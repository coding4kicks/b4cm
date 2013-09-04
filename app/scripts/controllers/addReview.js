'use strict';

angular.module('b4cmApp')
  .controller('AddReviewCtrl', function ($scope, $routeParams, spot, user) {

    var author = {},
        review = {};

    $scope.RATINGS = [{'label': 1}, {'label': 2}, {'label': 3}, {'label': 4}, {'label': 5}];
    $scope.rating = $scope.RATINGS[2];
  
    review.date = new Date();
    review.rating = $scope.rating;
    review.writeup = $scope.writeup;
    review.type = {'food': 0, 'study': 0, 'social': 0};

    user.getInfo().then(function(curUser) {
      console.log('hhhheeeer');
      console.log(curUser);
      if(curUser) {
        author.id = curUser.profile + '-' + curUser.id,
        author.name = curUser.displayName, 
        author.pic = curUser.gravatar
        review.author = author;
      }
      else {
        author = null;
      }

    });

    spot.get($routeParams.spotId).then(function(spot_data) {
      $scope.spot = spot_data;
      console.log($scope.spot);
      review.spotId = spot_data.id;
    });

    /**
     * @name addReview
     * @function
     *
     * @description Adds a review to a spot
     */     
    $scope.addReview = function() {

      // Make sure logged in
      if (user.loggedIn() && author){
        // Make sure review is filled in: type and writeup
        if ((typeof $scope.food !== 'undefined' || 
             typeof $scope.study !== 'undefined' || 
             typeof $scope.social !== 'undefined') &&
            typeof $scope.writeup !== 'undefined') {
          if ($scope.food) {review.type.food = 1};
          if ($scope.study) {review.type.study = 1};
          if ($scope.social) {review.type.social = 1};
          spot.addReview(review, $routeParams.spotId);
          // also add to user
        }
        else {
          alert("Must enter at least 1 type and a writeup.");
        }
      }
      else {
        alert("Must be logged in to add a review");
      }
    };
  });
