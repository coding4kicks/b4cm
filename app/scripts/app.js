'use strict';

angular.module('b4cmApp', ["google-maps"])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/listings', {
        templateUrl: 'views/listings.html',
        controller: 'ListingsCtrl'
      })
      .when('/spot', {
        templateUrl: 'views/spot.html',
        controller: 'SpotCtrl'
      })
      .when('/addSpot', {
        templateUrl: 'views/addSpot.html',
        controller: 'AddSpotCtrl'
      })
      .when('/addReview', {
        templateUrl: 'views/addReview.html',
        controller: 'AddReviewCtrl'
      })
      .when('/addWatch', {
        templateUrl: 'views/addWatch.html',
        controller: 'AddWatchCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/privacy', {
        templateUrl: 'views/privacy.html',
        controller: 'PrivacyCtrl'
      })
      .when('/terms', {
        templateUrl: 'views/terms.html',
        controller: 'TermsCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FaqCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/advertise', {
        templateUrl: 'views/advertise.html',
        controller: 'AdvertiseCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

/*****************************
 * APPLICATION HELPER FUNCS
 *****************************/

/**
 * @name _calculateStars
 * @function
 *
 * @description Calculates an array of URLs to star pictures.
 *              URL is based upon the passed in rating.
 *              URL points to either full, half or empty star.
 * @param {float} rating Review's star rating.
 * @returns {array} Array of URLs to star pictures.
 */ 
function _calculateStars(rating) {
  var stars = [];
  for (var i = 1; i <= 5; i++) {
    if (i < rating) {stars.push("images/star-icon.png")}
    else if (0.25 < (i - rating) && (i - rating) < 0.75) {
      stars.push("images/star-icon-half.png")}
    else {stars.push("images/star-icon-empty.png")}
  }
  return stars;
}

/**
 * @name _initializeGoogleMaps
 * @procedure
 *
 * @description Initialize parameters for google maps directive for the spot page.
 * @params {object} $scope Controller's scope.
 * @returns {nothing} Procedure has side effects on scope.
 */ 
function _initializeGoogleMaps($scope, position, spots) {

  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  // Add test for existance so doesn't blow up unit tests
  if (typeof google !== "undefined") {
    google.maps.visualRefresh = true;
  }

  $scope.position = {
    'coords': {
      'latitude': position.latitude,
      'longitude': position.longitude
    }
  };

  /** the initial center of the map */
  $scope.centerProperty = {
    'latitude': position.latitude,
    'longitude': position.longitude
  };

  /** the initial zoom level of the map */
  $scope.zoomProperty = 14;

  /** list of markers to put in the map */
  //$scope.markersProperty = [
  //  { 'latitude': $scope.spot.location.latitude,
  //    'longitude': $scope.spot.location.longitude,
  //    'infoWindow': $scope.spot.name,
  //    'icon' : {'url': "../images/marker-icon1.png"}
  //  },
  //];

  /** list of markers to put in the map */
  $scope.markersProperty = [];
  for (var i = 0; i < spots.length; i++) {
    var marker = {},
        spot = spots[i],
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

