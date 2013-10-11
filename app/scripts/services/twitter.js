'use strict';
// TODO: implement Oauth for login and for tweeting pics
//       and for smoother UI (no redirect)

angular.module('b4cmApp')
  .factory('twitter', function ( ) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
