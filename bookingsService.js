angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService, $q){

	var bookingsService = {};
	bookingsService.dailyBookings = []; 

bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 24 , 8, 30, 0), end:new Date(2015, 10, 24 , 10, 00, 0), allDay:false, bookingID:"B4", building: "Harrison-LeCaine Hall", roomNum:"101",duration:"1", reason:"Other", numPeople:"3", description:"Mischeif"},
		{title:"Coursework", start:new Date(2015, 10, 24 , 14, 30, 0), end:new Date(2015, 10, 24 , 15, 00, 0),allDay:false, bookingID:"B2", building: "Harrison-LeCaine Hall", roomNum:"101", duration:"1", reason:"Coursework", numPeople:"2", description:""},
		{title:"Rehearsal",start:new Date(2015, 10, 24 ,17, 30, 0), end:new Date(2015, 10, 24 , 18, 30, 0),allDay:false, bookingID:"B3", building: "Harrison-LeCaine Hall", roomNum:"101", duration:"1", reason:"Rehearsal", numPeople:"8", description:""});

	bookingsService.addEvent = function(){
		bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 24 , 11, 00, 0),  end:new Date(2015, 10, 24 , 12, 30, 0), allDay:false});
	}

	//retrieves the daily bookings given a date
	//called when the page first loads
	bookingsService.getDailyBookings = function(date){
		//call communication Service
		var room = '100HLH';
		var q = $q.defer();
		
		CommService.getDailyBookingsFromDb(date,room)
			.then(function(dailyBookings){
				q.resolve(dailyBookings);
			},
			function(err){
				alert("could not retrieve daily bookings from database");
				q.resolve(err);
			});
		return q.promise;
	}
	//bookingsService.getDailyBookings();

	bookingsService.getBookingInformation = function(bookingID){
		var q = $q.defer();
		CommService.getBookingInformation(bookingID)
			.then(function(bookingInfo){
				//console.log(bookingInfo);
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

		//var response = CommService.bookRoomInDB(roomInformation);

		console.log(newBookingInfo);
		//determine if there are conflicts
		if(bookingsService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list
			bookingsService.dailyBookings.push(newBookingInfo);

			return true;
		}
		else{
			//don't add and inform the user there was an error
			return false;
		}
	}

	//confirms that the booking does not conflict with other bookings
	//return true if no conflicts
	//return false if there are conflicts
	bookingsService.confirmNoBookingConflicts = function(startTime, endTime){

		var len = bookingsService.dailyBookings.length;
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

		return true; //no bookings or they all occur before your booking do whatever you want
	
	}


	


//check for conflicts

//determine possible durations
	return bookingsService;
}