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
    scope.spotObj = {'crowdfactor': _emptyCrowdGraph()};
    expect(window.alert).not.toHaveBeenCalled();
    expect(_user.loggedIn).not.toHaveBeenCalled();
    expect(_user.getInfo).not.toHaveBeenCalled();
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

  function _emptyCrowdGraph() {
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
        var closed_am = {'count': -1, 'score': -1},
            closed_pm = {'count': -1, 'score': -1};
        crowdgraph.day[day][i + 'am'] = closed_am;
        crowdgraph.day[day][i + 'pm'] = closed_pm;
      }
    });

    return crowdgraph
  }


});


