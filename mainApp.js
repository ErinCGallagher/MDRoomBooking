angular
.module('mainApp', 
	['ui.calendar',
	'ui.bootstrap',
	'ngRoute'])

//all the routing for the applicatin between pages takes place here
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
	
	.when('/', {
		templateUrl:"calendar.html",
		controller:"CalendarCtrl"
	})	
	.when('/search', {
		templateUrl:"search.html",
		controller:"SearchCtrl"
	})
	.when('/my-bookings', {
		templateUrl:"myBookings.html",
		controller:"MyBookingsCtrl"
	})
	.when('/user', {
		templateUrl:"admin/user.html",
		controller:"UserCtrl"
	})
	.when('/groups', {
		templateUrl:"admin/groups.html",
		controller:"GroupsCtrl"
	})
	//might not be it's own page
	.when('/other', {
		templateUrl:"other.html",
		controller:"OtherCtrl"
	})

}]);