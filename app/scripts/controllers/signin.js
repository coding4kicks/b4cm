'use strict';

angular.module('b4cmApp')
  .controller('SigninCtrl', function ($scope, user) {
    $scope.signIn = function (provider) {
      user.logIn(provider, $scope.email, $scope.password);
    };
  });
