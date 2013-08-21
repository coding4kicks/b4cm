'use strict';

angular.module('b4cmApp')
  .controller('ListingsCtrl', function ($scope, $log, $location) {

    $scope.findSpot = function() {
      $location.path("/spot");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    // Add test for existance so doesn't blow up unit tests
    if (typeof google !== "undefined") {
      google.maps.visualRefresh = true;
    }

  angular.extend($scope, {
    
    position: {
      coords: {
      latitude: 37.447365,
      longitude: -122.160248
      }
    },
    
    /** the initial center of the map */
    centerProperty: {
      latitude: 37.447365,
      longitude: -122.160248
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
      { latitude: 37.447365,
        longitude: -122.160248,
        infoWindow: "Peet's Coffee and Tea",
        icon : {url: "../images/marker-icon2.png"}
      },
      { latitude: 37.446252,
        longitude: -122.164073,
        infoWindow: "Coupa Cafe",
        icon : {url: "../images/marker-icon3.png"}
      }
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

  });
