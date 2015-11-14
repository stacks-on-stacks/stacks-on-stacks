// Add feedback about a user
amigo.controller('AddFeedback', function($scope, $http) {
  $scope.addFeedback = function() {
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

    $http(idReq($scope.author)).then(function(res) { // promise hell
      var authorId = res.data[0].id; // we need the friender ID first
      $http(idReq($scope.subject)).then(function(res) {
        var subjectId = res.data[0].id; // then we need a seperate call for the friendee id
        var req = {
          method: 'POST',
          url: '/api/addFeedback',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            author_id: authorId,
            subject_id: subjectId,
            feedback: $scope.feedback
          }
        };
        // we must put this inside the promise in order to have access to the Id numbers
        $http(req).then(function(res) {
          $scope.debug_response = 'Query sent';
        });
      });
    });
  };
});


amigo.controller('GetFeedback', function($scope, $http) {

  $scope.getFeedback = function(isAuthor) {
    var req = {
      method: 'POST',
      url: '/api/getFeedback',
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        username: $scope.username,
        authOrSubj: isAuthor
      }
    };
    $http(req).then(function(res) {
      $scope.feedbacks = res.data;
    });
  };
});