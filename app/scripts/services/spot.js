'use strict';

angular.module('b4cmApp')
  .factory('spot', function () {
    // Service logic
    // ...

    //var spot = {};
    var meaningOfLife = 42;

    // Public API here
    return {


      someMethod: function () {
        return meaningOfLife;
      }
      
    };
  });
