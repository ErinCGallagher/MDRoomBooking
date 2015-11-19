angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService){

	var bookingsService = {};
	var dailyBookings = {}; 
	//{
	//	B1:{date:x, roomNum:x, startTime:x, endTime:x, reason:x, people:x, description:x},
	//	B2:{date:y, roomNum:y, startTime:y, endTime:y, reason:y, people:y, description:y}
	//};

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