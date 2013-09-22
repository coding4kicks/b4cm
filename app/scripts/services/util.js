'use strict';

angular.module('b4cmApp')
  .factory('util', function ($rootScope) {

    var firebaseUrl = 'https://crowd-data.firebaseIO.com/',
        WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Public API here
    return {

      /**
       * @name getFbURL
       * @function
       *
       * @description Provides a single source for the Firebase location.
       */ 
      getFbUrl: function () {
        return firebaseUrl;
      },

      /**
       * @name WEEKDAYS
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
       * @name _constructCrowdFactor
       * @function
       *
       * @description Transform crowdfactor details into new structure better for display.
       *              New structure contains display information in separate blocks.
       * @param {array} cf_blocks Array of booleans, true if spot is open during block.
       * @param {object} cf_day Datastructure of status for every hour by day.
       * @returns {array} Array of display information for each day and hour broken up into blocks.
       */ 
      constructCrowdFactor: function(cf_blocks, cf_day) {
        var display_blocks = [], // Datastructure to display crowd factor.
            BLOCK_HOURS = {'morning': ['5am', '6am', '7am', '8am', '9am', '10am'],
                           'afternoon': ['11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
                           'evening': ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
                           'latenight': ['11pm', '12am', '1am', '2am', '3am', '4am']
                          },
            DAYS = {'monday': 'M', 'tuesday': 'T', 'wednesday': 'W', 'thursday': 'Th',
                    'friday': 'F', 'saturday': 'Sa', 'sunday': 'Su'};
        //for (var block_name in cf_blocks) {
        ['morning', 'afternoon', 'evening', 'latenight'].forEach(function(block_name){
          if(cf_blocks[block_name]) {
            var block = {};
            block.name = block_name;
            block.hours = [];
            block.days = [];
            BLOCK_HOURS[block_name].forEach(function(hour_label) {
              block.hours.push(hour_label.slice(0,-2));});
            for (var day_name in DAYS) {
              var day = {};
              day.name = day_name;
              day.label = DAYS[day_name];
              day.hours = [];
              BLOCK_HOURS[block_name].forEach(function(hour_label) {
                var hour = {},
                    spot_info = cf_day[day_name][hour_label],
                    cf_score = 0;
                if (spot_info.count !== 0) {cf_score = spot_info.score / spot_info.count;}
                if (spot_info.score === -1){cf_score = -1}
                hour.cf_status = _calculateStatus(cf_score);
                hour.label = hour_label;
                day.hours.push(hour);
              });
              block.days.push(day);
            }
            display_blocks.push(block);
          };
        });
        return display_blocks;
      },

      /**
       * @name _initializeGoogleMaps
       * @procedure
       *
       * @description Initialize parameters for google maps directive for the spot page.
       * @params {object} $scope Controller's scope.
       * @returns {nothing} Procedure has side effects on scope.
       */
      initializeGoogleMaps: function($scope, position, spots, zoom, index) {
      
        // TODO: Need to make sure center and zoom encompass all the locations.  
        //       Should probably just have zoom level and search radius be equal. How?
      
        // Enable the new Google Maps visuals until it gets enabled by default.
        // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
        // Add test for existance so doesn't blow up unit tests
        if (typeof google !== 'undefined') {
          google.maps.visualRefresh = true;
        }
        $scope.position = {
          'coords': {
            'latitude': position.latitude,
            'longitude': position.longitude
          }
        };
        /** the initial center of the map */
        $scope.centerProperty = {
          'latitude': position.latitude,
          'longitude': position.longitude
        };
        /** the initial zoom level of the map */
        $scope.zoomProperty = zoom || 14;
      
        /** list of markers to put in the map */
        $scope.markersProperty = [];
        for (var i = 0; i < spots.length; i++) {
          var marker = {},
              spot = spots[i],
              url = '../images/marker-icon' + (index + i) + '.png';
          marker.latitude = spot.location.latitude;
          marker.longitude = spot.location.longitude;
          marker.infoWindow = spot.name;
          marker.icon = {'url': url};
          $scope.markersProperty.push(marker);
        }
      
        // These 2 properties will be set when clicking on the map
        $scope.clickedLatitudeProperty = null;
        $scope.clickedLongitudeProperty = null;
        $scope.eventsProperty = {
          'click': function (mapModel, eventName, originalEventArgs) {
            // 'this' is the directive's scope
            $log.log('user defined event on map directive with scope', this);
            $log.log('user defined event: ' + eventName, mapModel, originalEventArgs);
          }
        };
        $scope.isMapElementHidden = false;
      },

      /**
       * @name safeApply
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
       * @name clone
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
