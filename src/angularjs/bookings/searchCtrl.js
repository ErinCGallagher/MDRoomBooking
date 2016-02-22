angular
.module('mainApp')
.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, uiCalendarConfig, $uibModal, $log, SharedVariableService, SearchService) {
	$scope.pageClass = 'search'; //used to change pages in index.html
	$scope.buildings = SharedVariableService.buildings;
  $scope.selectedBuilding = "Harrison LeCaine Hall";
  $scope.contents=["Upright Piano", "Grand Piano", "Open Space", "Mirror", "Projector"];
  
  $scope.events = SearchService.roomSearchResults;
	$scope.eventSources = [$scope.events]; 

	// DATE PICKER
	$scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
	};

	$scope.selectedDate = SearchService.convertoUTCForDisplay( new Date() ); //initialy current date
	var minDate = SearchService.convertoUTCForDisplay( new Date() );
	$scope.minDate = minDate.setDate(minDate.getDate()-1);
	$scope.maxDate = SearchService.convertoUTCForDisplay( new Date(2020, 5, 22) );
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

	 $scope.searchResults = false;

  $scope.search = function(){
		if($scope.myEndTime <= $scope.myStartTime ){
       alert = { type: 'danger', msg: "Error: Your end time cannot be before your start time"};
      $scope.alerts.push(alert);
		}
    else if($scope.selectedDate == undefined){
      alert = { type: 'danger', msg: "Error: You must supply a date before trying to search"};
      $scope.alerts.push(alert);
    }
		else{
			var startTime = $scope.myStartTime;
			var endTime = $scope.myEndTime;
			var selectedDate = $scope.selectedDate;
			var selectedContents = createSelectedContentObject();
			SearchService.selectedBuilding = $scope.selectedBuilding;
			SearchService.search($scope.selectedBuilding,selectedDate,startTime,endTime,selectedContents)
				.then(function(queryResults){
          uiCalendarConfig.calendars.myCalendar.fullCalendar( 'gotoDate', selectedDate );
          
					$scope.searchResults = false;
          console.log($scope.events);
					
					if(Object.keys(queryResults).length == 0){
						$scope.searchResults = true;
					}
          else{
            alert = { type: 'success', msg: "Results found for your search!!"};
            $scope.alerts.push(alert);
          }
          
          
					$scope.calRender = SearchService.calRender;
        },
				function(err){
				});
		}
	}

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


    //CALENDAR
	$scope.calRender = SearchService.calRender;

     $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  //called when emtpy calendar timeslot is selected
  $scope.bookRoomInCalendar = function(date, jsEvent, view){
    //ensure this user cannot book if not in drama or music
    if (SharedVariableService.userType != "nonbooking"){

      $scope.day = date.format("YYYY-MM-DD h:mm z");

      var makeBookingPopupInstance = $uibModal.open({
        templateUrl: 'makeBookingPopup.html',
        controller: 'MakeBookingPopupCtrl',
        resolve: {
          building: function () {
            return $scope.selectedBuilding;
          },
          roomNum: function () {
            return SearchService.selectedSearchRoom;
          },
          dateTime: function () {
            return date;
          },
          sourcePage: function () {
            return "search";
          }
        }
      });

      makeBookingPopupInstance.result.then(function (alert) {
        $scope.alerts.push(alert);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
    else{
      //non-booking user
      alert = { type: 'warning', msg: "You may not book rooms because you do not have room booking permissions"};
      $scope.alerts.push(alert);
    }
  }


 /* alert on eventClick */
 //called when a booking is clicked
  $scope.viewBookingInformation = function(date, jsEvent, view){

    console.log(SharedVariableService.userType);
    var viewBookingPopupInstance = $uibModal.open({
      templateUrl: 'viewBookingPopup.html',
      controller: 'ViewBookingPopupCtrl',
      resolve: {
        building: function () {
          return date.building;
        },
        roomNum: function () {
          return date.roomNum;
        },
        reason: function () {
          return date.title;
        },
        date: function () {
          return date.start.format("MMM D, YYYY");
        },
        startTime: function () {
          return date.start;
        },
        endTime: function () {
          return date.end;
        },
        bookingID: function () {
          return date.bookingID;
        },
          sourcePage: function () {
            return "search";
          }
      }
    });
    viewBookingPopupInstance.result.then(function (alert) {
      $scope.alerts.push(alert);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

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

};

