angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http){

	var commService = {};

	commService.getDailyBookingsFromDb = function(date, room){
		var promisePost = $http.post('db_scripts/GetDaily1.php', { "Date" :date, "Room":room })
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

	commService.getBookingInformation = function(bookingId){
		var promisePost = $http.post('db_scripts/GetBookingInfo1.php', { "BookingID" : bookingId})
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
	commService.bookRoomInDB = function(roomInformation){
		var endTime = roomInformation.end.toTimeString();
		console.log(endTime);
		/*
		endTime = endTime.split(' ')[0];
		console.log(endTime);
	*/
		var startTime = roomInformation.start.toTimeString();
		startTime = startTime.split(' ')[0];

		var date = roomInformation.end.toDateString();

		console.log(roomInformation.dateTime);

		var dateTime = roomInformation.dateTime.format("YYYY-MM-dd HH:mm:ss");

		console.log(dateTime);

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
		      dateTime:roomInformation.dateTime
		    };
		    console.log(data);
		var promisePost =  $http.post('db_scripts/MakeBooking1.php', data)
		    .success(function(data, status) {
		    	console.log(data);
		    	/*
		    	//converts the php date to javascript dat in local time
		    	var dateTimes = new Date(Date.parse(data));
		    	*/
		    	//console.log(dateTimes);
		    	console.log(date);
		    	return true;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;

	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need commService.
	commService.convertToExpectedFormat = function(dailyBookings){
		//assumes that events have been combined if they have the same booking ID	
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			var startTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].StartTime;
			var endTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].EndTime;
			var startTime = new Date(startTime);
			console.log(startTime);
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
		/*
		var formattedDailyBookings = [];
		var formattedArrayPos = 0;
		for(var i = 0; i<dailyBookings.length-1;i++){
			//console.log(dailyBookings[i]);
			console.log(dailyBookings[i].BookingID);
			if(i!=0 && dailyBookings[i].BookingID == dailyBookings[i-1].BookingID){
				console.log(dailyBookings[i-1].BookingID);
				var endTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].EndTime;
				console.log("same booking id" + formattedArrayPos);
				formattedDailyBookings[formattedArrayPos].end = endTime;
				console.log(formattedDailyBookings);
			}
			else{
				var startTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].StartTime;
				var endTime = dailyBookings[i].BookingDate + " " + dailyBookings[i].EndTime;
				console.log(formattedArrayPos);
				formattedDailyBookings[formattedArrayPos] =  
					{title:dailyBookings[i].Reason, 
					 start:startTime,
					 end:endTime,
					 allDay:false, 
					 bookingID:dailyBookings[i].BookingID, 
					 building: "Harrison-LeCaine Hall", 
					 roomNum: dailyBookings[i].RoomID,
					 bookingID: dailyBookings[i].BookingID
					};
					if(dailyBookings[i].BookingID != dailyBookings[i+1].BookingID){
						formattedArrayPos +=1;
					}
				console.log(formattedDailyBookings);

			}

			
		}
		console.log(formattedDailyBookings);
	*/
		return formattedDailyBookings;

	}

	return commService;
}