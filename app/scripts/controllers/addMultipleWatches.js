'use strict';

/* global alert */

angular.module('b4cmApp')

  /**
   * @name Add Watch Controller
   * @controller
   *
   * @description Adds a Crowd Watch report to a Spot's crowdfactor.
   */
  .controller('AddMultipleWatchesCtrl', function ($scope, $routeParams, $location, spot, user, util) {

    var watch = {},
        additionalInfo = {},
        currentDate = new Date(),
        futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000),
        currentDay = currentDate.getDay(),
        futureDay = futureDate.getDay(),
        currentHour = currentDate.getHours() % 12,
        futureHour = futureDate.getHours() % 12,
        currentMeridiem = (currentDate.getHours() < 12) ? '0' : '1',
        futureMeridiem = (futureDate.getHours() < 12) ? '0' : '1';
   
    $scope.spot = {}; // May need to clone since changing spot data and may not save.
    $scope.watchHours = [];
    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'},
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'},
                       {'label': 'Saturday'}, {'label': 'Weekdays'}, {'label': 'Weekends'},
                       {'label': 'All Week'}],
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
      $scope.spot = spotData;
      $scope.name = spotData.name;
      $scope.address = spotData.location.address;
      $scope.city = spotData.location.city;

      // Calculate block structure for display of crowdfactor visualization.
      $scope.blocks = util.constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                            $scope.spot.crowdfactor.day);
    });

    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.addWatch = function() {
      console.log('Add a Watch');
      var watch = {'start': {'day': $scope.startDay.label,
                             'hour': parseInt($scope.startHour.label, 10),
                             'meridiem': $scope.startMeridiem.label},
                    'stop':{'day': $scope.stopDay.label,
                             'hour': parseInt($scope.stopHour.label, 10),
                              'meridiem': $scope.stopMeridiem.label},
                    'cf_status': $scope.cf_status
                  };
      if (user.loggedIn()){
        if (typeof watch.cf_status !== 'undefined') {
          if ($scope.startDay.label === 'Weekdays' || 
              $scope.startDay.label === 'Weekends' ||
              $scope.startDay.label === 'All Week') {
            var dayList = [];
            if ($scope.startDay.label === 'Weekdays') {
              dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            }
            else if ($scope.startDay.label === 'Weekends') {
              dayList = ['Saturday', 'Sunday'];
            }
            else {
              dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            }
            dayList.forEach(function(day) {
              var newWatch = {'start': {'day': day,
                                        'hour': parseInt($scope.startHour.label, 10),
                                        'meridiem': $scope.startMeridiem.label},
                              'stop':{'day': day,
                                      'hour': parseInt($scope.stopHour.label, 10),
                                      'meridiem': $scope.stopMeridiem.label},
                              'cf_status': $scope.cf_status
                            };
              var start = util.clone(newWatch.start),
                  stop = util.clone(newWatch.stop);
              start.day = util.dayToNum(start.day);
              stop.day = util.dayToNum(stop.day);
              console.log('hereeee');
              newWatch.time = _calculateWatchTimes(start, stop, $scope.spot);
              newWatch.time.forEach(function(time) {
                 var score = util.statusToScore(newWatch.cf_status);
                 $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count + 1;
                 $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score + score;
              });
              $scope.watchHours.push(newWatch);
              console.log('doneee');
            });
          }
          else {
            console.log('here');
            var start = util.clone(watch.start),
                stop = util.clone(watch.stop),
                nextDay = $scope.WEEKDAYS[_incrementDay($scope.startDay.label, util)];;
            start.day = util.dayToNum(start.day);
            stop.day = util.dayToNum(stop.day);
            watch.time = _calculateWatchTimes(start, stop, $scope.spot);
            watch.time.forEach(function(time) {
               var score = util.statusToScore(watch.cf_status);
               $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count + 1;
               $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score + score;
            });
            $scope.watchHours.push(watch);
            // Increment days to next day for convenience
            $scope.startDay = nextDay;
            $scope.stopDay = nextDay;
          }
          // Recalculate block structure for display of crowdfactor visualization.
          $scope.blocks = util.constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                                    $scope.spot.crowdfactor.day);
          console.log('done');
        }
        else {
          alert('Must select a crowd status.');
        }
      }
      else {
        alert('Must be logged in to add a watch');
        $location.path('/signin');
        util.safeApply($scope);
      }
    }

    /**
     * @name deleteHours
     * @procedure
     *
     * @description Deletes hours from a business's hours of operations.
     *              Requires addSpot controllers $scope
     * @param {int} index The index for the business hours to delete.
     */
    $scope.deleteHours = function(index) {
      var watch = $scope.watchHours[index];
      watch.start.day = util.dayToNum(watch.start.day);
      watch.stop.day = util.dayToNum(watch.stop.day);
      watch.time = _calculateWatchTimes(watch.start, watch.stop, $scope.spot);
      watch.time.forEach(function(time) {
      var score = util.statusToScore(watch.cf_status);
        $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count - 1;
        $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score - score;
      });
      $scope.watchHours.splice(index, 1);
      // Recalculate block structure for display of crowdfactor visualization.
      $scope.blocks = util.constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                                $scope.spot.crowdfactor.day);
    };


    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.submitWatches = function() {
      if (user.loggedIn()){
        console.log('Submit Watches');
        console.log($scope.watchHours);
        watch.user = user.getInfo().display_name;

        if ($scope.watchHours.length < 1) {alert('Must add a watch to save.');}
        else {
          $scope.spot.crowdfactor.watch_count = $scope.spot.crowdfactor.watch_count + 1;
          spot.addMultipleWatches($scope.spot.crowdfactor, $scope.spot.id);
          alert('Crowd watches added.');
          $location.path('/spot/' + $scope.spot.id);
          util.safeApply($scope);
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
function _calculateWatchTimes(start, stop, spot) {
  var times = [],
      day = spot.crowdfactor.day,
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


