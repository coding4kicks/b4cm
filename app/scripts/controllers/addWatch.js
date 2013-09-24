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
      $scope.name = spotData.name;
      $scope.address = spotData.location.address;
      $scope.city = spotData.location.city;
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
        watch.time = util.calculateWatchTimes(start, stop, $scope.spotObj);
        watch.comment = $scope.watchComment;
        watch.user = user.getInfo().display_name;

        if (typeof watch.cf_status === 'undefined') {alert('Please choose a crowd status.');}
        else if (watch.time.length > 24) {alert('Watches must be for less than a 24 hour period.');}
        else {
          spot.addWatch(watch, $routeParams.spotId, $scope.spotObj.crowdfactor.watch_count);
          /* jshint camelcase: true */
          user.incrementWatchCount();
          alert('Crowd watch added.');
          $location.path('/spot/' + $scope.spotObj.id);
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
     * @name addMultiple
     * @function
     *
     * @description Redirects to add-multiple-watches-page.
     */
    $scope.addMultiple = function() {
      console.log('here');
      if (user.loggedIn()){
        $location.path('/addMultipleWatches/' + $scope.spotObj.id);
        util.safeApply($scope);
      }
      else {
        alert('Must be logged in to add watches.');
        $location.path('/signin/');
        util.safeApply($scope);
      }
    };

  });
