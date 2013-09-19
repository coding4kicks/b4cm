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

  it('addWatch requires a status', function () {
    var alertText = 'Please choose a crowd status.';
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _user.getInfo = jasmine.createSpy('getInfo').andReturn(
      {'provider': 'password', 'id': 1, 'display_name': 'Test', 'gravatar': 'fakeurl'});
    expect(window.alert).not.toHaveBeenCalled();
    expect(_user.loggedIn).not.toHaveBeenCalled();
    expect(_user.getInfo).not.toHaveBeenCalled();
    scope.$digest();
    scope.addWatch();
    expect(window.alert).toHaveBeenCalledWith(alertText);
    expect(_user.loggedIn).toHaveBeenCalled();
    expect(_user.getInfo).toHaveBeenCalled();
  });

  function _setValidScope(scope) {
    scope.startDay.label = 'Friday'; 
    scope.startHour.label = '8';
    scope.startMeridiem.label = 'am'
    scope.stopDay.label = 'Friday';
    scope.stopHour.label = '10';
    scope.stopMeridiem.label = 'am';
  }

});


