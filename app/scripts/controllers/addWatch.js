'use strict';

angular.module('b4cmApp')

  /**
   * @name Add Watch Controller
   * @controller
   *
   * @description Adds a Crowd Watch report to a Spot's crowdfactor.
   */ 
  .controller('AddWatchCtrl', function ($scope, $routeParams, spot, user) {

    var watch = {},
        spotObj = {},
        additionalInfo = {},
        current_date = new Date(),
        future_date = new Date(current_date.getTime() + 60 * 60 * 1000),
        current_day = current_date.getDay(),
        future_day = future_date.getDay(),
        current_hour = current_date.getHours() % 12,
        future_hour = future_date.getHours() % 12,
        current_meridiem = (current_date.getHours() < 12) ? '0' : '1',
        future_meridiem = (future_date.getHours() < 12) ? '0' : '1';

    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'}, 
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'}, 
                       {'label': 'Saturday'}],
    $scope.HOURS = [{'label': '12'}, {'label': '1'}, {'label': '2'}, {'label': '3'}, 
                    {'label': '4'}, {'label': '5'}, {'label': '6'}, {'label': '7'}, 
                    {'label': '8'}, {'label': '9'}, {'label': '10'}, {'label': '11'}],
    $scope.MERIDIEMS = [{'label': 'am'}, {'label': 'pm'}];

    $scope.startDay = $scope.WEEKDAYS[current_day];
    $scope.stopDay = $scope.WEEKDAYS[future_day];
    $scope.startHour = $scope.HOURS[current_hour];
    $scope.stopHour = $scope.HOURS[future_hour];
    $scope.startMeridiem = $scope.MERIDIEMS[current_meridiem];
    $scope.stopMeridiem = $scope.MERIDIEMS[future_meridiem];

    // Retreive the spot associated with this review.
    spot.get($routeParams.spotId).then(function(spot_data) {
      spotObj = spot_data;
    });

    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */     
    $scope.addWatch = function() {
      var start = {'day': _dayToNum($scope.startDay.label), 
                   'hour': parseInt($scope.startHour.label), 
                   'meridiem': $scope.startMeridiem.label},
          stop = {'day': _dayToNum($scope.stopDay.label), 
                  'hour': parseInt($scope.stopHour.label), 
                  'meridiem': $scope.stopMeridiem.label}
      watch.cf_status = $scope.cf_status;
      watch.time = _calculateWatchTimes(start, stop, spotObj);
      if (typeof watch.cf_status === 'undefined') {alert('Please choose a crowd status.');}
      else {
        // TODO: implement
        spot.addWatch(watch, $routeParams.spotId);
        // TODO: implement
        user.incrementWatchCount();
      }
    };

  });

/***************
 * HELPER FUNCS
 ***************/

/**
 * @name _calculateWatchTimes
 * @function
 *
 * @description Given a start and stop times, creates an array of time lables
 *              used as keys for updating a spot's crowdseer.  Also determines the total 
 *              score and count for the time periods.  Also checks time is not closed
 *              and score for the 
 * @param {object} start The start time. Props: day (int), hour (int), meridiem (string)
 * @param {object} stop The stop time. Props: day (int), hour (int), meridiem (string)
 * @return {array} An array of watch time lables i.e {'day': 'monday', 'hour': '11pm'}
 */ 
function _calculateWatchTimes(start, stop, spotObj) {
  var times = [],
      day = spotObj.crowdfactor.day,
      current = {'day': start.day, 'hour': start.hour, 'meridiem': start.meridiem},
      WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  while (current.day !== stop.day ||
         current.hour !== stop.hour ||
         current.meridiem !== stop.meridiem) {

    // Add watch to times
    var watch = {};
    var i = 0;
    i = i + 1;

    watch.day = WEEKDAYS[current.day].toLowerCase();
    watch.hour = current.hour + current.meridiem;
    watch.count = day[watch.day][watch.hour].count
    watch.score = day[watch.day][watch.hour].score
    // only add if not closed
    if (day[watch.day][watch.hour].count !== -1) {times.push(watch)};

    // Increment current time
    current.hour = current.hour + 1;
    if (current.hour === 12) {
      if (current.meridiem === 'pm') {
        current.day = current.day + 1;
        if (current.day === 7) {current.day = 0;}
        current.meridiem = 'am';
      }
      else {
        current.meridiem = 'pm';
      }
    }
    else if (current.hour === 13) {current.hour = 1;}
  }
  return times
}

