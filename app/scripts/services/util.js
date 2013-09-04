'use strict';

angular.module('b4cmApp')
  .factory('util', function ($rootScope) {

    var firebaseUrl = 'https://crowd-data.firebaseIO.com/';

    // Public API here
    return {
      getFbUrl: function () {
        return firebaseUrl;
      },

      // https://coderwall.com/p/ngisma
      // solution in comments
      safeApply: function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if (fn) {
                $scope.$eval(fn);
            }
        } else {
            if (fn) {
                $scope.$apply(fn);
            } else {
                $scope.$apply();
            }
        }
      }

    };

  });
