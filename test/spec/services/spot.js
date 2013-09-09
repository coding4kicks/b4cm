'use strict';

describe('Service: spot', function () {

  // load the service's module
  beforeEach(module('b4cmApp'));

  // instantiate service
  var spot,
       testSpot = { 'name': 'Test Spot',
                    'yelp_id': 'test-spot-palo-alto2',
                    'image_url': "../images/spot-peets.jpg",
                    'wifi': true,
                    'type': {'food': 1, 'study': 1, 'social': 0},
                    'location': {
                      'address': '221 Byron St',
                      'city': 'Palo Alto',
                      'state_code': 'CA',
                      'postal_code': '94301',
                    },
                    'business_hours': [
                      // Normal days
                      {'open_day': {'label': 'Monday'}, 'open_meridiem': {'label': 'am'},
                       'open_hour': {'label': '7:00', 'hour': 7, 'minutes': 0},
                       'close_day': {'label': 'monday'}, 'close_meridiem': {'label': 'pm'},
                       'close_hour': {'label': '7:00', 'hour': 7, 'minutes': 0}
                      },
                      // Closed in the middle of a day
                      {'open_day': {'label': 'Tuesday'}, 'open_meridiem': {'label': 'am'},
                       'open_hour': {'label': '7:00', 'hour': 7, 'minutes': 0},
                       'close_day': {'label': 'Tuesday'}, 'close_meridiem': {'label': 'am'},
                       'close_hour': {'label': '11:00', 'hour': 11, 'minutes': 0}
                      },
                      {'open_day': {'label': 'Tuesday'}, 'open_meridiem': {'label': 'pm'},
                       'open_hour': {'label': '1:00', 'hour': 1, 'minutes': 0},
                       'close_day': {'label': 'Tuesday'}, 'close_meridiem': {'label': 'pm'},
                       'close_hour': {'label': '7:00', 'hour': 7, 'minutes': 0}
                      },
                      // Half hour start and finish
                      {'open_day': {'label': 'Wednesday'}, 'open_meridiem': {'label': 'am'},
                       'open_hour': {'label': '7:30', 'hour': 7, 'minutes': 30},
                       'close_day': {'label': 'Wednesday'}, 'close_meridiem': {'label': 'pm'},
                       'close_hour': {'label': '7:30', 'hour': 7, 'minutes': 30}
                      },
                      // Half hours at the twelves
                      {'open_day': {'label': 'Thursday'}, 'open_meridiem': {'label': 'am'},
                       'open_hour': {'label': '12:30', 'hour': 12, 'minutes': 30},
                       'close_day': {'label': 'Thursday'}, 'close_meridiem': {'label': 'am'},
                       'close_hour': {'label': '11:30', 'hour': 11, 'minutes': 30}
                      },
                      {'open_day': {'label': 'Thursday'}, 'open_meridiem': {'label': 'pm'},
                       'open_hour': {'label': '1:30', 'hour': 1, 'minutes': 30},
                       'close_day': {'label': 'Thursday'}, 'close_meridiem': {'label': 'pm'},
                       'close_hour': {'label': '11:30', 'hour': 11, 'minutes': 30}
                      },
                      // Overnight
                      {'open_day': {'label': 'Friday'}, 'open_meridiem': {'label': 'pm'},
                       'open_hour': {'label': '8:00', 'hour': 8, 'minutes': 0},
                       'close_day': {'label': 'Saturday'}, 'close_meridiem': {'label': 'am'},
                       'close_hour': {'label': '8:00', 'hour': 8, 'minutes': 0}
                      }
                    ]
                   };

  beforeEach(inject(function (_spot_) {
    spot = _spot_;
  }));

  it('addReview should return false', function () {
    expect(spot.addReview({'author': {'id': 'passord/1'}, 'rating': {'label': 3}, type: {'food': 1, 'social': 0, 'study': 1}}, '1234', {'review_count': 3, 'rating_count': 9, 'type': {'food': 1, 'social': 1, 'study': 2}})).toBe(false);
  });

  it('addWatch should return false', function () {
    expect(spot.addWatch({'cf_status': 'herd', 'time': [{'day':'wednesday', 'hour':'8pm', 'count': 5, 'score': 21}], comment: 'This place rocks!', user: '1234'}, 123, 2)).toBe(false);
  });
  
  it('create should correctly add hours', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto2");
  }));

  it('empty blocks set to false', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    testSpot.business_hours = [];
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto2");
  }));

  it('create should correctly set id to yelp_id', inject(function ($rootScope) {
    var spotId = '',
        newSpot = {};
    spot.create(testSpot).then(function(value) {spotId = value});
    $rootScope.$apply();
    expect(spotId).toBe("test-spot-palo-alto2");
  }));

  it('create should correctly construct id if no yelp id', inject(function ($rootScope) {
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
    //expect(spot.get().id).toBe('fakeSpot1');
  });

  it('remove should return false', function () {
    expect(spot.remove()).toBe(false);
  });
  
});
