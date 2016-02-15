angular
.module('mainApp')
.service('MyBookingsService', MyBookingsService);

function MyBookingsService(CommService, $q, SharedVariableService){

	var myBookingsService = {};
	myBookingsService.userBookings = [];

	//retrieve the users future bookings for display
	myBookingsService.retrieveUserBookings = function(){

		CommService.retrieveUserBookings()
			.then(function(bookings){
				myBookingsService.userBookings.splice(0,myBookingsService.userBookings.length);
				for(var  i = 0; i < bookings.length; i++){
					myBookingsService.userBookings.push(bookings[i]);
				}

			},
			function(error){

			});

	}

	return myBookingsService;

}