'use strict';

angular.module('b4cmApp')
  .factory('spot', function ($rootScope, $q, angularFire, geolocation) {
    // Service logic
    // ...

    $rootScope.spots = {};

    var url = "https://crowd-data.firebaseio.com/spots",
        promise = angularFire(url, $rootScope, 'spots', {});

    var createdSpot = {};

    var fakeSpot1 = {
      'id': 'fakeSpot1',
      'name': 'Philz Coffee',
      'yelp_id': 'philz-coffee-palo-alto2',
      'image_url': "../images/spot-philz.jpg",
      'rating': 4.5,
      'wifi': true,
      'review_count': 175,
      'type': {
        'food': 5,
        'study': 8,
        'social': 1
        },
      'location': {
        'address': '101 Forest Ave',
        'city': 'Palo Alto',
        'state_code': 'CA',
        'postal_code': '94301',
        'latitude': 37.441838,
        'longitude': -122.161675,
        'geohash': '9q9jh0hdd8kz'
        },
        'reviews': [
          {
            'author': {
              'id': '12345',
              'name': 'Steve S.',
              'pic': '../images/peeps1.jpg'
            },
            'date': 'Tuesday, June 11th, 2013',
            'rating': 4.0,
            'writeup': 'Tesora = King of Coffee',
            'type': {
              'food': 1,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1235',
              'name': 'Jack O.',
              'pic': '../images/peeps2.jpg'
            },
            'date': 'Tuesday, June 10th, 2013',
            'rating': 3.5,
            'writeup': 'The only coffee shop were ordering a black coffee is seen as a faux paus.',
            'type': {
              'food': 0,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1234',
              'name': 'Whiny B.',
              'pic': '../images/peeps3.jpg'
            },
            'date': 'Tuesday, Jul 10th, 2012',
            'rating': 3.5,
            'writeup': 'Worth the hyp. Mint leaves in my mint coffe make me happy. Afterwards I get a coffee headache.',
            'type': {
              'food': 1,
              'study': 0,
              'social': 0
            }
          }
        ],
        'crowdfactor': {
          'watch_count': 732,
          'most_recent': {'time': 1377150514232, 'score': 4},
          'blocks': {'morning':true, 'afternoon':true, 'evening':true, 'latenight':false},
          'day': { 
            'monday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'tuesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 20},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'wednesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 25},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'thursday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 0},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'friday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 10, 'score': 25},
              '2pm': {'count': 10, 'score': 40},
              '3pm': {'count': 10, 'score': 50},
              '4pm': {'count': 10, 'score': 40},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'saturday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 1},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 10, 'score': 40},
              '2pm': {'count': 10, 'score': 50},
              '3pm': {'count': 10, 'score': 39},
              '4pm': {'count': 10, 'score': 40},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'sunday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 3},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            }
          }
        }
      };

var fakeSpot2 = {
      'id': 'fakeSpot2',
      'name': "Pete's Coffee and Tea",
      'yelp_id': 'peets-coffee-and-tea-palo-alto-2',
      'image_url': "../images/spot-peets.jpg",
      'rating': 3.5,
      'wifi': true,
      'review_count': 75,
      'type': {
        'food': 3,
        'study': 10,
        'social': 0
        },
      'location': {
        'address': '428 University Ave',
        'city': 'Palo Alto',
        'state_code': 'CA',
        'postal_code': '94301',
        'latitude': 37.441838,
        'longitude': -122.160248,
        'geohash': '9q9jadfa0hdd8kz'
        },
        'reviews': [
          {
            'author': {
              'id': '12345',
              'name': 'Steve S.',
              'pic': '../images/peeps1.jpg'
            },
            'date': 'Tuesday, June 11th, 2013',
            'rating': 4.0,
            'writeup': 'Tesora = King of Coffee',
            'type': {
              'food': 1,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1235',
              'name': 'Jack O.',
              'pic': '../images/peeps2.jpg'
            },
            'date': 'Tuesday, June 10th, 2013',
            'rating': 3.5,
            'writeup': 'The only coffee shop were ordering a black coffee is seen as a faux paus.',
            'type': {
              'food': 0,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1234',
              'name': 'Whiny B.',
              'pic': '../images/peeps3.jpg'
            },
            'date': 'Tuesday, Jul 10th, 2012',
            'rating': 3.5,
            'writeup': 'Worth the hyp. Mint leaves in my mint coffe make me happy. Afterwards I get a coffee headache.',
            'type': {
              'food': 1,
              'study': 0,
              'social': 0
            }
          }
        ],
        'crowdfactor': {
          'watch_count': 732,
          'most_recent': {'time': 1377150514232, 'score': 4},
          'blocks': {'morning':true, 'afternoon':true, 'evening':true, 'latenight':false},
          'day': { 
            'monday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'tuesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 20},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'wednesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 25},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'thursday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 0},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'friday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 5},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 20},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'saturday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 1},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'sunday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 3},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            }
          }
        }
      };

var fakeSpot3 = {
      'id': 'fakeSpot3',
      'name': 'Coupa Cafe',
      'yelp_id': 'coupa-café-palo-alto-3',
      'image_url': "../images/spot-coupa.jpg",
      'rating': 4.0,
      'wifi': true,
      'review_count': 200,
      'type': {
        'food': 8,
        'study': 6,
        'social': 4
        },
      'location': {
        'address': '538 Ramona St',
        'city': 'Palo Alto',
        'state_code': 'CA',
        'postal_code': '94301',
        'latitude': 37.446252,
        'longitude': -122.160248,
        'geohash': '9q9jaza0hdd8kz'
        },
        'reviews': [
          {
            'author': {
              'id': '12345',
              'name': 'Steve S.',
              'pic': '../images/peeps1.jpg'
            },
            'date': 'Tuesday, June 11th, 2013',
            'rating': 4.0,
            'writeup': 'Tesora = King of Coffee',
            'type': {
              'food': 1,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1235',
              'name': 'Jack O.',
              'pic': '../images/peeps2.jpg'
            },
            'date': 'Tuesday, June 10th, 2013',
            'rating': 3.5,
            'writeup': 'The only coffee shop were ordering a black coffee is seen as a faux paus.',
            'type': {
              'food': 0,
              'study': 1,
              'social': 0
            }
          },
          {
            'author': {
              'id': '1234',
              'name': 'Whiny B.',
              'pic': '../images/peeps3.jpg'
            },
            'date': 'Tuesday, Jul 10th, 2012',
            'rating': 3.5,
            'writeup': 'Worth the hyp. Mint leaves in my mint coffe make me happy. Afterwards I get a coffee headache.',
            'type': {
              'food': 1,
              'study': 0,
              'social': 0
            }
          }
        ],
        'crowdfactor': {
          'watch_count': 732,
          'most_recent': {'time': 1377150514232, 'score': 4},
          'blocks': {'morning':true, 'afternoon':true, 'evening':true, 'latenight':false},
          'day': { 
            'monday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'tuesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 20},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'wednesday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 25},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'thursday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 0},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'friday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 25},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'saturday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 1},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 5},
              '2pm': {'count': 5, 'score': 15},
              '3pm': {'count': 5, 'score': 25},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 20},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            },
            'sunday': {
              '12am': {'count': -1, 'score': -1},
              '1am': {'count': -1, 'score': -1},
              '2am': {'count': -1, 'score': -1},
              '3am': {'count': -1, 'score': -1},
              '4am': {'count': -1, 'score': -1},
              '5am': {'count': -1, 'score': -1},
              '6am': {'count': 5, 'score': 10},
              '7am': {'count': 5, 'score': 18},
              '8am': {'count': 5, 'score': 20},
              '9am': {'count': 5, 'score': 25},
              '10am': {'count': 5, 'score': 20},
              '11am': {'count': 5, 'score': 15},
              '12pm': {'count': 5, 'score': 20},
              '1pm': {'count': 5, 'score': 15},
              '2pm': {'count': 5, 'score': 10},
              '3pm': {'count': 5, 'score': 15},
              '4pm': {'count': 5, 'score': 25},
              '5pm': {'count': 5, 'score': 3},
              '6pm': {'count': 5, 'score': 20},
              '7pm': {'count': 5, 'score': 22},
              '8pm': {'count': 5, 'score': 12},
              '9pm': {'count': -1, 'score': -1},
              '10pm': {'count': -1, 'score': -1},
              '11pm': {'count': -1, 'score': -1},
            }
          }
        }
      };

    // Public API
    return {

      /**
       * @name addReview
       * @funtion
       *
       * @description Adds a review for to a spot.  Recieves a review object
       *              and a spot id.  The review contains author info, a writup,
       *              and a rating.  
       * @param {object} newReview A review to be added to a spot.
       *                 Properties: author info, writeup, and rating                 .
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      addReview: function (newReview, id) {
        return false;
      },

      /**
       * @name addWatch
       * @funtion
       *
       * @description Adds crowd watch details for to a spot.  Recieves a watch object
       *              and a spot id.  The watch object contains contains start and stop
       *              times and a rating.  This is converted in to an array of hours that
       *              is used as input to a crowdseer object.
       * @param {object} newWatch Describes a crowd watch to be entered into a spot.
       *                 Properties: start and stop times of watch event, a rating.
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      addWatch: function (newWatch, id) {
        //console.log(spotId, newWatch);
        return false;
      },

      /**
       * @name create
       * @funtion
       *
       * @description Creates and enters a spot from the datastore. The newSpot
       *              parameter is a partially constructed spot.  Additional details
       *              added here, such as the lat and long, the id, and defaults.
       * @param {object} newSpot The spot to be entered into datastore.
       * @returns {object} The spot id if successful otherwise an error code.
       */ 
      create: function (newSpot) {
        
        var deferred = $q.defer(),
            locationObj = {'address': newSpot.address,
                           'city': newSpot.city,
                           'postal_code': newSpot.postal_code, 
                           'state_code': newSpot.state_code };
        newSpot.id = _constructId(newSpot);
        newSpot.review_count = 0;
        newSpot.reviews = [];
        newSpot.crowdfactor = _initCrowdSeer(newSpot);
        geolocation.getLatLong(locationObj).then(function(locationObject) {
          
          // Construct Geohash 


          $rootScope.spots[newSpot.id] = newSpot;

          deferred.resolve(createdSpot.id);

        }, function(reason) {
          conosle.log('failed for ' + reason);
          deferred.resolve('error');
        });

        return deferred.promise;
      },

      /**
       * @name edit
       * @funtion
       *
       * @description Edits a spot in the datastore. 
       * @param {string} id The id of the spot to edit.
       * @returns {object} The spot id if successful otherwise an error code.
       */  
      edit: function (id) {
        return false;
      },

      /**
       * @name get
       * @funtion
       *
       * @description Retrieves a spot from the datastore. 
       * @param {string} id The id of the spot to get from the datastore.
       * @returns {object} The spot if successful otherwise an error code.
       */       
      get: function (id) {
        // TODO: need code to deal with invalid IDs.
        if (id === 'fakeSpot1') {return fakeSpot1;}
        if (id === 'fakeSpot2') {return fakeSpot2;}
        if (id === 'fakeSpot3') {return fakeSpot3;}
        return fakeSpot1;
      },

      /**
       * @name remove
       * @funtion
       *
       * @description Removes a spot from the datastore. 
       * @param {string} id The spot id to remove from the datastore.
       * @returns {string} The spot id if successful otherwise an error code.
       */ 
      remove: function (id) {
        return false;
      }
    };
  });

/**
 * @name _constructId
 * @function
 *
 * @description Constructs the id for a spot object.  If a yelp_id is present, that is added
 *              as the id, otherwise an id is constructed with the name, location, and possible int. 
 * @param {object} newSpot A spot with name and city (possibly yelp_id) but no id.
 * @returns {object} A spot object with an id.
 */ 
function _constructId(newSpot) {
  if (typeof newSpot.yelp_id !== 'undefined') {
    //TODO: check valid yelp id
    //TODO: check id doesn't already exist
    return newSpot.yelp_id;
  }
  else {
    var id = newSpot.name.toLowerCase() + '-' + newSpot.location.city.toLowerCase();
    id = id.replace(/ /g,"-"); // swap dash for space;
    id = encodeURIComponent(id);
    //TODO: check id doesn't already exist,
    // add 2, 3, ... to end if exists
    return id;
  }
}

/**
 * @name _initCrowdSeer
 * @function
 *
 * @description Constructs an initial crowdseer object for a spot. All times are set to closed.
 *              The business hours are then check, and those times are marked as open, with
 *              0 count and 0 score.  All hours are then checked to determine open blocks.
 * @param {object} newSpot The spot to construct the crowdseer for.
 * @returns {object} A crowdseer object.
 */ 
function _initCrowdSeer(newSpot) {
  var crowdfactor = {},
      WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      BLOCK_HOURS = {'morning': ['5am', '6am', '7am', '8am', '9am', '10am'],
                     'afternoon': ['11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
                     'evening': ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm'],
                     'latenight': ['11pm', '12am', '1am', '2am', '3am', '4am']
                    };
  crowdfactor.watch_count = 0;
  crowdfactor.most_recent = {'time': 0, 'score': 0};
  crowdfactor.blocks = {};
  crowdfactor.day = {};
  
  // Construct crowdfactor with all closed
  WEEKDAYS.forEach(function(day) {
    crowdfactor[day] = {};
    for (var i = 1; i <= 12; i++) {
      var closed_am = {'count': -1, 'score': -1},
          closed_pm = {'count': -1, 'score': -1};
      crowdfactor[day][i + 'am'] = closed_am;
      crowdfactor[day][i + 'pm'] = closed_pm;
    }
  });

  // Add open hours
  newSpot.business_hours.forEach(function(time) {
    var current = {'hour': time.open_hour.hour, 'meridiem': time.open_meridiem.label, 
                   'day': _dayToNum(time.open_day.label)},
        close = _roundCloseTime(time),
        i = 0;

    while (current.day !== close.day ||
           current.hour !== close.hour ||
           current.meridiem !== close.meridiem) {
      // Mark current time as open
      crowdfactor[WEEKDAYS[current.day]][current.hour + current.meridiem].count = 0;
      crowdfactor[WEEKDAYS[current.day]][current.hour + current.meridiem].score = 0;

      // Increment time
      current.hour = current.hour + 1;
      if (current.hour === 12) {
        if (current.meridiem === 'pm') {
          current.day = current.day + 1;
          if (current.day === 7) {current.day = 0;}
          current.meridiem = 'am';
        }
        else {
          current.meridiem = 'pm';
        }
      }
      else if (current.hour === 13) {current.hour = 1;}
    }
  });

  // Determine blocks
  for (var block in BLOCK_HOURS) {
    crowdfactor.blocks[block] = false; // Assume block is empty
    checkLoop:
    for (var i = 0; i < WEEKDAYS.length; i++) {
      var day = WEEKDAYS[i];
      for (var j = 0; j < BLOCK_HOURS[block].length; j++) {
        var hour = BLOCK_HOURS[block][j];
        if (crowdfactor[day][hour].count !== -1) {
          crowdfactor.blocks[block] = true;
          break checkLoop;
        }
      }
    }
  }

  return crowdfactor;
}

/**
 * @name _roundCloseTime
 * @function
 *
 * @description If any open period during an hour is open, the whole hour in crowdseer
 *              should appear as open.  For open times the initial hour is include, but 
 *              for close times the hour needs to be rounded up.  Rounding into a new
 *              meridiem or day must be taken into acount. This function performs this 
 *              rounding.
 * @param {object} time The time object to check for round. Props: hour, minutes, day, meridiem.
 * @returns {object} A close times object with day, hour, and meridiem.
 */ 
function _roundCloseTime(time) {
  var close = {},
      hour = time.close_hour.hour,
      minutes = time.close_hour.minutes,
      day = _dayToNum(time.close_day.label),
      meridiem = time.close_meridiem.label;

  if (minutes === 30) {
    hour = hour + 1;
    if (hour === 12) {
      if (meridiem === 'pm') {
        day = day + 1;
        if (day === 7) {day = 0;}
        meridiem = 'am';
      }
      else {
        meridiem = 'pm';
      }
    }
    else if (hour === 13) {hour = 1;}
  }

  close.day = day;
  close.hour = hour;
  close.meridiem = meridiem;

  return close;
};

/**
 * @name _dayToNum
 * @function
 *
 * @description Converts a day of the week (i.e. sunday) to a number.
 *              Capitalization doesn't matter.
 * @param {string} dayOfWeek The english day of week.
 * @return {int} A number representing the day of week. Sunday = 0...
 */  
function _dayToNum(dayOfWeek) {
  var dayNum = -1;
  switch(dayOfWeek.toLowerCase()) {
    case 'sunday':    dayNum = 0; break;
    case 'monday':    dayNum = 1; break;
    case 'tuesday':   dayNum = 2; break;
    case 'wednesday': dayNum = 3; break;
    case 'thursday':  dayNum = 4; break;
    case 'friday':    dayNum = 5; break;
    case 'saturday':    dayNum = 6; break;
  }
  return dayNum;
}

