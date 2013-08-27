'use strict';

angular.module('b4cmApp')
  .controller('AddSpotCtrl', function ($scope, spot) {

    var newSpot = {};

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
      alert("here");
    };

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
