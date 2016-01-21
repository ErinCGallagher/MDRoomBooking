angular
.module('mainApp')
.service('BookingCommService', BookingCommService);

//communication Service
function BookingCommService($http){

	var bookingCommService = {};


bookingCommService.getWeeklyBookingsFromDb = function(start, end, building){
		var promisePost = $http.post('src/php/bookings/getRoomWeeklyBookings.php', { "start" :start, "end" :end, "building":building })
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
		var promisePost = $http.post('src/php/bookings/getBookingInfo.php', { "bookingID" : bookingId})
		    .success(function(data, status) {
		    	 console.log("retrieved booking information from database: ");
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
			  uID:"11ecg5",
		      reason: roomInformation.title,
		      start: roomInformation.start,
		      end: roomInformation.end,
		      building: roomInformation.building, 
		      roomID: roomInformation.roomNum,  
		      numParticipants: roomInformation.numPeople, 
		      otherDesc:roomInformation.description,
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

	bookingCommService.getRooms = function(){
		return rooms = [{"Harrison LeCaine Hall" : ["HLH 102","HLH 103","HLH 104","HLH 105","HLH 106"]}];
	}

	bookingCommService.formatRooms = function(rooms){
		var fomattedRooms = [];
		for(var i = 0; i<rooms.length; i++){
			for(var key in rooms[i]){
				fomattedRooms[key] = rooms[i][key];
			}
		}
		return fomattedRooms;
	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need bookingCommService.
	bookingCommService.convertToExpectedFormat = function(dailyBookings){
		//assumes that events have been combined if they have the same booking ID	
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			var startTime = dailyBookings[i].bookingDate + " " + dailyBookings[i].startTime;
			var endTime = dailyBookings[i].bookingDate + " " + dailyBookings[i].endTime;
			var startTime = new Date(startTime);
			formattedDailyBookings[i] =  
			{title:dailyBookings[i].reason, 
			 start:new Date(startTime),
			 end:new Date(endTime),
			 allDay:false, 
			 bookingID:dailyBookings[i].bookingID, 
			 building: "Harrison-LeCaine Hall", 
			 roomNum: dailyBookings[i].roomID
			};
		}
		
		return formattedDailyBookings;

	}
	//loop through the object of weekly bookings for all rooms in a building and format it appropriately
	bookingCommService.formatBuildingWeeklyBookings = function(buildingWeeklyBookings){
		var formattedBookings = [];
		for(var key in buildingWeeklyBookings){
			formattedBookings[key] = bookingCommService.convertToExpectedFormat(buildingWeeklyBookings[key]);
		}

		return formattedBookings;

	}

	return bookingCommService;
}