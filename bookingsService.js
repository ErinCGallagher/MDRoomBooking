angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService){

	var bookingsService = {};
	bookingsService.dailyBookings = []; 

bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 20 , 8, 30, 0), end:new Date(2015, 10, 20 , 10, 00, 0), allDay:false, bookingID:"B4", building: "Harrison-LeCaine Hall", roomNum:"101",duration:"1", reason:"Other", numPeople:"3", description:"Mischeif"},
		{title:"Coursework", start:new Date(2015, 10, 20 , 14, 30, 0), end:new Date(2015, 10, 20 , 15, 00, 0),allDay:false, bookingID:"B2", building: "Harrison-LeCaine Hall", roomNum:"101", duration:"1", reason:"Coursework", numPeople:"2", description:""},
		{title:"Rehearsal",start:new Date(2015, 10, 20 ,17, 30, 0), end:new Date(2015, 10, 20 , 18, 30, 0),allDay:false, bookingID:"B3", building: "Harrison-LeCaine Hall", roomNum:"101", duration:"1", reason:"Rehearsal", numPeople:"8", description:""});

	bookingsService.addEvent = function(){
		bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 20 , 11, 00, 0),  end:new Date(2015, 10, 20 , 12, 30, 0), allDay:false});
	}

	//retrieves the daily bookings given a date
	//called when the page first loads
	bookingsService.getDailyBookings = function(date){
		//call communication Service
		var room = '100HLH';
		dailyBookings = CommService.getDailyBookingsFromDb(date,room);
		return dailyBookings;
	}
	//bookingsService.getDailyBookings();

	//retrieves booking information given a booking ID and a date
	bookingsService.getBookingInformation = function(bookingID, date){
		var bookingInfo = {};
		return bookingInfo;
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
			//if the start times match
			if((bookingsService.dailyBookings[i].end).getTime() == startTime.getTime()){
				//if the next booked time occurs after the end time of the current booking
				if(i == (len-1) || bookingsService.dailyBookings[i+1].start >= endTime ){
					return true; //no conflict
				}
				else{
					return false; //conflict!
				}
			}
			//no booking occurs before the current one
			else if((bookingsService.dailyBookings[i].start).getTime() > (startTime).getTime()){
				
				//if the current booking starts before the booked one ends
				if((startTime).getTime() < (bookingsService.dailyBookings[i].end).getTime() ){
					return false; //no conflict
				}
				//if the next booked time occurs after the end time of the current booking
				else if((bookingsService.dailyBookings[i].end).getTime() >= (endTime).getTime()){
					return true; //no conflict
				}
				else{
					return false; //conflict!
				}
			}
		}

		return true; //no bookings or they all occur before your booking do whatever you want

	}



//check for conflicts

//determine possible durations
	return bookingsService;
}