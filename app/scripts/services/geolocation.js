'use strict';

angular.module('b4cmApp')
  .factory('geolocation', function ($q, $rootScope) {

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
      getLatLong: function (address) {
        var deferred = $q.defer(),
            locObject = {};

        // No google in unit test so resolve fake lat/long
        if (typeof google === "undefined") {
          locObject.latitude = 37.441838;
          locObject.longitude = -122.161675;
          deferred.resolve(locObject);
        }

        else {
          // call geolocation api
          var geocoder = new google.maps.Geocoder();
              //address = location_object.address + ", " + location_object.city + ", " + location_object.state_code;
          address.replace(/ /g,"+"); // URI encode?
          console.log(address);
          geocoder.geocode( { 'address': address}, function(results, status) {
            console.log(results);
            console.log(status);
            if (status == google.maps.GeocoderStatus.OK) {
              locObject.latitude = results[0].geometry.location.lat();
              locObject.longitude = results[0].geometry.location.lng();
              // Need $rootScope.$apply here to transmit results back into Angular
              $rootScope.$apply(deferred.resolve(locObject));
            } else {
              // Need appropriate error handling.
              $rootScope.$apply(deferred.reject(status));
            }
          });
        }
        return deferred.promise;
      },

    };
  });

