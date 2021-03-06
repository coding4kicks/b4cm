'use strict';

/* global alert */

angular.module('b4cmApp')

  /**
   * @name Add Watch Controller
   * @controller
   *
   * @description Adds a Crowd Watch report to a Spot's crowdfactor.
   */
  .controller('AddWatchCtrl', function ($scope, $routeParams, $location, $window, spot, user, util) {

    var watch = {},
        currentDate = new Date(),
        futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000),
        currentDay = currentDate.getDay(),
        futureDay = futureDate.getDay(),
        currentHour = currentDate.getHours() % 12,
        futureHour = futureDate.getHours() % 12,
        currentMeridiem = (currentDate.getHours() < 12) ? '0' : '1',
        futureMeridiem = (futureDate.getHours() < 12) ? '0' : '1';

    $scope.doneInitializing = false;
    $scope.spotObj = {}; // Scope reference only used for testing.
    $scope.WEEKDAYS = [{'label': 'Sunday'}, {'label': 'Monday'}, {'label': 'Tuesday'},
                       {'label': 'Wednesday'}, {'label': 'Thursday'}, {'label': 'Friday'},
                       {'label': 'Saturday'}],
    $scope.HOURS = [{'label': '12'}, {'label': '1'}, {'label': '2'}, {'label': '3'},
                    {'label': '4'}, {'label': '5'}, {'label': '6'}, {'label': '7'},
                    {'label': '8'}, {'label': '9'}, {'label': '10'}, {'label': '11'}],
    $scope.MERIDIEMS = [{'label': 'am'}, {'label': 'pm'}];

    $scope.startDay = $scope.WEEKDAYS[currentDay];
    $scope.stopDay = $scope.WEEKDAYS[futureDay];
    $scope.startHour = $scope.HOURS[currentHour];
    $scope.stopHour = $scope.HOURS[futureHour];
    $scope.startMeridiem = $scope.MERIDIEMS[currentMeridiem];
    $scope.stopMeridiem = $scope.MERIDIEMS[futureMeridiem];

    // Retreive the spot associated with this review.
    spot.get($routeParams.spotId).then(function(spotData) {
      $scope.spotObj = spotData;
      $scope.name = spotData.name;
      $scope.address = spotData.location.address;
      $scope.city = spotData.location.city;
      $scope.doneInitializing = true;
    });

    /**
     * @name addWatch
     * @function
     *
     * @description Adds a crowd watch to a spot
     */
    $scope.addWatch = function() {
      if (user.loggedIn()){
        var start = {'day': util.dayToNum($scope.startDay.label),
                     'hour': parseInt($scope.startHour.label, 10),
                     'meridiem': $scope.startMeridiem.label},
            stop = {'day': util.dayToNum($scope.stopDay.label),
                    'hour': parseInt($scope.stopHour.label, 10),
                    'meridiem': $scope.stopMeridiem.label};
        /* jshint camelcase: false */
        watch.cf_status = $scope.cf_status;
        _checkStopDay(start, stop);
        watch.time = util.calculateWatchTimes(start, stop, $scope.spotObj);
        watch.comment = $scope.watchComment;
        watch.user = user.getInfo().display_name;
        if (typeof $scope.image2 === 'undefined') {
          $scope.image2 = {'resized': {'dateURL': null}};
        }
        watch.image_url = $scope.image2.resized.dataURL || null;

        if (typeof watch.cf_status === 'undefined') {alert('Please choose a crowd status.');}
        else if (watch.time.length > 24) {alert('Watches must be for less than a 24 hour period.');}
        else {
          spot.addWatch(watch, $routeParams.spotId, $scope.spotObj.crowdfactor.watch_count);
          user.incrementWatchCount();
          // TODO: *** CHECK SECURITY OF COMMENT (no XSS)
          if($scope.tweet) {
            //alert('Crowd watch added.');
            var urlParameters = [],
                totalString = '',
                twitterUrl = 'https://twitter.com/intent/tweet?',
                text = 'text=',
                tags = [ 'crowdstatus',
                         watch.cf_status,
                         $scope.spotObj.name.split(/[\s'&]+/).join(''),
                         $scope.spotObj.location.city.split(' ').join('')],
                tags2Add = [],
                hashtags = 'hashtags=',
                url = 'url=' + 'http%3A%2F%2Fwww.crowdabout.co%2Fspots%2F' + $scope.spotObj.id,
                via = 'via=aCrowdabout',
                related = 'related=aCrowdabout,sfstation,sfweekly',
                original_referer = 'original_referer=http://www.crowdabout.co/';
            if(typeof watch.comment !== 'undefined') {
              urlParameters.push(text += encodeURIComponent(watch.comment));
              totalString += watch.comment;
            }
            if((totalString + url.slice(4,url.length)).length < 140){
              urlParameters.push(url);
              totalString += url.slice(4, url.length);
            }
            if((totalString + via.slice(4,url.length)).length < 140){
              urlParameters.push(via);
              totalString += via.slice(4, url.length);
            }
            for(var i = 0; i < tags.length; i++){
              if((totalString + tags[i]).length < 140){
                tags2Add.push(tags[i]);
                totalString += tags[i];
              }
            }
            if (tags2Add.length > 0) {
              urlParameters.push(hashtags + tags2Add.join(','));
            }
            urlParameters.push(related);
            urlParameters.push(original_referer);
            twitterUrl += urlParameters.join('&');
            $window.open(twitterUrl);
          }
          else {alert('Crowd watch added.');}
          $location.path('/spot/' + $scope.spotObj.id);
          $location.replace();
          util.safeApply($scope);
        }
      }
      else {
        alert('Must be logged in to add a watch');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };
    /* jshint camelcase: true */

    /**
     * @name addMultiple
     * @function
     *
     * @description Redirects to add-multiple-watches-page.
     */
    $scope.addMultiple = function() {
      console.log('here');
      if (user.loggedIn()){
        $location.path('/addMultipleWatches/' + $scope.spotObj.id);
        $location.replace();
        util.safeApply($scope);
      }
      else {
        alert('Must be logged in to add watches.');
        $location.path('/signin/');
        util.safeApply($scope);
      }
    };

    /**
     * @name _checkStopDay
     * @function
     *
     * @description Deals with case of stop day after midnight
     * @param {object} start The start watch info (prop day is an int)
     * @param {object} stop The stop watch info (prop day is an int)
     * @return {string} The stop day, either current day, or 1 day in the future
     *                  if the stop time was after midnight.
     */
    function _checkStopDay(start, stop) {
      if (start.day === stop.day) {
        if ((start.meridiem === 'pm' && stop.meridiem === 'am') ||
            (start.meridiem === 'am' && stop.meridiem === 'am' && stop.hour <= start.hour)){
          stop.day = (stop.day + 1) % 7;
        }
      }
      //return day
    }

  });
