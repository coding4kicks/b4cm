'use strict';

describe('Service: spot', function () {

  // load the service's module
  beforeEach(module('b4cmApp'));

  // instantiate service
  var spot;
  beforeEach(inject(function (_spot_) {
    spot = _spot_;
  }));

  it('addReview should return false', function () {
    expect(spot.create()).toBe(false);
  });

  it('addWatch should return false', function () {
    expect(spot.create()).toBe(false);
  });
  
  it('create should return false', function () {
    expect(spot.create()).toBe(false);
  });

  it('edit should return false', function () {
    expect(spot.create()).toBe(false);
  });

  it('get should return false', function () {
    expect(spot.create()).toBe(false);
  });

  it('remove should return false', function () {
    expect(spot.create()).toBe(false);
  });
  
});
