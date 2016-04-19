//written by Erin Gallagher
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

	// Similar code exists in my adminUserService (all below)

	//cancel a users own booking from the my bookings page
	myBookingsService.cancelBooking = function(bookingID,startTime,recurring){
		var q = $q.defer();
		CommService.cancelBooking(bookingID,startTime)
		.then(function(){
			if(!recurring){
				updateBookingsDisplay(bookingID);
			}else{
				updateSingleRecurringBooking(bookingID); //TODO update booking from recurring
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

	//cancel a single booking from a reccuring booking group
	//remove the enitre group if no more bookings remain
	updateSingleRecurringBooking = function(bookingID){
		var i = 0;
		var j = 0;
		var len = -1;
		while(i < myBookingsService.recurringUserBookings.length){
			j = 0;
			while(j < myBookingsService.recurringUserBookings[i].recurringBooking.length){
				if(myBookingsService.recurringUserBookings[i].recurringBooking[j].bookingID == bookingID){
					myBookingsService.recurringUserBookings[i].recurringBooking.splice(j, 1);
					myBookingsService.recurringUserBookings[i].weeksRemaining -=1;
					len = myBookingsService.recurringUserBookings[i].recurringBooking.length;
				}
				if(len == 0){//if no recurring bookings are left, cancel the entire group
					updateRecurringDisplay(myBookingsService.recurringUserBookings[i].recurringID);
					i = myBookingsService.recurringUserBookings.length;
					break;
				}
			j++;
			}

		i++;
		}	
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