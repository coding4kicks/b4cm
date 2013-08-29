'use strict';

describe('Service: spot', function () {

  // load the service's module
  beforeEach(module('b4cmApp'));

  // instantiate service
  var spot,
       testSpot = {'name': 'Test Spot',
                    'yelp_id': 'test-spot-palo-alto2',
                    'image_url': "../images/spot-peets.jpg",
                    'wifi': true,
                    'type': {'food': 1, 'study': 1, 'social': 0},
                    'location': {
                      'address': '221 Byron St',
                      'city': 'Palo Alto',
                      'state_code': 'CA',
                      'postal_code': '94301',
                    }
                   };

  beforeEach(inject(function (_spot_) {
    spot = _spot_;
  }));

  it('addReview should return false', function () {
    expect(spot.addReview()).toBe(false);
  });

  it('addWatch should return false', function () {
    expect(spot.addWatch()).toBe(false);
  });
  
  it('addSpot should correctly add hours', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto2");
  }));

  it('addSpot should correctly set id to yelp_id', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto2");
  }));

  it('addSpot should correctly construct id', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    testSpot.yelp_id = undefined;
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto");
  }));

  it('edit should return false', function () {
    expect(spot.edit()).toBe(false);
  });

  it('get should return false', function () {
    expect(spot.get().id).toBe('fakeSpot1');
  });

  it('remove should return false', function () {
    expect(spot.remove()).toBe(false);
  });
  
});
