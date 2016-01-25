angular
.module('mainApp')
.service('SharedVariableService', SharedVariableService);

//communication Service
function SharedVariableService(CommService){
	var sharedVariableService = {};

	sharedVariableService.userType = "admin";
	sharedVariableService.buildings = []; //array of building names
	sharedVariableService.buildingInfo = {}; //array of building names and hours of operation
	sharedVariableService.buildingAndRooms = []; //array of building and their associated rooms


	initialLoad = function(){
		CommService.initialRetrival()
			.then(function(response){
				createBuildingAndRoomsLists(response);
			},
			function(err){
				q.reject(err);
			});
	}
	initialLoad();

	createBuildingAndRoomsLists = function(info){
		for (var key in info) {
			sharedVariableService.buildings.push(key);
			sharedVariableService.buildingAndRooms[key] =info[key].rooms;
			sharedVariableService.buildingInfo[key] = {closeTime:info[key].closeTime, openTime:info[key].openTime,}
		}
	}



	return sharedVariableService;


}

