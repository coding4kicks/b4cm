'use strict';

angular.module('b4cmApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/listings', {
        templateUrl: 'views/listings.html',
        controller: 'ListingsCtrl'
      })
      .when('/spot', {
        templateUrl: 'views/spot.html',
        controller: 'SpotCtrl'
      })
      .when('/addSpot', {
        templateUrl: 'views/addSpot.html',
        controller: 'AddSpotCtrl'
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
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/advertise', {
        templateUrl: 'views/advertise.html',
        controller: 'AdvertiseCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
