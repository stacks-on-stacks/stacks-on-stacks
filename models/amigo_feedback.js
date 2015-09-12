/*------------------------------------

// This module.exports is a function. It's the way that we
// pass in the live database connection ("knex") and use it with
// all the various module methods (which are returned.)  Trying
// to just export an object of methods will not work without
// the live database. 

module.exports for amigo_feedback.js
  addFeedback: Given an author and subject ID number, stores
  feedback (text) in the database. 

  delFeecback: Taking a feedback# FOR THIS TABLE, deletes
  the record from the database. 

  listMySentFeedback: Given a user ID, returns all feedback
  where the user ID is the author.

  listAboutMeFeedback: Given a user ID, returns all feedback
  where the user is the subject.  

-------------------------------------*/

module.exports = function(knex) {
  return {
    addFeedback: function(author, subject, feedback) { // int, int, string, string
      return knex('amigo_feedback')
        .insert({
          'author_id': author,
          'subject_id': subject,
          'feedback': feedback
        });
    },
    deleteMessage: function(feedbackId) { // int, int, string, string
      return knex('amigo_feedback')
        .where({
          'id': feedbackId
        }).del();
    },
    getFeedback: function(username, isAuthor) { // int, string(either 'receiver' or 'sender')
       isAuthor = isAuthor || 'author'; // default case just in case of errors. 
        if(isAuthor === 'author'){
          grabId = 'aUsers.username';
        }
        if(isAuthor === 'subject'){
          grabId = 'sUsers.username';
        }
       return knex('amigo_feedback') // must use aliases here
        .innerJoin('users AS aUsers', 'aUsers.id', 'amigo_feedback.author_id') // need to use the "as" to alias
        .innerJoin('users AS sUsers', 'sUsers.id', 'amigo_feedback.subject_id')
        .where(grabId, username)
        .select('sUsers.username as subject', 'aUsers.username as author', 'feedback');
    }
  };
}