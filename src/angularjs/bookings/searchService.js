angular
.module('mainApp')
.service('SearchService', SearchService);
function SearchService(CommService, BookingsService, $q, SharedVariableService){

	var searchService = {};

	searchService.searchResults = [];
	searchService.selectedBuilding = "Harrison LeCaine Hall";
	searchService.selectedSearchRoom = "HLH 102";
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
				q.resolve();
				buildingSearchResults = response;
				searchService.calRender = searchService.setUpRoomTabs();
				searchService.setUpRoomsWeeklyEvents()
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	searchService.setUpRoomTabs =function(){
		searchService.roomTabs.splice(0,searchService.roomTabs.length);

		var buildingRooms = [];
		
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
	searchService.setUpRoomsWeeklyEvents = function(){
		var numEvents = searchService.searchResults.length;
		searchService.searchResults.splice(0,numEvents);
		//ensure the room number exsists in the building
		if(buildingSearchResults[searchService.selectedSearchRoom] !=  undefined){
			for(var i = 0; i<buildingSearchResults[searchService.selectedSearchRoom].length; i++){
				searchService.weeklyBookings.push(buildingSearchResults[searchService.selectedSearchRoom][i]);
			}
		}
		console.log(searchService.searchResults);
	}

	searchService.convertoUTCForDisplay = function(timeStamp){
		return BookingsService.convertoUTCForDisplay(timeStamp);
	}

	searchService.convertFromUTCtoLocal = function(timeStamp){
		return BookingsService.convertFromUTCtoLocal(timeStamp);
	}

	return searchService;
}