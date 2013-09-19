'use strict';

/* global alert */

angular.module('b4cmApp')

  /**
   * @name Add Review Controller
   * @controller
   *
   * @description Allows a user to add a review.  The data is denormalized.  
   *              The review is saved both to its associated spot and to the user's data.
   */
  .controller('AddReviewCtrl', function ($scope, $routeParams, $location, spot, user, util) {

    var author = {},
        review = {},
        additionalInfo = {};

    $scope.RATINGS = [{'label': 1}, {'label': 2}, {'label': 3}, {'label': 4}, {'label': 5}];
    $scope.rating = $scope.RATINGS[2];
    review.type = {'food': 0, 'study': 0, 'social': 0};

    // Retreive the spot associated with this review.
    spot.get($routeParams.spotId).then(function(spotData) {
      $scope.spot = spotData;
      review.spotId = spotData.id;
      /* jshint camelcase: false */
      additionalInfo.review_count = spotData.review_count;
      additionalInfo.rating_count = spotData.rating_count;
      /* jshint camelcase: true */
      additionalInfo.type = spotData.type;
    });

    /**
     * @name addReview
     * @function
     *
     * @description Adds a review to a spot. Also save the review to the user's object
     */
    $scope.addReview = function() {

      if (user.loggedIn()){
        var curUser = user.getInfo();
        author.id = curUser.provider + '/' + curUser.id,
        /* jshint camelcase: false */
        author.name = curUser.display_name,
        /* jshint camelcase: true */
        author.pic = curUser.gravatar;
        review.author = author;
        review.date = new Date().getTime();
        review.rating = $scope.rating;
        review.writeup = $scope.writeup;

        // Make sure review is filled in: type and writeup
        if ((typeof $scope.food !== 'undefined' ||
             typeof $scope.study !== 'undefined' ||
             typeof $scope.social !== 'undefined') &&
            typeof $scope.writeup !== 'undefined') {
          if ($scope.food) {review.type.food = 1;}
          if ($scope.study) {review.type.study = 1;}
          if ($scope.social) {review.type.social = 1;}
          spot.addReview(review, $routeParams.spotId, additionalInfo);
          user.addReview(review, $routeParams.spotId);
          // Redirect back to spot
          $location.path('/spot/' + $routeParams.spotId);
          util.safeApply($scope);
        }
        else {alert('Must enter at least 1 type and a writeup.');}
      }
      else {
        alert('Must be logged in to add a review');
        $location.path('/signin');
        util.safeApply($scope);
      }
    };
  });
