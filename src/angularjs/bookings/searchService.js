angular
.module('mainApp')
.service('SearchService', SearchService);
function SearchService(CommService, BookingsService, $q, SharedVariableService){

	var searchService = {};

	searchService.roomSearchResults = [];
	searchService.selectedBuilding = "Harrison LeCaine Hall";
	searchService.selectedSearchRoom = "HLH 102";
	searchService.calRender = false;
	searchService.calRender = false;
	var buildingSearchResults = [];
	searchService.roomTabs = [];
	searchService.minTime = "07:30:00";
	searchService.maxTime = "22:00:00";

	searchService.search = function(selectedBuilding,selectedDate,startTime,endTime,selectedContents){
		var searchCriteria = {
			building : selectedBuilding,
			startTime : searchService.convertFromUTCtoLocal(startTime),
			endTime : searchService.convertFromUTCtoLocal(endTime),
			contents : selectedContents,
			date : selectedDate
		}
		var q = $q.defer();
		CommService.search(searchCriteria)
			.then(function(response){
				buildingSearchResults = response;
				searchService.calRender = searchService.setUpRoomTabs();
				searchService.setUpRoomsEvents();
				q.resolve(response);
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
		var numEvents = searchService.roomSearchResults.length;
		searchService.roomSearchResults.splice(0,numEvents);
		//ensure the room number exsists in the building
		if(buildingSearchResults[searchService.selectedSearchRoom] !=  undefined){
			for(var i = 0; i<buildingSearchResults[searchService.selectedSearchRoom].length; i++){
				searchService.roomSearchResults.push(buildingSearchResults[searchService.selectedSearchRoom][i]);
			}
		}
		return searchService.roomSearchResults;
	}

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