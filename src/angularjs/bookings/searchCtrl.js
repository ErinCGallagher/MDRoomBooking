angular
.module('mainApp')
.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, uiCalendarConfig, $uibModal, $log, SharedVariableService, SearchService) {
	$scope.pageClass = 'search'; //used to change pages in index.html
	$scope.buildings = SharedVariableService.buildings;
  $scope.selectedBuilding = SharedVariableService.defaultBuilding;
  $scope.contents=["Upright Piano", "Grand Piano", "Music Stands", "Mirror", "Chairs"];
  
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
    $scope.makeTransparent = true;
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
      //must set calRender to true here or else date won't change
      $scope.calRender = true;
      uiCalendarConfig.calendars.myCalendar.fullCalendar( 'gotoDate', selectedDate );
      
      SearchService.search($scope.selectedBuilding,selectedDate,startTime,endTime,selectedContents)
				.then(function(queryResults){
					$scope.searchResults = false;
          console.log($scope.events);
					
					if(Object.keys(queryResults).length == 0){
						$scope.searchResults = true;
					}
          else{
            $scope.closeAlert(0);
            alert = { type: 'success', msg: "Results found for your search!!"};
            $scope.alerts.push(alert);
            $scope.makeTransparent = false;
          }
          
          
					$scope.calRender = SearchService.calRender;
          uiCalendarConfig.calendars.myCalendar.fullCalendar( 'gotoDate', selectedDate );
          selectTab();
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

    selectTab = function(){
      $scope.selectedTab = SearchService.roomTabs[0];
    for(var key in $scope.tabs){
        if ($scope.tabs[key].title ==  $scope.selectedTab.title){
          $scope.tabs[key].active = true;
        }else{
          $scope.tabs[key].active = false;
        }
      }
  }


  //CALENDAR
	$scope.calRender = SearchService.calRender;

     $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(0, $scope.alerts.length);
  };

  //called when emtpy calendar timeslot is selected
  $scope.bookRoomInCalendar = function(date, jsEvent, view){
    //ensure this user cannot book if not in drama or music
    if (SharedVariableService.userType != "nonbooking"){

      $scope.day = date.format("YYYY-MM-DD h:mm z");

      var makeBookingPopupInstance = $uibModal.open({
        templateUrl: 'makeBookingPopup.html',
        controller: 'MakeBookingPopupCtrl',
        backdrop: 'static',
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
      backdrop: 'static',
      resolve: {
        booking: function(){
          return date;
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
      views: {
        agendaDay: { // name of view
            columnFormat: 'dddd, MMM DD, YYYY'
            // other view-specific options here
        }
    },

      dayClick : $scope.bookRoomInCalendar,
      eventClick: $scope.viewBookingInformation,
    }
  };

};

