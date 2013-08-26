'use strict';

angular.module('b4cmApp')
  .controller('AddSpotCtrl', function ($scope, spot) {

    var newSpot = {};

    $scope.addHours = function() {
      alert("here");
    };

    $scope.addSpot = function() {
      spot.create(newSpot);
    };

    $scope.yelpIdHelp = function() {
      alert("here");
    };

  });
