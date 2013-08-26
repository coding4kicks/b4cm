'use strict';

angular.module('b4cmApp')
  .controller('AddReviewCtrl', function ($scope, $routeParams, spot) {

    var author = {'id': '555', 'name': 'Jolly G.', 'pic': '../images/peeps1.jpg'},
        review = {};
        
  
    $scope.RATINGS = [{'label': 1}, {'label': 2}, {'label': 3}, {'label': 4}, {'label': 5}];
    $scope.rating = $scope.RATINGS[2];

    review.author = author;
    review.date = new Date();
    review.rating = $scope.rating;
    review.writeup = $scope.writeup;
    review.type = {'food': 0, 'study': 0, 'social': 0};

    /**
     * @name addReview
     * @function
     *
     * @description Adds a review to a spot
     */     
    $scope.addReview = function() {
      if ($scope.food) {review.type.food = 1};
      if ($scope.study) {review.type.study = 1};
      if ($scope.social) {review.type.social = 1};
      spot.addReview(review, $routeParams.spotId);
    };
  });
