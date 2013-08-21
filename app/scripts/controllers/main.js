'use strict';

angular.module('b4cmApp')
  .controller('MainCtrl', function ($scope, $location) {

    $scope.findListings = function() {
      $location.path("/listings");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

    $scope.addWatch = function() {
      $location.path("/addWatch");
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$scope.$$phase) { $scope.$apply(); }
    };

  });
