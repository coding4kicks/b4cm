'use strict';

angular.module('b4cmApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.findListings = function() {
      alert('here');
      //$location.path("#/listings");
      //$scope.$apply();
    };
  });
