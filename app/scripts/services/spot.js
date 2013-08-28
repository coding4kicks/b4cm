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

      addReview: function (newReview, spotId) {
        return false;
      },

      addWatch: function (newWatch, spotId) {
        //console.log(spotId, newWatch);
        return false;
      },

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

      edit: function () {
        return false;
      },

      get: function (id) {
        // TODO: need code to deal with invalid IDs.
        if (id === 'fakeSpot1') {return fakeSpot1;}
        if (id === 'fakeSpot2') {return fakeSpot2;}
        if (id === 'fakeSpot3') {return fakeSpot3;}
        return fakeSpot1;
      },

      remove: function () {
        return false;
      }
    };
  });

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

function _getLatLong(locationObj) {
  // call geolocation api
}
