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

  it('expect nothing', function () { 
  });
});
