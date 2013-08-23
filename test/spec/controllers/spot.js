'use strict';

describe('Controller: SpotCtrl', function ($timeout) {

  // load the controller's module
  beforeEach(module('b4cmApp'));
  beforeEach(module('google-maps'));

  var SpotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpotCtrl = $controller('SpotCtrl', {
      $scope: scope
    });
  }));
  
  it('expect nothing', function ($timout) {
     //$timeout.flush()
  });

});
