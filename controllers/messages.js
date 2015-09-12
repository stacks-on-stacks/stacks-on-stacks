var amigo = angular.module('amigo');

amigo.controller('SendMessage', function($scope, $http) {

  $scope.sendMessage = function() {
      $scope.subject, $scope.content);

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

    $http(idReq($scope.sender)).then(function(res) { // promise hell
      var senderId = res.data[0].id; // we need the friender ID
      $http(idReq($scope.reciever)).then(function(res) {
        var recieverId = res.data[0].id; // then the friendee ID
        var req = {
          method: 'POST',
          url: '/api/sendMessage',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            sender_id: senderId,
            reciever_id: recieverId,
            subject: $scope.subject,
            content: $scope.content
          }
        };
        // we must put this inside the promise in order to have access to the Id numbers
        $http(req).then(function(res) {
          $scope.message_response = 'Query sent';
        });
      });
    });
  };
});


amigo.controller('GetMessages', function($scope, $http) {

  $scope.getMessages = function(isReceiver) {
     console.log('controller', $scope.username, isReceiver);
    var req = {
      method: 'POST',
      url: '/api/getMessages',
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        username: $scope.username,
        recOrSend: isReceiver
      }
    };
    $http(req).then(function(res) {
      $scope.messages = res.data;
    });
  };
});