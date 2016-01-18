angular
.module('mainApp')
.service('BookingCommService', BookingCommService);

//communication Service
function BookingCommService($http){

	var bookingCommService = {};

bookingCommService.getDailyBookingsFromDb = function(start, end, room){
		var promisePost = $http.post('src/php/bookings/getRoomWeeklyBookings.php', { "Start" :start, "End" :end, "Room":room })
		    .success(function(data, status) {
		    	console.log("daily bookings from database:");
		    	console.log(data);
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });

		return promisePost;
		}

	bookingCommService.getBookingInformation = function(bookingId){
		var promisePost = $http.post('src/php/bookings/getBookingInfo.php', { "BookingID" : bookingId})
		    .success(function(data, status) {
		    	 console.log("retrieved booking infromation from database: ");
		    	 console.log(data);
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });
		return promisePost;
		   
		}		

	//call the php script that adds a booking to the DB
	bookingCommService.bookRoomInDB = function(roomInformation){

		var data = {
			  UID:"11ecg5",
		      Reason: roomInformation.title,
		      start: roomInformation.start,
		      end: roomInformation.end,
		      building: roomInformation.building, 
		      RoomID: roomInformation.roomNum,
		      duration: roomInformation.duration,  
		      numParticipants: roomInformation.numPeople, 
		      OtherDesc:roomInformation.description,
		    };
		var promisePost =  $http.post('src/php/bookings/createBooking.php', data)
		    .success(function(response) {
		    	var hello = response;
		    	return hello;
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;

	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need bookingCommService.
	bookingCommService.convertToExpectedFormat = function(dailyBookings){
		//assumes that events have been combined if they have the same booking ID	
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			var startTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].StartTime;
			var endTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].EndTime;
			var startTime = new Date(startTime);
			formattedDailyBookings[i] =  
			{title:dailyBookings[i].Reason, 
			 start:new Date(startTime),
			 end:new Date(endTime),
			 allDay:false, 
			 bookingID:dailyBookings[i].BookingID, 
			 building: "Harrison-LeCaine Hall", 
			 roomNum: dailyBookings[i].RoomID
			};
		}
		
		return formattedDailyBookings;

	}

	return bookingCommService;
}