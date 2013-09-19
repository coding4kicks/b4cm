'use strict';

describe('Controller: AddSpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddSpotCtrl,
      scope,
      window;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window) {
    window = $window;
    scope = $rootScope.$new();
    AddSpotCtrl = $controller('AddSpotCtrl', {
      $scope: scope
    });
  }));

  it('addHours adds hours and incrments the day', function () { 
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
    window.alert = jasmine.createSpy();
    expect(window.alert).not.toHaveBeenCalled();
    scope.addSpot();
    expect(window.alert).toHaveBeenCalled();
  });


});
