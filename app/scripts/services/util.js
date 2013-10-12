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
       * @name constructCrowdFactor
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
                    'friday': 'F', 'saturday': 'Sa', 'sunday': 'Su'},
            util = this;
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
                // Handle case of after midnight
                if (block_name === 'latenight' && hour_label !== '11pm') {
                  spot_info = cf_day[util.WEEKDAYS()[util.incrementDay(day_name)].toLowerCase()][hour_label];
                }
                if (spot_info.count !== 0) {cf_score = spot_info.score / spot_info.count;}
                if (spot_info.score === -1){cf_score = -1}
                hour.cf_status = util.calculateStatus(cf_score);
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
    
      shouldBeNextDay: function(times) {
        if(times.close_meridiem.label === 'am') {
          if(times.open_meridiem.label === 'pm') {return true;}
          else if(parseInt(times.open_hour.label) >= parseInt(times.close_hour.label)){return true;}
          else if(parseInt(times.close_hour.label) === 12){return true;}
          else {return false;}
        }
        else {return false;}
      },

      /**
       * @name statusToScore
       * @function
       *
       * @description Convert a crowd status label to a digital score.
       * @param {string} cf_status The crowd status: empty, few, etc.
       * @returns {int} Status score 1-5.
       */ 
      statusToScore: function(cf_status) {
        switch (cf_status) {
          case 'empty':
            return 1;
            break;
          case 'few':
            return 2;
            break;
          case 'average':
            return 3;
            break;
          case 'crowded':
            return 4;
            break;
          case 'packed':
            return 5;
            break;
        }
      },

      /**
       * @name calculateWatchTimes
       * @function
       *
       * @description Given a start and stop times, creates an array of time lables
       *              used as keys for updating a spot's crowdseer.  Also determines the total 
       *              score and count for the time periods.  Also checks time is not closed
       *              and score for the 
       * @param {object} start The start time. Props: day (int), hour (int), meridiem (string)
       * @param {object} stop The stop time. Props: day (int), hour (int), meridiem (string)
       * @return {array} An array of watch time lables i.e {'day': 'monday', 'hour': '11pm'}
       */
      calculateWatchTimes: function(start, stop, spot) {
        var times = [],
            day = spot.crowdfactor.day,
            current = {'day': start.day, 'hour': start.hour, 'meridiem': start.meridiem},
            WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
        while (current.day !== stop.day ||
               current.hour !== stop.hour ||
               current.meridiem !== stop.meridiem) {
      
          // Add watch to times
          var watch = {};
          var i = 0;
          i = i + 1;
          watch.day = WEEKDAYS[current.day].toLowerCase();
          watch.hour = current.hour + current.meridiem;
          watch.count = day[watch.day][watch.hour].count;
          watch.score = day[watch.day][watch.hour].score;
          // only add if not closed
          if (day[watch.day][watch.hour].count !== -1) {times.push(watch);}
      
          // Increment current time
          current.hour = current.hour + 1;
          if (current.hour === 12) {
            if (current.meridiem === 'pm') {
              current.day = current.day + 1;
              if (current.day === 7) {current.day = 0;}
              current.meridiem = 'am';
            }
            else {
              current.meridiem = 'pm';
            }
          }
          else if (current.hour === 13) {current.hour = 1;}
        }
        return times;
      },

      /**
       * @name incrementDay
       * @function
       *
       * @description Advances the day of week by one
       * @param {string} day The day to increment
       * @this The utility service
       * @return {int} The number representation of the next day.
       */
      incrementDay: function(day) {
        var nextDay = this.dayToNum(day) + 1;
        if (nextDay === 7) {nextDay = 0;}
        return nextDay;
      },

      /**
       * @name handleFormErrors
       * @procedure
       *
       * @description Notifies the user of errors upon form submission.
       *              Recieves a scope and array of errors that are invalid.
       *              For each error, the scope's validForm object is switched to
       *              invalid, triggering the invalid css class for that elelment.
       * @param {object} $scope The form's controlling scope.
       * @param {array} errors An array of string names for each error type.
       */
      handleFormErrors: function($scope, errors) {
        errors.forEach(function(error) {
          $scope.validForm[error.toLowerCase()] = 'invalid';
        });
        if (errors.length === 1) {
          alert(errors[0] + ' is a required field.');
        }
        else {
          alert(errors.join(', ') + ' are required fields.');
        }
      },

      /**
       * @name timeInfo
       * @function
       *
       * @description Closure that maintains time label and day of week info about a given date.
       *              Both can be used as keys to access a spots crowdfactor info.
       * @param {ojbect} date Date to calculate day and label for.
       * @returns {object} getTime() - Returns the getTime() result for the date object.
       *                   getTimeLabel() - Returns the time label.
       *                   getDay() - Returns the day of weeek
       */
      timeInfo: function(date) {
        var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = WEEKDAY[date.getDay()],
            hour24 = date.getHours(),
            hour = hour24 % 12,
            meridiem = (hour24 < 12) ? 'am' : 'pm',
            timeLabel = '';
        if (hour === 0) {hour = 12;}
        timeLabel = hour + meridiem;
      
        return {
          getTime: function() {return date.getTime();},
          getTimeLabel: function() {return timeLabel;},
          getDay: function() {return day;}
        };
      },

      /**
       * @name calculateStars
       * @function
       *
       * @description Calculates an array of URLs to star pictures.
       *              URL is based upon the passed in rating.
       *              URL points to either full, half or empty star.
       * @param {float} rating Review's star rating.
       * @returns {array} Array of URLs to star pictures.
       */
      calculateStars: function(rating) {
        var stars = [];
        for (var i = 1; i <= 5; i++) {
          if (i <= rating) {stars.push('images/star-icon.png');}
          else if (0.25 < (i - rating) && (i - rating) < 0.75) {
            stars.push('images/star-icon-half.png');
          }
          else {stars.push('images/star-icon-empty.png');}
        }
        return stars;
      },

      /**
       * @name calculateStatus
       * @function
       *
       * @description Calculates crowdfactor status based upon crowd score.
       * @param {float} score Crowd score from 1-5.
       * @returns {string} Crowd status (closed, empty, few, average, crowded, or packed).
       */
      calculateStatus: function(score) {
        var cfStatus = '';
        if (score < 0) {cfStatus = 'closed';}
        else if (score < 0.5) {cfStatus = 'none';}
        else if (score < 1.5) {cfStatus = 'empty';}
        else if (score < 2.5) {cfStatus = 'few';}
        else if (score < 3.5) {cfStatus = 'average';}
        else if (score < 4.5) {cfStatus = 'crowded';}
        else if (score <= 5) {cfStatus = 'packed';}
        else {console.log('Error in status update for score:' + score);}
        return cfStatus;
      },

      /**
       * @name initializeGoogleMaps
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
