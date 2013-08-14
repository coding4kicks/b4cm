'use strict';

angular.module('b4cmApp')
  .controller('ListingsCtrl', function ($scope, $location) {

    $scope.findSpot = function() {
      $location.path("/spot");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

    //angular.extend($scope, {
	  //  center: {
		//    latitude: 0, // initial map center latitude
		//    longitude: 0, // initial map center longitude
	  //  },
	  //  markers: [], // an array of markers,
	  //  zoom: 8, // the zoom level
    //});

  });
