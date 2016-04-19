//written by Erin Gallagher
angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService, $q, SharedVariableService){

	var bookingsService = {};
	bookingsService.selectedBuilding = "Harrison LeCaine Hall"; //default
	bookingsService.selectedroom = "HLH 102"; //default
	bookingsService.weeklyBookings = []; //for a specific room
	bookingsService.RoomTabs = [];
	var buildingWeeklyBookings = []; //for the entire building

	//retrieves the daily bookings given a date
	//called when the page first loads
	bookingsService.getWeeklyBookings = function(start, end, building){
		bookingsService.selectedBuilding = building;
		//call communication Service
		CommService.getWeeklyBookingsFromDb(start, end, bookingsService.selectedBuilding, SharedVariableService.userType)
			.then(function(retrievedBookings){
				bookingsService.weeklyBookings.length = 0;
				buildingWeeklyBookings = retrievedBookings;

				bookingsService.setUpRoomsWeeklyEvents();
				
			},
			function(err){
				alert("could not retrieve daily bookings from database");
			});
	}

	bookingsService.setUpRoomTabs =function(){
		bookingsService.RoomTabs.splice(0,bookingsService.RoomTabs.length);

		var buildingRooms = [];
		
		//this way retrieves the room ids and then the will get the data
		if (SharedVariableService.buildingAndRooms[bookingsService.selectedBuilding] != undefined){
            buildingRooms = SharedVariableService.buildingAndRooms[bookingsService.selectedBuilding];
		}

		var numRooms = buildingRooms.length;
		if(numRooms == 0){
			return false; //don't render the calendar because there are no rooms
		}
		for(var i = 0; i<numRooms; i++){
			bookingsService.RoomTabs.push({title:buildingRooms[i]});
		}
		return true;
	}

	//remove all current events in weeklyBookings and 
	//replace with events for the selected room
	bookingsService.setUpRoomsWeeklyEvents = function(){
		var numEvents = bookingsService.weeklyBookings.length;
		bookingsService.weeklyBookings.splice(0,numEvents);
		//ensure the room number exsists in the building
		if(buildingWeeklyBookings[bookingsService.selectedroom] !=  undefined){
			for(var i = 0; i<buildingWeeklyBookings[bookingsService.selectedroom].length; i++){
				bookingsService.weeklyBookings.push(buildingWeeklyBookings[bookingsService.selectedroom][i]);
			}
		}
	}



	//retirve booking information from the database
	bookingsService.getBookingInformation = function(bookingID){
		var q = $q.defer();
		CommService.getBookingInformation(bookingID)
			.then(function(bookingInfo){
				q.resolve(bookingInfo);
			},
			function(err){
				alert("error with PHP script Booking Service line 104");
				q.reject();
			});
		return q.promise;
	}

	//return an array with the list of possible durations given a booking start time
	//used for the duration dropdown in the popup
	bookingsService.getPossibleDurations = function(startTime){
		for(var i=0; i<bookingsService.weeklyBookings.length; i++){
			if(bookingsService.weeklyBookings[i].start >= startTime){

			}
		}
		return bookingInfo;
	}

	//sends info to database to book a room
	//waits until a successful or non-successful response is returned
	//newBookingInfo may be an array with all the attributes
	bookingsService.bookRoom = function(newBookingInfo){
		var roomInformation = {};
		var q = $q.defer();
		//ensures that if a building or room change happens it does not impact current booking
		var room = bookingsService.selectedroom;
		//determine if there are conflicts
		if(bookingsService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list
			CommService.bookRoomInDB(newBookingInfo)
				.then(function(bookingID){
					q.resolve(true);
					newBookingInfo.bookingID = bookingID;
					newBookingInfo.userName = SharedVariableService.name;
					newBookingInfo.userEmail = SharedVariableService.netID + "@queensu.ca";
					newBookingInfo.color = CommService.eventColourPicker(newBookingInfo.title);
					buildingWeeklyBookings[room].push(newBookingInfo);
					if(bookingsService.selectedroom == room){ //if the room has changed don't add it
						bookingsService.weeklyBookings.push(newBookingInfo);
					}
				},
				function(errorStatus){
					q.reject(errorStatus);
				});
		}
		else{
			//there is a booking conflict
			q.reject("Your booking could not be completed because it conflicted with another booking");
		}
		return q.promise;
	}

	//
	bookingsService.bookRoomRecurring = function(newBookingInfo){
		var roomInformation = {};
		var q = $q.defer();
		//ensures that if a building or room change happens it does not impact current booking
		var room = bookingsService.selectedroom;
		//determine if there are conflicts
		if(bookingsService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list
			CommService.bookRoomRecurrInDB(newBookingInfo)
				.then(function(failedSuceededBookings){
					q.resolve(failedSuceededBookings);
					newBookingInfo.bookingID = failedSuceededBookings.bookingID;
					newBookingInfo.userName = SharedVariableService.name;
					newBookingInfo.userEmail = SharedVariableService.netID + "@queensu.ca";
					newBookingInfo.color = CommService.eventColourPicker(newBookingInfo.title);
					buildingWeeklyBookings[room].push(newBookingInfo);
					if(bookingsService.selectedroom == room){ //if the room has changed don't add it
						bookingsService.weeklyBookings.push(newBookingInfo);
					}
				},
				function(errorStatus){
					q.reject(errorStatus);
				});
		}
		else{
			//there is a booking conflict
			q.reject("Your booking could not be completed because it conflicted with another booking");
		}
		return q.promise;

	}

	//calculate the end timestamp given the selected duration and the startTimestamp
	bookingsService.calclEndTime = function(durations, selectedDuration, startTimestamp){
	    var durationHours = 0;
	    for(var i=0; i<durations.length; i++) {
	      if (selectedDuration == durations[i]){
	        durationHours = (i+1) * 0.5;
	      }
	    }

	    return moment(startTimestamp).add(durationHours, 'h');
  }

  //convert the offset from local to UTC time
  //return an integer that represents the UTC offset from the local time
  bookingsService.generateOffset = function(timestamp){
  	//date manipulation crap
	var jsDate = new Date(timestamp); //converts to javascript date object
	var offset = jsDate.getTimezoneOffset() * 60000; //retrieves offset from utc time
	return offset;
  }

	//convert javascript date to UTC time by determining offset from local
	//used for time picker display because all data is supposed to be timezone ambiguous
  	bookingsService.convertoUTCForDisplay = function(timestamp){
  		//date manipulation crap
	  	var jsDate = new Date(timestamp); //converts to javascript date object
	  	var offset = bookingsService.generateOffset(timestamp);

	  	var selectedTime = jsDate.getTime(); //retrieves the time selected
	  	var utc = selectedTime + offset; //convert to UTC time by adding the offset
	  	var TimeZoned = new Date(utc) //create new date object with this time

	  	return TimeZoned;
  	}

	//convert javascript date back to local from UTC time
	//do this before sending data back to the database
	//the database is going to convert this back to its version of UTC time 
  	bookingsService.convertFromUTCtoLocal = function(timestamp){
  		//date manipulation crap
	  	var jsDate = new Date(timestamp); //converts to javascript date object
	  	var offset = bookingsService.generateOffset(timestamp);

	  	var selectedTime = jsDate.getTime(); //retrieves the time selected
	  	var utc = selectedTime - offset; //convert to UTC time by adding the offset
	  	var TimeZoned = new Date(utc) //create new date object with this time

	  	return TimeZoned;
  	}

	//confirms that the booking does not conflict with other bookings
	//return true if no conflicts
	//return false if there are conflicts
	bookingsService.confirmNoBookingConflicts = function(potentialStartTime, potentialEndTime){

		var len = bookingsService.weeklyBookings.length;

		//loop through the bookings for that day
		for(var i=0; i<bookingsService.weeklyBookings.length; i++){
			//isAfter, isBefore & IsSame does not work unless moment object is in utc mode
			var checkStart = moment.utc(bookingsService.weeklyBookings[i].start);
			var checkEnd = moment.utc(bookingsService.weeklyBookings[i].end);

			if((checkStart).isSame(potentialStartTime)){
				return false;
			}
			//if the start time is in between
			//example: 11-12:30 booked, try and book 11:30-12 
			else if(potentialStartTime.isAfter(checkStart)
				&& potentialEndTime.isBefore(checkEnd) ){
				return false;
			}
			//if the start time is before but the potentialEndtime is during a booking
			else if(potentialEndTime.isAfter(checkStart) 
				&& (potentialEndTime.isBefore(checkEnd) || potentialEndTime.isSame(checkEnd) ) ){
				return false;
			}
			//start time is before and end time is after
			else if (potentialStartTime.isBefore(checkStart) && ( potentialEndTime.isAfter(checkEnd) || potentialEndTime.isSame(checkEnd))){
				return false;
			}
		}

		return true; //no bookings or they all occur before your booking do whatever you want
	
	}

	//remove bookings from calendar display
	bookingsService.updateDisplayBookings = function(bookingID, room){
		for (var i = 0; i < buildingWeeklyBookings[room].length; i++){
			if(buildingWeeklyBookings[room][i].bookingID == bookingID){
				//remove the booking
				buildingWeeklyBookings[room].splice(i,1);
			}
		}
		//remove it from the current display as well
		if(bookingsService.selectedroom ==  room){
			for (var i = 0; i < bookingsService.weeklyBookings.length; i++){
				if(bookingsService.weeklyBookings[i].bookingID == bookingID){
					//remove the booking
					bookingsService.weeklyBookings.splice(i,1);
				}
			}
		}
	}

	//cancels a booking
	bookingsService.cancelBooking = function(bookingID,startTime) {
		var room = bookingsService.selectedroom;
		var q = $q.defer();
				console.log(startTime);
		CommService.cancelBooking(bookingID,startTime)
			.then(function(){
				q.resolve();
				bookingsService.updateDisplayBookings(bookingID, room);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//cancel all recurring bookings
	bookingsService.cancelAllRecurringBookings = function(reccurringID){
		var room = bookingsService.selectedroom;
		var q = $q.defer();
		CommService.cancelAllRecurringBookings(reccurringID)
			.then(function(){
				q.resolve();
				bookingsService.updateDisplayBookings(reccurringID, room);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//determine the current semester and provide a max number of reccuring bookings
	//note january is 00, feb is 01 etc..
	bookingsService.determineMaxReccuringWeeks = function(reccuringStartDate){

		var oneDay = 24*60*60*1000
		var startDate = new Date(reccuringStartDate);
		var currentDate = new Date();
		var semesterTwoYear = currentDate.getFullYear();
		var currentSemester = "fall";

		//if the current Month is between Setempber & Decemeber Inclusive
		//it's first semester 
		if(currentDate.getMonth() >= 8 && currentDate.getMonth() <= 11){
			semesterTwoYear = currentDate.getFullYear()+1; //semester 2 will be next year
			currentSemester = "fall";
		}
		//if the current Month is between January & April Inclusive
		//it's second semester 
		else if(currentDate.getMonth() >= 0 && currentDate.getMonth() <= 3){
			semesterTwoYear = currentDate.getFullYear(); //currently in smester 2
			currentSemester = "winter";
		}
		//if the current Month is between May & August Inclusive
		//it's summer semester
		else{
			semesterTwoYear = currentDate.getFullYear();
			currentSemester = "summer";
		}
		
		var startSemesterOne = new Date(currentDate.getFullYear(),08,01); //Sept 1st
		var endSemesterOne = new Date(currentDate.getFullYear(),11,31); //December 31st
		var startSemesterTwo = new Date(semesterTwoYear,00,01); //Jan 1st
		var endSemesterTwo = new Date(semesterTwoYear,03,31); //April 31st
		var startSemesterSummer = new Date(semesterTwoYear,03,01); //May 1st
		var endSemesterSummer = new Date(semesterTwoYear,07,31); //August 31st

		var fallEarlyBookingDate = new Date(currentDate.getFullYear(),07,1); //August 1st
		var WinterEarlyBookingDate = new Date(currentDate.getFullYear(),11,1); //December 1st
		var SummerEarlyBookingDate = new Date(currentDate.getFullYear(),03,1); //April 1st

		//can book reccuring booking for 1 year from today
		if(SharedVariableService.userType == "admin"){
			var numWeeks = 52;

		}
		//determine the semester for room booking hours
		//if it's 1 month from the next semester they can start booking in advance
		else{//if faculty, can book reccuring booking for the current semester
			if(currentSemester == "fall"){
				var numDaysBetween = Math.round(Math.abs(startDate.getTime() - endSemesterOne.getTime())/oneDay);
				var numWeeks = Math.floor(numDaysBetween/7);
				//they can start booking for the winter semester
				//it's December 1st
				if(currentDate.getMonth() == 11 && currentDate.getDate() >= 1){
					var numDaysBetween = Math.round(Math.abs(WinterEarlyBookingDate.getTime() - endSemesterTwo.getTime())/oneDay);
					var extraWeeks = Math.floor(numDaysBetween/7);
					numWeeks += extraWeeks;
				}
			}
			else if(currentSemester == "winter"){
				var numDaysBetween = Math.round(Math.abs(startDate.getTime() - endSemesterTwo.getTime())/oneDay);
				var numWeeks = Math.floor(numDaysBetween/7);

				//they can start booking for the summer semester
				//it's April 1st
				if(currentDate.getMonth() == 3 && currentDate.getDate() >= 1){
					var numDaysBetween = Math.round(Math.abs(SummerEarlyBookingDate.getTime() - endSemesterSummer.getTime())/oneDay);
					var extraWeeks = Math.floor(numDaysBetween/7);
					numWeeks += extraWeeks;
				}
			}
			else{ //currentSemester == "summer"
				console.log("summer");
				var numDaysBetween = Math.round(Math.abs(startDate.getTime() - endSemesterSummer.getTime())/oneDay);
				var numWeeks = Math.floor(numDaysBetween/7);

				//they can start booking for the fall semester
				//it's August 1st
				if(currentDate.getMonth() == 7 && currentDate.getDate() >= 1){
					var numDaysBetween = Math.round(Math.abs(fallEarlyBookingDate.getTime() - endSemesterOne.getTime())/oneDay);
					var extraWeeks = Math.floor(numDaysBetween/7);
					numWeeks += extraWeeks;
				}
			}
		}

		return numWeeks; //return the max number of weeks the user can reccur over
	}
	
	bookingsService.getRoomInfo = function(info) {
		var q = $q.defer();
		CommService.getRoomInfo(info)
			.then(function(info) {
				q.resolve(info);
			},
			function(err) {
				alert("could not retrieve room from database");
				q.resolve(err);
			});
		return q.promise;
	}
	
	//determine possible durations
	return bookingsService;
}