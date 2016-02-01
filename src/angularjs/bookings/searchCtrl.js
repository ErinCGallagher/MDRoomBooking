angular
.module('mainApp')
.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, SharedVariableService, BookingsService) {
	$scope.pageClass = 'search'; //used to change pages in index.html
	$scope.buildings = SharedVariableService.buildings;
    $scope.selectedBuilding = "Harrison LeCaine Hall";
    $scope.contents=["Upright Piano", "Grand Piano", "Open Space", "Mirror", "Projector"];

  	$scope.hstep = 1;
 	$scope.mstep = 30;

	$scope.ismeridian = true;

	var dateTime = new Date();
	var TimeZoned = BookingsService.convertoUTCForDisplay(dateTime);

	  //add 30 minutes because the minimum booking time is 30 minutes
	var TimeZoned = TimeZoned.setMinutes(TimeZoned.getMinutes() + 30)

	  //local time with UTC offset (so actually UTC time but javascript wants it to be local)
	$scope.myStartTime = TimeZoned; //displayed to user 
	$scope.myEndTime = TimeZoned; //displayed to user 

	$scope.minTime = TimeZoned; //min time restriction

	$scope.search = function(){
		BookingsService.search();
	}

};

