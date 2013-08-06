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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
