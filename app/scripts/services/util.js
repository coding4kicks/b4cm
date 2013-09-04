'use strict';

angular.module('b4cmApp')
  .factory('util', function () {

    var firebaseUrl = 'https://crowd-data.firebaseIO.com/';

    // Public API here
    return {
      getFbUrl: function () {
        return firebaseUrl;
      }
    };
  });
