

amigo.controller('AddProfile', function($scope, $http) {

  $scope.addProfile = function() {

    $scope.profilepic = $scope.profilepic || 'No Picture'

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
      $scope.resProfile = 'Profile: ' + res.config.data.profile;
      $scope.resProfilePic = 'Profile Pic ' + res.config.data.profilePic;
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


    
amigo.controller('Ctrl', function($scope) {
    $scope.user = {
      name: '',
      currentTrips: 'Costa Rica',
      pastTrips: 'New York',
      age: '27',
      gender: 'female',
      aboutMe: 'I am a badass',
      email: '',
      interests: 'Cooking and food stuffs'
    };
    //***********Updates Database on user change*******//
    $scope.updateUser = function() {
      return $http.post('/addProfile', $scope.user);
    };

    //*****vaildate remote********//
    amigo.controller('ValidateRemoteCtrl', function($scope, $http, $q) {
    $scope.user = {
      name: 'awesome user'
    };

    $scope.checkName = function(data) {
      var d = $q.defer();
      $http.post('/checkName', {value: data}).success(function(res) {
        res = res || {};
        if(res.status === 'ok') { // {status: "ok"}
          d.resolve()
        } else { // {status: "error", msg: "Username should be `awesome`!"}
          d.resolve(res.msg)
        }
      }).error(function(e){
        d.reject('Server error!');
      });
      return d.promise;
    };
  });
});  