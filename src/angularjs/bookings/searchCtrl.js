angular
.module('mainApp')
.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, SharedVariableService, BookingsService) {
	$scope.pageClass = 'search'; //used to change pages in index.html
	$scope.buildings = SharedVariableService.buildings;
    $scope.selectedBuilding = "Harrison LeCaine Hall";
    $scope.contents=["Upright Piano", "Grand Piano", "Open Space", "Mirror", "Projector"];

  	// time picker config config
  	$scope.hstep = 1;
 	$scope.mstep = 30;
	$scope.ismeridian = true; //12 hour


	var currentDate = moment();
	var startTimeZoned = new Date();
	var endTimeZoned = new Date();

	//set starting hours and minutes for time pickers
	startTimeZoned.setHours(09);
	startTimeZoned.setMinutes(00);
	startTimeZoned.setSeconds(00);
	endTimeZoned.setHours(11);
	endTimeZoned.setMinutes(00);
	endTimeZoned.setSeconds(00);

	$scope.myStartTime = startTimeZoned; //displayed to user 
	$scope.myEndTime = endTimeZoned; //displayed to user


	$scope.search = function(){
		if($scope.myEndTime < $scope.myStartTime ){
			alert("your end time cannot be before your start time");
		}
		else{
			var startTime = $scope.myStartTime;
			var endTime = $scope.myEndTime;
			BookingsService.search($scope.selectedBuilding,startTime,endTime);
		}
	}

};

