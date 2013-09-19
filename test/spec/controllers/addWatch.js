'use strict';

describe('Controller: AddWatchCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddWatchCtrl,
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
    AddWatchCtrl = $controller('AddWatchCtrl', {
      $scope: scope
    });
  }));

  it('addWatch requires login', function () {
    var alertText = 'Must be logged in to add a watch';
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    expect(_user.loggedIn).not.toHaveBeenCalled();
    scope.addWatch();
    expect(window.alert).toHaveBeenCalledWith(alertText);
    expect(_user.loggedIn).toHaveBeenCalled();
  });

});
