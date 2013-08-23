'use strict';

angular.module('b4cmApp')
  .controller('ListingsCtrl', function ($scope, $log, $location) {

   // Initialize google maps parameters for listings page
    _initializeGoogleMapsListings($scope);

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

/**
 * @name _initializeGoogleMapsListings
 * @procedure
 *
 * @description Initialize parameters for google maps directive on listings-page.
 * @params {object} $scope Controller's scope.
 * @returns {nothing} Procedure has side effects on scope.
 */ 
function _initializeGoogleMapsListings($scope) {

  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  // Add test for existance so doesn't blow up unit tests
  if (typeof google !== "undefined") {
    google.maps.visualRefresh = true;
  }

  $scope.listings = {};
  $scope.listings.location = {};
  $scope.listings.location.latitude = 37.447365;
  $scope.listings.location.longitude =-122.160248;

  $scope.listings.spots = [];
  var spot1 = {},
      spot2 = {},
      spot3 = {};
  spot1.name = "Philz Coffee";
  spot1.location = {'latitude': 37.441838, 'longitude': -122.161675};
  spot2.name = "Peet's Coffee and Tea";
  spot2.location = {'latitude': 37.441838, 'longitude': -122.160248};
  spot3.name = "Coupa Cafe";
  spot3.location = {'latitude': 37.446252, 'longitude': -122.160248};
  $scope.listings.spots.push(spot1);
  $scope.listings.spots.push(spot2);
  $scope.listings.spots.push(spot3);

  $scope.position = {
    'coords': {
      'latitude': $scope.listings.location.latitude,
      'longitude': $scope.listings.location.longitude
    }
  };

  /** the initial center of the map */
  $scope.centerProperty = {
    'latitude': $scope.listings.location.latitude,
    'longitude': $scope.listings.location.longitude
  };

  /** the initial zoom level of the map */
  $scope.zoomProperty = 14;

  /** list of markers to put in the map */
  $scope.markersProperty = [];
  for (var i = 0; i < $scope.listings.spots.length; i++) {
    var marker = {},
        spot = $scope.listings.spots[i],
        url = "../images/marker-icon" + (i + 1) + ".png";
    marker.latitude = spot.location.latitude;
    marker.longitude = spot.location.longitude;
    marker.infoWindow = spot.name;
    marker.icon = {'url': url};
    $scope.markersProperty.push(marker);
  }  

  // These 2 properties will be set when clicking on the map
  $scope.clickedLatitudeProperty = null;
  $scope.clickedLongitudeProperty = null;   
  $scope.eventsProperty = {
    'click': function (mapModel, eventName, originalEventArgs) {	
      // 'this' is the directive's scope
      $log.log("user defined event on map directive with scope", this);
      $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
    }
  };
}
