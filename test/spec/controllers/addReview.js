'use strict';

describe('Controller: AddReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddReviewCtrl,
      scope,
      window,
      _user,
      _spot,
      promise;

  // Instantiate user and spot services
  beforeEach(module(function($provide) {
    $provide.provider('user', function() {
      this.$get = function() {
        return {loggedIn: jasmine.createSpy('loggedIn').andReturn(false)};
       };      
    });
    $provide.provider('spot', function() {
      this.$get = function() {
        return {};
       };      
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window, $q, user, spot) {
    scope = $rootScope.$new();
    window = $window;
    _user = user;
    _spot = spot;
    promise = $q.defer().promise;
    _spot.get = jasmine.createSpy('get').andReturn(promise);
    AddReviewCtrl = $controller('AddReviewCtrl', {
      $scope: scope
    });
  }));

  it('addReview requires login', function () {
    var userText = 'Must be logged in to add a review';
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    scope.addReview();
    expect(window.alert).toHaveBeenCalledWith(userText);
  });
});
