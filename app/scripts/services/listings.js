'use strict';

angular.module('b4cmApp')

  /**
   * @name Listing Service
   * @service
   *
   * @description Pulls listings from FirebaseGeo
   * @data-location https://crowd-data.firebaseIO.com/geo/
   * @data-key lat and lon
   * @data-sample {JSON} 
   *    {'geohash':
   *        'id': {string} Spot id,
   *        'hash': {string} Spot geohash,
   *        'lat': {string} Spot latitude
   *        'lon': {string} Spot longitude
   *    }
   */ 
  .factory('listings', function ($q, $rootScope, geolocation) {

    var geoRef = new Firebase('https://crowd-data.firebaseio.com/geo'),
        geo = new FirebaseGeo(geoRef);

    //////////////////// 
    // PUBLIC API
    //////////////////// 
    return {

      /**
       * @name add
       * @funtion
       *
       * @description Adds a spot to the listings database.
       *              Requires lat and lon and data containing spot id.
       *              Adds lat and lon to data.  Geo will add hash.
       * @param {float} lat Spot's latitude.
       * @param {float} lon Spot's longitude.
       * @param {object} data Data object containing spot's id.                .
       * @returns {string} Geohash for spot.
       */ 
      add: function (lat, lon, data) {
        data.lat = lat;
        data.lon = lon;
        var hash = geo.insert(lat, lon, data);
        return hash;
      },

      edit: function () {
        return false;
      },

      /**
       * @name get
       * @funtion
       *
       * @description Gets the spots for a search location.  
       *              Filters based upon listing type.
       *              The location is an addressed which is converted 
       *              to lat and lon and then passed into Geo
       * @param {string} searchLocation Address of search.
       * @param {string} listingType Type of spot searching for. TODO: remove, not used here?
       * @returns {array} List of returned spot id's.
       */ 
      get: function (searchLocation, listingType) {
        var deferred = $q.defer(),
            DEFAULT_RADIUS = 10;
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
