var amigo = angular.module('amigo');

amigo.controller('Befriend', function($scope, $http) {

  $scope.befriend = function() {

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

    $http(idReq($scope.friender)).then(function(res) { // promise hell
      var frienderId = res.data[0].id; // we need the friender ID
      $http(idReq($scope.friendee)).then(function(res) {
        var friendeeId = res.data[0].id; // then the friendee ID
        var req = {
          method: 'POST',
          url: '/api/befriend',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            friender: frienderId,
            friendee: friendeeId
          }
        };
        // we must put this inside the promise in order to have access to the Id numbers
        $http(req).then(function(res) {
          $scope.befriend_response = 'Query sent';
        });
      });
    });
  };
});

amigo.controller('GetFriends', function($scope, $http) {

  $scope.getFriends = function(whichLookup) {
    whichLookup = whichLookup || 'myFriends';

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

    $http(idReq($scope.username)).then(function(res) { // promise hell
      var userId = res.data[0].id; // we need the friender ID
      if (whichLookup === 'myFriends') {
        dataPack = {
          type:'friender_id',
          id: userId,
        };
      }
      if (whichLookup === 'friendsMe') {
        dataPack = {
          type:'friendee_id',
          id: userId,
        };
      }
      var req = {
        method: 'POST',
        url: '/api/getFriends',
        headers: {
          'Content-Type': 'application/json'
        },
        data: dataPack
      };
      // we must put this inside the promise in order to have access to the Id numbers
      $http(req).then(function(res) {
        $scope.friends = res.data;
      });
    });
  };
});