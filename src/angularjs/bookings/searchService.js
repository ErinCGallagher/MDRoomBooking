angular
.module('mainApp')
.service('SearchService', SearchService);
function SearchService(CommService, BookingsService, $q, SharedVariableService){

	var searchService = {};

	searchService.selectedBuilding = "Harrison LeCaine Hall";
	searchService.selectedSearchRoom = "HLH 102";
	searchService.roomSearchResults = [];
	searchService.roomTabs = [];
	var buildingSearchResults = [];

	searchService.calRender = false;
	searchService.minTime = "07:30:00";
	searchService.maxTime = "23:00:00";

	searchService.search = function(selectedBuilding,selectedDate,startTime,endTime,selectedContents){
		var searchCriteria = {
			building : selectedBuilding,
			startTime : searchService.convertFromUTCtoLocal(startTime),
			endTime : searchService.convertFromUTCtoLocal(endTime),
			contents : selectedContents,
			date : searchService.convertFromUTCtoLocal(selectedDate)
		}
		var q = $q.defer();
		CommService.search(searchCriteria, SharedVariableService.userType)
			.then(function(response){
				searchService.roomSearchResults.splice(0,searchService.roomSearchResults.length);
				buildingSearchResults = response;
				searchService.calRender = searchService.setUpRoomTabs();
				searchService.setUpRoomsEvents();
				q.resolve(buildingSearchResults);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//set up the room tabs displayed at top of the search page
	//no tabs means nothing matched the user's search criteria
	searchService.setUpRoomTabs =function(){
		searchService.roomTabs.splice(0,searchService.roomTabs.length);

		var buildingRooms = [];

		//no search results macth their search criteria
		if(buildingSearchResults == []){
			return false
		}
		
		//this way retrieves the room ids and then the will get the data
		if (SharedVariableService.buildingAndRooms[searchService.selectedBuilding] != undefined){
			if(buildingSearchResults != []){
			    buildingRooms = Object.keys(buildingSearchResults);
			}
		}

		var numRooms = buildingRooms.length;
		if(numRooms == 0){
			return false; //don't render the calendar because there are no rooms
		}
		for(var i = 0; i<numRooms; i++){
			searchService.roomTabs.push({title:buildingRooms[i]});
		}
		return true;
	}

	//remove all current events in searchResults and 
	//replace with events for the selected room
	searchService.setUpRoomsEvents = function(){
		searchService.roomSearchResults.splice(0,searchService.roomSearchResults.length);
		//ensure the room number exsists in the building
		if(buildingSearchResults[searchService.selectedSearchRoom] !=  undefined){
			for(var i = 0; i<buildingSearchResults[searchService.selectedSearchRoom].length; i++){
				searchService.roomSearchResults.push(buildingSearchResults[searchService.selectedSearchRoom][i]);
			}
		}

	}

	//sends info to database to book a room
	//waits until a successful or non-successful response is returned
	//newBookingInfo may be an array with all the attributes
	searchService.bookRoom = function(newBookingInfo){
		var roomInformation = {};
		var q = $q.defer();
		//ensures that if a building or room change happens it does not impact current booking
		var room = searchService.selectedSearchRoom;
		//determine if there are conflicts
		if(searchService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list
			CommService.bookRoomInDB(newBookingInfo)
				.then(function(bookingID){
					q.resolve(true);
					newBookingInfo.bookingID = bookingID;
					newBookingInfo.userName = SharedVariableService.name;
					newBookingInfo.userEmail = SharedVariableService.netID + "@queensu.ca";
					newBookingInfo.color = CommService.eventColourPicker(newBookingInfo.title);
					buildingSearchResults[room].push(newBookingInfo);
					if(searchService.selectedSearchRoom == room){ //if the room has changed don't add it
						searchService.roomSearchResults.push(newBookingInfo);
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

	searchService.bookRoomRecurring = function(newBookingInfo){
		var roomInformation = {};
		var q = $q.defer();
		//ensures that if a building or room change happens it does not impact current booking
		var room = searchService.selectedSearchRoom;
		//determine if there are conflicts
		if(searchService.confirmNoBookingConflicts(newBookingInfo.start,newBookingInfo.end)){
			//add booking to the dailyBookings list
			CommService.bookRoomRecurrInDB(newBookingInfo)
				.then(function(response){
					q.resolve(response);
					newBookingInfo.bookingID = response.bookingID;
					newBookingInfo.userName = SharedVariableService.name;
					newBookingInfo.userEmail = SharedVariableService.netID + "@queensu.ca";
					newBookingInfo.color = CommService.eventColourPicker(newBookingInfo.title);
					buildingSearchResults[room].push(newBookingInfo);
					if(searchService.selectedSearchRoom == room){ //if the room has changed don't add it
						searchService.roomSearchResults.push(newBookingInfo);
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

	//confirms that the booking does not conflict with other bookings
	//return true if no conflicts
	//return false if there are conflicts
	searchService.confirmNoBookingConflicts = function(potentialStartTime, potentialEndTime){

		var len = searchService.roomSearchResults.length;

		//loop through the bookings for that day
		for(var i=0; i<searchService.roomSearchResults.length; i++){
			//isAfter, isBefore & IsSame does not work unless moment object is in utc mode
			var checkStart = moment.utc(searchService.roomSearchResults[i].start);
			var checkEnd = moment.utc(searchService.roomSearchResults[i].end);

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

	//cancels a booking
	searchService.cancelBooking = function(bookingID,startTime) {
		var room = searchService.selectedSearchRoom;
		var q = $q.defer();
		CommService.cancelBooking(bookingID,startTime)
			.then(function(){
				q.resolve();
				searchService.updateDisplayBookings(bookingID, room);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//cancel all recurring bookings
	searchService.cancelAllRecurringBookings = function(reccurringID){
		var room = searchService.selectedSearchRoom;
		var q = $q.defer();
		CommService.cancelAllRecurringBookings(reccurringID)
			.then(function(){
				q.resolve();
				searchService.updateDisplayBookings(reccurringID, room);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//remove bookings from claendar display
	searchService.updateDisplayBookings = function(bookingID, room){
		for (var i = 0; i < buildingSearchResults[room].length; i++){
			if(buildingSearchResults[room][i].bookingID == bookingID){
				//remove the booking
				buildingSearchResults[room].splice(i,1);
			}
		}
		//remove it from the current display as well
		if(searchService.selectedSearchRoom ==  room){
			for (var i = 0; i < searchService.roomSearchResults.length; i++){
				if(searchService.roomSearchResults[i].bookingID == bookingID){
					//remove the booking
					searchService.roomSearchResults.splice(i,1);
				}
			}
		}
	}

	//called when leaving this controll and reinitilizaes all data
	searchService.clearData = function(){
		//lear room tabs
		searchService.roomTabs.splice(0,searchService.roomTabs.length);

		//clear search results
		searchService.roomSearchResults.splice(0,searchService.roomSearchResults.length);

		buildingSearchResults = [];


	}

	//convert javascript date to UTC time by determining offset from local
	//used for time picker display because all data is supposed to be timezone ambiguous
	searchService.convertoUTCForDisplay = function(timeStamp){
		return BookingsService.convertoUTCForDisplay(timeStamp);
	}

	//convert javascript date back to local from UTC time
	//do this before sending data back to the database
	//the database is going to convert this back to its version of UTC time 
	searchService.convertFromUTCtoLocal = function(timeStamp){
		return BookingsService.convertFromUTCtoLocal(timeStamp);
	}

	return searchService;
}