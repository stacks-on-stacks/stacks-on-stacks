/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for activities.js
  addInterests: takes an interest and a user-trip# and
  inserts that into the database. 

  removeInterests: takes an ID# FOR THIS TABLE and removes
  it from the database. 

  getInterestID: Takes an interest and userTripID and
  returns the specific record(s) where that id can be found. 

-------------------------------------*/

module.exports = function(knex) {
  return {
    addActivity: function(userTripId, activity) {
      return knex('activities')
        .insert({
          'users_trips_id': userTripId,
          'activity': activity
          });
      }
    }
  }
