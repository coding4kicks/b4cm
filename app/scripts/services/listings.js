'use strict';

angular.module('b4cmApp')
  .factory('listings', function ($q, $rootScope, geolocation) {

    var geoRef = new Firebase('https://crowd-data.firebaseio.com/geo'),
        geo = new FirebaseGeo(geoRef);

    var fakeListingsStudy = {};
    fakeListingsStudy.location = { 'city': 'Palo Alto',
                              'state_code': 'CA',
                              'latitude': 37.447365, 
                              'longitude': -122.160248
                            };

    // Public API here
    return {
      add: function (lat, lon, data) {
        data.lat = lat;
        data.lon = lon;
        var hash = geo.insert(lat, lon, data);
        return hash;
      },
      edit: function () {
        return false;
      },
      get: function (searchLocation, listingType) {
        var deferred = $q.defer(),
            DEFAULT_RADIUS = 25;
        // Asynch call to get lat and long of search location.
        geolocation.getLatLong(searchLocation).then(function(locationObject) {
          var deferred2 = $q.defer(),
              spotIdList = [];
          geo.searchRadius(locationObject.latitude, 
                           locationObject.longitude, 
                           DEFAULT_RADIUS, 
                           function(results) {
            results.forEach(function(result) {
              spotIdList.push(result.id);
            });
            // Resolve the outerscope deferred
            $rootScope.$apply(deferred.resolve({'idList': spotIdList, 'location': locationObject}));      
          });          
          return deferred2.promise;

          }, function(reason) {
            conosle.log('failed for ' + reason);
            deferred.resolve('error');
        });

        return deferred.promise;
      },
      remove: function () {
        return false;
      }
    };
  });
