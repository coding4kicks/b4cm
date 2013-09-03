'use strict';

angular.module('b4cmApp')
  .controller('SignupCtrl', function ($scope, user) {
    $scope.signup = function () {
      if (typeof $scope.email === 'undefined' ||
          typeof $scope.password === 'undefined') {
        alert('Must enter valid password and email');
      }
      else {
        user.signUp($scope.email, $scope.password);
      }
    };
    $scope.signin = function () {

    };

  });
