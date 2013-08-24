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

    var hour = 60 * 60 * 1000,
        current_date = new Date(),
        current_time = timeInfo(current_date),
        plus1_time = timeInfo(new Date(current_date.getTime() + 1 * hour)),
        plus2_time = timeInfo(new Date(current_date.getTime() + 2 * hour)),
        plus3_time = timeInfo(new Date(current_date.getTime() + 3 * hour)),
        plus4_time = timeInfo(new Date(current_date.getTime() + 4 * hour)),
        times = [current_time, plus1_time, plus2_time, plus3_time, plus4_time];

    $scope.current_time = current_time.getTimeLabel();
    $scope.plus2_time = plus2_time.getTimeLabel();
    $scope.plus4_time = plus4_time.getTimeLabel();


    var CFLABELS = ['Empty', 'Few', 'Average', 'Crowded', 'Herd'];
    $scope.spots = [];
    $scope.listings.spots.forEach(function(geohash) {
      var spot_id = geohash[Object.keys(geohash)[0]],
          spot_obj = spot.get(spot_id);
          
          //count = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.current_time].count,
          //score = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.current_time].score,
          //count1 = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.plus1_time].count,
          //score1 = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.plus1_time].score,
          //count2 = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.plus2_time].count,
          //score2 = spot_obj.crowdfactor.day[current_day.toLowerCase()][$scope.plus2_time].score;
      
      // Calculate star rating for spot
      spot_obj.stars = _calculateStars(spot_obj.rating);

      // Calculate crowd status for crowd watch bar
      spot_obj.cf_status_label = ''//_calculateStatus(spot_obj, current_time);
      spot_obj.cf_status_boxes = _calculateBoxLabels(spot_obj, times)
      console.log(spot_obj.cf_status_boxes);
      $scope.spots.push(spot_obj);
    });

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

function timeInfo(date) {

  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
      day = WEEKDAY[date.getDay()],
      hour24 = date.getHours(),
      hour = hour24 % 12,
      meridiem = (hour24 - 12 < 0) ? 'am' : 'pm',
      timeLabel = '';
  if (hour === 0) {hour = 12};
  timeLabel = hour + meridiem;

  return {
    getTimeLabel: function() {return timeLabel;},
    getDay: function() {return day;}
  }
}

function _calculateBoxLabels(spot_obj, times) {
  var cf_labels = [];
  times.forEach(function(time) {
    var day = spot_obj.crowdfactor.day[time.getDay().toLowerCase()],
        count = day[time.getTimeLabel()].count,
        score = day[time.getTimeLabel()].score,
        cf_score = score / count;
    if(score === -1){cf_score = -1};
    cf_labels.push(_setStatus(cf_score));
  });
  return cf_labels;
}


