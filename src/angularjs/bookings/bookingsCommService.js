angular
.module('mainApp')
.service('BookingCommService', BookingCommService);

//communication Service
function BookingCommService($http){

	var bookingCommService = {};
	var selectedBuilding = "Harrison LeCaine Hall";


bookingCommService.getWeeklyBookingsFromDb = function(start, end, building){
		selectedBuilding = building;
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
		console.log(data);
		var promisePost =  $http.post('src/php/bookings/createBooking.php', data)
		    .success(function(response) {
		    	console.log(response);
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	return responseDate.status;
		    });
		 return promisePost;

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
			 building: selectedBuilding, 
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

	bookingCommService.cancelBooking = function(bookingID,startTime) {

		var data = {bookingID:bookingID, start:startTime};
		var promisePost =  $http.post('src/php/bookings/cancel.php', data)
		    .success(function(data) {
		    	console.log(data);
		    })
		    .error(function(responseDate) { //request to the php scirpt failed

		    });
		 return promisePost;
	}

	//sends search criteria to the DB
	//returns all rooms and bookings that match the search cirteria
	//format expected = date, startTime,endTime,building, contents (individually included)
	bookingCommService.search = function(searchCriterai){
			selectedBuilding = searchCriterai.building;
		var data = {
			building : searchCriterai.building,
			startTime : searchCriterai.startTime,
			endTime : searchCriterai.endTime,
			date : searchCriterai.date,
			uprightPiano : searchCriterai.contents["Upright Piano"],
			grandPiano : searchCriterai.contents["Grand Piano"],
			openSpace : searchCriterai.contents["Open Space"],
			mirror : searchCriterai.contents["Mirror"],
			projector : searchCriterai.contents["Projector"]
		}
		console.log(data);
		var promisePost =  $http.post('src/php/bookings/search.php', data)
		    .success(function(data) {
		    	console.log(data);
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	console.log(responseDate);
		    });
		 return promisePost;

	}

	bookingCommService.retrieveUserBookings = function(){
		var promisePost =  $http.post('src/php/bookings/getUserBookings.php')
		    .success(function(data) {
		    	console.log(data);
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	console.log(responseDate);
		    });
		 return promisePost;
	}

	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need bookingCommService.
	bookingCommService.convertUserBookingsToExpectedFormat = function(dailyBookings){
		//assumes that events have been combined if they have the same booking ID	
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			formattedDailyBookings[i] =  
			{reason:dailyBookings[i].reason, 
			 start:dailyBookings[i].startTime,
			 end:dailyBookings[i].endTime,
			 date:dailyBookings[i].bookingDate,
			 bookingID:dailyBookings[i].bookingID, 
			 building: dailyBookings[i].building, 
			 roomNum: dailyBookings[i].roomID,
			 keyRequired:true
			};
		}
		return formattedDailyBookings;
	}

	return bookingCommService;
}