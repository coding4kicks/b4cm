'use strict';

describe('Controller: AddSpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddSpotCtrl,
      scope,
      window,
      _user,
      _spot;

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
  beforeEach(inject(function ($controller, $rootScope, $window, user, spot) {
    window = $window;
    _user = user;
    _spot = spot;
    scope = $rootScope.$new();
    AddSpotCtrl = $controller('AddSpotCtrl', {
      $scope: scope
    });
  }));

  it('addHours correctly adds hours and incrments the day', function () { 
    expect(scope.business_hours.length).toBe(0);
    var fake_hours = _setHours(scope, 'Friday', 8, 'am', 9, 'am');
    var oldOpen = scope.openDay,
        oldClose = scope.closeDay;
    scope.addHours();
    expect(scope.business_hours.length).toBe(1);
    expect(scope.business_hours[0]).toEqual(fake_hours);
    expect(scope.openDay.label).toBe('Saturday');
    expect(scope.closeDay.label).toBe('Saturday');
  });

  xit('addHours correctly adds hours past midnight with pm close', function () { 
    expect(scope.business_hours.length).toBe(0);
    scope.openDay = {'label': 'Friday'};
    scope.openHour = {'label': '8:00', 'hour': 8, 'minutes': 0}
    scope.openMeridiem = {'label': 'am'};
    scope.closeDay = {'label': 'Friday'};
    scope.closeHour = {'label': '9:00', 'hour': 9, 'minutes': 0}
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

  xit('addHours correctly adds hours past midnight with pm close', function () { 
    expect(scope.business_hours.length).toBe(0);
    scope.openDay = {'label': 'Friday'};
    scope.openHour = {'label': '8:00', 'hour': 8, 'minutes': 0}
    scope.openMeridiem = {'label': 'am'};
    scope.closeDay = {'label': 'Friday'};
    scope.closeHour = {'label': '9:00', 'hour': 9, 'minutes': 0}
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

  it('addSpot checks required form elements', function () {
    var alertText = 'Name, Address, City, Zip, State, Type, Hours are required fields.';
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    scope.addSpot();
    expect(window.alert).toHaveBeenCalledWith(alertText);
  });

  it('addSpot checks for user', function () {
    var userText = 'Must be signed in to add a spot';
    window.alert = jasmine.createSpy();
    _setValidScope(scope);
    expect(window.alert).not.toHaveBeenCalled();
    scope.addSpot();
    expect(window.alert).toHaveBeenCalledWith(userText);
  });

  it('addSpot creates spot if user logged in', inject(function($q) {
    // Doesn't validate call parameters since Date().getTime() changes.
    var deferred = $q.defer(),
        promise = deferred.promise;
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _user.getInfo = jasmine.createSpy('getInfo').andReturn(
      {'provider': 'password', 'id': 1, 'display_name': 'Test', 'gravatar': 'fakeurl'});  
    _spot.create = jasmine.createSpy('create').andReturn(promise);
    _setValidScope(scope);
    expect(_user.loggedIn).not.toHaveBeenCalled();
    expect(_user.getInfo).not.toHaveBeenCalled();
    expect(_spot.create).not.toHaveBeenCalled();
    scope.addSpot();
    expect(_user.loggedIn).toHaveBeenCalled();
    expect(_user.getInfo).toHaveBeenCalled();
    expect(_spot.create).toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
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

  function _setValidScope(scope) {
    var time = {
      'open_day': {'label': 'Friday'},
      'open_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'open_meridiem': {'label': 'am'},
      'close_day': {'label': 'Friday'},
      'close_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'close_meridiem': {'label': 'am'}};
    scope.spotName = 'TestSpot';
    scope.address = '221 Byron St';
    scope.city = 'Palo Alto';
    scope.postal_code = '94301';
    scope.state_code = 'CA';
    scope.food = undefined;
    scope.study = true;
    scope.social = true;
    scope.image2 = {'resized': {}};
    scope.image2.resized.dataURL = 'testPic';
    scope.wifi = true;
    scope.business_hours = [];
    scope.business_hours.push(time);
  };

});

