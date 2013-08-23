'use strict';

angular.module('b4cmApp')
  .factory('listings', function () {
    // Service logic
    // ...

    var fakeListings = [];

    // Public API here
    return {
      add: function () {
        return false;
      },
      edit: function () {
        return false;
      },
      get: function () {
        return fakeListings;
      },
      remove: function () {
        return false;
      }
    };
  });
