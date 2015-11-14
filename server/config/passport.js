var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs')
var configAuth = require('./auth');


module.exports = function(passport, knex, Users) {

  // used to serialize the user for the session
  // adds user.id to all requests from now until logout
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  // Checks to see what your user ID is on each page
  // and makes sure that gets the entire row
  passport.deserializeUser(function(id, done) {
    Users.getUserById(id).then(function(user) { done(null, user[0])}); 
  });

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    process.nextTick(function() {

    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    Users.getUserByName(username).then( function(user) {
      
      // check to see if theres already a user with that username
      if (user.length) {
        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
      }
        // if there is no user with that username create the user
        var newUser            = new Object(); 

        // set the user's local credentials
        newUser.username = username;
        newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        Users.signupLocal(newUser.username, newUser.password).then(function(user) {
          newUser.id = user[0];
          return done(null, newUser);
        });
      
    })
    .catch(function(err) {
      return done(err);
    });    
      
    });
  }));

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with username and password from our form

    // find a user whose username is the same as the forms username
    // we are checking to see if the user trying to login already exists
    Users.getUserByName(username).then(
    function(user) {
      // if no user is found, return the message
      if (!user.length)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      // if the user is found but the password is wrong
      if (!bcrypt.compareSync(password, user[0].password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user[0]);
    })
    .catch(function(err) {
      return done(err);
    });
  }));

  // This is the facebook login stuff.
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID          : configAuth.facebookAuth.clientID,
    clientSecret      : configAuth.facebookAuth.clientSecret,
    callbackURL       : configAuth.facebookAuth.callbackURL,
    profileFields     : ["emails", "displayName", "name", "hometown", "location", "gender"],
    passReqToCallback : true
  },

  // facebook will send back the token and profile
  function(req, accessToken, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {

    //user is not logged in yet
    if (!req.user) {

      Users.getUserByFB(profile.id).then(
        function(user) {
        // if the user is found, then log them in
        if (user.length) {
          return done(null, user[0]); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new Object();

          // set all of the facebook information in our user model
          newUser.fb_id    = profile.id; // set the users facebook id                   
          newUser.fb_token = accessToken; // we will save the token that facebook provides to the user                    
          newUser.username = profile.displayName; // look at the passport user profile to see how names are returned

          // save our user to the database
          Users.signupFacebook(profile.displayName, profile.id, accessToken).then(function(userRow) {
            newUser.id = userRow[0];
            return done(null, newUser);
          });
        }
        })
        .catch(function(err) { return done(err); }); 
    //user is logged in and needs to be merged
    } else {
      // This is actually broken. There was supposed to be a
      // "connect to facebook" button on the dashboard for already
      // locally signed-up users.
      var user = req.user;

      user.fb_id = profile.id;
      user.fb_token = accessToken;

      Users.updateFacebook(profile.id, accessToken, user.id);
      }
    });
  })); 
}

