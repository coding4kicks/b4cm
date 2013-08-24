'use strict';

angular.module('b4cmApp')

  /**
   * @name Listings Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested listing.
   */ 
  .controller('ListingsCtrl', function ($scope, $log, $location, listings, spot) {

    // Get listings
    $scope.listings = listings.get();
    $scope.spots = [];
    $scope.listings.spots.forEach(function(geohash) {
      var spot_id = geohash[Object.keys(geohash)[0]],
          spot_obj = spot.get(spot_id);
          spot_obj.stars = _calculateStars(spot_obj.rating);
      $scope.spots.push(spot_obj);
    });
    //console.log(spots);
    

    // Initialize google maps parameters for listings page
    _initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots);

    /**
     * @name getSpot
     * @function
     *
     * @description Redirects to spot-page.
     */ 
    $scope.getSpot = function() {
      $location.path("/spot");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };  

  });

/***************
 * HELPER FUNCS
 ***************/


