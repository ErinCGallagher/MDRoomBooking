angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http){

	var commService = {};

	commService.getDailyBookingsFromDb = function(date, room){
		var promisePost = $http.post('db_scripts/GetDaily1.php', { "Date" :date, "Room":room })
		    .success(function(data, status) {
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });

		return promisePost;
		}

	commService.getBookingInformation = function(bookingId){
		var promisePost = $http.post('db_scripts/GetBookingInfo1.php', { "BookingID" : bookingId})
		    .success(function(data, status) {
		    	 //console.log(data);
		      return data; //all the bookings for the given date and room
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });
		return promisePost;
		   
		}		

	//call the php script that adds a booking to the DB
	//
	commService.bookRoomInDB = function(roomInformation){
		var endTime = roomInformation.end.toTimeString();
		endTime = endTime.split(' ')[0];
		console.log(endTime);

		var startTime = roomInformation.start.toTimeString();
		startTime = startTime.split(' ')[0];
		console.log(startTime);

		var date = roomInformation.end.toDateString();
		console.log(date);

		var data = {
			  UID:"11ecg5",
		      Reason: roomInformation.title,
		      start: startTime,
		      end: endTime,
		      date: date,
		      building: roomInformation.building, 
		      RoomID: roomInformation.roomNum,
		      duration: roomInformation.duration,  
		      numParticipants: roomInformation.numPeople, 
		      OtherDesc:roomInformation.description,
		    };
		    		console.log(data);
		var promisePost =  $http.post('db_scripts/MakeBooking1.php', data)
		    .success(function(data, status) {
		    	console.log(data);
		    	return true;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });
		 return promisePost;

	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need commService.
	commService.convertToExpectedFormat = function(dailyBookings){
		
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			var startTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].StartTime;
			var endTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].EndTime;
			
			formattedDailyBookings[i] =  
			{title:dailyBookings[i].Reason, 
			 start:startTime,
			 end:endTime,
			 allDay:false, 
			 bookingID:dailyBookings[i].BookingID, 
			 building: "Harrison-LeCaine Hall", 
			 roomNum: dailyBookings[i].RoomID
			};
		}

		return formattedDailyBookings;

	}

	return commService;
}