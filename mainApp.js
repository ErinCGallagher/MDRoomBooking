angular
.module('mainApp', 
	['ui.calendar',
	'ui.bootstrap',
	'ngRoute'])

//all the routing for the applicatin between pages takes place here
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
	
	.when('/calendar', {
		templateUrl:"calendar.html",
		controller:"CalendarCtrl",
		activetab: 'calendar'
	})	
	.when('/search', {
		templateUrl:"search.html",
		controller:"SearchCtrl",
		activetab: 'search'
	})
	.when('/my-bookings', {
		templateUrl:"myBookings.html",
		controller:"MyBookingsCtrl",
		activetab: 'my-bookings'
	})
	.when('/admin/user', {
		templateUrl:"admin/user.html",
		controller:"UserCtrl",
		activetab: 'admin',
		activesubtab: 'user'
	})
	.when('/admin/groups', {
		templateUrl:"admin/groups.html",
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