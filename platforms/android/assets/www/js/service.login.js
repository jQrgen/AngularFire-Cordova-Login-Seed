
angular.module('myApp.service.login', ['firebase', 'myApp.service.firebase'])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', 'profileCreator', '$timeout', 'hasProfileChecker',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout, hasProfileChecker) {
         var auth = null;
         return {
            init: function() {
               return auth = $firebaseSimpleLogin(firebaseRef());
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
               assertAuth();
               auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true
               }).then(function(user) {
                  console.log(user);
                     if( callback ) {
                        //todo-bug https://github.com/firebase/angularFire/issues/199
                        $timeout(function() {
                           callback(null, user);
                        });
                     }
                  }, callback);
            },

            facebookLogin: function(callback){
               assertAuth();
               auth.$login('facebook', {
                  rememberMe: true,
                  scope: 'email'
               }).then(function(user){
                     if(callback){
                        $timeout(function(){
                           callback(null, user);
                        })
                     }
               })
            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            changePassword: function(opts) {
               assertAuth();
               var cb = opts.callback || function() {};
               if( !opts.oldpass || !opts.newpass ) {
                  $timeout(function(){ cb('Please enter a password'); });
               }
               else if( opts.newpass !== opts.confirm ) {
                  $timeout(function() { cb('Passwords do not match'); });
               }
               else {
                  auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() { cb && cb(null) }, cb);
               }
            },

            createAccount: function(email, pass, callback) { // lagrer brukeren integrert i firebase
               assertAuth();
               auth.$createUser(email, pass).then(function(user) {
                callback && callback(null, user) }, callback);
            },

            createProfile: profileCreator,

            hasProfile: hasProfileChecker
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])

   .factory('profileCreator', ['firebaseRef', '$timeout', function(firebaseRef, $timeout) { // lagrer i databasen
      return function(id, email, name, callback) {
         console.log(email);
         firebaseRef('users/'+id).set({email: email, first_name: name}, function(err) {
            //err && console.error(err);
            if( callback ) {
               $timeout(function() {
                  callback(err);
               })
            }
         });

         function ucfirst (str) {
            // credits: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
         }
      }
   }])

   .factory('hasProfileChecker', ['firebaseRef', function(firebaseRef){
      return function(id){
         firebaseRef('users').once('value', function (dataSnapshot){
            if(dataSnapshot.hasChild(id)){
               return true;
            }else{
               return false;
            }
         })
      }
   }]);