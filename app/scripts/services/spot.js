'use strict';

angular.module('b4cmApp')

  /**
   * @name Spot Service
   * @service
   *
   * @description Saves, retrieves, and edits Spot information.
   * @data-location https://crowd-data.firebaseIO.com/spots/
   * @data-key <spot.id>
   * @data-sample {JSON} 
   *    {'spot':
   *        'id': {string}  Yelp id or Spot name + city + incremented int,
   *        'imageUrl': {string} Image to the picture for the spot,
   *        'wifi': {boolean} True if spot has wifi,
   *        'yelp_id': {string} The yelp_id for the business,
   *        'rating_count': {int} The sum of all rating scores
   *        'review_count': {int} The total number of reviews
   *        'reviews': {array} Users' reviews,
   *        'location': {object} details about Spots location
   *        'crowdfactor': {object} Details about the crowds at a spot
   *        'business_hours': {array} Details of the spots hours of operation
   *    }
   */ 
  .factory('spot', function ($q, $timeout, $rootScope, geolocation, listings, user, util) {

    // Initialize cache to 20
    var cache = spotCache(20),
        fbUrl = util.getFbUrl();

    //////////////////// 
    // PUBLIC API
    //////////////////// 
    return {

      /**
       * @name addReview
       * @funtion
       *
       * @description Adds a review for a spot by a user to both the spot and the user.
       *              Recieves a review object, a spot id, and additional: updated counts
       *              The review contains author info, a writup and a rating 
       * @param {object} newReview A review to be added to a spot.
       *                 Properties: author info, writeup, and rating
       * @param {int} spotId The spot to add the review to.
       * @param {object} additionalInfo Counts needed to update the spot object.                 .
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      addReview: function (newReview, spotId, additionalInfo) {
        var revRef = new Firebase(fbUrl + 'spots/' + spotId + '/reviews').push(),
            spotRef = new Firebase(fbUrl + 'spots/' + spotId),
            userRef = new Firebase(fbUrl + 'users/' + newReview.author.id);
        spotRef.child('review_count').set(parseInt(additionalInfo.review_count) + 1);
        spotRef.child('rating_count').set(parseInt(additionalInfo.rating_count) + parseInt(newReview.rating.label));
        var typeUpdate = {'food': parseInt(additionalInfo.type.food) + newReview.type.food,
                          'study': parseInt(additionalInfo.type.study) + newReview.type.study,
                          'social': parseInt(additionalInfo.type.social) + newReview.type.social
                         };
        if (additionalInfo.review_count === 0) {
          var user_info = {};
          user_info = newReview.author;
          user_info.date = newReview.date;
          spotRef.child('first_review').set(user_info); 
        }
        spotRef.child('type').set(typeUpdate);
        revRef.set(newReview);
        return false
      },

      /**
       * @name addWatch
       * @funtion
       *
       * @description Adds crowd watch details for to a spot.  Recieves a watch object
       *              and a spot id.  The watch object contains contains start and stop
       *              times and a rating.  This is converted in to an array of hours that
       *              is used as input to a crowdseer object.
       * @param {object} newWatch Describes a crowd watch to be entered into a spot.
       *                 Properties: start and stop times of watch event, a rating.
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      addWatch: function (newWatch, spotId, currentCount) {
        var dayRef = new Firebase(fbUrl + 'spots/' + spotId + '/crowdfactor/day/'),
            crowdFactorRef = new Firebase(fbUrl + 'spots/' + spotId + '/crowdfactor/'),
            score = util.statusToScore(newWatch.cf_status),
            currentHour = (new Date()).getHours() % 12,
            lastWatchHour = parseInt(newWatch.time[newWatch.time.length - 1].hour.slice(0,-2));

        crowdFactorRef.child('watch_count').set(currentCount + 1);
        if (typeof newWatch.comment === 'undefined') {newWatch.comment = 'No Comment';}
        newWatch.time.forEach(function(time) {
          dayRef.child(time.day).child(time.hour).child('count').set(time.count + 1);
          dayRef.child(time.day).child(time.hour).child('score').set(time.score + score);
          // Set most recent if close to current time
          if(Math.abs(currentHour - lastWatchHour) < 2) {
            var mostRecent = {'score': score, 'time': (new Date()).getTime(),
                              'comment': newWatch.comment, 'user': newWatch.user,
                              'image_url': newWatch.image_url};
            crowdFactorRef.child('most_recent').set(mostRecent);
            //crowdFactorRef.child('most_recent').child('score').set(score);
            //crowdFactorRef.child('most_recent').child('time').set((new Date()).getTime());
            //crowdFactorRef.child('most_recent').child('comment').set(newWatch.comment);
            //crowdFactorRef.child('most_recent').child('user').set(newWatch.user);
          }

        });
        return false;
      },

      /**
       * @name addMultipleWatches
       * @funtion
       *
       * @description Adds multiple crowd watches for to a spot. Updates the entire 
       *              crowdfactor.
       * @param {object} newWatch Describes a crowd watch to be entered into a spot.
       *                 Properties: start and stop times of watch event, a rating.
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      addMultipleWatches: function (crowdfactor, spotId) {
        var crowdFactorRef = new Firebase(fbUrl + 'spots/' + spotId + '/crowdfactor/');
        crowdFactorRef.set(crowdfactor);
        return false;
      },

      /**
       * @name create
       * @funtion
       *
       * @description Creates and enters a spot from the datastore. The newSpot
       *              parameter is a partially constructed spot.  Additional details
       *              added here, such as the lat and long, the id, and defaults.
       * @param {object} newSpot The spot to be entered into datastore.
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      create: function (newSpot) {

        var deferred = $q.defer(),
            base_url = 'https://crowd-data.firebaseio.com/spots/',
            spot_url = '',
            locationObj = {'address': newSpot.location.address,
                           'address2': newSpot.location.address2,
                           'city': newSpot.location.city,
                           'postal_code': newSpot.location.postal_code, 
                           'state_code': newSpot.location.state_code },
            address = locationObj.address + ", " + locationObj.city + ", " + locationObj.state_code;

        if(typeof locationObj.address2 !== 'undefined'){
            address = locationObj.address + ", " + locationObj.address2 + ", " + 
                      locationObj.city + ", " + locationObj.state_code;
        }

        newSpot.id = _constructId(newSpot);

        // Set Defaults - Must guard against undefined to protect from Firebase error.
        if (typeof newSpot.yelp_id === 'undefined') {newSpot.yelp_id = null};
        if (typeof newSpot.image_url === 'undefined') {newSpot.image_url = null};
        if (typeof newSpot.wifi === 'undefined') {newSpot.wifi = false};
        if (typeof newSpot.address2 === 'undefined') {newSpot.wifi = null};
        if (typeof newSpot.opentable_id === 'undefined') {newSpot.opentable_id = null};
        if (typeof newSpot.doordash === 'undefined') {newSpot.doordash = false};
        if (typeof newSpot.orderahead === 'undefined') {newSpot.orderahead = false};
        if (typeof newSpot.phone === 'undefined') {newSpot.phone = null};
        if (typeof newSpot.email === 'undefined') {newSpot.email = null};
        if (typeof newSpot.website === 'undefined') {newSpot.website = null};
        newSpot.review_count = 0;
        newSpot.rating_count = 0;
        newSpot.reviews = [];
        newSpot.crowdfactor = _initCrowdSeer(newSpot);

        // Asynch call to get lat and long.
        geolocation.getLatLong(address).then(function(locationObject) {          
          newSpot.location.latitude = locationObject.latitude;
          newSpot.location.longitude = locationObject.longitude;

          // Add to listings & add geohash TODO: return geohash
          newSpot.location.geohash = listings.add(locationObject.latitude,
                                                  locationObject.longitude,
                                                  {'id': newSpot.id});

          // Add the new spot in Firebase
          var spotRef = new Firebase('https://crowd-data.firebaseIO.com/spots/' + newSpot.id);
          spotRef.set(newSpot);

          deferred.resolve(newSpot);

        }, function(reason) {
          if (reason === 'ZERO_RESULTS') {alert('Unable to geolocate address.');}
          console.log('failed for ' + reason);
          deferred.resolve('error');
        });

        return deferred.promise;
      },

      /**
       * @name edit
       * @funtion
       *
       * @description Edits a spot in the datastore. If the address has
       *              changed, the old listing is removed and a new one 
       *              added with the new geohash.  No matter what, the id
       *              will still be the same.  Issue is if name changes,
       *              url will still have old name.
       * @param {object} editedSpot The new spot info.
       * @param {object} oldData Old data for the crowdfactor and address
       * @returns {object} The spot if successful otherwise an error code.
       */  
      edit: function (editedSpot, oldData) {
        var deferred = $q.defer(),
            base_url = 'https://crowd-data.firebaseio.com/spots/',
            spot_url = '',
            locationObj = {'address': editedSpot.location.address,
                           'city': editedSpot.location.city,
                           'postal_code': editedSpot.location.postal_code, 
                           'state_code': editedSpot.location.state_code },
            address = locationObj.address + ", " + 
                      locationObj.city + ", " + 
                      locationObj.state_code,
            oldAddress = oldData.location.address + ", " + 
                         oldData.location.city + ", " + 
                         oldData.location.state_code;

        if(typeof locationObj.address2 !== 'undefined' && 
           locationObj.address2 !== null &&
           locationObj.address2 !== ''){
          address = locationObj.address + ", " + 
                    locationObj.address2 + ", " + 
                    locationObj.city + ", " + 
                    locationObj.state_code;
        }

        if(typeof oldData.location.address2 !== 'undefined' &&
           oldData.location.address2 !== null &&
           oldData.location.address2 !== ''){
          oldAddress = oldData.location.address + ", " + 
                       oldData.location.address2 + ", " +
                       oldData.location.city + ", " + 
                       oldData.location.state_code;
        }

        // Set Defaults - Must guard against undefined to protect from Firebase error.
        if (typeof editedSpot.yelp_id === 'undefined') {editedSpot.yelp_id = null};
        if (typeof editedSpot.image_url === 'undefined') {editedSpot.image_url = null};
        if (typeof editedSpot.wifi === 'undefined') {editedSpot.wifi = false};
        if (typeof editedSpot.location.address2 === 'undefined') {
            editedSpot.location.address2 = null
        };
        if (typeof editedSpot.opentable_id === 'undefined') {editedSpot.opentable_id = null};
        if (typeof editedSpot.doordash === 'undefined') {editedSpot.doordash = false};
        if (typeof editedSpot.orderahead === 'undefined') {editedSpot.orderahead = false};
        if (typeof editedSpot.phone === 'undefined') {editedSpot.phone = null};
        if (typeof editedSpot.email === 'undefined') {editedSpot.email = null};
        if (typeof editedSpot.website === 'undefined') {editedSpot.website = null};


        // How to deal with watches that already exist: need update
        editedSpot.crowdfactor = _initCrowdSeer(editedSpot);
        editedSpot.crowdfactor = _updateCrowdSeer(editedSpot, oldData);

        // Asynch call to get lat and long.
        // only do geolocation and add to listing if new address (must delete old from listing)
        if (address !== oldAddress || 
            typeof oldData.location.latitude === 'undefined' ||
            typeof oldData.location.longitude === 'undefined') {
          geolocation.getLatLong(address).then(function(locationObject) {          
            editedSpot.location.latitude = locationObject.latitude;
            editedSpot.location.longitude = locationObject.longitude;

            // double check new lat long different for update
            if (editedSpot.location.latitude !== oldData.location.latitude ||
                editedSpot.location.longitude !== oldData.location.longitude) {
              listings.remove(oldData.location.geohash);
              // Add to listings & add geohash TODO: return geohash
              // Need listing delete of old
              editedSpot.location.geohash = listings.add(locationObject.latitude,
                                                      locationObject.longitude,
                                                      {'id': editedSpot.id});
            }

            // Add the new spot in Firebase
            var spotRef = new Firebase('https://crowd-data.firebaseIO.com/spots/' + editedSpot.id);
            spotRef.set(editedSpot);

            deferred.resolve(editedSpot);

          }, function(reason) {
            if (reason === 'ZERO_RESULTS') {alert('Unable to geolocate address.');}
            console.log('failed for ' + reason);
            deferred.resolve('error');
          });
        }
        else {
          // Add the new spot in Firebase
          var spotRef = new Firebase('https://crowd-data.firebaseIO.com/spots/' + editedSpot.id);
          spotRef.set(editedSpot);
          deferred.resolve(editedSpot);
        }

        return deferred.promise;
      },

      /**
       * @name get
       * @funtion
       *
       * @description Retrieves a spot from the datastore. 
       * @param {string} id The id of the spot to get from the datastore.
       * @returns {object} The spot if successful otherwise an error code.
       */       
      get: function (id) {
        // TODO: need code to deal with invalid IDs.
        //if (id in spotCache) {deferred.resolve(spotCache[id]);}
        var deferred = $q.defer();
        if(cache.check(id)) {deferred.resolve(cache.get(id));}
        else {
          var spotRef = new Firebase('https://crowd-data.firebaseIO.com/spots/' + id);
          spotRef.on('value', function(data) {
            // Need to handle data.val() === null
            // Need $rootScope.$apply here to transmit results back into Angular
            //$rootScope.$apply(deferred.resolve(data.val()));
            util.safeApply($rootScope, deferred.resolve(data.val()));
            cache.add(data.val());
            // TODO: Need broadcast to update current status / comment
            // $rootScope.$broadcast('most_recent', data.val().crowdfactor.most_recent);
          });
        }
        return deferred.promise;
      },

      /**
       * @name remove
       * @funtion
       *
       * @description Removes a spot from the datastore. 
       * @param {string} id The spot id to remove from the datastore.
       * @returns {string} The spot id if successful otherwise an error code.
       */ 
      remove: function (id) {
        return false;
      },

      /**
       * @name getStatus
       * @function
       *
       * @description Gets the current status label: closed, empty, few, average, crowded, packed.
       *              And determine if status is historical or withing the past hour.
       * @param {object} spot The spot to determine the status for.
       * @param {object} time The time object to use to determine the status.
       * @returns {object} cfStatus with label, time, and comment properties
       */
      getStatus: function(spot, time) {
        /* jshint camelcase: false */
        var cfStatus = {},
            timeDelta = (time.getTime() - spot.crowdfactor.most_recent.time) / 60 / 1000,
            CFLABELS = ['Empty', 'Few', 'Average', 'Crowded', 'Packed'];
      
        if (timeDelta < 60) {
      
          cfStatus.time = Math.round(timeDelta) + ' minutes ago';
          cfStatus.label = CFLABELS[spot.crowdfactor.most_recent.score - 1];
          cfStatus.comment = '"' + spot.crowdfactor.most_recent.comment + '"';
          cfStatus.user = spot.crowdfactor.most_recent.user;
          cfStatus.image_url = spot.crowdfactor.most_recent.image_url;
          /* jshint camelcase: true */
        }
        else {
          cfStatus.time = 'historical';
          cfStatus.comment = 'N/A';
          cfStatus.user = '';
          var day = spot.crowdfactor.day[time.getDay().toLowerCase()],
              count = day[time.getTimeLabel()].count,
              score = day[time.getTimeLabel()].score;
          if (count === -1){ cfStatus.label = 'Closed'; }
          else if (count === 0){
            cfStatus.label = '';
            cfStatus.time = 'No watches';
          }
          else {
            cfStatus.label = CFLABELS[Math.round(score/count) - 1];
          }
        }
        return cfStatus;
      }
    };
  });

/**
 * @name _constructId
 * @function
 *
 * @description Constructs the id for a spot object.  If a yelp_id is present, that is added
 *              as the id, otherwise an id is constructed with the name, location, and possible int. 
 * @param {object} newSpot A spot with name and city (possibly yelp_id) but no id.
 * @returns {object} A spot object with an id.
 */ 
function _constructId(newSpot) {
  if (typeof newSpot.yelp_id !== 'undefined') {
    //TODO: check valid yelp id
    //TODO: check id doesn't already exist
    return newSpot.yelp_id;
  }
  else {
    var id = newSpot.name.toLowerCase() + '-' + newSpot.location.city.toLowerCase();
    id = id.replace(/ /g,"-"); // swap dash for space;
    id = encodeURIComponent(id);
    //TODO: check id doesn't already exist,
    // add 2, 3, ... to end if exists
    return id;
  }
}

/**
 * @name _initCrowdSeer
 * @function
 *
 * @description Constructs an initial crowdseer object for a spot. All times are set to closed.
 *              The business hours are then check, and those times are marked as open, with
 *              0 count and 0 score.  All hours are then checked to determine open blocks.
 * @param {object} newSpot The spot to construct the crowdseer for.
 * @returns {object} A crowdseer object.
 */ 
function _initCrowdSeer(newSpot) {
  var crowdfactor = {},
      WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      BLOCK_HOURS = {'morning': ['5am', '6am', '7am', '8am', '9am', '10am'],
                     'afternoon': ['11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
                     'evening': ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
                     'latenight': ['11pm', '12am', '1am', '2am', '3am', '4am']
                    };
  crowdfactor.watch_count = 0;
  crowdfactor.most_recent = {'time': 0, 'score': 0};
  crowdfactor.blocks = {};
  crowdfactor.day = {};
  
  // Construct crowdfactor with all closed
  WEEKDAYS.forEach(function(day) {
    crowdfactor.day[day] = {};
    for (var i = 1; i <= 12; i++) {
      var closed_am = {'count': -1, 'score': -1},
          closed_pm = {'count': -1, 'score': -1};
      crowdfactor.day[day][i + 'am'] = closed_am;
      crowdfactor.day[day][i + 'pm'] = closed_pm;
    }
  });

  // Add open hours
  newSpot.business_hours.forEach(function(time) {
    var current = {'hour': time.open_hour.hour, 'meridiem': time.open_meridiem.label, 
                   'day': _dayToNum(time.open_day.label)},
        close = _roundCloseTime(time),
        i = 0;

    while (current.day !== close.day ||
           current.hour !== close.hour ||
           current.meridiem !== close.meridiem) {
      // Mark current time as open
      crowdfactor.day[WEEKDAYS[current.day]][current.hour + current.meridiem].count = 0;
      crowdfactor.day[WEEKDAYS[current.day]][current.hour + current.meridiem].score = 0;

      // Increment time
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
  });

  // Determine blocks
  for (var block in BLOCK_HOURS) {
    crowdfactor.blocks[block] = false; // Assume block is empty
    checkLoop:
    for (var i = 0; i < WEEKDAYS.length; i++) {
      var day = WEEKDAYS[i];
      for (var j = 0; j < BLOCK_HOURS[block].length; j++) {
        var hour = BLOCK_HOURS[block][j];
        if (crowdfactor.day[day][hour].count !== -1) {
          crowdfactor.blocks[block] = true;
          break checkLoop;
        }
      }
    }
  }

  return crowdfactor;
}

function _updateCrowdSeer(newSpot, oldData) {
  for (var day in oldData.crowdfactor.day) {
    for (var time in oldData.crowdfactor.day[day]) {
      // Use spots old data if it exists when not closed
      if (newSpot.crowdfactor.day[day][time].count !== -1 &&
          oldData.crowdfactor.day[day][time].count !== -1) {
          newSpot.crowdfactor.day[day][time] = oldData.crowdfactor.day[day][time];
      }
    }
  }
  return newSpot.crowdfactor;
}

/**
 * @name _roundCloseTime
 * @function
 *
 * @description If any open period during an hour is open, the whole hour in crowdseer
 *              should appear as open.  For open times the initial hour is include, but 
 *              for close times the hour needs to be rounded up.  Rounding into a new
 *              meridiem or day must be taken into acount. This function performs this 
 *              rounding.
 * @param {object} time The time object to check for round. Props: hour, minutes, day, meridiem.
 * @returns {object} A close times object with day, hour, and meridiem.
 */ 
function _roundCloseTime(time) {
  var close = {},
      hour = time.close_hour.hour,
      minutes = time.close_hour.minutes,
      day = _dayToNum(time.close_day.label),
      meridiem = time.close_meridiem.label;

  if (minutes === 30) {
    hour = hour + 1;
    if (hour === 12) {
      if (meridiem === 'pm') {
        day = day + 1;
        if (day === 7) {day = 0;}
        meridiem = 'am';
      }
      else {
        meridiem = 'pm';
      }
    }
    else if (hour === 13) {hour = 1;}
  }

  close.day = day;
  close.hour = hour;
  close.meridiem = meridiem;

  return close;
};

/**
 * @name _dayToNum
 * @function
 *
 * @description Converts a day of the week (i.e. sunday) to a number.
 *              Capitalization doesn't matter.
 * @param {string} dayOfWeek The english day of week.
 * @return {int} A number representing the day of week. Sunday = 0...
 */  
function _dayToNum(dayOfWeek) {
  var dayNum = -1;
  switch(dayOfWeek.toLowerCase()) {
    case 'sunday':    dayNum = 0; break;
    case 'monday':    dayNum = 1; break;
    case 'tuesday':   dayNum = 2; break;
    case 'wednesday': dayNum = 3; break;
    case 'thursday':  dayNum = 4; break;
    case 'friday':    dayNum = 5; break;
    case 'saturday':    dayNum = 6; break;
  }
  return dayNum;
}

/**
 * @name _dayToNum
 * @closure
 *
 * @description Stores a cache recently accessed spots so a call to the datastore
 *              is unecessary.  Also helps prevent a Angular $digest bug which occurs
 *              when trying to reload a spot that has already been retrieved.  
 *              Capitalization doesn't matter.
 * @param {int} cacheSize The number of spots to store in the cache.
 * @return {object} The cache object with functions check, add, all, and get.
 */ 
function spotCache(cacheSize) {
  var cache = [];

  return {

    /**
     * @name check
     * @function
     *
     * @description Checks if a spot is in the cache.
     * @param {int} id The id of the spot to check for.
     * @return {boolean} True if a cache hit.
     */ 
    check: function(id) {
      var hit = false;
      cache.forEach(function(spot) {
        if((spot !== null) && (typeof spot.id !== 'undefined') && (spot.id === id)) {hit = true;}
      });
      return hit;
    },

    /**
     * @name add
     * @function
     *
     * @description Adds a spot to the cache.  If there are more spots in
     *              the cache than cacheSize, the least recent spot is removed.
     * @param {object} spot The spot to add to the cache.
     */ 
    add: function(spot) {
      if (cache.length >= cacheSize) {cache.shift();}
      cache.push(spot);
    },

    /**
     * @name get
     * @function
     *
     * @description Retrieve a spot from the cach.
     * @param {int} id The id of the spot to retrieve.
     * @return {object} The spot from the cache.
     */ 
    get: function(id) {
      var returnSpot = null
      cache.forEach(function(spot) {
        if(typeof (spot.id !== 'undefined') && (spot.id === id)) {returnSpot = spot;}
      });
      return returnSpot;
    },

    /**
     * @name all
     * @function
     *
     * @description Return the whole cache for troubleshooting.
     * @return {array} All of the cache.
     */ 
    all: function() {
      return cache;
    }
  }

}
