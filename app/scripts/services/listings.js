'use strict';

angular.module('b4cmApp')
  .factory('listings', function ($q, geolocation) {

    var geoRef = new Firebase('https://crowd-data.firebaseio.com/geo'),
        geo = new FirebaseGeo(geoRef);

    var fakeListingsStudy = {};
    fakeListingsStudy.location = { 'city': 'Palo Alto',
                              'state_code': 'CA',
                              'latitude': 37.447365, 
                              'longitude': -122.160248
                            };
    fakeListingsStudy.type = 'Study';
    fakeListingsStudy.spots = [
      {'geohash1': 'fakeSpot1'},
      {'geohash2': 'fakeSpot2'},
      {'geohash3': 'fakeSpot3'}
    ];

    var fakeListingsSocial = {};
    fakeListingsSocial.location = { 'city': 'Palo Alto',
                              'state_code': 'CA',
                              'latitude': 37.447365, 
                              'longitude': -122.160248
                            };
    fakeListingsSocial.type = 'Social';
    fakeListingsSocial.spots = [
      {'geohash1': 'fakeSpot1'},
      {'geohash2': 'fakeSpot2'},
      {'geohash3': 'fakeSpot3'}
    ];

    var fakeListingsFood = {};
    fakeListingsFood.location = { 'city': 'Palo Alto',
                              'state_code': 'CA',
                              'latitude': 37.447365, 
                              'longitude': -122.160248
                            };
    fakeListingsFood.type = 'Food';
    fakeListingsFood.spots = [
      {'geohash1': 'fakeSpot1'},
      {'geohash2': 'fakeSpot2'},
      {'geohash3': 'fakeSpot3'}
    ];

    var fakeListingsAll = {};
    fakeListingsAll.location = { 'city': 'Palo Alto',
                              'state_code': 'CA',
                              'latitude': 37.447365, 
                              'longitude': -122.160248
                            };
    fakeListingsAll.type = 'All';
    fakeListingsAll.spots = [
      {'geohash1': 'fakeSpot1'},
      {'geohash2': 'fakeSpot2'},
      {'geohash3': 'fakeSpot3'}
    ];

    // Public API here
    return {
      add: function (lat, lon, data) {
        var hash = geo.insert(lat, lon, data);
        return hash;
      },
      edit: function () {
        return false;
      },
      get: function (searchLocation, listingType) {
        var deferred = $q.defer(),
            DEFAULT_RADIUS = 10;
        // Asynch call to get lat and long of search location.
        geolocation.getLatLong(searchLocation).then(function(locationObject) {
          var deferred = $q.defer();
          geo.searchRadius(locationObject.latitude, 
                           locationObject.longitude, 
                           DEFAULT_RADIUS, 
                           function(results) {
            deferred.resolve(results);      
          });          
          return deferred.promise;

          }, function(reason) {
            conosle.log('failed for ' + reason);
            deferred.resolve('error');
        });

        return deferred.promise;

        //if (listingType === 'study') {return fakeListingsStudy;}
        //if (listingType === 'social') {return fakeListingsSocial;}
        //if (listingType === 'food') {return fakeListingsFood;}
        //if (listingType === 'all') {return fakeListingsAll;}
        //return fakeListingsStudy;
      },
      remove: function () {
        return false;
      }
    };
  });
