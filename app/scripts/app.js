'use strict';

angular.module('b4cmApp', ['google-maps', 'imageupload', 'ui.bootstrap.modal'])

  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/listings/:spotType/:searchLocation', {
        templateUrl: 'views/listings.html',
        controller: 'ListingsCtrl'
      })
      .when('/spot/:spotId', {
        templateUrl: 'views/spot.html',
        controller: 'SpotCtrl'
      })
      .when('/addSpot', {
        templateUrl: 'views/addSpot.html',
        controller: 'AddSpotCtrl'
      })
      .when('/editSpot/:spotId', {
        templateUrl: 'views/editSpot.html',
        controller: 'EditSpotCtrl'
      })
      .when('/addReview/:spotId', {
        templateUrl: 'views/addReview.html',
        controller: 'AddReviewCtrl'
      })
      .when('/addWatch/:spotId', {
        templateUrl: 'views/addWatch.html',
        controller: 'AddWatchCtrl'
      })
      .when('/addMultipleWatches/:spotId', {
        templateUrl: 'views/addMultipleWatches.html',
        controller: 'AddMultipleWatchesCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/privacy', {
        templateUrl: 'views/privacy.html',
        controller: 'PrivacyCtrl'
      })
      .when('/terms', {
        templateUrl: 'views/terms.html',
        controller: 'TermsCtrl'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html',
        controller: 'FaqCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/advertise', {
        templateUrl: 'views/advertise.html',
        controller: 'AdvertiseCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl'
      })
      .when('/welcome', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  })

  .run(function ($rootScope, $location, user, util) {

    // Spot types for search
    $rootScope.spotTypes = [
      {name:'Food'},
      {name:'Study'},
      {name:'Social'},
      {name:'All'}
    ];
    $rootScope.spotType = $rootScope.spotTypes[0];

    // Listen for login
    $rootScope.$on('login', function(event, name) {
      $rootScope.name = name;
      util.safeApply($rootScope);
    });

    // Logout
    $rootScope.logOut = function() {
      $rootScope.name = null;
      user.logOut();
    };

    /**
     * @name addWatch
     * @function
     *
     * @description Redirects to add-watch-page.
     */
    $rootScope.searchListings = function(spotType, searchLocation) {
      //default search - switch to context aware search based upon location or url
      if (typeof searchLocation === 'undefined') {searchLocation = 'Palo Alto, CA';}
      $location.path('/listings/' + spotType.toLowerCase() + '/' + encodeURIComponent(searchLocation));
      // http://www.yearofmoo.com/2012/10/ ... apply-digest-and-phase
      if(!$rootScope.$$phase) { $rootScope.$apply(); }
    };

  });
