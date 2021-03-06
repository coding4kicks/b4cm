'use strict';

describe('Controller: AddMultipleWatchesCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddMultipleWatchesCtrl,
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
    AddMultipleWatchesCtrl = $controller('AddMultipleWatchesCtrl', {
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
    var alertText = 'Must select a crowd status.';
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    expect(window.alert).not.toHaveBeenCalled();
    scope.addWatch();
    expect(window.alert).toHaveBeenCalledWith(alertText);
  });

  it('addWatch should add a single watch', function () {
    var watchHours = [{ start: { day:'Saturday', hour: 9, meridiem: 'pm' },
                        stop: { day: 'Saturday', hour: 10, meridiem: 'pm' },
                        cf_status: 'Empty',
                        time: [{ day: 'saturday', hour: '9pm', count: 1, score: 3} ]}];
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _setWatchScope(scope, 'Saturday');
    expect(window.alert).not.toHaveBeenCalled();
    scope.addWatch();
    expect(scope.watchHours).toEqual(watchHours);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('addWatch should add a weekend', function () {
    var watchHours = [{ start: { day:'Weekends', hour: 9, meridiem: 'pm' },
                        stop: { day: 'Weekends', hour: 10, meridiem: 'pm' },
                        cf_status: 'Empty',
                      }];
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _setWatchScope(scope, 'Weekends');
    expect(window.alert).not.toHaveBeenCalled();
    scope.addWatch();
    expect(scope.watchHours).toEqual(watchHours);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('deleteHours should remove a watch', function() {
    scope.watchHours = [{ start: { day:'Saturday', hour: 9, meridiem: 'pm' },
                        stop: { day: 'Saturday', hour: 10, meridiem: 'pm' },
                        cf_status: 'Empty',
                        time: [{ day: 'saturday', hour: '9pm', count: 1, score: 3} ]}]
    _setWatchScope(scope, 'Saturday');
    scope.deleteHours(0);
    expect(scope.watchHours.length).toEqual(0);
  });

  it('submitWatches requires login', function () {
    var alertText = 'Must be logged in to add a watch';
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    expect(_user.loggedIn).not.toHaveBeenCalled();
    scope.submitWatches();
    expect(window.alert).toHaveBeenCalledWith(alertText);
    expect(_user.loggedIn).toHaveBeenCalled();
  });

  it('submitWatches checks for watches', function () {
    var alertText = "Must add a watch to save."
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _user.getInfo = jasmine.createSpy('getInfo').andReturn(
      {'provider': 'password', 'id': 1, 'display_name': 'Test', 'gravatar': 'fakeurl'});
    expect(window.alert).not.toHaveBeenCalled();
    scope.submitWatches();
    expect(window.alert).toHaveBeenCalledWith(alertText);
  });

  it('submitWatches saves watches for spot.', function () {
    window.alert = jasmine.createSpy();
    _user.loggedIn = jasmine.createSpy('loggedIn').andReturn(true);
    _user.getInfo = jasmine.createSpy('getInfo').andReturn(
      {'provider': 'password', 'id': 1, 'display_name': 'Test', 'gravatar': 'fakeurl'});
    _setWatchScope(scope, 'Saturday');
    _spot.addMultipleWatches =jasmine.createSpy('addMultipleWatches')
    scope.addWatch();
    expect(_spot.addMultipleWatches).not.toHaveBeenCalled();
    scope.submitWatches();
    expect(_spot.addMultipleWatches).toHaveBeenCalled();
  });

  function _setWatchScope(scope, day) {
    scope.startDay.label = day;
    scope.startHour.label = 9;
    scope.startMeridiem.label = 'pm';
    scope.stopDay.label = day;
    scope.stopHour.label = 10;
    scope.stopMeridiem.label = 'pm';
    scope.cf_status = 'Empty';
    scope.spot = {'crowdfactor': _fullCrowdGraph()};
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



