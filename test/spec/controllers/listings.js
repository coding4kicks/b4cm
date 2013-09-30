'use strict';

describe('Controller: ListingsCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var ListingsCtrl,
      scope,
      window,
      _user,
      _spot,
      _listings,
      deferred,
      deferred2;

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
    $provide.provider('listings', function() {
      this.$get = function() {
        return {get: jasmine.createSpy('get').andReturn(false)};
       };      
    });
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window, $q, user, spot, listings) {
    window = $window;
    _user = user;
    _spot = spot;
    _listings = listings
    deferred = $q.defer();
    deferred2 = $q.defer();
    _spot.get = jasmine.createSpy('get').andReturn(deferred.promise);
    _listings.get = jasmine.createSpy('get').andReturn(deferred2.promise);
    scope = $rootScope.$new();
    ListingsCtrl = $controller('ListingsCtrl', {
      $scope: scope
    });
  }));

  it('editSpot checks for user', function () {
    var userText = 'Must be signed in to edit a spot';
    window.alert = jasmine.createSpy();
    deferred2.resolve(_fakeSpot());
    scope.$apply();
    expect(window.alert).not.toHaveBeenCalled();
    //scope.editSpot();
    expect(window.alert).toHaveBeenCalledWith('');
  });

  it('addHours correctly adds hours and incrments the day', function () {
  });

  it('expect nothing', function () {
  });

  function _fakeSpot() {
    var spotObj = {},
        time = {
      'open_day': {'label': 'Friday'},
      'open_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'open_meridiem': {'label': 'am'},
      'close_day': {'label': 'Friday'},
      'close_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'close_meridiem': {'label': 'am'}};
    spotObj.crowdfactor = {}
    spotObj.location = {};
    spotObj.name = 'Super Duper';
    spotObj.yelp_id = 'fake_id';
    spotObj.location.address = '333 Fake St';
    spotObj.location.city = 'Palo Alto';
    spotObj.location.postal_code = 94301;
    spotObj.location.state_code = 'CA';
    spotObj.wifi = true;
    spotObj.image_url = 'fake-url';
    spotObj.business_hours = [];
    spotObj.business_hours.push(time);
    spotObj.type = {'food': 1, 'social': 0, 'study': 1}
    return spotObj;
  }

});
