'use strict';

angular.module('b4cmApp')

  /**
   * @name Spot Controller
   * @controller
   *
   * @description Retrieves and calculates display information for a requested spot (aka. business).
   */ 
  .controller('SpotCtrl', function ($scope, $location, spot) {

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
    console.log($scope.types);

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    // Add test for existance so doesn't blow up unit tests
    if (typeof google !== "undefined") {
      google.maps.visualRefresh = true;
    }

    angular.extend($scope, {
      
      position: {
        coords: {
        latitude: 37.441838 ,
        longitude: -122.161675
        }
      },
      
      /** the initial center of the map */
      centerProperty: {
        latitude: 37.441838 ,
        longitude: -122.161675
      },
        
      /** the initial zoom level of the map */
      zoomProperty: 14,
        
      /** list of markers to put in the map */
      markersProperty: [
        { latitude: 37.441838 ,
          longitude: -122.161675,
          infoWindow: "Philz Coffee",
          icon : {url: "../images/marker-icon1.png"}
        },
      ],
        
      // These 2 properties will be set when clicking on the map
      clickedLatitudeProperty: null,	
      clickedLongitudeProperty: null,
        
      eventsProperty: {
        click: function (mapModel, eventName, originalEventArgs) {	
          // 'this' is the directive's scope
          $log.log("user defined event on map directive with scope", this);
          $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
        }
      }
    });

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

  });
