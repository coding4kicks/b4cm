'use strict';

describe('Controller: SpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var SpotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpotCtrl = $controller('SpotCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
