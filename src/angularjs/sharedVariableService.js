angular
.module('mainApp')
.service('SharedVariableService', SharedVariableService);

//communication Service
function SharedVariableService(){
	var sharedVariableService = {};

	sharedVariableService.userType = "admin";

	return sharedVariableService;


}

