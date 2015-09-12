/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for blogs.js
  addBlog: Takes an authorid#, a subject and a body, and adds it to the db. 

  removeBlog: Takes a blog id FOR THIS TABLE and removes it from the db.

  modifyBlog: Updates a blogpost, given the id# FOR THIS TABLE for the blog

  getBlogsByUser: returns all records for a particular user #. 

-------------------------------------*/

module.exports = function(knex) {

  return {
    // takes a comma delimited string, splits it into an array
    publishBlog: function(author, subject, body, media) {
      var created = new Date();
      return knex('blogs')
        .insert({
          'author_id': author,
          'subject': subject,
          'body': body,
          'created_at': created
        })
        .returning('id')
        .into('blogs')
        .then(function(id) {
          id = id[0];
          return knex.insert({
            'url': media,
            'blog_id': id,
            'user_id': null,
            'trip_id': null
          }).into('media');
        });
    },
    getBlogs: function(username) {
      return knex('blogs')
        .innerJoin('users', 'users.id', 'blogs.author_id')
        .where('username', username)
        .select('username as author_name', 'subject', 'body', 'created_at');
    }
  };
};