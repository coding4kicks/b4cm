'use strict';

describe('Directive: scrollPosition', function () {
  beforeEach(module('b4cmApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<scroll-position></scroll-position>');
    element = $compile(element)($rootScope);
    //expect(element.text()).toBe('this is the scrollPosition directive');
  }));
});
