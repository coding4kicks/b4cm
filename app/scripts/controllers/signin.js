'use strict';

angular.module('b4cmApp')
  .controller('SigninCtrl', function ($scope, user) {
    $scope.signIn = function (provider) {
      alert('sign in: ', provider);
      user.logIn(provider, $scope.email, $scope.password);
    };
  });
