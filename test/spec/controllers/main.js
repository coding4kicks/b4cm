'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var MainCtrl,
    scope;


  beforeEach(inject(function($httpBackend) {
    $httpBackend.whenGET('myModalContent.html').respond({});
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('expect nothing', function () { 
  });
});
