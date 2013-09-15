'use strict';

describe('Controller: EditSpotCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var EditSpotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditSpotCtrl = $controller('EditSpotCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
