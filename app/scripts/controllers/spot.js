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

    $scope.stars = []; // Array of URLs for rating visuals
    for (var i = 1; i <= 5; i++) {
      if (i < $scope.spot.rating) {$scope.stars.push("images/star-icon.png")}
      else if (0.25 < (i - $scope.spot.rating) && (i - $scope.spot.rating) < 0.75) {
        $scope.stars.push("images/star-icon-half.png")}
      else {$scope.stars.push("images/star-icon-empty.png")}
    }

    $scope.types = []; // Array of types/weighting for this spot
    var total_icon_size = 5625, // 75 x 75 max icon size
        total_font_size = 324, // 18 max font size
        total_count = $scope.spot.type.food + $scope.spot.type.study + $scope.spot.type.social,
        size, font;
    size = Math.sqrt(total_icon_size * ($scope.spot.type.food/total_count));
    font = Math.sqrt(total_font_size * ($scope.spot.type.food/total_count));
    $scope.types.push(["../images/b4cm-icon-food.png", "Food", size, font]);
    size = Math.sqrt(total_icon_size * ($scope.spot.type.study/total_count));
    font = Math.sqrt(total_font_size * ($scope.spot.type.study/total_count));
    $scope.types.push(["../images/b4cm-icon-study.png", "Study", size, font]);
    size = Math.sqrt(total_icon_size * ($scope.spot.type.social/total_count));
    font = Math.sqrt(total_font_size * ($scope.spot.type.social/total_count));
    $scope.types.push(["../images/b4cm-icon-social.png", "Social", size, font]);
    $scope.types.sort(function(a, b) {return b[2] - a[2]});

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
          weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          time_delta = 0,
          CFLABELS = ['Empty', 'Few', 'Average', 'Crowded', 'Herd'];
    
      // Get current time info
      $scope.current_day = weekday[current_date.getDay()];
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
    
      $timeout(function(){_updateStatus();}, 60000);
    }
    // Start updates
    _updateStatus();

  });


