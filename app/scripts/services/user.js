'use strict';

angular.module('b4cmApp')
  .factory('user', function ($rootScope) {

    var ref = new Firebase('https://crowd-data.firebaseIO.com'),
        userObj = null;

    var auth = new FirebaseSimpleLogin(ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        userObj = user;
        if (user.provider === 'password' || user.provider === 'persona') {
          userObj.name = user.email;
        }
        else {
          userObj.name = user.id
        }
        console.log(userObj);
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
        $rootScope.$broadcast('login', userObj.name);
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
          else {
            console.log(error);
          }
        });
      },
      logIn: function (provider, email, password) {
        console.log('here');
        console.log(provider);
        if (provider === 'email') {
          console.log('email provider');
          auth.login('password', {
            'email': email,
            'password': password,
            'rememberMe': true
          });
        }
        else {console.log('provider ', provider);auth.login(provider);}
      },
      loggedIn: function () {
        if (user) {return true;}
        else {return false;}
      },
      logOut: function () {
        userObj = null;
        auth.logout();
      },
      getName: function () {
        console.log(userObj);
        if (userObj) {return userObj.id}
        else {return null;}
      }
    };
  });
