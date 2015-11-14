// First time the app is defined as an angular module
// ng-app IS "amigo"
var amigo = angular.module('amigo', ['ngRoute', 'xeditable']);

// This is the x-editable option for the theme.
amigo.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bs3 IS "bootstrap"
});

// This is to produce the single-page app. This way, 
//whenever the url is pointing to X, it 
// inserts views/x.html into the dashboard ng-view div
amigo.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/trips', {
        templateUrl: 'views/trips.html',
        controller: 'tripsCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'Ctrl'
      })
      .otherwise({
        redirectTo: '/trips' // default page upon sign-in. 
      });
  }]);