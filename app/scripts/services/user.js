'use strict';

angular.module('b4cmApp')
  .factory('user', function ($rootScope, $q, $timeout) {

    var ref = new Firebase('https://crowd-data.firebaseIO.com'),
        usersUrl = 'https://crowd-data.firebaseIO.com/users/',
        userObj = null;

    var auth = new FirebaseSimpleLogin(ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        // retrieve user object from db
        var userUrl = usersUrl + user.provider + '/' + user.id,
            userRef = new Firebase(userUrl);
        userRef.on('value', function(data) {
          // Need to handle data.val() === null
          userObj = data.val();
          console.log(userObj);
          $rootScope.$broadcast('login', userObj.displayName);
        });
      } else {
        // user is logged out
      }
    });

    // Public API here
    return {
      signUp: function (email, password, name) {
        auth.createUser(email, password, function(error, user) {
          if (!error) {
            var newUser = _createUser(user, name),
                userUrl = usersUrl + user.provider + '/' + user.id,
                userRef = new Firebase(userUrl);
            console.log(newUser);
            console.log('User Id: ' + user.id + ', Email: ' + user.email);
            userRef.set(newUser);
            userObj = newUser;
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
        if (userObj) {return true;}
        else {return false;}
      },
      logOut: function () {
        userObj = null;
        auth.logout();
      },
      getId: function () {
        console.log(userObj);
        if (userObj) {return userObj.id}
        else {return null;}
      },
      getInfo: function () {
        // Need to delay for browser refresh
        var deferred = $q.defer();
        if (userObj) {deferred.resolve(userObj)}
        else {
          // TODO: find a better way.
          $timeout(function() {
            console.log('here');
            deferred.resolve(userObj);}, 2000);
        }
        return deferred.promise;
      }
    };
  });

function _createUser(user, name) {
  var newUser = {};
  newUser.id = user.id;
  newUser.displayName = user.displayName;
  newUser.email = user.email;
  newUser.provider = user.provider;
  newUser.joinDate = new Date();
  newUser.gravatar = '';
  newUser.reviews = [];
  newUser.watchCount = 0;
  newUser.watchLocations = [];
  if (typeof newUser.displayName === 'undefined') {
    newUser.displayName = name;
  }
  return newUser;
}
