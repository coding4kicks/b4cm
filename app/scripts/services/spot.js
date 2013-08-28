'use strict';

angular.module('b4cmApp')
  .factory('spot', function () {
    // Service logic
    // ...

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
        // Should return new spots id.
        newSpot.id = _constructId(newSpot);
        newSpot.review_count = 0;
        var locationObj = {'address': newSpot.address,
                           'city': newSpot.city,
                           'postal_code': newSpot.postal_code, 
                           'state_code': newSpot.state_code };
        locationObj = _getLatLong(locationObj);
        createdSpot = newSpot;
        return createdSpot.id;
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
 * @name _getLatLong
 * @function
 *
 * @description Calls a geolocation service to retrieve a lat and long for an address
 *              included in a location object.  The lat and long are then added to the
 *              location object. The location object is then returned.
 * @param {object} locationObj A location with address, city, state_code, and zip_code
 * @returns {object} The given location object with latitude and longitude parameters added.
 */ 
function _getLatLong(locationObj) {

  // Add test for existance so doesn't blow up unit tests
  if (typeof google !== "undefined") {  

    // call geolocation api
    var count = '(waiting for result)',
        mapResults = [],
        geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': '1600+Amphitheatre+Parkway,+Mountain+View,+CA'}, function(results, status) {
        console.log(results);
        console.log(status);
        console.log(results[0]);
        console.log(results[0].geometry);
        console.log(results[0].geometry.location);
        console.log(results[0].geometry.location.lat);
        console.log(results[0].geometry.location.lng());
       // if (status == google.maps.GeocoderStatus.OK) {
       //   $scope.count = results.length;
       //   $scope.mapResults = results;
       // } else {
       //   $scope.status = "Geocode was not successful: " + status;
       // }
      //$scope.$apply();
      });
  }
}
