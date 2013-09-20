'use strict';

/* global alert */

angular.module('b4cmApp')

  /**
   * @name Add Watch Controller
   * @controller
   *
   * @description Adds a Crowd Watch report to a Spot's crowdfactor.
   */
  .controller('AddWatchCtrl', function ($scope, $routeParams, $location, spot, user, util) {

    var watch = {},
        //spotObj = {},
        additionalInfo = {},
        currentDate = new Date(),
        futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000),
        currentDay = currentDate.getDay(),
        futureDay = futureDate.getDay(),
        currentHour = currentDate.getHours() % 12,
        futureHour = futureDate.getHours() % 12,
        currentMeridiem = (currentDate.getHours() < 12) ? '0' : '1',
        futureMeridiem = (futureDate.getHours() < 12) ? '0' : '1';

    $scope.spotObj = {}; // Scope reference only used for testing.
    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'},
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'},
                       {'label': 'Saturday'}],
    $scope.HOURS = [{'label': '12'}, {'label': '1'}, {'label': '2'}, {'label': '3'},
                    {'label': '4'}, {'label': '5'}, {'label': '6'}, {'label': '7'},
                    {'label': '8'}, {'label': '9'}, {'label': '10'}, {'label': '11'}],
    $scope.MERIDIEMS = [{'label': 'am'}, {'label': 'pm'}];

    $scope.startDay = $scope.WEEKDAYS[currentDay];
    $scope.stopDay = $scope.WEEKDAYS[futureDay];
    $scope.startHour = $scope.HOURS[currentHour];
    $scope.stopHour = $scope.HOURS[futureHour];
    $scope.startMeridiem = $scope.MERIDIEMS[currentMeridiem];
    $scope.stopMeridiem = $scope.MERIDIEMS[futureMeridiem];

    // Retreive the spot associated with this review.
    spot.get($routeParams.spotId).then(function(spotData) {
      $scope.spotObj = spotData;
    });

    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.addWatch = function() {
      if (user.loggedIn()){
        var start = {'day': util.dayToNum($scope.startDay.label),
                     'hour': parseInt($scope.startHour.label, 10),
                     'meridiem': $scope.startMeridiem.label},
            stop = {'day': util.dayToNum($scope.stopDay.label),
                    'hour': parseInt($scope.stopHour.label, 10),
                    'meridiem': $scope.stopMeridiem.label};
        /* jshint camelcase: false */
        watch.cf_status = $scope.cf_status;
        watch.time = _calculateWatchTimes(start, stop, $scope.spotObj);
        watch.comment = $scope.watchComment;
        watch.user = user.getInfo().display_name;

        if (typeof watch.cf_status === 'undefined') {alert('Please choose a crowd status.');}
        else if (watch.time.length > 24) {alert('Watches must be for less than a 24 hour period.');}
        else {
          spot.addWatch(watch, $routeParams.spotId, $scope.spotObj.crowdfactor.watch_count);
          /* jshint camelcase: true */
          user.incrementWatchCount();
          alert('Crowd watch added.');

          if ($scope.multipleWatches) {
            alert('multiples');
          }
          else {
            alert('redirect');
          }
        }
      }
      else {
        alert('Must be logged in to add a watch');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };

  });

/***************
 * HELPER FUNCS
 ***************/
/* TODO: Move to utility */
/* jshint -W098 */
/* jshint -W003 */


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
    watch.count = day[watch.day][watch.hour].count;
    watch.score = day[watch.day][watch.hour].score;
    // only add if not closed
    if (day[watch.day][watch.hour].count !== -1) {times.push(watch);}

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
  return times;
}

