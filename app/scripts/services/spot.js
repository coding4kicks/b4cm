'use strict';

angular.module('b4cmApp')
  .factory('spot', function () {
    // Service logic
    // ...

    var fakeSpot = {
      'id': '123',
      'name': 'Philz Coffee',
      'yelp_id': 'philz-coffee-palo-alto2',
      'rating': 3.5,
      'wifi': true,
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
          'total': 732,
          'most_recent': {'time': 'June, 2nd, 2012, 5:32', 'score': 4},
          'blocks': {'morning':true, 'afternoon':true, 'evening':true, 'latenight':false},
          'days': { 
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
            }
          }
        }
      };

    // Public API here
    return {
      addReview: function () {
        return false;
      },
      addWatch: function () {
        return false;
      },
      create: function () {
        return false;
      },
      edit: function () {
        return false;
      },
      get: function () {
        return false;
      },
      remove: function () {
        return false;
      }
    };
  });
