angular
.module('mainApp')
.service('MyBookingsService', MyBookingsService);

function MyBookingsService(CommService, $q, BookingsService,SharedVariableService){

	var myBookingsService = {};
	myBookingsService.userBookings = [];
	myBookingsService.recurringUserBookings = [];

	//retrieve the users future bookings for display
	myBookingsService.retrieveUserBookings = function(){

		CommService.retrieveUserBookings(SharedVariableService.netID)
			.then(function(bookingsResponse){
				//non recurring bookings
				myBookingsService.userBookings.splice(0,myBookingsService.userBookings.length);
				for(var  i = 0; i < bookingsResponse.bookings.length; i++){
					myBookingsService.userBookings.push(bookingsResponse.bookings[i]);
				}

				//recurring bookings
				myBookingsService.recurringUserBookings.splice(0,myBookingsService.recurringUserBookings.length);
				for(var  j = 0; j < bookingsResponse.recurringBookings.length; j++){
					myBookingsService.recurringUserBookings.push(bookingsResponse.recurringBookings[j]);
				}
			},
			function(error){

			});
	}

	myBookingsService.retrieveHoursRemaining = function(){
		var q = $q.defer();
			var date = new Date();
			CommService.hoursRemaining(date)
			.then(function(retrievedHours){
				q.resolve(retrievedHours);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}


	//cancel a users own booking from the my bookings page
	myBookingsService.cancelBooking = function(bookingID,startTime,recurring){
		var q = $q.defer();
		CommService.cancelBooking(bookingID,startTime)
		.then(function(){
			if(!recurring){
				updateBookingsDisplay(bookingID);
			}else{
				updateBookingsDisplay(bookingID); //TODO update booking from recurring
			}

			q.resolve();
		},
		function(err){
			q.resolve(err);
		});
		return q.promise;
	}
	//cancel all bookings associated with a reccuring booking
	myBookingsService.cancelAllRecurringBookings = function(reccurringID){
		var q = $q.defer();
		CommService.cancelAllRecurringBookings(reccurringID)
		.then(function(){
			updateRecurringDisplay(reccurringID);
			q.resolve();
		},
		function(err){
			q.resolve(err);
		});
		return q.promise;
	}

	//after a booking has been canceled successfully, remove it from the my bookings table
	updateBookingsDisplay = function(bookingID){
		var i = 0
		while(i < myBookingsService.userBookings.length){
			if(myBookingsService.userBookings[i].bookingID == bookingID){
				myBookingsService.userBookings.splice(i, 1);
				i = myBookingsService.userBookings.length;
			}
		i++;
		}

	}

	//after a booking has been canceled successfully, remove it from the my bookings table
	updateRecurringDisplay = function(reccurringID){
		var i = 0
		while(i < myBookingsService.recurringUserBookings.length){
			if(myBookingsService.recurringUserBookings[i].recurringID == reccurringID){
				myBookingsService.recurringUserBookings.splice(i, 1);
				i = myBookingsService.recurringUserBookings.length;
			}
		i++;
		}

	}


	return myBookingsService;

}