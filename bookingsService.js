angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService, $q){

	var bookingsService = {};
	bookingsService.dailyBookings = []; 

	//retrieves the daily bookings given a date
	//called when the page first loads
	bookingsService.getDailyBookings = function(date){
		//call communication Service
		var room = 'HLH 102';
		var q = $q.defer();
		
		CommService.getDailyBookingsFromDb(date,room)
			.then(function(retrievedBookings){
				bookingsService.dailyBookings.length = 0;
				var formattedBookings = CommService.convertToExpectedFormat(retrievedBookings.data);
				for(var i = 0; i<formattedBookings.length;i++){
					bookingsService.dailyBookings.push(formattedBookings[i]);
				}
				q.resolve(bookingsService.dailyBookings);
			},
			function(err){
				alert("could not retrieve daily bookings from database");
				q.resolve(err);
			});
		return q.promise;
	}


	bookingsService.getBookingInformation = function(bookingID){
		var q = $q.defer();
		CommService.getBookingInformation(bookingID)
			.then(function(bookingInfo){
				q.resolve(bookingInfo);
			},
			function(err){
				alert("error with PHP script Booking Service line 104");
				q.reject();
			});
		return q.promise;
	}

	//return an array with the list of possible durations given a booking start time
	//used for the duration dropdown in the popup
	bookingsService.getPossibleDurations = function(startTime){
		for(var i=0; i<bookingsService.dailyBookings.length; i++){
			if(bookingsService.dailyBookings[i].start >= startTime){

			}
		}
		return bookingInfo;
	}

	//sends info to database to book a room
	//waits until a successful or non-successful response is returned
	//newBookingInfo may be an array with all the attributes
	bookingsService.bookRoom = function(newBookingInfo){
		var roomInformation = {};

		//determine if there are conflicts
		if(bookingsService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list

			var q = $q.defer();
			CommService.bookRoomInDB(newBookingInfo)
				.then(function(bookingID){
					q.resolve(true);
					newBookingInfo.bookingID = bookingID.data;
					bookingsService.dailyBookings.push(newBookingInfo);
					console.log(newBookingInfo);
				},
				function(err){
					q.reject(false);
				});
			return q.promise;
		}
		else{
			//don't add and inform the user there was an error
			return false;
		}
	}

	//calculate the end timestamp given the selected duration and the startTimestamp
	bookingsService.calclEndTime = function(durations, selectedDuration, startTimestamp){
	    var durationHours = 0;
	    for(var i=0; i<durations.length; i++) {
	      if (selectedDuration == durations[i]){
	        durationHours = (i+1) * 0.5;
	      }
	    }

	    return moment(startTimestamp).add(durationHours, 'h');
  }

	//confirms that the booking does not conflict with other bookings
	//return true if no conflicts
	//return false if there are conflicts
	bookingsService.confirmNoBookingConflicts = function(startTime, endTime){

		var len = bookingsService.dailyBookings.length;

		/*
		//loop through the daily bookings
		for(var i=0; i<bookingsService.dailyBookings.length; i++){

			if((bookingsService.dailyBookings[i].start).getTime() == startTime.getTime()){
				return false;
			}
			//if the start time is in between
			else if(startTime.getTime() >= (bookingsService.dailyBookings[i].start).getTime() &&
				 startTime.getTime() < (bookingsService.dailyBookings[i].end).getTime()){
				return false;
			}
			else if(endTime.getTime() > (bookingsService.dailyBookings[i].start).getTime() &&
				 endTime.getTime() <= (bookingsService.dailyBookings[i].end).getTime()){
				return false;
			}
		}
		*/
		return true; //no bookings or they all occur before your booking do whatever you want
	
	}


//determine possible durations
	return bookingsService;
}