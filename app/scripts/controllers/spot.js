'use strict';

angular.module('b4cmApp')

  /**
   * @name Spot Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested spot (aka. business).
   */ 
  .controller('SpotCtrl', function ($scope, $location, $timeout, $routeParams, angularFire, spot) {

    // Load spot information
    //$scope.spot = spot.get($routeParams.spotId);

    spot.get($routeParams.spotId).then(function(spot_data) {

      $scope.spot = spot_data;
      console.log($scope.spot);
      $scope.watch_count = $scope.spot.crowdfactor.watch_count;

      // Calculate stars overall and for each review.
      $scope.stars = _calculateStars($scope.spot.rating);
      if (typeof $scope.spot.reviews === 'undefined') {$scope.spot.reviews = {'length': 0};}
      for (var j = 0; j < $scope.spot.reviews.length; j++) {
        $scope.spot.reviews[j].stars = _calculateStars($scope.spot.reviews[j].rating);
      }

      // Calculate weighting for each type of spot.
      $scope.types = _weightTypes($scope.spot.type.food,
                                  $scope.spot.type.study,
                                  $scope.spot.type.social);

      // Calculate block structure for display of crowdfactor visualization.
      $scope.blocks = _constructCrowdFactor($scope.spot.crowdfactor.blocks,
                                            $scope.spot.crowdfactor.day);

      // Set up crowdfactor current time marker information.
      $scope.show_marker = _initializeShowMarkerMatrix();
      $scope.current_marker = {'day': '', 'hour': '', 'meridiem': ''}; // Currently visible marker position

      // Initialize google maps parameters for spot page
      _initializeGoogleMaps($scope, $scope.spot.location, [$scope.spot]);
   
      // Start updates
      _updateStatus($scope, $timeout);

     });

    /**
     * @name addWatch
     * @function
     *
     * @description Redirects to add-watch-page.
     */ 
    $scope.addWatch = function() {
      $location.path("/addWatch/" + $scope.spot.id);
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

    /**
     * @name addReview
     * @function
     *
     * @description Redirects to add-review-page.
     */ 
    $scope.addReview = function() {
      $location.path("/addReview/" + $scope.spot.id);
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
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
 * @name _constructCrowdFactor
 * @function
 *
 * @description Transform crowdfactor details into new structure better for display.
 *              New structure contains display information in separate blocks.
 * @param {array} cf_blocks Array of booleans, true if spot is open during block.
 * @param {object} cf_day Datastructure of status for every hour by day.
 * @returns {array} Array of display information for each day and hour broken up into blocks.
 */ 
function _constructCrowdFactor(cf_blocks, cf_day) {
  var display_blocks = [], // Datastructure to display crowd factor.
      BLOCK_HOURS = {'morning': ['5am', '6am', '7am', '8am', '9am', '10am'],
                     'afternoon': ['11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
                     'evening': ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
                     'latenight': ['11pm', '12am', '1am', '2am', '3am', '4am']
                    },
      DAYS = {'monday': 'M', 'tuesday': 'T', 'wednesday': 'W', 'thursday': 'Th',
              'friday': 'F', 'saturday': 'Sa', 'sunday': 'Su'};
  for (var block_name in cf_blocks) {
    if(cf_blocks[block_name]) {
      var block = {};
      block.name = block_name;
      block.hours = [];
      block.days = [];
      BLOCK_HOURS[block_name].forEach(function(hour_label) {
        block.hours.push(hour_label.slice(0,-2));});
      for (var day_name in DAYS) {
        var day = {};
        day.name = day_name;
        day.label = DAYS[day_name];
        day.hours = [];
        BLOCK_HOURS[block_name].forEach(function(hour_label) {
          var hour = {},
              spot_info = cf_day[day_name][hour_label],
              cf_score = spot_info.score / spot_info.count;
          if(spot_info.score === -1){cf_score = -1};
          hour.cf_status = _calculateStatus(cf_score);
          hour.label = hour_label;
          day.hours.push(hour);
        });
        block.days.push(day);
      }
      display_blocks.push(block);
    };
  }
  return display_blocks;
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
var _updateStatus = function ($scope, $timeout) {
  // Hack: should use GMT and Timezone, vice users machine time.
  var current_date = new Date(),
      current_status = _getStatus($scope.spot, _timeInfo(current_date));;
  _calculateCurrentTimeInfo($scope, current_date);
  $scope.current_status = current_status.time;
  $scope.current_cflabel = current_status.label;
  _updateMarker($scope);
  $timeout(function(){_updateStatus($scope, $timeout);}, 60000);
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



