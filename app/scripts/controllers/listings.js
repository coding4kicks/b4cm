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
        plus2_time = timeInfo(new Date(current_date.getTime() + 1 * hour)),
        plus3_time = timeInfo(new Date(current_date.getTime() + 1 * hour)),
        plus4_time = timeInfo(new Date(current_date.getTime() + 1 * hour));

    $scope.current_time = current_time.getLabel();
    $scope.plus2_time = current_time.getLabel();
    $scope.plus4_time = current_time.getLabel();

   // console.log(plus1_time.getLabel());

   // var cur_time = timeInfo(new Date());
   // console.log(cur_time.getLabel());
   // // Calculate current time, +2 hours, and +4 hours
   // var current_date = new Date(),
   //     WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
   //     current_day = WEEKDAY[current_date.getDay()],
   //     current_hour24 = current_date.getHours(),
   //     plus1_hour24 = current_hour24 + 1,
   //     plus2_hour24 = current_hour24 + 2,
   //     plus3_hour24 = current_hour24 + 3,
   //     plus4_hour24 = current_hour24 + 4,
   //     current_hour = current_hour24 % 12,
   //     plus1_hour = plus1_hour24 % 12,
   //     plus2_hour = plus2_hour24 % 12,
   //     plus3_hour = plus3_hour24 % 12,
   //     plus4_hour = plus4_hour24 % 12,
   //     current_meridiem = (current_hour24 - 12 < 0) ? 'am' : 'pm',
   //     plus1_meridiem = (plus1_hour24 - 12 < 0 || plus1_hour24 > 23) ? 'am' : 'pm',
   //     plus2_meridiem = (plus2_hour24 - 12 < 0 || plus1_hour24 > 23) ? 'am' : 'pm',
   //     plus3_meridiem = (plus3_hour24 - 12 < 0 || plus3_hour24 > 23) ? 'am' : 'pm',
   //     plus4_meridiem = (plus4_hour24 - 12 < 0 || plus4_hour24 > 23) ? 'am' : 'pm';
   // if (current_hour === 0) {current_hour = 12}
   // else if (plus2_hour === 0) {plus2_hour = 12}
   // else if (plus4_hour === 0) {plus4_hour = 12}
   // $scope.current_time = current_hour + current_meridiem;
   // $scope.plus1_time = plus1_hour + plus1_meridiem;
   // $scope.plus2_time = plus2_hour + plus2_meridiem;
   // $scope.plus3_time = plus3_hour + plus3_meridiem;
   // $scope.plus4_time = plus4_hour + plus4_meridiem;

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
          //spot_obj.cf_status_label = 
          //spot_obj.cf_status =
          // spot_obj.cf_status1 =
          //spot_obj.cf_status2 =
          //spot_obj.cf_status3 =
          //spot_obj.cf_status4 =
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
      label = '';
  if (hour === 0) {hour = 12};
  label = hour + meridiem;

  return {
    getLabel: function() {return label},
    getDay: function() {return day}
  }
}


