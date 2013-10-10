'use strict';

angular.module('b4cmApp')

  /**
   * @name Spot Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested spot (aka. business).
   */ 
  .controller('SpotCtrl', function ($scope, $location, $timeout, $routeParams, spot, user, util) {
    $scope.doneInitializing = false;
    $scope.initClass = 'page-element';
    $scope.startIndex = 1;
    $scope.noReviews = false;
    $scope.displayMore = true;
    $scope.externalServices = [];
    // Google map defaults
    $scope.isMapElementHidden = true;
    $scope.centerProperty = {
      'latitude': 37.7833,
      'longitude': 122.4167
    };
    $scope.position = {
      'coords': {
        'latitude': 37.7833,
        'longitude': 122.4167
      }
    };
    $scope.zoomProperty = 14;

    // Load spot information
    spot.get($routeParams.spotId).then(function(spot_data) {
      $scope.spot = spot_data;
      $scope.watch_count = $scope.spot.crowdfactor.watch_count;
      //$scope.spot.yelpLink = "http://www.yelp.com/biz/" + $scope.spot.yelp_id;

      // Calculate stars overall, stars for each review,
      // and the total number of reviews being displayed and reviews returned.
      var ratingScore = 0;
      if($scope.spot.review_count !== 0) {
        ratingScore = $scope.spot.rating_count / $scope.spot.review_count;
      }
      $scope.stars = _calculateStars(ratingScore);
      var reviewsDisplayedCount = 0;
      if (typeof $scope.spot.reviews !== 'undefined' && $scope.spot.review_count !== 0) {
        for (var review in $scope.spot.reviews) {
          // Set defualt pic
          if (typeof $scope.spot.reviews[review].author !== 'undefined' &&
              !$scope.spot.reviews[review].author.pic) {
            $scope.spot.reviews[review].author.pic = '../images/default-author-pic.png';
          }
          $scope.spot.reviews[review].stars = _calculateStars($scope.spot.reviews[review].rating.label);
          reviewsDisplayedCount = reviewsDisplayedCount + 1;
        }
      }
      $scope.reviewsDisplayedCount = reviewsDisplayedCount;
      
      // If no reviews to show, display the "Be the first" tagline
      if ($scope.spot.review_count < 1) {$scope.noReviews = true;}

      // Calculate weighting for each type of spot.
      $scope.types = _weightTypes($scope.spot.type.food,
                                  $scope.spot.type.study,
                                  $scope.spot.type.social);

      // Determine external services
      if($scope.spot.yelp_id){
        var serviceInfo = {};
        serviceInfo.name = 'Yelp';
        serviceInfo.logo = '../images/yelp-logo.jpg';
        serviceInfo.link = 'http://www.yelp.com/biz/' + $scope.spot.yelp_id;
        $scope.externalServices.push(serviceInfo);
      }
      if($scope.spot.opentable_id){
        // TODO: handle time and date
        var serviceInfo = {};
        serviceInfo.name = 'OpenTable';
        serviceInfo.logo = '../images/opentable-logo.jpeg';
        serviceInfo.link = 'http://www.opentable.com/opentables.aspx?t=rest&r=' +
                            $scope.spot.opentable_id + 
                            '&m=4&p=2&d=10/11/2013%207:00:00%20PM&scpref=10'
        $scope.externalServices.push(serviceInfo);
      }
      if($scope.spot.doordash){
        var serviceInfo = {};
        serviceInfo.name = 'DoorDash';
        serviceInfo.logo = '../images/doordash-logo.jpeg';
        serviceInfo.link = 'https://www.doordash.com/palo_alto'
        $scope.externalServices.push(serviceInfo);

      }
      if($scope.spot.orderahead){
        var serviceInfo = {};
        serviceInfo.name = 'OrderAhead';
        serviceInfo.logo = '../images/orderahead-logo.jpeg';
        serviceInfo.link = 'https://www.orderaheadapp.com/search?q=' + 
                           encodeURIComponent($scope.spot.name) + 
                           "&loc=" + 
                           encodeURIComponent($scope.spot.location.city);
        $scope.externalServices.push(serviceInfo);
      }
      console.log($scope.externalServices);
        
      // Calculate block structure for display of crowdfactor visualization.
      $scope.blocks = util.constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                                $scope.spot.crowdfactor.day);

      // Set up crowdfactor current time marker information.
      $scope.show_marker = _initializeShowMarkerMatrix();
      $scope.current_marker = {'day': '', 'hour': '', 'meridiem': ''}; 
      
      // Initialize google maps parameters for spot page
      console.log('initializing google maps');
      $timeout(function(){_initializeGoogleMaps($scope, $scope.spot.location, [$scope.spot])},0);
      
      // Start updates of current time, marker, and crowdstatus.
      _updateStatus($scope, $timeout, spot, util);
      $scope.doneInitializing = true;
      $scope.initClass = '';
     });

    /**
     * @name addWatch
     * @function
     *
     * @description Redirects to add-watch-page.
     */ 
    $scope.addWatch = function() {
      if (user.loggedIn()){
        $location.path("/addWatch/" + $scope.spot.id);
        util.safeApply($scope);
      }
      else {
        alert("Must be logged in to add a watch");
        $location.path("/signin/");
        util.safeApply($scope);
      }
    };

    /**
     * @name editSpot
     * @function
     *
     * @description Redirects to editSpot-page.
     */ 
    $scope.editSpot = function() {
      if (user.loggedIn()){
        $location.path("/editSpot/" + $scope.spot.id);
        util.safeApply($scope);
      }
      else {
        alert("Must be logged in to add a watch");
        $location.path("/signin/");
        util.safeApply($scope);
      }
    };

    /**
     * @name addReview
     * @function
     *
     * @description Redirects to add-review-page.
     */ 
    $scope.addReview = function() {
      if (user.loggedIn()){
        $location.path("/addReview/" + $scope.spot.id);
        util.safeApply($scope);
      }
      else {
        alert("Must be logged in to add a review.");
        $location.path("/signin/");
        util.safeApply($scope);
      }
    };

    /**
     * @name findNearby
     * @function
     *
     * @description Redirects listings page.
     * @param {string} type The type of listings to find
     */ 
    $scope.findNearby = function(spotType) {
      var searchLocation = $scope.spot.location.address + ', ' + 
                           $scope.spot.location.city + ', ' + 
                           $scope.spot.location.state_code;
      $location.path('/listings/' + spotType.toLowerCase() + '/' + encodeURIComponent(searchLocation));
      util.safeApply($scope);
    };

    /**
     * @name addToFavs
     * @procedure
     *
     * @description Adds a spot to the users favorites list.
     * @param {string} type The type of listings to find
     */ 
    $scope.addToFavs = function() {
      if(user.loggedIn()) {
        console.log('adding a fav.');
        user.addToFavs($scope.spot.id);
      }
      else{alert('Must be logged in to fav a spot.');}
    };

  });

/***************
 * HELPER FUNCS
 ***************/

/**
 * @name _weightTypes
 * @function
 *
 * @description Determines what percent of total each type represents.
 *              Used to adjust type icon and text size.
 * @param {integer} food Number of votes for food type.
 * @param {integer} study Number of votes for study type.
 * @param {integer} social Number of votes for social type.
 * @returns {array} Sorted array of icon URLs, type name, icon size, and font size.
 */ 
function _weightTypes(food, study, social) {
  var types = [],
      total_count = food + study + social;
  types.push(_calculateTypeWeight(food, 'Food', total_count));
  types.push(_calculateTypeWeight(study, 'Study', total_count));
  types.push(_calculateTypeWeight(social, 'Social', total_count));
  types.sort(function(a, b) {return b[2] - a[2]});
  return types;
}

/**
 * @name _calculateTypeWeight
 * @function
 *
 * @description Determine the weight for a single type.
 *              Construct array of type display parameters.
 *              Used by _weightTypes function.
 * @param {integer} count Count for a particular type.
 * @param {string} label Name of type.
 * @param {integer} total Sum of counts for all types.
 * @returns {array} Array of type parameters: URL, type name, icon size, and font size.
 */ 
function _calculateTypeWeight(count, label, total) {
  var total_icon_size = 5625, // 75 x 75 max icon size
      total_font_size = 324, // 18 max font size
      url, size, font;
  url = "../images/b4cm-icon-" + label.toLowerCase() + ".png";
  size = Math.sqrt(total_icon_size * (count/total));
  font = Math.sqrt(total_font_size * (count/total));
  return [url, label, size, font];
}

/**
 * @name _initializeShowMarkerMatrix
 * @function
 *
 * @description Set up boolean matrix of current time markers.
 *              All initially set to false.
 *              One true on will be determined by current time.
 * @returns {object} Boolean matrix, size is days x hours.
 */ 
function _initializeShowMarkerMatrix() {
  var show_marker = {},  
      DAYS = {'monday': 'M', 'tuesday': 'T', 'wednesday': 'W', 'thursday': 'Th',
              'friday': 'F', 'saturday': 'Sa', 'sunday': 'Su'};
  for (var day_name in DAYS) {
    show_marker[day_name] = {}
    for (var i = 1; i <= 12; i++) {
      show_marker[day_name][i + 'am'] = false;
      show_marker[day_name][i + 'pm'] = false;
    }
  }
  return show_marker;
}

/**
 * @name _updateStatus
 * @procedure
 *
 * @description Sets the current time and the current status of a spot.
 *              Calls itself recursively.
 * @returns {nothing} Procedure has side effects on scope.
 */ 
var _updateStatus = function ($scope, $timeout, spot, util) {
  // Hack: should use GMT and Timezone, vice users machine time.
  var current_date = new Date(),
      current_status = spot.getStatus($scope.spot, util.timeInfo(current_date));;
  _calculateCurrentTimeInfo($scope, current_date);
  $scope.current_status = current_status.time;
  $scope.current_cflabel = current_status.label || 'No Data';
  $scope.current_comment = current_status.comment;
  $scope.current_user = current_status.user;
  $scope.current_image_url = current_status.image_url;
  _updateMarker($scope);
  $timeout(function(){_updateStatus($scope, $timeout, spot, util);}, 60000);
}

/**
 * @name _calculateCurrentTimeInfo
 * @procedure
 *
 * @description Calculates day of week, hours, minutes, and meridiem for display.
 * @returns {nothing} Procedure has side effects on scope.
 */ 
function _calculateCurrentTimeInfo($scope, current_date) {
  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $scope.current_day = WEEKDAY[current_date.getDay()];
  $scope.current_hour = current_date.getHours() % 12;
  if ($scope.current_hour === 0) {$scope.current_hour = 12};
  $scope.current_meridiem = (current_date.getHours() - 12 < 0) ? 'am' : 'pm';
  $scope.current_minutes = current_date.getMinutes();
  if ($scope.current_minutes < 10) {$scope.current_minutes = '0' + $scope.current_minutes;}
}

/**
 * @name _updateMarker
 * @procedure
 *
 * @description Update (if necessary) the position of the current time marker.
 * @returns {nothing} Procedure has side effects on scope.
 */ 
function _updateMarker($scope) {
  var time_label;
  if ($scope.current_marker.day !== $scope.current_day ||
      $scope.current_marker.hour !== $scope.current_hour) {
    if ($scope.current_marker.day) {
      time_label = $scope.current_marker.hour + $scope.current_marker.meridiem
      $scope.show_marker[$scope.current_marker.day][time_label] = false;
    }
    $scope.show_marker[$scope.current_day.toLowerCase()][$scope.current_hour + $scope.current_meridiem] = true;
    $scope.current_marker.day = $scope.current_day.toLowerCase();
    $scope.current_marker.hour = $scope.current_hour ;
    $scope.current_marker.meridiem = $scope.current_meridiem;
  }
}



