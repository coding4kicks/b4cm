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

    // Calculate current time, +2 hours, and +4 hours
    var current_date = new Date(),
        current_hour24 = current_date.getHours(),
        plus2_hour24 = current_hour24 + 2,
        plus4_hour24 = current_hour24 + 4,
        current_hour = current_hour24 % 12,
        plus2_hour = plus2_hour24 % 12,
        plus4_hour = plus4_hour24 % 12,
        current_meridiem = (current_hour24 - 12 < 0) ? 'am' : 'pm',
        plus2_meridiem = (plus2_hour24 - 12 < 0 || plus2_hour24 > 23) ? 'am' : 'pm',
        plus4_meridiem = (plus4_hour24 - 12 < 0 || plus4_hour24 > 23) ? 'am' : 'pm';
    if (current_hour === 0) {current_hour = 12}
    else if (plus2_hour === 0) {plus2_hour = 12}
    else if (plus4_hour === 0) {plus4_hour = 12}
    console.log(current_hour);
    console.log(plus2_hour);
    console.log(plus4_hour);
    $scope.current_time = current_hour + current_meridiem;
    $scope.plus2_time = plus2_hour + plus2_meridiem;
    $scope.plus4_time = plus4_hour + plus4_meridiem;


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


