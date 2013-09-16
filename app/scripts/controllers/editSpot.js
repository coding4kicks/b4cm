'use strict';

angular.module('b4cmApp')

  /**
   * @name AddSpot Controller
   * @controller
   *
   * @description Adds a new spot to the database.
   */ 
  .controller('EditSpotCtrl', function ($scope, $routeParams, $location, spot, util, user) {

    var editedSpot = {},
        oldData = {};

    // Retreive the spot to edit.
    spot.get($routeParams.spotId).then(function(spot_data) {
      editedSpot = spot_data;
      oldData.business_hours = util.clone(spot_data.business_hours);
      oldData.location = util.clone(spot_data.location);
      console.log(oldData);
      $scope.spotName = spot_data.name;
      $scope.yelp_id = spot_data.yelp_id;
      $scope.address = spot_data.location.address;
      $scope.city = spot_data.location.city;
      $scope.postal_code = spot_data.location.postal_code;
      $scope.state_code = spot_data.location.state_code;
      $scope.wifi = spot_data.wifi;
      $scope.image_url = spot_data.image_url;
      //$scope.food = spot_data.type.food;
      //$scope.study = spot_data.type.study;
      //$scope.social = spot_data.type.social;
      $scope.business_hours = spot_data.business_hours;
      //util.safeApply();
    });

    
    //$scope.business_hours = []; // Business's hours of operation
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
    $scope.closeDay = $scope.WEEKDAYS[1];
    $scope.closeHour = $scope.HOURS[14];
    $scope.closeMeridiem = $scope.MERIDIEMS[1];

    // Form Validation
    $scope.validForm = {};

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
                   'close_day': $scope.closeDay, 
                   'close_hour': $scope.closeHour, 
                   'close_meridiem': $scope.closeMeridiem},
          nextDay = $scope.WEEKDAYS[_incrementDay($scope.openDay.label)];
      $scope.business_hours.push(times);
      // Increment days to next day for convenience
      $scope.openDay = nextDay;
      $scope.closeDay = nextDay;
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
    }

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
      if (errors.length > 0) {_handleFormErrors($scope, errors);}
     
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
        editedSpot.location = {};
        editedSpot.location.address = $scope.address;
        editedSpot.location.city = $scope.city;
        editedSpot.location.state_code = $scope.state_code;
        editedSpot.location.postal_code = $scope.postal_code;
        editedSpot.wifi = $scope.wifi;
        //if (typeof $scope.image2 === 'undefined') {
        //  $scope.image2 = {'resized': {'dateURL': null}};
        //}
        if (typeof $scope.image2 !== 'undefined') {
          editedSpot.image_url = $scope.image2.resized.dataURL;
        }
        //editedSpot.type = {'food': 0, 'study': 0, 'social': 0}
        if ($scope.food) {editedSpot.type.food = editedSpot.type.food + 1};
        if ($scope.study) {editedSpot.type.study = editedSpot.type.food + 1};
        if ($scope.social) {editedSpot.type.social = editedSpot.type.food + 1};

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
          user.incrementSpotCount();
          // Redirect to added spot
          $location.path("/spot/" + editedSpot.id);
          util.safeApply($scope);
        });
      }
      else {
        alert('Must be signed in to edit a spot');
        $location.path("/signin");
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

/*****************************
 * HELPER FUNCS
 *****************************/

/**
 * @name _handleFormErrors
 * @procedure
 *
 * @description Notifies the user of errors upon form submission.
 *              Recieves a scope and array of errors that are invalid.
 *              For each error, the scope's validForm object is switched to
 *              invalid, triggering the invalid css class for that elelment.
 * @param {object} $scope The form's controlling scope.
 * @param {array} errors An array of string names for each error type.
 */ 
function _handleFormErrors($scope, errors) {
  errors.forEach(function(error) {
    $scope.validForm[error.toLowerCase()] = 'invalid';
  });
  if (errors.length === 1) {
    alert(errors[0] + " is a required field.");
  }
  else {
    alert(errors.join(', ') + " are required fields.");
  }
}

/**
 * @name _incrementDay
 * @function
 *
 * @description Advances the day of week by one
 * @param {string} day The day to increment
 * @return {int} The number representation of the next day.
 */ 
function _incrementDay(day) {
  var nextDay = _dayToNum(day) + 1;
  if (nextDay === 7) {nextDay = 0};
  return nextDay;
 }

