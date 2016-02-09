angular
.module('mainApp', 
	['ui.calendar',
	'ui.bootstrap',
	'ngRoute'])

//all the routing for the applicatin between pages takes place here
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
	
	.when('/', {
		templateUrl:"src/html_css/login.html",
		controller:"LoginCtrl",
		activetab: null
	})	
	.when('/calendar', {
		templateUrl:"src/html_css/calendar.html",
		controller:"CalendarCtrl",
		activetab: 'calendar'
	})	
	.when('/search', {
		templateUrl:"src/html_css/search.html",
		controller:"SearchCtrl",
		activetab: 'search'
	})
	.when('/my-bookings', {
		templateUrl:"src/html_css/myBookings.html",
		controller:"MyBookingsCtrl",
		activetab: 'my-bookings'
	})
	.when('/admin/user', {
		templateUrl:"src/html_css/users.html",
		controller:"UsersCtrl",
		activetab: 'admin',
		activesubtab: 'user'
	})
	.when('/admin/groups', {
		templateUrl:"src/html_css/groups.html",
		controller:"GroupsCtrl",
		activetab: 'admin',
		activesubtab: 'groups'
	})
	//might not be it's own page
	.when('/other', {
		templateUrl:"other.html",
		controller:"OtherCtrl",
		activetab: 'other'
	})
	.otherwise({redirectTo: '/calendar'});

}]);