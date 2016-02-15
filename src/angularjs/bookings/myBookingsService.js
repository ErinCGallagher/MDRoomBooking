angular
.module('mainApp')
.service('MyBookingsService', MyBookingsService);

function MyBookingsService(CommService, $q, SharedVariableService){

	var myBookingsService = {};
	myBookingsService.userBookings = [];

	//retrieve the users future bookings for display
	myBookingsService.retrieveUserBookings = function(){

		CommService.retrieveUserBookings()
			.then(function(userBookings){
				myBookingsService.userBookings.splice(0,myBookingsService.userBookings.length);
				for(var  i = 0; i < userBookings.length; i++){
					myBookingsService.userBookings.push(userBookings[i]);
				}

			},
			function(error){

			});

	}

	return myBookingsService;

}