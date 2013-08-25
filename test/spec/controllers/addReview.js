'use strict';

describe('Controller: AddReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('b4cmApp'));

  var AddReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddReviewCtrl = $controller('AddReviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {

  });
});
