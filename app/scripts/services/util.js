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
       * @name dayToNum
       * @function
       *
       * @description Converts a day of the week (i.e. sunday) to a number.
       *              Capitalization doesn't matter.
       * @param {string} dayOfWeek The english day of week.
       * @return {int} A number representing the day of week. Sunday = 0...
       */
      dayToNum: function(dayOfWeek) {
        var dayNum = -1;
        /* jshint -W015 */
        switch(dayOfWeek.toLowerCase()) {
        case 'sunday':    dayNum = 0; break;
        case 'monday':    dayNum = 1; break;
        case 'tuesday':   dayNum = 2; break;
        case 'wednesday': dayNum = 3; break;
        case 'thursday':  dayNum = 4; break;
        case 'friday':    dayNum = 5; break;
        case 'saturday':  dayNum = 6; break;
        }
        return dayNum;
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
