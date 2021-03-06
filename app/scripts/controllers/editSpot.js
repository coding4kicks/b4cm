'use strict';
/* global alert */

angular.module('b4cmApp')

  /**
   * @name EditSpot Controller
   * @controller
   *
   * @description Edits a spot already in the database.
   */
  .controller('EditSpotCtrl', function ($scope, $routeParams, $location, spot, util, user) {

    var editedSpot = {},
        oldData = {};

    $scope.doneInitializing = false;

    /* jshint camelcase: false */
    // Retreive the spot to edit.
    spot.get($routeParams.spotId).then(function(spot_data) {
      editedSpot = util.clone(spot_data); // start off with a copy
      oldData.crowdfactor = util.clone(spot_data.crowdfactor);
      oldData.location = util.clone(spot_data.location);
      $scope.spotName = spot_data.name;
      $scope.address = spot_data.location.address;
      $scope.address2 = spot_data.location.address2;
      $scope.city = spot_data.location.city;
      $scope.postal_code = spot_data.location.postal_code;
      $scope.state_code = spot_data.location.state_code;
      $scope.wifi = spot_data.wifi;
      $scope.image_url = spot_data.image_url;
      $scope.business_hours = spot_data.business_hours;
      $scope.yelp_id = spot_data.yelp_id;
      $scope.opentable_id = spot_data.opentable_id;
      $scope.doordash = spot_data.doordash;
      $scope.orderahead = spot_data.orderahead;
      $scope.phone = spot_data.phone;
      $scope.email = spot_data.email;
      $scope.website = spot_data.website;
      $scope.doneInitializing = true;
    });
    /* jshint camelcase: true */

    $scope.HOURS = [];
    for (var i = 1; i <= 12; i++) {
      var time = {'label': i + ':00', 'hour': i, 'minutes': 0},
          timeHalf = {'label': i + ':30', 'hour': i, 'minutes': 30};
      $scope.HOURS.push(time);
      $scope.HOURS.push(timeHalf);
    }
    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'},
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'},
                       {'label': 'Saturday'}];
    $scope.MERIDIEMS = [{'label': 'am'}, {'label': 'pm'}];
    $scope.openDay = $scope.WEEKDAYS[1];
    $scope.openHour = $scope.HOURS[12];
    $scope.openMeridiem = $scope.MERIDIEMS[0];
    $scope.closeHour = $scope.HOURS[14];
    $scope.closeMeridiem = $scope.MERIDIEMS[1];

    // Form Validation
    $scope.validForm = {};

    /* jshint camelcase: false */
    /**
     * @name addHours
     * @procedure
     *
     * @description Adds hours to a business's hours of operations.
     *              Requires editSpot controllers $scope
     */
    $scope.addHours = function() {
      var times = {'open_day': $scope.openDay,
                   'open_hour': $scope.openHour,
                   'open_meridiem': $scope.openMeridiem,
                   'close_day': $scope.openDay,
                   'close_hour': $scope.closeHour,
                   'close_meridiem': $scope.closeMeridiem},
          nextDay = $scope.WEEKDAYS[util.incrementDay($scope.openDay.label)];
      if (util.shouldBeNextDay(times)){
        times.close_day = $scope.WEEKDAYS[util.incrementDay($scope.openDay.label)];
      }
      $scope.business_hours.push(times);
      // Increment days to next day for convenience
      $scope.openDay = nextDay;
    };

  /**
   * @name deleteHours
   * @procedure
   *
   * @description Deletes hours from a business's hours of operations.
   *              Requires editSpot controllers $scope
   * @param {int} index The index for the business hours to delete.
   */
    $scope.deleteHours = function(index) {
      $scope.business_hours.splice(index, 1);
    };

  /**
   * @name editSpot
   * @procedure
   *
   * @description Calls the spot service to add a new spot to the database.
   *              Requires the editSpot controller's $scope
   */
    $scope.editSpot = function() {

      // Validate the form
      var errors = [];
      if (typeof $scope.spotName === 'undefined') {errors.push('Name');}
      if (typeof $scope.address === 'undefined') {errors.push('Address');}
      if (typeof $scope.city === 'undefined') {errors.push('City');}
      if (typeof $scope.postal_code === 'undefined') {errors.push('Zip');}
      if (typeof $scope.state_code === 'undefined') {errors.push('State');}
      if ($scope.business_hours.length === 0) {errors.push('Hours');}
      if (errors.length > 0) {util.handleFormErrors($scope, errors);}

      // Save the spot
      else if (user.loggedIn()){
        var curUser = user.getInfo(),
            editor = {};
        // TODO: switch editor info to array so can track editors
        // TODO: save last state so can revert back
        editor.id = curUser.provider + '/' + curUser.id;
        editor.name = curUser.display_name;
        editor.pic = curUser.gravatar;
        editedSpot.editor = editor;
        editedSpot.date_edited = new Date().getTime();

        editedSpot.name = $scope.spotName;
        editedSpot.yelp_id = $scope.yelp_id;
        editedSpot.opentable_id = $scope.opentable_id;
        editedSpot.doordash = $scope.doordash;
        editedSpot.orderahead = $scope.orderahead;
        editedSpot.phone = $scope.phone;
        editedSpot.email = $scope.email;
        editedSpot.website = $scope.website;

        editedSpot.location.address = $scope.address;
        editedSpot.location.address2 = $scope.address2;
        editedSpot.location.city = $scope.city;
        editedSpot.location.state_code = $scope.state_code;
        editedSpot.location.postal_code = $scope.postal_code;
        editedSpot.wifi = $scope.wifi;
        //if (typeof $scope.image2 === 'undefined') {
        //  $scope.image2 = {'resized': {'dateURL': null}};
        //}
        if(typeof editedSpot.location.address2 === 'undefined') {
          editedSpot.location.address2 = null;
        }
        if (typeof $scope.image2 !== 'undefined') {
          editedSpot.image_url = $scope.image2.resized.dataURL;
        }
        //editedSpot.type = {'food': 0, 'study': 0, 'social': 0}
        if(typeof editedSpot.type === 'undefined'){
          editedSpot.type = {'food': 0, 'study': 0, 'social':0};
        }
        if ($scope.food) {editedSpot.type.food = editedSpot.type.food + 1;}
        if ($scope.study) {editedSpot.type.study = editedSpot.type.study + 1;}
        if ($scope.social) {editedSpot.type.social = editedSpot.type.social + 1;}

        // Hack to remove $$haskey property which blows up Firebase
        editedSpot.business_hours = [];
        $scope.business_hours.forEach(function(hour) {
          var time = {'open_day': hour.open_day, 'open_meridiem': hour.open_meridiem,
                      'open_hour': hour.open_hour, 'close_day': hour.close_day,
                      'close_meridiem': hour.close_meridiem, 'close_hour': hour.close_hour };
          editedSpot.business_hours.push(time);
        });

        // Create the spot - Asynch send to firebase
        spot.edit(editedSpot, oldData).then(function (editedSpot) {
          // Handle success or error
          // Redirect to added spot
          alert('Spot Updated.');
          $location.path('/spot/' + editedSpot.id);
          $location.replace();
          util.safeApply($scope);
        });
      }
      else {
        alert('Must be signed in to edit a spot');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };

  /**
   * @name yelpIdHelp
   * @procedure
   *
   * @description Toggles the visibility of the yelp id help section.
   *              Requires editSpot controllers $scope
   */
    $scope.yelpIdHelp = function() {
      $scope.yelpHelpShow = !$scope.yelpHelpShow;
    };

  });
/* jshint camelcase: false */
