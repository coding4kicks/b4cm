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
  .factory('spot', function ($q, $timeout, $rootScope, geolocation, listings, util) {

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
      addWatch: function (newWatch, spotId) {
        console.log(spotId, newWatch);
        var crowdfactorRef = new Firebase(fbUrl + 'spots/' + spotId + '/crowdfactor/day/'),
            mostRecentRef = new Firebase(fbUrl + 'spots/' + spotId + '/crowdfactor/'),
            score = _statusToScore(newWatch.cf_status);

        newWatch.time.forEach(function(time) {
          crowdfactorRef.child(time.day).child(time.hour).child('count').set(time.count + 1);
          crowdfactorRef.child(time.day).child(time.hour).child('score').set(time.score + score);
          mostRecentRef.child('most_recent').child('score').set(score);
          mostRecentRef.child('most_recent').child('time').set((new Date()).getTime());
        });
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
                           'city': newSpot.location.city,
                           'postal_code': newSpot.location.postal_code, 
                           'state_code': newSpot.location.state_code },
            address = locationObj.address + ", " + locationObj.city + ", " + locationObj.state_code;

        newSpot.id = _constructId(newSpot);

        // Set Defaults - Must guard against undefined to protect from Firebase error.
        if (typeof newSpot.yelp_id === 'undefined') {newSpot.yelp_id = null};
        if (typeof newSpot.image_url === 'undefined') {newSpot.image_url = null};
        if (typeof newSpot.wifi === 'undefined') {newSpot.wifi = false};
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

          deferred.resolve(newSpot.id);

        }, function(reason) {
          conosle.log('failed for ' + reason);
          deferred.resolve('error');
        });

        return deferred.promise;
      },

      /**
       * @name edit
       * @funtion
       *
       * @description Edits a spot in the datastore. 
       * @param {string} id The id of the spot to edit.
       * @returns {object} The spot id if successful otherwise an error code.
       */  
      edit: function (id) {
        return false;
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
      }
    };
  });

function _statusToScore(cf_status) {
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
    case 'herd':
      return 5;
      break;
  }
}

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
        if(typeof (spot.id !== 'undefined') && (spot.id === id)) {hit = true;}
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
