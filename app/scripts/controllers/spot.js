'use strict';

angular.module('b4cmApp')
  .controller('SpotCtrl', function ($scope) {
  
  $scope.addWatch = function() {
    $location.path("/addWatch");
    // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
    if(!$scope.$$phase) { $scope.$apply(); }
  };


  // Enable the new Google Maps visuals until it gets enabled by default.
  // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
  google.maps.visualRefresh = true;

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
    
  });
