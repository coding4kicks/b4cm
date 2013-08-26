'use strict';

angular.module('b4cmApp')
  .controller('AddWatchCtrl', function ($scope, $routeParams) {

    var watch = {},
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
    $scope.startDayNum = current_day;
    $scope.stopDay = $scope.WEEKDAYS[future_day];
    $scope.stopDayNum = future_day;
    $scope.startHour = $scope.HOURS[current_hour];
    $scope.stopHour = $scope.HOURS[future_hour];
    $scope.startMeridiem = $scope.MERIDIEMS[current_meridiem];
    $scope.stopMeridiem = $scope.MERIDIEMS[future_meridiem];

    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */     
    $scope.addWatch = function() {
      var start = {'day': $scope.startDayNum, 'hour': $scope.startHour.label, 'meridiem': $scope.startMeridiem.label},
          stop = {'day': $scope.stopDayNum, 'hour': $scope.stopHour.label, 'meridiem': $scope.stopMeridiem.label}
      watch.cf_status = $scope.cf_status;
      watch.time = _calculateWatchTimes(start, stop);
      //alert($scope.cf_status);
      //spot.addWatch(watch, $routeParams.spotId);
    };

  });

function _calculateWatchTimes(start, stop) {
  var times = [],
      current = {'day': start.day, 'hour': parseInt(start.hour), 'meridiem': start.meridiem},
      WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  console.log(current);
  while (current.day !== stop.day &&
         current.hour !== parseInt(stop.hour) &&
         current.meridiem !== stop.meridiem) {

    // Add watch to times
    var watch = {};

    watch.day = WEEKDAYS[current.day];
    watch.hour = current.hour + current.meridiem;
    times.push(watch);

    // Increment current time
    console.log(current.day, current.hour, current.meridiem);
    current.hour = current.hour + 1;
    if (current.hour > 11) {
      if (current.meridiem === 'pm') {
        current.day = current.day + 1;
        if (current.day > 6) {current.day = 0;}
        current.meridiem = 'am'
      }
      else {
        current.meridiem = 'pm';
      }
    }
    else if (current.hour > 12) {current.hour = 1;}
    console.log(current.day, current.hour, current.meridiem);
  }
  //console.log(times);
}
