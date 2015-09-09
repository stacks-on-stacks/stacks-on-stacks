angular.module('amiGo',['ngRoute']);

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'views/signin.html',
      controller: 'AuthController'
    })
   })
 
 $(function(){
	$(document).on('focus', 'div.form-group-options div.input-group-option:last-child input', function(){
		var sInputGroupHtml = $(this).parent().html();
		var sInputGroupClasses = $(this).parent().attr('class');
		$(this).parent().parent().append('<div class="'+sInputGroupClasses+'">'+sInputGroupHtml+'</div>');
	});
	
	$(document).on('click', 'div.form-group-options .input-group-addon-remove', function(){
		$(this).parent().remove();
	});
});
  