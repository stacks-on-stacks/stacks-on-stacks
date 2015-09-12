// helperfunction creates the correct format for getting a user ID by name. 

var amigo = angular.module('amigo');

amigo.controller('WriteBlog', function($scope, $http) {

  $scope.publishBlog = function() {

      $scope.subject, $scope.body);

    var idReq = function(username) {
      return {
        method: 'POST',
        url: '/api/getProfile',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: username
        }
      };
    };

    $http(idReq($scope.author)).then(function(res) { // promise hell
      var authorId = res.data[0].id; // we need the friender ID
      var req = {
        method: 'POST',
        url: '/api/publishBlog',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          author_id: authorId,
          subject: $scope.subject,
          body: $scope.body,
          media: $scope.blogpic
        }
      };
      // we must put this inside the promise in order to have access to the Id numbers
      $http(req).then(function(res) {
        $scope.debug_response = 'Query sent';
      });
    });
  };
});

amigo.controller('GetBlogs', function($scope, $http) {

  $scope.getBlogs = function() {

    var req = {
      method: 'POST',
      url: '/api/getBlogs',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: $scope.username
      }
    };
    $http(req).then(function(res) {
      $scope.debug_response = 'Query sent';
      $scope.blogs = res.data;
    });
  };
});