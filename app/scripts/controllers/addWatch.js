'use strict';

angular.module('b4cmApp')
  .controller('AddWatchCtrl', function ($scope, $routeParams) {

    var id = $routeParams.spotId,
        current_date = new Date(),
        future_date = new Date(current_date.getTime() + 60 * 60 * 1000),
        current_day = current_date.getDay(),
        future_day = future_date.getDay(),
        current_hour = current_date.getHours() % 12,
        future_hour = future_date.getHours() % 12,
        current_meridiem = (current_hour - 12 < 0) ? '1' : '0',
        future_meridiem = (future_hour - 12 < 0) ? '1' : '0';
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
  });
