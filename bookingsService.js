angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService){

	var bookingsService = {};
	bookingsService.dailyBookings = []; 

bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 20 , 8, 30, 0), end:new Date(2015, 10, 20 , 10, 00, 0), allDay:false, bookingID:"B4", roomNum:"101",duration:"1", reason:"Other", numPeople:"3", description:"Mischeif"},
		{title:"Coursework", start:new Date(2015, 10, 20 , 14, 30, 0), end:new Date(2015, 10, 20 , 15, 00, 0),allDay:false, bookingID:"B2", roomNum:"101", duration:"1", reason:"Coursework", numPeople:"2", description:""},
		{title:"Rehearsal",start:new Date(2015, 10, 20 ,17, 30, 0), end:new Date(2015, 10, 20 , 18, 30, 0),allDay:false, bookingID:"B3", roomNum:"101", duration:"1", reason:"Rehearsal", numPeople:"8", description:""});

	bookingsService.addEvent = function(){
		bookingsService.dailyBookings.push(
		{title:"Other", start:new Date(2015, 10, 20 , 11, 00, 0),  end:new Date(2015, 10, 20 , 12, 30, 0), allDay:false});
	}

	//retrieves the daily bookings given a date
	bookingsService.getDailyBookings = function(date){
		//call communication Service
		var room = '100HLH';
		dailyBookings = CommService.getDailyBookingsFromDb(date,room);
		return dailyBookings;
	}

	//retrieves booking information given a booking ID and a date
	bookingsService.getBookingInformation = function(bookingID, date){
		var bookingInfo = {};
		return bookingInfo;
	}


	//sends info to database to book a room
	//waits until a successful or non-successful response is returned
	//newBookingInfo may be an array with all the attributes
	bookingsService.bookRoom = function(newBookingInfo){
		var roomInformation = {};
		var response = CommService.bookRoomInDB(roomInformation);
		if(response){
			//add booking to the dailyBookings list
			return response;
		}
		else{
			//don't add and inform the user there was an error
			return 'could not create your room booking';
		}
		
	}

	//may not use
	//confirms that the booking does not conflict with other bookings
	bookingsService.confirmNoBookingConflicts = function(date, startTime, endTime){
		return true;
	}

	return bookingsService;
}