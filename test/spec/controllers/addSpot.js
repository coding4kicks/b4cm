'use strict';

describe('Controller: AddSpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddSpotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddSpotCtrl = $controller('AddSpotCtrl', {
      $scope: scope
    });
  }));

  it('addHours correctly adds hours and incrments day', function () { 
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
    console.log(scope.business_hours);
  });
});
