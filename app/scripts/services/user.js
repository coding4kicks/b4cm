'use strict';

angular.module('b4cmApp')

  /**
   * @name User Service
   * @service
   *
   * @description Authenticates users credentials via firebase simple-login.
   *              Maintains users data in Firebase.
   * @data-location https://crowd-data.firebaseIO.com/users/
   * @data-key <user.profile>-<user.id>
   * @data-sample {JSON} 
   *    {'user':
   *        'id': {string} Profile dependent id,
   *        'email': {string} User's email,
   *        'provider': {string} Firebase provdier: password, fb, twit, gith, pers,
   *        'joinDate': {Date} User's datetime at join,
   *        'gravatar': {string} Url to picture location: gravatar, fb, twit.
   *        'reviews': {array} Users reviews,
   *        'watch_count': {int} Number of watches performed,
   *        'watchLocations': {array} Places user has performed a crowdwatch
   *    }
   */ 
  .factory('user', function ($rootScope, $q, $timeout, $location, util) {

    var fbUrl = util.getFbUrl(),
        ref = new Firebase(fbUrl),
        usersUrl = fbUrl + 'users/',
        userObj = null,
        redirectLocation = null;

    /**
     * Firebase Authentication
     * https://www.firebase.com/docs/security/simple-login-overview.html
     */ 
    var auth = new FirebaseSimpleLogin(ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        alert('Email and password combination invalid.');
        console.log('error: ', error);
      } else if (user) {
        // user authenticated with Firebase
        // retrieve user object from db
        console.log('user authenticated');
        var userUrl = usersUrl + user.provider + '/' + user.id,
            userRef = new Firebase(userUrl);
        userRef.on('value', function(data) {
          // Need to handle data.val() === null
          userObj = data.val();
          // Need broadcast to update user name in nav bar
          if (userObj) {$rootScope.$broadcast('login', userObj.display_name);}

          // redirect only from signup and signin
          if (redirectLocation) {
            console.log('redirecting');
            $location.path("/" + redirectLocation);
            util.safeApply($rootScope);
            redirectLocation = null;
          }

        });
      } else {
        // user is logged out
      }
    });

    //////////////////// 
    // PUBLIC API
    //////////////////// 
    return {

      /**
       * @name addReview
       * @funtion
       *
       * @description Adds a review for a spot by a user to the users data.
       *              The review contains author info, a writup, a rating, and a spot id
       * @param {object} newReview A review to be added to a spot.
       *                 Properties: author info, writeup, and rating
       * @param {int} spotId The spot to add the review to.                .
       * @returns {object} TODO: The user id if successful otherwise an error code.
       */ 
      addReview: function (newReview, spotId) {
        // TODO: only use user info from inside user service
        // TODO: add pathId to user that is provider/userId
        var userRef = new Firebase(fbUrl + 'users/' + newReview.author.id);
        userRef.child('reviews').push().set(newReview);
        return false
      },

      /**
       * @name incrementWatchCount
       * @funtion
       *
       * @description Adds 1 to the User's total watch count
       * @returns {object} TODO: The spot id if successful otherwise an error code.
       */ 
      incrementWatchCount: function () {
        var id = userObj.provider + '/' + userObj.id,
            userRef = new Firebase(fbUrl + 'users/' + id),
            newCount = userObj.watch_count + 1;
        userRef.child('watch_count').set(newCount);
        return false;
      },

      /**
       * @name incrementSpotCount
       * @funtion
       *
       * @description Adds 1 to the User's total spot count
       * @returns {object} TODO: The spot id if successful otherwise an error code.
       */ 
      incrementSpotCount: function () {
        var id = userObj.provider + '/' + userObj.id,
            userRef = new Firebase(fbUrl + 'users/' + id),
            newCount = 1
        if (typeof userObj.spot_count !== 'undefined') {
            newCount = userObj.spot_count + 1;
        }
        userRef.child('spot_count').set(newCount);
        return false;
      },      
      /**
       * @name signUp
       * @procedure
       *
       * @description Creates a user with Firebase auth.  
       *              Saves the users details into Firebase.
       *              These are two separate actions.  Firebase auth contains limited data.
       *              Additional attributes such as gravatar, reviews, etc. need to be 
       *              stored in an additional Firebase data structure.
       *              After creating the user, they are automatically logged on and
       *              redirected to a welcome page.  TODO: Currently there is no email
       *              verification - need external system.
       */ 
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
            redirectLocation = 'welcome';
            auth.login('password', {
              'email': email,
              'password': password,
              'rememberMe': true
            });

          }
          else {
            alert('Unable to create user - Please report: ', error);
            console.log(error);
          }
        });
      },

      /**
       * @name logIn
       * @procedure
       *
       * @description Given a provider method, logs the user in via Firebase auth.
       *              For the 'password' method, an email and password are required.
       *              TODO: implement other provider methods: fb, twit, gith, pers.
       */ 
      logIn: function (provider, email, password) {
        console.log('here');
        console.log(provider);
        if (provider === 'email') {
          console.log('email provider');
          redirectLocation = 'welcome';
          auth.login('password', {
            'email': email,
            'password': password,
            'rememberMe': true
          });
        }
        else {console.log('provider ', provider);auth.login(provider);}
        
      },

      /**
       * @name loggedIn
       * @function
       *
       * @description Checks if a user is logged in. Performs this by checking if
       *              a user object exists.  This means the method must be used 
       *              synchronously upon user input since on browser refresh, Firebase
       *              takes a couple hundred miliseconds to verify and retieve user info.
       * @return {boolean} True if user is logged in.
       */ 
      loggedIn: function () {
        if (userObj) {return true;}
        else {return false;}
      },

      /**
       * @name logOut
       * @Procedure
       *
       * @description Sets the user object to null and logs the user out via Firebase auth.
       */ 
      logOut: function () {
        userObj = null;
        auth.logout();
      },

      /**
       * @name getInfo
       * @function
       *
       * @description Return the information for the currently logged in user.
       *              Can only be retrieved synchronously via user input since on
       *              browser refresh Firebase takes a couple hundred milliseconds
       *              to obtain the information.  To retrieve the info asynchrounously
       *              listen for (where needed) and emit the variable (in auth) on rootsScope. 
       */ 
      getInfo: function () {
        return userObj;
      },

      /**
       * @name addToFavs
       * @function
       *
       * @description Adds a spot id to the users favorites list.
       * @param {string} spotId The spot id to add to the favorites list. 
       */
      addToFavs: function (spotId) {
        // Make sure id is not already in favs so don't duplicate
        // IE8 incompatable use of indexOf for arrays]]
        if(typeof userObj.favorites !== 'undefined'){
          for(var favorite in userObj.favorites) {
            if (spotId === userObj.favorites[favorite]){
              alert('Already a Fav'); 
              return false
            }
          }
        }
        var userId = userObj.provider + '/' + userObj.id,
            userRef = new Firebase(fbUrl + 'users/' + userId);
        userRef.child('favorites').push().set(spotId);
        alert('Fav Added'); 
        return true;
      }
    };
  });

/***************
 * HELPER FUNCS
 ***************/

/**
 * @name _createUser
 * @function
 *
 * @description Create a new user to enter into Firebase
 * @param {object} user User info returned from Firebase auth.
 * @param {string} name The display name for the user.
 */ 
function _createUser(user, name) {
  var newUser = {};
  newUser.id = user.id;
  newUser.display_name = user.displayName;
  newUser.email = user.email;
  newUser.provider = user.provider;
  newUser.join_date = new Date();
  newUser.gravatar = '';
  newUser.reviews = [];
  newUser.watch_count = 0;
  newUser.watch_locations = [];
  if (typeof newUser.display_name === 'undefined') {
    newUser.display_name = name;
  }
  return newUser;
}
