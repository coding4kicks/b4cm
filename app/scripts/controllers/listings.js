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

    // Format spots for display
    $scope.spots = [];
    $scope.listings.spots.forEach(function(geohash) {
      var spot_id = geohash[Object.keys(geohash)[0]],
          spot_obj = spot.get(spot_id),
          current_status = _calculateCurrentStatus1(spot_obj, current_time);;
                
      // Calculate star rating for spot
      spot_obj.stars = _calculateStars(spot_obj.rating);

      // Calculate crowd status for crowd watch bar
      spot_obj.cf_status_label = current_status.label;
      spot_obj.cf_status_time = current_status.time;
      spot_obj.cf_status_boxes = _calculateBoxLabels(spot_obj, times)


      $scope.spots.push(spot_obj);
    });

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
      meridiem = (hour24 - 12 < 0) ? 'am' : 'pm',
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
    cf_labels.push(_setStatus(cf_score));
  });
  return cf_labels;
}


