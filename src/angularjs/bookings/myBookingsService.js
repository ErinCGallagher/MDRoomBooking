angular
.module('mainApp')
.service('MyBookingsService', MyBookingsService);

function MyBookingsService(CommService, $q, BookingsService,SharedVariableService){

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

	//cancel a users own booking from the my bookings page
	myBookingsService.cancelBooking = function(bookingID,startTime){
		var q = $q.defer();
		CommService.cancelBooking(bookingID,startTime)
		.then(function(){
			updateDisplay(bookingID);
			q.resolve();
		},
		function(err){
			q.resolve(err);
		});
		return q.promise;
	}

	updateDisplay = function(bookingID){
		var i = 0
		while(i < myBookingsService.userBookings.length){
			if(myBookingsService.userBookings[i].bookingID == bookingID){
				myBookingsService.userBookings.splice(i, 1);
				i = myBookingsService.userBookings.length;
			}
		i++;
		}
	}

	return myBookingsService;

}