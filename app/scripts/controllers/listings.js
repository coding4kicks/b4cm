'use strict';

angular.module('b4cmApp')

  /**
   * @name Listings Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested listing.
   */ 
  .controller('ListingsCtrl', function ($scope, $log, $location, $routeParams, listings, spot) {

    var spotType = $routeParams.spotType,
        searchLocation = decodeURIComponent($routeParams.searchLocation),
        spotList = [],
        cacheList = [],
        SPOTS_PER_PAGE = 10,
        CACHE_SIZE = SPOTS_PER_PAGE * 1, // implement cache of next page results later (at end of function)
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
    $scope.listings = {}
    $scope.listings.type = $routeParams.spotType;
    $scope.listings.displayAddress = searchLocation;
    $scope.current_time = current_time.getTimeLabel();
    $scope.plus2_time = plus2_time.getTimeLabel();
    $scope.plus4_time = plus4_time.getTimeLabel();

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
    // TODO: filter by spot type in listings service
    listings.get(searchLocation, spotType).then(function(listingInfo) {
      var idList = listingInfo.idList;
      $scope.listings.location = {}
      $scope.listings.location.latitude = listingInfo.location.latitude;
      $scope.listings.location.longitude = listingInfo.location.longitude; 
      $scope.numReturns = idList.length;
      if (idList.length === 0) {$scope.noSpots = true;}
      else {

        // Get and format spot info for each spot in returned id list,
        // up to the number of spots per page to display.
        for (var i = 0; i < SPOTS_PER_PAGE; i++) {
          if (i === idList.length) {break;} // Break if not a full set of results
          var spotId = idList[i];
          spot.get(spotId).then(function(spotObj) {
            var current_status = _getStatus(spotObj, current_time),
                score = 0;
            if (spotObj.review_count !== 0) {
              score = spotObj.rating_count / spotObj.review_count;
            }
            spotObj.stars = _calculateStars(score);
            spotObj.cf_status_label = current_status.label;
            spotObj.cf_status_time = current_status.time;
            spotObj.cf_status_boxes = _calculateBoxLabels(spotObj, times)
            $scope.spots.push(spotObj);
            if ($scope.spots.length + 1 === SPOTS_PER_PAGE ||
                $scope.spots.length === idList.length) {
              // Initialize google maps parameters for listings page when all data is ready
              _initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots, 12);
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
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
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


