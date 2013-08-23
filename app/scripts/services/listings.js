'use strict';

angular.module('b4cmApp')
  .factory('listings', function () {
    // Service logic
    // ...

    var fakeListings = {};
    fakeListings.location = {'latitude': 37.447365, 'longitude': -122.160248};
    fakeListings.type = 'study';
    fakeListings.spots = [
      {'geohash1': 'fakeSpot1Id'},
      {'geohash2': 'fakeSpot2Id'},
      {'geohash3': 'fakeSpot3Id'}
    ];


    // Public API here
    return {
      add: function () {
        return false;
      },
      edit: function () {
        return false;
      },
      get: function () {
        return fakeListings;
      },
      remove: function () {
        return false;
      }
    };
  });
