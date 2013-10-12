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
    _spot.getStatus = jasmine.createSpy('getStaus').andReturn(_fakeStatus());;
    _listings.get = jasmine.createSpy('get').andReturn(deferred2.promise);
    scope = $rootScope.$new();
    ListingsCtrl = $controller('ListingsCtrl', {
      $scope: scope
    });
  }));

  it('listings.get retrieves and handles the data.', function () {
    deferred2.resolve(_fakeListing());
    expect(_spot.get).not.toHaveBeenCalled();
    scope.$apply();
    expect(_spot.get).toHaveBeenCalledWith(123);
  });

  it('listings.get retrieves the spots and their status', function () {
    deferred2.resolve(_fakeListing());
    deferred.resolve(_fakeSpot());
    expect(_spot.getStatus).not.toHaveBeenCalled();
    scope.$apply();
    expect(_spot.getStatus).toHaveBeenCalled();
  });

  it('spots are added to spot list', function () {
    deferred2.resolve(_fakeListing());
    deferred.resolve(_fakeSpot());
    expect(scope.spots.length).toBe(0);
    scope.$apply();
    expect(scope.spots.length).toBe(1);
  });

  it('spots are added to spot list up to 10', function () {
    var bigListing = _fakeListing();
    bigListing.idList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    deferred2.resolve(bigListing);
    deferred.resolve(_fakeSpot());
    expect(scope.spots.length).toBe(0);
    scope.$apply();
    expect(scope.spots.length).toBe(10);
  });

  it('more option is not diplayed when less than 10 spots', function () {
    deferred2.resolve(_fakeListing());
    deferred.resolve(_fakeSpot());
    scope.$apply();
    expect(scope.displayMore).toBe(undefined);
  });

  it('more option is diplayed when over 10 spots', function () {
    var bigListing = _fakeListing();
    bigListing.idList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    deferred2.resolve(bigListing);
    deferred.resolve(_fakeSpot());
    scope.$apply();
    expect(scope.displayMore).toBe(true);
  });

  it('spots are not added to any list if wrong type.', function () {
    var _fakeSpotWrongType = _fakeSpot();
    _fakeSpotWrongType.type.undefined = 0;
    deferred2.resolve(_fakeListing());
    deferred.resolve(_fakeSpotWrongType);
    expect(scope.spots.length).toBe(0);
    scope.$apply();
    expect(scope.spots.length).toBe(0);
  });

  function _fakeListing() {
    var listingsObj = {};
    listingsObj.id = 123;
    listingsObj.hash = 'RUCRAZY123';
    listingsObj.location = {};
    listingsObj.location.latitude = 73.223322;
    listingsObj.location.longitude = -123.123456;
    listingsObj.idList = [123];
    return listingsObj;
  }

  function _fakeSpot() {
    var spotObj = {},
        time = {
      'open_day': {'label': 'Friday'},
      'open_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'open_meridiem': {'label': 'am'},
      'close_day': {'label': 'Friday'},
      'close_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
      'close_meridiem': {'label': 'am'}};
    spotObj.crowdfactor = _fullCrowdGraph();
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
    spotObj.type = {'food': 1, 'social': 0, 'study': 1, 'undefined': 1}
    return spotObj;
  }

  function _fakeStatus() {
    var statusObj = {};
    return statusObj;
  }


  function _fullCrowdGraph() {
    var crowdgraph = {},
        WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        BLOCK_HOURS = {'morning': ['5am', '6am', '7am', '8am', '9am', '10am'],
                       'afternoon': ['11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
                       'evening': ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
                       'latenight': ['11pm', '12am', '1am', '2am', '3am', '4am']
                      };
    crowdgraph.watch_count = 0;
    crowdgraph.most_recent = {'time': 0, 'score': 0};
    crowdgraph.blocks = {};
    crowdgraph.day = {};
    
    // Construct crowdgraph with all closed
    WEEKDAYS.forEach(function(day) {
      crowdgraph.day[day] = {};
      for (var i = 1; i <= 12; i++) {
        var statusAm = {'count': 1, 'score': 3},
            statusPm = {'count': 1, 'score': 3};
        crowdgraph.day[day][i + 'am'] = statusAm;
        crowdgraph.day[day][i + 'pm'] = statusPm;
      }
    });

    return crowdgraph
  }

});
