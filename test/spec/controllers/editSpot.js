'use strict';

describe('Controller: EditSpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var EditSpotCtrl,
      scope,
      window,
      _user,
      _spot,
      deferred;

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
    window = $window;
    _user = user;
    _spot = spot;
    deferred = $q.defer();
    _spot.get = jasmine.createSpy('get').andReturn(deferred.promise);
    scope = $rootScope.$new();
    EditSpotCtrl = $controller('EditSpotCtrl', {
      $scope: scope
    });
  }));

  it('addHours adds hours and incrments the day', function () {
    scope.business_hours = [];
    expect(scope.business_hours.length).toBe(0);
    scope.openDay = {'label': 'Friday'};
    scope.openHour = {'label': '8:00', 'hour': 8, 'minutes': 0}
    scope.openMeridiem = {'label': 'am'};
    scope.closeDay = {'label': 'Friday'};
    scope.closeHour = {'label': '8:00', 'hour': 8, 'minutes': 0}
    scope.closeMeridiem = {'label': 'am'};
    var oldOpen = scope.openDay,
        oldClose = scope.closeDay;
    scope.addHours();
    expect(scope.business_hours.length).toBe(1);
    expect(scope.business_hours[0].open_day).toBe(oldOpen);
    expect(scope.business_hours[0].open_hour).toBe(scope.openHour);
    expect(scope.business_hours[0].open_meridiem).toBe(scope.openMeridiem);
    expect(scope.business_hours[0].close_day).toBe(oldClose);
    expect(scope.business_hours[0].close_hour).toBe(scope.closeHour);
    expect(scope.business_hours[0].close_meridiem).toBe(scope.closeMeridiem);
    expect(scope.openDay.label).toBe('Saturday');
    expect(scope.closeDay.label).toBe('Saturday');
  });

  it('addHours correctly adds hours and incrments the day', function () {
    scope.business_hours = [];
    expect(scope.business_hours.length).toBe(0);
    var fake_hours = _setHours(scope, 'Friday', 8, 'am', 9, 'am');
    scope.addHours();
    expect(scope.business_hours.length).toBe(1);
    expect(scope.business_hours[0]).toEqual(fake_hours);
    expect(scope.openDay.label).toBe('Saturday');
    //expect(scope.closeDay.label).toBe('Saturday');
  });

  it('addHours correctly adds hours past midnight with pm open', function () {
    scope.business_hours = [];
    expect(scope.business_hours.length).toBe(0);
    var fake_hours = _setHours(scope, 'Friday', 8, 'pm', 2, 'am');
    fake_hours.close_day = {'label': 'Saturday'};
    scope.addHours();
    expect(scope.business_hours.length).toBe(1);
    expect(scope.business_hours[0]).toEqual(fake_hours);
    expect(scope.business_hours[0].close_day).toEqual(fake_hours.close_day);
  });

  it('addHours correctly adds hours past midnight with am open', function () {
    scope.business_hours = [];
    expect(scope.business_hours.length).toBe(0);
    var fake_hours = _setHours(scope, 'Friday', 8, 'am', 2, 'am');
    fake_hours.close_day = {'label': 'Saturday'};
    scope.addHours();
    expect(scope.business_hours.length).toBe(1);
    expect(scope.business_hours[0]).toEqual(fake_hours);
    expect(scope.business_hours[0].close_day).toEqual(fake_hours.close_day);
  });

  it('deleteHours removes a time', function () { 
    scope.business_hours = ['dummyData'];
    expect(scope.business_hours.length).toBe(1);
    scope.deleteHours();
    expect(scope.business_hours.length).toBe(0);
  });

  it('yelpIdHelp toggles', function () { 
    scope.yelpHelpShow = false;
    scope.yelpIdHelp();
    expect(scope.yelpHelpShow).toBe(true);
  });

  it('editSpot checks required form elements', function () {
    var alertText = 'Name, Address, City, Zip, State, Hours are required fields.';
    scope.business_hours = [];
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    scope.editSpot();
    expect(window.alert).toHaveBeenCalledWith(alertText);
  });

  it('editSpot checks for user', function () {
    var userText = 'Must be signed in to edit a spot';
    window.alert = jasmine.createSpy();
    deferred.resolve(_fakeSpot());
    scope.$apply();
    expect(window.alert).not.toHaveBeenCalled();
    scope.editSpot();
    expect(window.alert).toHaveBeenCalledWith(userText);
  });

  it('editSpot saves a spot', inject(function($q) {
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _user.getInfo = jasmine.createSpy('getInfo').andReturn(
      {'provider': 'password', 'id': 1, 'display_name': 'Test', 'gravatar': 'fakeurl'});
    _spot.edit = jasmine.createSpy('edit').andReturn(deferred.promise);
    deferred.resolve(_fakeSpot());
    scope.$apply();
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    expect(_spot.edit).not.toHaveBeenCalled();
    scope.editSpot();
    expect(window.alert).not.toHaveBeenCalled();
    expect(_spot.edit).toHaveBeenCalled();
  }));

  function _setHours(scope, day, openHr, openMm, closeHr, closeMm) {
    var fake_hours = {}
    fake_hours.open_day = {'label': day};
    fake_hours.open_hour = {'label': openHr + ':00', 'hour': openHr, 'minutes': 0};
    fake_hours.open_meridiem = {'label': openMm};
    fake_hours.close_day = {'label': day};
    fake_hours.close_hour = {'label': closeHr + ':00', 'hour': closeHr, 'minutes': 0};
    fake_hours.close_meridiem = {'label': closeMm};
    scope.openDay = fake_hours.open_day;
    scope.openHour = fake_hours.open_hour;
    scope.openMeridiem = fake_hours.open_meridiem;
    scope.closeDay = fake_hours.close_day;
    scope.closeHour = fake_hours.close_hour;
    scope.closeMeridiem = fake_hours.close_meridiem;
    return fake_hours;
  };

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



