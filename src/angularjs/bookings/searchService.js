angular
.module('mainApp')
.service('SearchService', SearchService);
function SearchService(CommService, BookingsService, $q, SharedVariableService){

	var searchService = {};

	searchService.searchResults = [];
	searchService.selectedSearchRoom = "HLH 102";
	var buildingSearchResults = [];
	searchService.minTime = "09:00:00";
	searchService.maxTime = "11:00:00";

	searchService.setTimes = function(){
		searchService.minTime = "09:00:00";
		searchService.maxTime = "12:00:00";
	}

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
				searchService.setUpRoomsWeeklyEvents()
			},
			function(err){
				q.reject();
			});
		return q.promise;
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