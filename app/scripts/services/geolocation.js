'use strict';

angular.module('b4cmApp')
  .factory('geolocation', function ($q, $rootScope) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {

      /**
       * @name _getLatLong
       * @function
       *
       * @description Calls a geolocation service to retrieve a lat and long for an address
       *              included in a location object.  The lat and long are then added to the
       *              location object. The location object is then returned.
       * @param {object} locationObj A location with address, city, state_code, and zip_code
       * @returns {object} The given location object with latitude and longitude parameters added.
       */ 
      getLatLong: function (location_object) {
        console.log('in');
        var deferred = $q.defer();

        // No google in unit test so resolve fake lat/long
        if (typeof google === "undefined") {
          location_object.latitude = 37.441838;
          location_object.longitude = -122.161675;
          console.log('leaving test');
          deferred.resolve(location_object);
        }
        else {
          // call geolocation api
          var geocoder = new google.maps.Geocoder();
          // TODO: switch in location object address info
          geocoder.geocode( { 'address': '1500+Amphitheatre+Parkway,+Mountain+View,+CA'}, function(results, status) {
            console.log(results);
            console.log(status);
            if (status == google.maps.GeocoderStatus.OK) {
              location_object.latitude = results[0].geometry.location.lat();
              location_object.longitude = results[0].geometry.location.lng();
              console.log('leaving live');
              // need $rootScope.$apply here to transmit results back into Angular
              $rootScope.$apply(deferred.resolve(location_object));
            } else {
              $rootScope.$apply(deferred.reject(status));
            }
          });
        }
        return deferred.promise;
      },

      getGeohash: function(location_object) {
        //var geohash = 

      }
    };
  });

