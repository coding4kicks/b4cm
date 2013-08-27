'use strict';

angular.module('b4cmApp')
  .controller('AddSpotCtrl', function ($scope, spot) {

    var newSpot = {};

    $scope.business_hours = [];

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


    //var fakeSpot1 = {
    //  'id': 'fakeSpot1',
    //  'name': 'Philz Coffee',
    //  'yelp_id': 'philz-coffee-palo-alto2',
    //  'image_url': "../images/spot-philz.jpg",
    //  'rating': 4.5,
    //  'wifi': true,
    //  'review_count': 175,
    //  'type': {
    //    'food': 5,
    //    'study': 8,
    //    'social': 1
    //    },
    //  'location': {
    //    'address': '101 Forest Ave',
    //    'city': 'Palo Alto',
    //    'state_code': 'CA',
    //    'postal_code': '94301',
    //    'latitude': 37.441838,
    //    'longitude': -122.161675,
    //    'geohash': '9q9jh0hdd8kz'
    //    },
    //    'reviews':
    //    'crowdfactor': {
    //      'watch_count': 732,
    //      'most_recent': {'time': 1377150514232, 'score': 4},
    //      'blocks': {'morning':true, 'afternoon':true, 'evening':true, 'latenight':false},
    //      'day': { 
    //        'monday': {
    //          '12am

    $scope.addHours = function() {
      var times = {'open_day': $scope.openDay, 
                   'open_hour': $scope.openHour, 
                   'open_meridiem': $scope.openMeridiem,
                   'close_day': $scope.closeDay, 
                   'close_hour': $scope.closeHour, 
                   'close_meridiem': $scope.closeMeridiem};
      $scope.business_hours.push(times);
    };

    $scope.deleteHour = function(index) {
      $scope.business_hours.splice(index, 1);
    }

    $scope.addSpot = function() {
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

      spot.create(newSpot);
      console.log(newSpot);
    };

    $scope.yelpIdHelp = function() {
      alert("here");
    };

  });
