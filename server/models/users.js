/*------------------------------------
// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 


module.exports for users.js
  signupLocal: -- takes a username and a hashed password,
  returns a promise to insert that username and hashed password
  into the database. 

  signupFacebook -- using the passport framework, it takes
  a username, a facebook ID, and a facebook token and returns
  a promise to insert that username and facebook info into
  the database.  

  updateFacebook -- Takes a facebook ID, facebook Token, and userID (an int)
  if a user already exists, this is a way for  them to add their
  facebook profile to their user info. 
    Checks to see if user exists. If so, returns false; if not,
    takes username, hashedPass, facebookID, facebookToken and inserts them in the database. 
    If FacebookID is null, works with just username and hashpass. 
  
  addProfile -- takes a userID#, and profile text, updateing
  the profile to include the new profile text.  

  getUserByName -- a helper function that returns a user record
  if you only have the username. 

  getUserById -- a helper function that returns a user's record
  if you only have the id#

  getUserByFacebook -- a helper function that returns a user's record
  if you only have the facebookID. 


-------------------------------------*/


module.exports = function(knex) {

  return {
    signupLocal: function(username, hashedPass) {
      return knex('users').insert({
        'username': username,
        'password': hashedPass,
      });
    },

    signupFacebook: function(username, facebookId, facebookToken) {
      return knex('users').insert({
        'username': username,
        'fb_id': facebookId,
        'fb_token': facebookToken
      });
    },

    updateFacebook: function(facebookId, facebookToken, userId) {
      return knex('users')
        .where('id', userId) 
        .update({
          'fb_id': facebookId,
          'fb_token': facebookToken
        });
    },

    addProfile: function(id, profileText){
      return knex('users')
        .where({'id': id})
        .update({'profile':profileText});
    },
    getUserByName: function(username){
      return knex('users')
        .where({'username':username})
        .select();
    },
    getUserById: function(id){
      return knex('users')
        .where({'id':id})
        .select();
    },
    getUserByFB: function(facebookId){
      return knex('users')
        .where({'fb_id':facebookId})
        .select();
    }
    
  }

};
