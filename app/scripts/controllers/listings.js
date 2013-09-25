'use strict';

angular.module('b4cmApp')

  /**
   * @name Listings Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested listing.
   */ 
  .controller('ListingsCtrl', function ($scope, $log, $location, $routeParams, $timeout, $window, 
                                        listings, spot, user, util) {

    var spotType = $routeParams.spotType,
        searchLocation = decodeURIComponent($routeParams.searchLocation),
        spotList = [],
        moreList = [],
        prevList = [],
        SPOTS_PER_PAGE = 10,
        HOUR = 60 * 60 * 1000,
        // Create a timeinfo object for each of the five crowdwatch boxes
        current_date = new Date(),
        current_time = _timeInfo(current_date),
        plus1_time = _timeInfo(new Date(current_date.getTime() + 1 * HOUR)),
        plus2_time = _timeInfo(new Date(current_date.getTime() + 2 * HOUR)),
        plus3_time = _timeInfo(new Date(current_date.getTime() + 3 * HOUR)),
        plus4_time = _timeInfo(new Date(current_date.getTime() + 4 * HOUR)),
        times = [current_time, plus1_time, plus2_time, plus3_time, plus4_time];

    $scope.spots = [];
    $scope.noSpots = false;
    $scope.startIndex = 1;
    $scope.listings = {}
    $scope.listings.type = $routeParams.spotType;
    $scope.listings.displayAddress = searchLocation;
    $scope.current_time = current_time.getTimeLabel();
    $scope.plus2_time = plus2_time.getTimeLabel();
    $scope.plus4_time = plus4_time.getTimeLabel();

    //console.log('heeer');
    //console.log($scope.scroll);

    // Google map defaults - Otherwise 3rd party plugin breaks
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
    $scope.zoomProperty = 12;

    // Retrieve the listings for the specified search location, 
    listings.get(searchLocation, spotType).then(function(listingInfo) {
      var idList = listingInfo.idList;
      $scope.listings.location = {}
      $scope.listings.location.latitude = listingInfo.location.latitude;
      $scope.listings.location.longitude = listingInfo.location.longitude; 
      $scope.numReturns = idList.length;
      if (idList.length === 0) {$scope.noSpots = true; $scope.startIndex = 0;}
      else {
        // Must retrieve all spots returned in search
        // Need to fix this if have a lot of spots (at least return after 10 good ones returned)
        // and save others for later
        var typeSpots = 0,
            totalSpots = 0,
            initialized = false;
        for (var i = 0; i < idList.length; i++) {
          //if (i === idList.length) {break;} // Break if not a full set of results
          var spotId = idList[i];
          spot.get(spotId).then(function(spotObj) {
            totalSpots = totalSpots + 1;
            // Basic filtering: filter if no recommendations of this type.
            // Later should filter based on a percentage
            // Also, total is all returned spots for the area, not of this type.
            if (spotObj !== null && spotObj.type[spotType] > 0) {
              var current_status = spot.getStatus(spotObj, current_time),
                  score = 0;
              typeSpots = typeSpots + 1;
              if (spotObj.review_count !== 0) {
                score = spotObj.rating_count / spotObj.review_count;
              }
              spotObj.stars = _calculateStars(score);
              spotObj.cf_status_label = current_status.label;
              spotObj.cf_status_time = current_status.time;
              spotObj.cf_status_boxes = _calculateBoxLabels(spotObj, times)
              if ($scope.spots.length < SPOTS_PER_PAGE) {
                $scope.spots.push(spotObj);
              }
              else {
                moreList.push(spotObj);
                $scope.displayMore = true;
              }
            }
            // Initialize google maps parameters for listings page when all data is ready
            if ((typeSpots === SPOTS_PER_PAGE ||
                totalSpots === idList.length) &&
                !initialized) {
              var zoom = 12,
                  index = 1;
              initialized = true;
              util.initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots, zoom, index);
            }
          });
        }
      }
    });

    /**
     * @name getSpot
     * @function
     *
     * @description Redirects to spot-page passing spot id.
     */ 
    $scope.getSpot = function(spot_id) {
      $location.path("/spot/" + spot_id);
      util.safeApply($scope);
    };

    /**
     * @name addSpot
     * @function
     *
     * @description Redirects to add-spot-page if user logged in.
     */ 
    $scope.addSpot = function() {
      if (user.loggedIn()) {
        $location.path('/addSpot');
        util.safeApply($scope);
      }
      else {
        alert('Must be signed in to add a spot.');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };   

    /**
     * @name moreSpots
     * @function
     *
     * @description Displays the next set of results.
     */ 
    $scope.moreSpots = function() {
      var newList = moreList.splice(0, SPOTS_PER_PAGE),
          zoom = 12;
      $scope.displayPrevious = true
      $scope.startIndex = $scope.startIndex + SPOTS_PER_PAGE;
      prevList = prevList.concat($scope.spots);
      $scope.spots = newList;
      if (moreList.length < 1) {$scope.displayMore = false}
      util.initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots, zoom, $scope.startIndex);
    }; 

    /**
     * @name previousSpots
     * @function
     *
     * @description Displays the previous set of results.
     */ 
    $scope.previousSpots = function() {
      var newList = prevList.splice(prevList.length - SPOTS_PER_PAGE, SPOTS_PER_PAGE),
          zoom = 12;
      $scope.displayMore = true
      $scope.startIndex = $scope.startIndex - SPOTS_PER_PAGE;
      moreList = $scope.spots.concat(moreList);
      $scope.spots = newList;
      if (prevList.length < 1) {$scope.displayPrevious = false}
      util.initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots, zoom, $scope.startIndex);
    }; 

  });

/***************
 * HELPER FUNCS
 ***************/

/**
 * @name _calculateBoxLabels
 * @function
 *
 * @description Determines the crowdfactor status for an array of times.
 * @param {object} spot Spot to determine crowdfactor info from.
 * @param {array} times Array of times to determine status for.
 * @returns {array} An array of crowdfactor statuses.
 */ 
function _calculateBoxLabels(spot, times) {
  var cf_labels = [];
  times.forEach(function(time) {
    var day = spot.crowdfactor.day[time.getDay().toLowerCase()],
        count = day[time.getTimeLabel()].count,
        score = day[time.getTimeLabel()].score,
        cf_score = 0;
    if (count !== 0) {cf_score = score / count;}
    if (score === -1){cf_score = -1};
    cf_labels.push(_calculateStatus(cf_score));
  });
  return cf_labels;
}


