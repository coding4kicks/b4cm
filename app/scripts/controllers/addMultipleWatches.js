'use strict';

/* global alert */

// TODO: probably blowup on weekend/weekday/all entries past midnight;

angular.module('b4cmApp')

  /**
   * @name Add Watch Controller
   * @controller
   *
   * @description Adds a Crowd Watch report to a Spot's crowdfactor.
   */
  .controller('AddMultipleWatchesCtrl', function ($scope, $routeParams, $location, spot, user, util) {

    var watch = {},
        currentDate = new Date(),
        futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000),
        currentDay = currentDate.getDay(),
        futureDay = futureDate.getDay(),
        currentHour = currentDate.getHours() % 12,
        futureHour = futureDate.getHours() % 12,
        currentMeridiem = (currentDate.getHours() < 12) ? '0' : '1',
        futureMeridiem = (futureDate.getHours() < 12) ? '0' : '1',
        WEEKDAY_LIST = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        WEEKEND_LIST = ['Saturday', 'Sunday'],
        ALL_LIST = WEEKDAY_LIST.concat(WEEKEND_LIST),
        MON_THUR = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        FRI_SAT = ['Friday', 'Saturday'];

    $scope.doneInitializing = false;
    $scope.spot = {}; // May need to clone since changing spot data and may not save.
    $scope.watchHours = [];
    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'},
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'},
                       {'label': 'Saturday'}, {'label': 'Weekdays'}, {'label': 'Weekends'},
                       {'label': 'Mon - Thur'}, {'label': 'Fri & Sat'}, {'label': 'All Week'}],
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
      $scope.doneInitializing = true;
    });
    /* jshint camelcase: false */
    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.addWatch = function() {
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
              $scope.startDay.label === 'All Week' ||
              $scope.startDay.label === 'Mon - Thur' ||
              $scope.startDay.label === 'Fri & Sat') {
            var dayList = [];
            $scope.stopDay.label = $scope.startDay.label;
            $scope.stopDay.label = $scope.startDay.label;
            if (watch.start.day === 'Weekdays') {dayList = WEEKDAY_LIST;}
            else if ($scope.startDay.label === 'Weekends') {dayList = WEEKEND_LIST;}
            else if ($scope.startDay.label === 'Mon - Thur') {dayList = MON_THUR;}
            else if ($scope.startDay.label === 'Fri & Sat') {dayList = FRI_SAT;}
            else {dayList = ALL_LIST;}
            $scope.watchHours.push(watch); // push weekday/weekend/all
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
              // Handle after midnight case where need to increment stop day
              _checkStopDay(start, stop);
              newWatch.time = util.calculateWatchTimes(start, stop, $scope.spot);
              newWatch.time.forEach(function(time) {
                var score = util.statusToScore(newWatch.cf_status);
                $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count + 1;
                $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score + score;
              });
              //$scope.watchHours.push(newWatch); // Don't add individual for now
            });
          }
          else {
            var start = util.clone(watch.start),
                stop = util.clone(watch.stop),
                nextDay = $scope.WEEKDAYS[util.incrementDay($scope.startDay.label)];
            start.day = util.dayToNum(start.day);
            stop.day = util.dayToNum(stop.day);
            _checkStopDay(start, stop);
            watch.time = util.calculateWatchTimes(start, stop, $scope.spot);
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
      var watch = $scope.watchHours[index],
          dayList = [];
      if (watch.start.day === 'Weekdays' ||
          watch.start.day === 'Weekends' ||
          watch.start.day === 'Mon - Thur'  ||
          watch.start.day === 'Fri & Sat'  ||
          watch.start.day === 'All Week') {
        if (watch.start.day === 'Weekdays') {dayList = WEEKDAY_LIST;}
        else if ($scope.startDay.label === 'Weekends') {dayList = WEEKEND_LIST;}
        else if ($scope.startDay.label === 'Mon - Thur') {dayList = MON_THUR;}
        else if ($scope.startDay.label === 'Fri & Sat') {dayList = FRI_SAT;}
        else {dayList = ALL_LIST;}
        dayList.forEach(function(day) {
          watch.start.day = util.dayToNum(day);
          watch.stop.day = util.dayToNum(day);
          _checkStopDay(watch.start, watch.stop);
          watch.time = util.calculateWatchTimes(watch.start, watch.stop, $scope.spot);
          watch.time.forEach(function(time) {
            var score = util.statusToScore(watch.cf_status);
            $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count - 1;
            $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score - score;
          });
        });
        $scope.watchHours.splice(index, 1);
      }
      else {
        watch.start.day = util.dayToNum(watch.start.day);
        watch.stop.day = util.dayToNum(watch.stop.day);
        _checkStopDay(watch.start, watch.stop);
        watch.time = util.calculateWatchTimes(watch.start, watch.stop, $scope.spot);
        watch.time.forEach(function(time) {
          var score = util.statusToScore(watch.cf_status);
          $scope.spot.crowdfactor.day[time.day][time.hour].count = time.count - 1;
          $scope.spot.crowdfactor.day[time.day][time.hour].score = time.score - score;
        });
        $scope.watchHours.splice(index, 1);
      }
      // Recalculate block structure for display of crowdfactor visualization.
      $scope.blocks = util.constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                                $scope.spot.crowdfactor.day);
    };

    /**
     * @name submitWatches
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.submitWatches = function() {
      if (user.loggedIn()){
        watch.user = user.getInfo().display_name;

        if ($scope.watchHours.length < 1) {alert('Must add a watch to save.');}
        else {
          $scope.spot.crowdfactor.watch_count = $scope.spot.crowdfactor.watch_count + 1;
          spot.addMultipleWatches($scope.spot.crowdfactor, $scope.spot.id);
          alert('Crowd watches added.');
          $location.path('/spot/' + $scope.spot.id);
          $location.replace();
          util.safeApply($scope);
        }
      }
      else {
        alert('Must be logged in to add a watch');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };


    /**
     * @name _checkStopDay
     * @function
     *
     * @description Deals with case of stop day after midnight
     * @param {object} start The start watch info (prop day is an int)
     * @param {object} stop The stop watch info (prop day is an int)
     * @return {string} The stop day, either current day, or 1 day in the future
     *                  if the stop time was after midnight.
     */
    function _checkStopDay(start, stop) {
      if (start.day === stop.day) {
        if ((start.meridiem === 'pm' && stop.meridiem === 'am') ||
            (start.meridiem === 'am' && stop.meridiem === 'am' && stop.hour <= start.hour)){
          stop.day = (stop.day + 1) % 7;
        }
      }
      //return day
    }

  });
/* jshint camelcase: true */
