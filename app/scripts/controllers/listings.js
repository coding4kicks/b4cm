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
        searchLocation = decodeURIComponent($routeParams.searchLocation);
  
    $scope.listings = {}
    $scope.listings.type = $routeParams.spotType;
    $scope.listings.location = searchLocation;

    // Get geohash
    var spotList = [],
        cacheList = [],
        SPOTS_PER_PAGE = 10,
        CACHE_SIZE = SPOTS_PER_PAGE * 1; 
        // implement cache of next page results later (at end of function)

    $scope.spots = [];

    // Calculate times
    var hour = 60 * 60 * 1000,
        current_date = new Date(),
        current_time = _timeInfo(current_date),
        plus1_time = _timeInfo(new Date(current_date.getTime() + 1 * hour)),
        plus2_time = _timeInfo(new Date(current_date.getTime() + 2 * hour)),
        plus3_time = _timeInfo(new Date(current_date.getTime() + 3 * hour)),
        plus4_time = _timeInfo(new Date(current_date.getTime() + 4 * hour)),
        times = [current_time, plus1_time, plus2_time, plus3_time, plus4_time];

    $scope.current_time = current_time.getTimeLabel();
    $scope.plus2_time = plus2_time.getTimeLabel();
    $scope.plus4_time = plus4_time.getTimeLabel();

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
  
    listings.get(searchLocation, spotType).then(function(idList) {
      console.log(idList);
      // Get and format spot info for each spot in returned id list.
      for (var i = 0; i < SPOTS_PER_PAGE; i++) {
        var spotId = idList[i];
        spot.get(spotId).then(function(spotObj) {
          current_status = _getStatus(spotObj, current_time);
          spotObj.stars = _calculateStars(spotObj.rating);
          spotObj.cf_status_label = current_status.label;
          spotObj.cf_status_time = current_status.time;
          spotObj.cf_status_boxes = _calculateBoxLabels(spot_obj, times)
          $scope.spots.push(spotObj);
          if ($scope.spots.length + 1 === SPOTS_TO_SHOW) {
            // Initialize google maps parameters for listings page when all data is ready
            _initializeGoogleMaps($scope,  $scope.listings.location, $scope.spots);
          }
        });
      }
    });
      // Get listings
      //$scope.listings = listings.get(spotType);

      // Format spots for display
      //$scope.spots = [];
      //$scope.listings.spots.forEach(function(geohash) {
      //listings_data.spots.forEach(function(geohash) {
      //  var spot_id = geohash[Object.keys(geohash)[0]],
      //      spot_obj = spot.get(spot_id),
      //      current_status = _getStatus(spot_obj, current_time);
                  
        // Calculate star rating for spot
      //  spot_obj.stars = _calculateStars(spot_obj.rating);

        // Calculate crowd status for crowd watch bar
      //  spot_obj.cf_status_label = current_status.label;
      //  spot_obj.cf_status_time = current_status.time;
      //  spot_obj.cf_status_boxes = _calculateBoxLabels(spot_obj, times)

       // $scope.spots.push(spot_obj);
      //});


    //});

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
        cf_score = score / count;
    if(score === -1){cf_score = -1};
    cf_labels.push(_calculateStatus(cf_score));
  });
  return cf_labels;
}


