// Write a blog
amigo.controller('WriteBlog', function($scope, $http) {
  $scope.publishBlog = function() {
    // idReq is a helperfunction which creates 
    // the correct format for getting a user ID by name. 
    // This function returns the proper format
    // for a request. It's used often, so it's
    // abstracted out for DRY. 
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
    // pass in the username to idReq .then use the user ID it returns in 
    // the $http request. 
    $http(idReq($scope.author)).then(function(res) { 
      var authorId = res.data[0].id; // we need the author ID, not just the name.
      // format a new request object
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
          media: $scope.blogpic // this is optional
        }
      };
      // pass the request object into the database
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