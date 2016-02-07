angular
.module('mainApp')
.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, uiCalendarConfig, SharedVariableService, SearchService) {
	$scope.pageClass = 'search'; //used to change pages in index.html
	$scope.buildings = SharedVariableService.buildings;
    $scope.selectedBuilding = "Harrison LeCaine Hall";
    $scope.contents=["Upright Piano", "Grand Piano", "Open Space", "Mirror", "Projector"];
    
    $scope.events = SearchService.roomSearchResults;
  	$scope.eventSources = [$scope.events]; 

  	$scope.$watch('events', function(events) {
	    console.log($scope.events);

 	});

 	$scope.$watch('eventSources', function(eventSources) {
	    console.log($scope.eventSources);

 	});

  	// DATE PICKER
  	$scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
  	};

  	$scope.selectedDate = new Date(); //initialy current date
  	$scope.minDate = new Date();
  	$scope.maxDate = new Date(2020, 5, 22);
  	$scope.format = 'EEEE, MMM d, yyyy'; //Friday, Feb 5, 2016

  	$scope.open = function() {
    	$scope.popup1.opened = true;
  	};

  	$scope.popup1 = {
    	opened: false
  	};

  	// TIME PICKER
  	// time picker config config
  	$scope.hstep = 1;
 	$scope.mstep = 30;
	$scope.ismeridian = true; //12 hour


	//var currentDate = moment();
	var startTimeZoned = new Date();
	var endTimeZoned = new Date();
	//convert to UTC time 
	startTimeZoned = SearchService.convertoUTCForDisplay(startTimeZoned); 
	endTimeZoned = SearchService.convertoUTCForDisplay(endTimeZoned);

	//set starting hours and minutes for time pickers
	startTimeZoned.setHours(09);
	startTimeZoned.setMinutes(00);
	startTimeZoned.setSeconds(00);
	endTimeZoned.setHours(11);
	endTimeZoned.setMinutes(00);
	endTimeZoned.setSeconds(00);

	$scope.myStartTime = startTimeZoned; //displayed to user 
	$scope.myEndTime = endTimeZoned; //displayed to user

	// CONTENTS CHECKBOXES
	$scope.selection = [];

	// toggle selection for a given fruit by name
	 $scope.toggleSelection = function toggleSelection(selectedContent) {
	    var idx = $scope.selection.indexOf(selectedContent);

	    // is currently selected
	    if (idx > -1) {
	      $scope.selection.splice(idx, 1);
	    }

	    // is newly selected
	    else {
	      $scope.selection.push(selectedContent);
	    }
	 };

	 createSelectedContentObject = function(){
	 	var reformattedContents = {};
	 	for(var i = 0; i < $scope.contents.length; i++){
	 		//if not selected
	 		if($scope.selection.indexOf($scope.contents[i]) == -1){
	 			reformattedContents[$scope.contents[i]] = false;
	 		}
	 		else{
	 			reformattedContents[$scope.contents[i]] = true;
	 		}
	 	}
	 	return reformattedContents;
	 }


	 var initialSearch = 0; //used to determine if this is the first search 
	$scope.search = function(){
		if($scope.myEndTime <= $scope.myStartTime ){
			alert("your end time cannot be before your start time");
		}
		else{
			var startTime = $scope.myStartTime;
			var endTime = $scope.myEndTime;
			var selectedDate = $scope.selectedDate;
			var selectedContents = createSelectedContentObject();
			SearchService.selectedBuilding = $scope.selectedBuilding;
			SearchService.search($scope.selectedBuilding,selectedDate,startTime,endTime,selectedContents)
				.then(function(){

					//weird bug where $scope is not initially updated 
					//this function must be called twice on initial load or the events won't render
					if(initialSearch == 0){
						initialSearch = 1;
						$scope.search();
					}
					
					$scope.calRender = SearchService.calRender;
				},
				function(err){
				});
		}
	}
	
	//CALENDAR
	$scope.calRender = SearchService.calRender;


	//calendar config
	/* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false, //allows you to drag events
      defaultView:'agendaDay',
      minTime :SearchService.minTime, //earliest time to display
      maxTime : SearchService.maxTime,
      timeFormat: '',
      slotEventOverlap:false,
      allDaySlot:false,
      timezone: false,
      //slotDuration:'00:30:00:00',//default
      header:{ //buttons at the top
        left: '',
        //center: 'prev, title next',
        center: '',
        right: ''
      },

      dayClick : $scope.bookRoomInCalendar,
      eventClick: $scope.viewBookingInformation,
    }
  };

  /*tabs*/
  $scope.tabs = SearchService.roomTabs;

  //detects when a tab is changed and provides the room id
  $scope.changeRoom=function(roomID){
    SearchService.selectedSearchRoom = roomID;
    SearchService.setUpRoomsEvents();
  }

  	//detect when changing tabs
  	$scope.$on("$destroy", function(){
        SearchService.calRender = false;
        SearchService.clearData();

    });

};

