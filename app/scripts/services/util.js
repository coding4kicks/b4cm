'use strict';

angular.module('b4cmApp')
  .factory('util', function ($rootScope) {

    var firebaseUrl = 'https://crowd-data.firebaseIO.com/',
        WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Public API here
    return {

      /**
       * getFbURL
       * @function
       *
       * @description Provides a single source for the Firebase location.
       */ 
      getFbUrl: function () {
        return firebaseUrl;
      },

      /**
       * WEEKDAYS
       * @enum
       *
       * @description Enum of days of the week
       */ 
      WEEKDAYS: function () {
        return WEEKDAYS;
      },

      /**
       * safeApply
       * @procedure
       *
       * @description Enum of days of the week
       * @author https://coderwall.com/p/ngisma (in comments)
       */ 
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
      },

      /**
       * clone
       * @function
       *
       * @description Deep copies 6 types of Javascript objects.
       * @author http://stackoverflow.com/a/728694/2297380
       * @this Refers to the util service
       */ 
      clone: function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
      }

    };

  });
