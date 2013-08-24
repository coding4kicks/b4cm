'use strict';

angular.module('b4cmApp', ["google-maps"])
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
      .when('/addReview', {
        templateUrl: 'views/addReview.html',
        controller: 'AddReviewCtrl'
      })
      .when('/addWatch', {
        templateUrl: 'views/addWatch.html',
        controller: 'AddWatchCtrl'
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
      .otherwise({
        redirectTo: '/'
      });
  });

/***************
 * HELPER FUNCS
 ***************/

/**
 * @name _calculateStars
 * @function
 *
 * @description Calculates an array of URLs to star pictures.
 *              URL is based upon the passed in rating.
 *              URL points to either full, half or empty star.
 * @param {float} rating Review's star rating.
 * @returns {array} Array of URLs to star pictures.
 */ 
function _calculateStars(rating) {
  var stars = [];
  for (var i = 1; i <= 5; i++) {
    if (i < rating) {stars.push("images/star-icon.png")}
    else if (0.25 < (i - rating) && (i - rating) < 0.75) {
      stars.push("images/star-icon-half.png")}
    else {stars.push("images/star-icon-empty.png")}
  }
  return stars;
}
