'use strict';

angular.module('b4cmApp')
  .factory('user', function () {

    var ref = new Firebase('https://crowd-data.firebaseIO.com'),
        user = {};

    var auth = new FirebaseSimpleLogin(ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        this.user = user;
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
      } else {
        // user is logged out
      }
    });

    // Public API here
    return {
      signUp: function (email, password) {
        auth.createUser(email, password, function(error, user) {
          if (!error) {
            console.log('User Id: ' + user.id + ', Email: ' + user.email);
          }
        });
        return meaningOfLife;
      },
      logIn: function (provider, email, password) {
        if (provider === email) {
          auth.login('password', {
            email: '<email@domain.com>',
            password: '<password>'
          });
        }
        else {auth.login(provider);}
      },
      loggedIn: function () {
        if (user) {return true;}
        else {return false;}
      },
      logOut: function () {
        user = null;
        auth.logout();
      }
    };
  });
