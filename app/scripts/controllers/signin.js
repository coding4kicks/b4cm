'use strict';

angular.module('b4cmApp')
  .controller('SigninCtrl', function ($scope, user) {
    $scope.signIn = function (provider) {
      user.logIn(provider, $scope.email, $scope.password);
    };

    $scope.tempAlert = function () {
      alert('Alternate signup methods will be available for beta in a few weeks.');
    };

  });
