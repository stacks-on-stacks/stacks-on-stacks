/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for users_trips.js
  makeTrip: This function creates a new trip (using the trips.js model). 
  It then takes the last inserted id (the new trip) and ties it into the
  user ID. 

  getTripsByUser: This returns all user-trip records belonging to the userID

  getUsersByTrip: This returns all user-trip records belonging to the tripID

-------------------------------------*/



module.exports = function(knex) {
var trips = require('./trips.js')(knex);
  return {
    makeTrip: function(destination, timeStart, timeEnd, user) {
      console.log('destination inside users trips', destination);
      return trips.addTrip(destination, timeStart, timeEnd)
        .then(
          function(trip) { // can you promisify this?
            console.log('hello', trip);
            tripId = trip[0];
            knex('users_trips')
              .insert({
              'user_id': user,
              'trip_id': tripId
             });
          });
    },
    getTripsByUser: function(user) {
      return knex('users_trips').where({
        'user_id': user
      }).select();
    },
    getUsersByTrip: function(trip) {
      return knex('users_trips').where({
        'trip_id': trip
      }).select();
    }
  };
};