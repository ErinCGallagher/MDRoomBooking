angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http, $q, BookingCommService){

	var commService = {};

	commService.getDailyBookingsFromDb = function(start, end, room){
		var q = $q.defer();
		BookingCommService.getDailyBookingsFromDb(start, end, room)
			.then(function(dailyBookingObjects){
				q.resolve(dailyBookingObjects);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	commService.getBookingInformation = function(bookingId){
		var q = $q.defer();
		BookingCommService.getBookingInformation(bookingId)
			.then(function(bookingInformation){
				q.resolve(bookingInformation);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}		

	//call the php script that adds a booking to the DB
	commService.bookRoomInDB = function(roomInformation){
		var q = $q.defer();
		BookingCommService.bookRoomInDB(roomInformation)
			.then(function(bookingObject){
				q.resolve(bookingObject);
			},			function(err){
				q.reject();
			});
		return q.promise;
	}

	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need commService.
	commService.convertToExpectedFormat = function(dailyBookings){

		return BookingCommService.convertToExpectedFormat(dailyBookings);

	}

	return commService;
}