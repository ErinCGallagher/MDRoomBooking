angular
.module('mainApp')
.service('BookingsService', BookingsService);

function BookingsService(CommService, $q){

	var bookingsService = {};
	bookingsService.selectedBuilding = "Harrison LeCaine Hall"; //default
	bookingsService.selectedroom = "HLH 102"; //default
	bookingsService.weeklyBookings = []; 
	bookingsService.RoomTabs = [];
	var buildingWeeklyBookings = [];
	var rooms = CommService.getRooms();

	bookingsService.setUpRoomTabs =function(){
		bookingsService.RoomTabs.splice(0,bookingsService.RoomTabs.length);

		var buildingRooms = [];
		//this way retrieves the room ids and then the will get the data
		if (rooms[bookingsService.selectedBuilding] != undefined){
			buildingRooms = rooms[bookingsService.selectedBuilding];
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
	//replace with events for the selected rom
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

	//retrieves the daily bookings given a date
	//called when the page first loads
	bookingsService.getWeeklyBookings = function(start, end){
		//call communication Service
		CommService.getWeeklyBookingsFromDb(start, end, bookingsService.selectedBuilding)
			.then(function(retrievedBookings){
				bookingsService.weeklyBookings.length = 0;
				buildingWeeklyBookings = retrievedBookings;

				bookingsService.setUpRoomsWeeklyEvents();
				
			},
			function(err){
				alert("could not retrieve daily bookings from database");
			});
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
					buildingWeeklyBookings[room].push(newBookingInfo);
					bookingsService.weeklyBookings.push(newBookingInfo);
				},
				function(err){
					q.reject(false);
				});
		}
		else{
			//don't add and inform the user there was an error
			q.reject(false);
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

  	//given a date, convert it to UTC time but display it as local so the javascript doesn't manipulate it
  	//return a javascript date object that is the current UTC time
  	bookingsService.convertoUTCForDisplay = function(timestamp){
  		//date manipulation crap
	  	var jsDate = new Date(timestamp); //converts to javascript date object
	  	var offset = bookingsService.generateOffset(timestamp);

	  	var selectedTime = jsDate.getTime(); //retrieves the time selected
	  	var utc = selectedTime + offset; //convert to UTC time by adding the offset
	  	var TimeZoned = new Date(utc) //create new date object with this time

	  	return TimeZoned;
  	}

  	//convert javascript date back to UTC time from local
  	//return a javascript date object that is the current UTC time
  	bookingsService.convertoUTCForDisplayMinus = function(timestamp){
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
			var checkStart = moment.utc(bookingsService.convertoUTCForDisplayMinus(bookingsService.weeklyBookings[i].start));
			var checkEnd = moment.utc(bookingsService.convertoUTCForDisplayMinus(bookingsService.weeklyBookings[i].end));

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

	//determine possible durations
	return bookingsService;
}