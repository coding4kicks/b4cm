'use strict';

describe('Service: listings', function () {

  // load the service's module
  beforeEach(module('b4cmApp'));

  // instantiate service
  var listings;
  beforeEach(inject(function (_listings_) {
    listings = _listings_;
  }));

  it('create should return false', function () {
    var data = {'id': 'some-great-place'};
    expect(listings.add(32.323232, -122.222222, data)).toBe('9m9pfu22rz1v');
  });

  it('edit should return false', function () {
    expect(listings.edit()).toBe(false);
  });

  it('get should return false', function () {
    //expect(listings.get().spots.length).toBe(3);
  });

  it('remove should return false', function () {
    expect(listings.remove()).toBe(false);
  });

});
