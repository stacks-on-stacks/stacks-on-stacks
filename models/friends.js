/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

Keep in mind that as written, there is currently no way for friends to confirm
each other's friendship (making it more like a twitter Follow than a facebook "friend")

module.exports for friends.js
  befriend: takes two user IDs (one for the "friender" the other for the "friendee")
  and creates a one-way connection between the two.  

  defriend: takes the ID of a friendship (from this table) and deletes it from the db. 

  listFriends: This takes the ID of a user and lists all friends that that user has
  made. 

  listWhoFriendsMe: This takes the ID of a user and lists all records where
  they have been the "friendee". 
-------------------------------------*/

module.exports = function(knex) {
  return {
    befriend: function(frienderId, friendeeId) { // int, int -- logic to get IDs from username is in controller
      return knex('friends')
        .insert({
          'friender_id': frienderId,
          'friendee_id': friendeeId
        });
    },
    defriend: function(friendshipId) { // int
      return knex('friends')
        .where({
          'id': friendshipId
        })
        .del();
    },
    getFriends: function(userCriteria) {
      var criteria = {};
      criteria[userCriteria.type] = userCriteria.id;
      var otherType = '';
      if (userCriteria.type === 'friender_id') {
        otherType = 'friendee_id';
      }
      if (userCriteria.type === 'friendee_id') {
        otherType = 'friender_id';
      }

      return knex('friends')
        .innerJoin('users', 'users.id', 'friends.' + otherType)
        .where(criteria)
        .select();
    }
  };
};