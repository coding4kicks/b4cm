'use strict';

describe('Controller: AddWatchCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddWatchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddWatchCtrl = $controller('AddWatchCtrl', {
      $scope: scope
    });
  }));

  it('should receive a spotId', function () {
    //expect(scope.id).toBe(true);
  });
});
