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
