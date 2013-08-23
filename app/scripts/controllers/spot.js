'use strict';

angular.module('b4cmApp')

  /**
   * @name Spot Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested spot (aka. business).
   */ 
  .controller('SpotCtrl', function ($scope, $location, $timeout, spot) {

    $scope.spot = spot.get(); // Load spot information

    $scope.total_watchers = $scope.spot.crowdfactor.total_watchers;

    // Calculate stars overall and for each review.
    $scope.stars = _calculateStars($scope.spot.rating);
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


    var DAYS = {'monday': 'M', 'tuesday': 'T', 'wednesday': 'W', 'thursday': 'Th',
                'friday': 'F', 'saturday': 'Sa', 'sunday': 'Su'};

    $scope.show_marker = {};  // Matrix of boolean values.  True one based on current time.
    for (var day_name in DAYS) {
      $scope.show_marker[day_name] = {}
      for (var i = 1; i <= 12; i++) {
        $scope.show_marker[day_name][i + 'am'] = false;
        $scope.show_marker[day_name][i + 'pm'] = false;
      }
    }

    $scope.current_marker = {'day': '', 'hour': '', meridiem: ''}; // Currently visible marker position

    /**
     * GOOGLE MAPS
     */

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    // Add test for existance so doesn't blow up unit tests
    if (typeof google !== "undefined") {
      google.maps.visualRefresh = true;
    }
    
    $scope.position = {
      'coords': {
        'latitude': $scope.spot.location.latitude,
        'longitude': $scope.spot.location.longitude
      }
    };

    /** the initial center of the map */
    $scope.centerProperty = {
      'latitude': $scope.spot.location.latitude,
      'longitude': $scope.spot.location.longitude
    };

    /** the initial zoom level of the map */
    $scope.zoomProperty = 14;

    /** list of markers to put in the map */
    $scope.markersProperty = [
      { 'latitude': $scope.spot.location.latitude,
        'longitude': $scope.spot.location.longitude,
        'infoWindow': $scope.spot.name,
        'icon' : {'url': "../images/marker-icon1.png"}
      },
    ];
        
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

    /**
     * @name addWatch
     * @function
     *
     * @description Redirects to add-watch-page.
     */ 
    $scope.addWatch = function() {
      $location.path("/addWatch");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

    /**
     * @name _updateStatus
     * @function
     *
     * @description Sets the current time and the current status of a spot.
     *              Calls itself recursively.
     */ 
    var _updateStatus = function () {
      // Hack: should use GMT and Timezone, vice users machine.
      var current_date = new Date(),
          time_delta = 0,
          WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          CFLABELS = ['Empty', 'Few', 'Average', 'Crowded', 'Herd'];
    
      // Get current time info
      $scope.current_day = WEEKDAY[current_date.getDay()];
      $scope.current_hour = current_date.getHours() % 12;
      if ($scope.current_hour === 0) {$scope.current_hour = 12};
      $scope.current_meridiem = (current_date.getHours() - 12 < 0) ? 'am' : 'pm';
      $scope.current_minutes = current_date.getMinutes();
      if ($scope.current_minutes < 10) {$scope.current_minutes = '0' + $scope.current_minutes;}
    
      // Get status
      time_delta = (current_date.getTime() - $scope.spot.crowdfactor.most_recent.time) / 60 / 1000;
      if (time_delta < 60) {
        $scope.current_status = Math.round(time_delta) + ' minutes ago';
        $scope.current_cflabel = CFLABELS[$scope.spot.crowdfactor.most_recent.score - 1];
      }
      else {
        $scope.current_status = 'historical';
        var time_label = $scope.current_hour + $scope.current_meridiem,
            count = $scope.spot.crowdfactor.day[$scope.current_day.toLowerCase()][time_label].count,
            score = $scope.spot.crowdfactor.day[$scope.current_day.toLowerCase()][time_label].score;
        if (count === -1){ $scope.current_cflabel = 'Closed' }
        else {
          $scope.current_cflabel = CFLABELS[Math.round(score/count) - 1];
        }
      }

      // Update marker display.
      var time_label;
      if ($scope.current_marker.day !== $scope.current_day ||
          $scope.current_marker.hour !== $scope.current_hour) {
            if ($scope.current_marker.day) {
              time_label = $scope.current_marker.hour + $scope.current_marker.meridiem
              $scope.show_marker[$scope.current_marker.day][time_label] = false;
            }
            $scope.show_marker[$scope.current_day.toLowerCase()][$scope.current_hour + $scope.current_meridiem] = true;
            $scope.current_marker.day = $scope.current_day;
            $scope.current_marker.hour = $scope.current_hour ;
            $scope.current_marker.meridiem = $scope.current_meridiem;
        }
    
      $timeout(function(){_updateStatus();}, 60000);
    }
    // Start updates
    _updateStatus();

  });

/***************
 * HELPER FUNCS
 ***************/

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
      for (var i = 0; i < BLOCK_HOURS[block_name].length; i++) {
        block.hours.push(BLOCK_HOURS[block_name][i].slice(0,-2));
      }
      for (var day_name in DAYS) {
        var day = {};
        day.name = day_name;
        day.label = DAYS[day_name];
        day.hours = [];
        for (var i = 0; i < BLOCK_HOURS[block_name].length; i++) {
          var hour = {},
              hr = BLOCK_HOURS[block_name][i],
              spot_info = cf_day[day_name][hr],
              cf_score = spot_info.score / spot_info.count;
          if (spot_info.score < 0) {hour.cf_status = 'closed'}
          else if (cf_score < .5) {hour.cf_status = 'empty';} 
          else if (cf_score < 2.5) {hour.cf_status = 'few';}
          else if (cf_score < 3.5) {hour.cf_status = 'ave';}
          else if (cf_score < 4.5) {hour.cf_status = 'crowded';}
          else if (cf_score <= 5) {hour.cf_status = 'herd';}
          else {console.log('Error in status update for ' + day_name + ' at ' + hr);}
          hour.label = hr;
          day.hours.push(hour);
        }
        block.days.push(day);
      }
      display_blocks.push(block);
    };
  }
  return display_blocks;
}


