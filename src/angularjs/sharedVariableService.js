angular
.module('mainApp')
.service('SharedVariableService', SharedVariableService);

//communication Service
function SharedVariableService($q, CommService){
	var sharedVariableService = {};

	sharedVariableService.userType = "admin";
	sharedVariableService.buildings = []; //array of building names
	sharedVariableService.buildingInfo = {}; //array of building names and hours of operation
	sharedVariableService.buildingAndRooms = []; //array of building and their associated rooms
	sharedVariableService.netID = "";
	sharedVariableService.initialLoadComplete = false;


	//set up all initial variables required by the program
	//by calling the inital.php script
	sharedVariableService.initialSetup = function(){
		var q = $q.defer();
		CommService.initialRetrival()
			.then(function(response){
				createBuildingAndRoomsLists(response)
				//don't resolve until the initial load has completed
				while(sharedVariableService.initialLoadComplete == false){} 

				q.resolve(); //now go to the calendar page
			},
			function(err){
				q.reject(err); //cannot complete the initial load script
			});
		return q.promise;
	}
	

	createBuildingAndRoomsLists = function(info){
		for (var key in info) {
			sharedVariableService.buildings.push(key);
			sharedVariableService.buildingAndRooms[key] =info[key].rooms;
			sharedVariableService.buildingInfo[key] = {closeTime:info[key].closeTime, openTime:info[key].openTime,}
		}
		sharedVariableService.initialLoadComplete = true;
	}



	return sharedVariableService;


}

