'use strict';

angular.module('b4cmApp')

  /**
   * @name Listings Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested listing.
   */
  .controller('ListingsCtrl', function ($scope, $log, $location, $routeParams, $timeout, $window, listings, spot, user, util) {

    var spotType = $routeParams.spotType,
        searchLocation = decodeURIComponent($routeParams.searchLocation),
        spotList = [],
        moreList = [],
        prevList = [],
        SPOTS_PER_PAGE = 10,
        HOUR = 60 * 60 * 1000,
        // Create a timeinfo object for each of the five crowdwatch boxes
        currentDate = new Date(),
        currentTime = util.timeInfo(currentDate),
        plus1Time = util.timeInfo(new Date(currentDate.getTime() + 1 * HOUR)),
        plus2Time = util.timeInfo(new Date(currentDate.getTime() + 2 * HOUR)),
        plus3Time = util.timeInfo(new Date(currentDate.getTime() + 3 * HOUR)),
        plus4Time = util.timeInfo(new Date(currentDate.getTime() + 4 * HOUR)),
        times = [currentTime, plus1Time, plus2Time, plus3Time, plus4Time];

    $scope.spots = [];
    $scope.noSpots = false;
    $scope.startIndex = 1;
    $scope.listings = {};
    $scope.listings.type = $routeParams.spotType;
    $scope.listings.displayAddress = searchLocation;
    $scope.currentTime = currentTime.getTimeLabel();
    $scope.plus2Time = plus2Time.getTimeLabel();
    $scope.plus4Time = plus4Time.getTimeLabel();


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
      $scope.listings.location = {};
      $scope.listings.location.latitude = listingInfo.location.latitude;
      $scope.listings.location.longitude = listingInfo.location.longitude;
      $scope.numReturns = idList.length;
      if (idList.length === 0) {$scope.noSpots = true; $scope.startIndex = 0;}
      else {
        // Must retrieve all spots returned in search
        // TODO: Need to fix this if have a lot of spots (at least return after 10 good ones returned)
        // and save others for later
        var typeSpots = 0,
            totalSpots = 0,
            initialized = false;
        for (var i = 0; i < idList.length; i++) {
          //if (i === idList.length) {break;} // Break if not a full set of results
          var spotId = idList[i];
          /* jshint -W083 */
          spot.get(spotId).then(function(spotObj) {
            totalSpots = totalSpots + 1;
            // Basic filtering: filter if no recommendations of this type.
            // Later should filter based on a percentage
            // Also, total is all returned spots for the area, not of this type.
            if (spotObj !== null && 
                (spotObj.type[spotType] > 0 || spotType === 'all')) {
              var currentStatus = spot.getStatus(spotObj, currentTime),
                  score = 0;
              typeSpots = typeSpots + 1;
              /* jshint camelcase: false */
              if (spotObj.review_count !== 0) {
                score = spotObj.rating_count / spotObj.review_count;
              }
              /* jshint camelcase: true */
              spotObj.stars = _calculateStars(score);
              spotObj.crowdStatusLabel = currentStatus.label;
              spotObj.crowdStatusTime = currentStatus.time;
              spotObj.crowdStatusBoxes = _calculateBoxLabels(spotObj, times);
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
    $scope.getSpot = function(spotId) {
      $location.path('/spot/' + spotId);
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
      $scope.displayPrevious = true;
      $scope.startIndex = $scope.startIndex + SPOTS_PER_PAGE;
      prevList = prevList.concat($scope.spots);
      $scope.spots = newList;
      if (moreList.length < 1) {$scope.displayMore = false;}
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
      $scope.displayMore = true;
      $scope.startIndex = $scope.startIndex - SPOTS_PER_PAGE;
      moreList = $scope.spots.concat(moreList);
      $scope.spots = newList;
      if (prevList.length < 1) {$scope.displayPrevious = false;}
      util.initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots, zoom, $scope.startIndex);
    };

  });

/***************
 * HELPER FUNCS
 ***************/

/* TODO: move to utility */
/* jshint -W003 */

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
  var crowdStatusLabels = [];
  times.forEach(function(time) {
    var day = spot.crowdfactor.day[time.getDay().toLowerCase()],
        count = day[time.getTimeLabel()].count,
        score = day[time.getTimeLabel()].score,
        crowdStatusScore = 0;
    if (count !== 0) {crowdStatusScore = score / count;}
    if (score === -1){crowdStatusScore = -1;}
    crowdStatusLabels.push(_calculateStatus(crowdStatusScore));
  });
  return crowdStatusLabels;
}


