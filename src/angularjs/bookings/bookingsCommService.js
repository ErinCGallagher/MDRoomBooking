//written by Erin Gallagher
angular
.module('mainApp')
.service('BookingCommService', BookingCommService);

//communication Service
function BookingCommService($http){

	var bookingCommService = {};
	var selectedBuilding = "Harrison LeCaine Hall";


//retirves all bookings for a building and all it's rooms
//between 2 dates given building
bookingCommService.getWeeklyBookingsFromDb = function(start, end, building){
		selectedBuilding = building;
		var promisePost = $http.post('src/php/bookings/getRoomWeeklyBookings.php', { "start" :start, "end" :end, "building":building })
		    .success(function(data, status) {
		    	console.log("daily bookings from database:");
		    	console.log(data);
		    })
		    .error(function(data, status) {
		    	return 'error';
   
		    });

		return promisePost;
		}
	

	//call the php script that adds a booking to the DB
	//if recurringBooking is true, then call make recurring booking script
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
		    .error(function(response) { //request to the php scirpt failed;
		    	console.log(response);
		    	return response.status;
		    });
		 return promisePost;

	}

	//call the php script that adds a booking to the DB
	//if recurringBooking is true, then call make recurring booking script
	bookingCommService.bookRoomRecurrInDB = function(roomInformation){

		var data = {
			  uID:"11ecg5",
		      reason: roomInformation.title,
		      start: roomInformation.start,
		      end: roomInformation.end,
		      building: roomInformation.building, 
		      roomID: roomInformation.roomNum,  
		      numParticipants: roomInformation.numPeople, 
		      otherDesc:roomInformation.description,
		      recurringBooking:roomInformation.recurringBooking, //true or false
          	  totalWeeks:roomInformation.numWeeksRecur //including the current week
		    };
		console.log(data);

		var promisePost =  $http.post('src/php/bookings/createRecurring.php', data)
		    .success(function(response) {
		    	console.log(response);
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	console.log(responseDate.status);
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

	//provided a colour for each reason for booking
	bookingCommService.eventColourPicker = function(reason){
		if(reason == 'Individual Rehearsal'){
			return '#6371C6';
		}else if(reason == 'Ensemble Rehearsal'){
			return '#37a3fb';
		}else if(reason == 'Other'){
			return '#2ca09e';
		}else if(reason == 'Coursework'){
			return '#990D6F';
		}else if(reason == 'Meetings'){
			return '#5931b4';
		}else if(reason == 'Performance'){
			return '#2EB671';
		}else if(reason == 'Course'){
			return '#1e51fa';
		}else{ //shouldnt get here
			return '#597EFC';
		}
	}


	//convert the weekly bookings information to the correct font end format
	bookingCommService.convertToExpectedFormat = function(dailyBookings,userType){
		//assumes that events have been combined if they have the same booking ID	
		var formattedDailyBookings = [];

		for(var i = 0; i<dailyBookings.length;i++){
			var startTime = dailyBookings[i].bookingDate + "T" + dailyBookings[i].startTime + "Z";
			var endTime = dailyBookings[i].bookingDate + "T" + dailyBookings[i].endTime + "Z";
			if(dailyBookings[i].hrsSource != "Faculty" && dailyBookings[i].hrsSource != "Admin"){
				dailyBookings[i].hrsSource = "student";
			}


			var newStartDate = new Date(startTime);
			var newEndDate = new Date(endTime);
 
			var colour = bookingCommService.eventColourPicker(dailyBookings[i].reason);

			formattedDailyBookings[i] =  
			{title:dailyBookings[i].reason, 
			 start:newStartDate.toISOString(),
			 end:newEndDate.toISOString(),
			 allDay:false, 
			 bookingID:dailyBookings[i].bookingID, 
			 building: selectedBuilding, 
			 roomNum: dailyBookings[i].roomID,
			 numPeople:dailyBookings[i].numParticipants,
			 description:dailyBookings[i].otherDesc,
			 color:colour
			};

			if(userType != "student" && userType != "nonbooking"){ //user name only for Faculty & Admin users
				formattedDailyBookings[i].userName = dailyBookings[i].firstName + " " + dailyBookings[i].lastName;
				formattedDailyBookings[i].bookingUserType = dailyBookings[i].hrsSource.toLowerCase();
			}
			if(userType == "admin" || userType == "faculty"){ //email
				formattedDailyBookings[i].userEmail = dailyBookings[i].uID + "@queensu.ca";
			}
		}
		
		return formattedDailyBookings;
	}

	//loop through the object of weekly bookings for all rooms in a building and format it appropriately
	bookingCommService.formatBuildingWeeklyBookings = function(buildingWeeklyBookings, userType){
		var formattedBookings = [];
		for(var key in buildingWeeklyBookings){
			formattedBookings[key] = bookingCommService.convertToExpectedFormat(buildingWeeklyBookings[key], userType);
		}

		return formattedBookings;

	}
	//cancel a single booking 
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

	//cancel all bokings asscoiated with a reccurring booking
	bookingCommService.cancelAllRecurringBookings = function(recurringID){
		var data = {recurringID:recurringID};
		var promisePost =  $http.post('src/php/bookings/cancelRecurring.php', data)
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
			stands : searchCriterai.contents["Music Stands"],
			mirror : searchCriterai.contents["Mirror"],
			chairs : searchCriterai.contents["Chairs"]
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

	//retrieves all the users bookings that occur after the current date and time
	bookingCommService.retrieveUserBookings = function(uID){
		var data = {uID:uID}
		var promisePost =  $http.post('src/php/bookings/getUserBookings.php', data)
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
			var startTime = dailyBookings[i].bookingDate + "T" + dailyBookings[i].startTime;
			var endTime = dailyBookings[i].bookingDate + "T" + dailyBookings[i].endTime;


			formattedDailyBookings[i] =  
			{reason:dailyBookings[i].reason, 
			 start:startTime,
			 end:endTime,
			 date:dailyBookings[i].bookingDate,
			 bookingID:dailyBookings[i].bookingID, 
			 building: dailyBookings[i].building, 
			 roomNum: dailyBookings[i].roomID,
			 keyRequired:dailyBookings[i].reqKey.toLowerCase()
			};
		}
		return formattedDailyBookings;
	}

	bookingCommService.convertRecurringUserBookingsToExpectedFormat = function(bookings){
		var formattedDailyBookings = [];

		for(var i = 0; i<bookings.length;i++){

			formattedDailyBookings[i] =  
			{building: bookings[i].building, 
			 dayOfWeek:bookings[i].dayOfWeek,
			 recurringID:bookings[i].recurringID,
			 roomNum: bookings[i].room,
			 time: bookings[i].time,
			 reason:bookings[i].reason,
			 weeksRemaining:bookings[i].weeksRemaining, 
			 keyRequired:bookings[i].reqKey, 
			};

			formattedDailyBookings[i].recurringBooking = [];
			for(var j = 0; j<bookings[i].bookings.length;j++){
				formattedDailyBookings[i].recurringBooking[j] = [];
				formattedDailyBookings[i].recurringBooking[j] = 
				{bookingID:bookings[i].bookings[j][0],
				 date:bookings[i].bookings[j][1],
				 recurringID:bookings[i].recurringID
				};
			}

		}
		return formattedDailyBookings;

	}

	//retirve the hours remaining for a week.
	//determines the week based on the date provided and the week it is within
	bookingCommService.hoursRemaining = function(date){
		var data = {date:date};
		var promisePost =  $http.post('src/php/bookings/hoursRemaining.php', data)
		    .success(function(data) {
		    })
		    .error(function(responseDate) { //request to the php scirpt failed
		    	console.log(responseDate);
		    });
		 return promisePost;
	}
	
	bookingCommService.getRoomInfo = function(info){

		var promisePost = $http.post('src/php/bookings/getRoomInfo.php', info)
		    .success(function(data, status) {
		    	console.log("getRoomInfo", data);
		    	return data;
		    })
		    .error(function(data, status) {
		    	return 'error';   
		    });

		return promisePost;
	}

	return bookingCommService;
}