'use strict';

angular.module('b4cmApp')
  .directive('scrollPosition', function ($window) {
    return function(scope, element, attrs) {
      var windowEl = angular.element($window);
      windowEl.on('scroll', function() {
        scope.$apply(function() {
          scope[attrs.scrollPosition] = windowEl.scrollTop();
        });
      });
    };
  });
