'use strict';

angular.module('b4cmApp')

  /**
   * @name AddSpot Controller
   * @controller
   *
   * @description Adds a new spot to the database.
   */ 
  .controller('AddSpotCtrl', function ($scope, $location, spot, util, user) {

    var newSpot = {};
    $scope.business_hours = []; // Business's hours of operation
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
   *              Requires addSpot controllers $scope
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
   *              Requires addSpot controllers $scope
   * @param {int} index The index for the business hours to delete.
   */ 
    $scope.deleteHours = function(index) {
      $scope.business_hours.splice(index, 1);
    }

  /**
   * @name addSpot
   * @procedure
   *
   * @description Calls the spot service to add a new spot to the database.
   *              Requires the addSpot controller's $scope
   */ 
    $scope.addSpot = function() {

      // Validate the form
      var errors = [];
      if (typeof $scope.name === 'undefined') {errors.push('Name')};
      if (typeof $scope.address === 'undefined') {errors.push('Address')};
      if (typeof $scope.city === 'undefined') {errors.push('City')};
      if (typeof $scope.postal_code === 'undefined') {errors.push('Zip')};
      if (typeof $scope.state_code === 'undefined') {errors.push('State')};
      if (typeof $scope.food === 'undefined' &&
          typeof $scope.study === 'undefined' &&
          typeof $scope.social === 'undefined') {errors.push('Type')};
      if (errors.length > 0) {_handleFormErrors($scope, errors);}

      // Add the spot
      else if (user.loggedIn()){
        var curUser = user.getInfo(),
            first_user = {};
        first_user.id = curUser.provider + '/' + curUser.id;
        first_user.name = curUser.display_name;
        first_user.pic = curUser.gravatar;
        newSpot.first_user = first_user;
        newSpot.date_added = new Date().getTime();
        newSpot.name = $scope.name;
        newSpot.yelp_id = $scope.yelp_id;
        newSpot.location = {};
        newSpot.location.address = $scope.address;
        newSpot.location.city = $scope.city;
        newSpot.location.state_code = $scope.state_code;
        newSpot.location.postal_code = $scope.postal_code;
        newSpot.wifi = $scope.wifi;
        if (typeof $scope.image2 === 'undefined') {
          $scope.image2 = {'resized': {'dateURL': null}};
        }
        newSpot.image_url = $scope.image2.resized.dataURL;
        newSpot.type = {'food': 0, 'study': 0, 'social': 0}
        if ($scope.food) {newSpot.type.food = 1};
        if ($scope.study) {newSpot.type.study = 1};
        if ($scope.social) {newSpot.type.social = 1};

        // Hack to remove $$haskey property which blows up Firebase
        newSpot.business_hours = [];
        $scope.business_hours.forEach(function(hour) {
          var time = {'open_day': hour.open_day, 'open_meridiem': hour.open_meridiem,
                      'open_hour': hour.open_hour, 'close_day': hour.close_day,
                      'close_meridiem': hour.close_meridiem, 'close_hour': hour.close_hour };
          newSpot.business_hours.push(time);
        });

        // Create the spot - Asynch send to firebase
        spot.create(newSpot).then(function (spotId) {
          // Handle success or error
          user.incrementSpotCount();
          // Redirect to added spot
          $location.path("/spot/" + spotId);
          util.safeApply($scope);
        });
      }
      else {
        alert('Must be signed in to add a spot');
        $location.path("/signin");
        util.safeApply($scope);
      }
    };

  /**
   * @name yelpIdHelp
   * @procedure
   *
   * @description Toggles the visibility of the yelp id help section.
   *              Requires addSpot controllers $scope
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
