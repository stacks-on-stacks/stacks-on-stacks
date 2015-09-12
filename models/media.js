/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

// Because media can be attached to a blog, a trip, or a user, most of these
// methods take a string (variable name: type) that can be 'blog', 'trip', or 'user'.  

module.exports for media.js
  addMedia: adds a URL reference to the media table and connects it with the
  appropriate type and id. 

  getMediaById: takes an id# and a type, and returns that media's recrod. 

  deleteMediaByTypeId: given an id# and a type, deletes that media. 

  deleteMediaByMediaId: given an id# FOR THIS TABLE, deletes that media. 

-------------------------------------*/

module.exports = function(knex) {
  return {
    addMedia: function(id, url, type) { // type is a string that can be 'blog' 'trip' or 'user'
      type = type + '_id';
      var mediaObject = {
        'url': url,
        'blog_id': null,
        'trip_id': null,
        'user_id': null
      };
      mediaObject[type] = id;
      return knex('media')
        .insert(
          mediaObject
        );
    },
    getMediaById: function(id, type) {
      type = type + '_id';
      var searchObj = {};
      searchObj[type] = id;
      return knex('media')
        .where(searchObj)
        .select();
    },
    deleteMediaByTypeId: function(id, type) {
      type = type + '_id';
      var searchObj = {};
      searchObj[type] = id;
      return knex('media')
        .where(searchObj)
        .del();
    },
    deleteMediaByMediaId: function(id) {
      return knex('media')
        .where({
          id: id
        }).del();
    }
  };
};