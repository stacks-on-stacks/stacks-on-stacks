var amigo = angular.module('amigo');

amigo.controller('AddProfile', function($scope, $http) {

  $scope.addProfile = function() {

    var req = {
      method: 'POST',
      url: '/api/addProfile',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        profile: $scope.profile,
        profilepic: $scope.profilepic
      }
    };
    $http(req).then(function(res) {
      $scope.response = res;
    });

  };

});

amigo.controller('GetProfile', function($scope, $http) {

  $scope.getProfile = function(){

    console.log('getting profile of', $scope.username);

    var req = {
      method: 'POST',
      url: '/api/getProfile',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: $scope.username
      }
    };
    $http(req).then(function(res) {
      var record = res.data[0];
      $scope.user_id = record.id;
      $scope.user_email = record.email;
      $scope.user_hashpass = record.password;
      $scope.user_fb_id = record.fb_id;
      $scope.user_fb_token = record.fb_token;
      $scope.user_profile = record.profile;
    });

  };

});


    
  