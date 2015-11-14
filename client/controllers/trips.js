// code provided by Google Maps API
var geocoder = new google.maps.Geocoder();

var getCoordinates = function(address, callback) {
  var coordinates;
  geocoder.geocode({
    address: address
  }, function(results, status) {
    var coord_obj = results[0].geometry.location;
    coordinates = [coord_obj.G, coord_obj.K]; // coord_obj.G = Latitude, coord_obj.K = Longitude
    callback(coordinates);
  });
};
// end google stuff


amigo.controller('MakeTrips', function($scope, $http, $location) {
  $scope.makeTrip = function() {
    // We really should have just allowed the database to hold
    // a null value. But we didn't. Change this in the schema.sql file. 
    $scope.activities = $scope.activities || 'No Activities Defined' 
    // seperate activities into an array
    var activities = $scope.activities.split(',')
    // remove leading blank spaces
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].charAt(0) === ' ') {
        activities[i] = activities[i].slice(1);
      }
    }
    // activities is now an array of activity strings

    getCoordinates($scope.destination, function(coor) {
      var req = {
        method: 'POST',
        url: '/api/createTrip',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          destination: $scope.destination,
          geocode_latitude: coor[0], // because we only get this in a callback
          geocode_longitude: coor[1], // the entire req must be used inside that callback.
          start: $scope.start.toJSON().slice(0, 10),
          end: $scope.end.toJSON().slice(0, 10),
        }
      };
      $http(req).then(function(res) {
        $scope.response = 'Query sent';
        // again, replace this with allowing the db to take null values
        $scope.tripPic = $scope.tripPic || 'No Trip Picture'
        var UTReq = {
          method: 'POST',
          url: '/api/createUserTrip',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            trip_id: res.data[0],
            media: $scope.tripPic
          }
        };

        $http(UTReq).then(function(res) {
          $scope.response +=
            ' Second query (users.trips) sent';

          for (var i = 0; i < activities.length; i++) {
            var interestReq = {
              method: 'POST',
              url: '/api/addActivity',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                users_trips_id: res.data[0],
                activity: activities[i]
              }
            };
            $http(interestReq).then(function() {
              $scope.response +=
                ' act' + i;
              if($location.url !== '/test'){
                $location.url('/profile')
              }
            });
          }
        });
      });
    });
  };
});


amigo.controller('GetTrips', function($scope, $http) {

  $scope.getMyTrips = function (){
    var req = {
      method: 'POST',
      url: '/api/getMyTrips',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  }

  $scope.getTripsByUsername = function() {

    console.log('clicking getTrips', $scope.username);

    var req = {
      method: 'POST',
      url: '/api/getTrips',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: $scope.username
      }
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  };
});

amigo.controller('GetTripsByTime', function($scope, $http) {

  $scope.getTripsByTime = function() {

    var req = {
      method: 'POST',
      url: '/api/getTripsByTime',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        start: $scope.start,
        end: $scope.end
      }
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  };
});

// Below is the conflicting version. These are redundant
// but the trips view needs them right now.
amigo.controller('tripsCtrl', function($scope, $http) {
  console.log("tripsCtrl");
  $scope.makeTrip = function() {

    console.log('clicking makeTrip', $scope.destination, $scope.start.toJSON().slice(0,10), $scope.end.toJSON().slice(0,10));

    var req = {
      method: 'POST',
      url: '/api/createTrip',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        destination: $scope.destination,
          start: $scope.start.toJSON().slice(0,10),
          end: $scope.end.toJSON().slice(0,10)
      }
    };
    $http(req).then(function(res) {
      $scope.response = 'Query sent';
      var newReq = {
        method: 'POST',
        url: '/api/createUserTrip',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          trip_id: res.data[0]
        }
      }

      $http(newReq).then(function() {
        $scope.response = 'Second query sent';
      });
    });
  };
  $scope.addProfile = function() {

    console.log('clicking AddProfile', $scope.profile);

    var req = {
      method: 'POST',
      url: '/api/addProfile',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        profile: $scope.profile
      }
    };
    $http(req).then(function(res) {
      $scope.response = 'Query sent';
    });

  };
});
