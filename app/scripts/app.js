'use strict';

angular.module('b4cmApp', ["google-maps"])

  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/listings/:spotType/:searchLocation', {
        templateUrl: 'views/listings.html',
        controller: 'ListingsCtrl'
      })
      .when('/spot/:spotId', {
        templateUrl: 'views/spot.html',
        controller: 'SpotCtrl'
      })
      .when('/addSpot', {
        templateUrl: 'views/addSpot.html',
        controller: 'AddSpotCtrl'
      })
      .when('/addReview/:spotId', {
        templateUrl: 'views/addReview.html',
        controller: 'AddReviewCtrl'
      })
      .when('/addWatch/:spotId', {
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

  })
  
  .run(function ($rootScope, $location) {

    // Spot types for search
    $rootScope.spotTypes = [
      {name:'Food'},
      {name:'Study'},
      {name:'Social'},
      {name:'All'}
    ];
    $rootScope.spotType = $rootScope.spotTypes[0];

    /**
     * @name addWatch
     * @function
     *
     * @description Redirects to add-watch-page.
     */ 
    $rootScope.searchListings = function(spotType, searchLocation) {
      $location.path("/listings/" + spotType.toLowerCase() + "/" + encodeURIComponent(searchLocation));
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$rootScope.$$phase) { $rootScope.$apply(); }
    };

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
 * @name _calculateStatus
 * @function
 *
 * @description Calculates crowdfactor status based upon crowd score.
 * @param {float} score Crowd score from 1-5.
 * @returns {string} Crowd status (closed, empty, few, average, crowded, or herd).
 */ 
function _calculateStatus(score) {
  var cf_status = "";
  if (score < 0) {cf_status = 'closed'}
  else if (score < .5) {cf_status = 'empty';} 
  else if (score < 2.5) {cf_status = 'few';}
  else if (score < 3.5) {cf_status = 'average';}
  else if (score < 4.5) {cf_status = 'crowded';}
  else if (score <= 5) {cf_status = 'herd';}
  else {console.log('Error in status update for score:' + score);}
  return cf_status;
}

/**
 * @name _getStatus
 * @function
 *
 * @description Gets the current status label: closed, empty, few, average, crowded, herd.
 *              And determine if status is historical or withing the past hour.
 * @param {object} spot The spot to determine the status for.
 * @param {object} time The time object to use to determine the status.
 * @returns {object} cf_status with label property and time property
 */ 
function _getStatus(spot, time) {
  var cf_status = {},
      time_delta = (time.getTime() - spot.crowdfactor.most_recent.time) / 60 / 1000,
      CFLABELS = ['Empty', 'Few', 'Average', 'Crowded', 'Herd'],
      cf_status_label, cf_status_time;
  if (time_delta < 60) {
    cf_status_time = Math.round(time_delta) + ' minutes ago';
    cf_status_label = CFLABELS[$scope.spot.crowdfactor.most_recent.score - 1];
  }
  else {
    cf_status_time = 'historical';
    var day = spot.crowdfactor.day[time.getDay().toLowerCase()],
        count = day[time.getTimeLabel()].count,
        score = day[time.getTimeLabel()].score;    
    if (count === -1){ cf_status_label = 'Closed' }
    else {
      cf_status_label = CFLABELS[Math.round(score/count) - 1];
    }
  }
  cf_status.label = cf_status_label;
  cf_status.time = cf_status_time;
  return cf_status;
}

/**
 * @name _timeInfo
 * @function
 *
 * @description Closure that maintains time label and day of week info about a given date.
 *              Both can be used as keys to access a spots crowdfactor info.
 * @param {ojbect} date Date to calculate day and label for.
 * @returns {object} getTime() - Returns the getTime() result for the date object.
 *                   getTimeLabel() - Returns the time label.
 *                   getDay() - Returns the day of weeek
 */ 
function _timeInfo(date) {
  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
      day = WEEKDAY[date.getDay()],
      hour24 = date.getHours(),
      hour = hour24 % 12,
      meridiem = (hour24 < 12) ? 'am' : 'pm',
      timeLabel = '';
  if (hour === 0) {hour = 12};
  timeLabel = hour + meridiem;

  return {
    getTime: function() {return date.getTime();},
    getTimeLabel: function() {return timeLabel;},
    getDay: function() {return day;}
  }
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

