'use strict';

describe('Controller: AddMultipleWatchesCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddMultipleWatchesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddMultipleWatchesCtrl = $controller('AddMultipleWatchesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
