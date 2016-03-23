angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal,$compile, $log, $location, uiCalendarConfig, BookingsService, SharedVariableService){

  $scope.buildings = SharedVariableService.buildings;
  $scope.selectedBuilding = SharedVariableService.defaultBuilding;
  $scope.events = BookingsService.weeklyBookings;
  $scope.pageClass = 'calendar'; //used to change pages in index.html

  //stores the current events displayed on the calendar
  //updated by the bookingServce
  $scope.eventSources = [$scope.events]; 

  // DATE PICKER
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.selectedDate = BookingsService.convertoUTCForDisplay( new Date() ); //initialy current date
  $scope.format = 'EEEE, MMM d, yyyy'; //Friday, Feb 5, 2016

  $scope.$watch('selectedDate', function() {
    if(uiCalendarConfig.calendars.myCalendar != null){
      console.log($scope.selectedDate);
      uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.selectedDate);
      selectTab();
    }
  });
  
  $scope.open = function() {
    $scope.popup1.opened = true;
  };

  $scope.popup1 = {
    opened: false
  };

  //change the previous calendar date
  $scope.previousDate = function(){
      uiCalendarConfig.calendars.myCalendar.fullCalendar('prev');
      selectTab();
  }

  //change the next calendar date
  $scope.nextDate = function(){
      uiCalendarConfig.calendars.myCalendar.fullCalendar('next');
      selectTab();
  }

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
        backdrop: 'static',
        resolve: {
          building: function () {
            return $scope.selectedBuilding;
          },
          roomNum: function () {
            return BookingsService.selectedroom;
          },
          dateTime: function () {
            return date;
          },
          sourcePage: function () {
            return "bookings";
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
        return "bookings";
      }
    }
  });
  viewBookingPopupInstance.result.then(function (alert) {
    $scope.alerts.push(alert);
  }, function () {
    $log.info('Modal dismissed at: ' + new Date());
  });

};

    $scope.eventRender = function(event, element, view) { 

     //element.attr({'tooltip': event.title,'tooltip-append-to-body': true});
    if(event.title == "Performance" || event.title == "Course"){
      element.find('.fc-title').append("<div class='desc'>" + event.description + "</div>");
      $compile(element)($scope);
    }
  };


	/* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false, //allows you to drag events
      defaultView:'agendaWeek',
      minTime :"07:00:00", //earliest time to display
      maxTime : "23:00:00",
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
      viewRender: function(view) {
        //render the date only after the calendar has fully loaded
        var week = uiCalendarConfig.calendars.myCalendar.fullCalendar( 'getView' );
        var start = week.start;
        var end = week.end;
        $scope.date = start.format("MMM D, YYYY") + " - "+ end.format("MMM D, YYYY");
        //retirve bookings for default room Harrison-LeCaine Hall
        BookingsService.selectedBuilding = $scope.selectedBuilding;
        $scope.calRender = BookingsService.setUpRoomTabs();
        BookingsService.getWeeklyBookings(start, end, $scope.selectedBuilding);
      },

      dayClick : $scope.bookRoomInCalendar,
      eventClick: $scope.viewBookingInformation,
      eventRender: $scope.eventRender,
    },
  };



  $scope.calRender = false; //if there are no rooms for the building hide the calendar
  //retirves the selected building when the go button is pressed
  //sets the selected building
  $scope.retrieveRooms = function(){
    var week = uiCalendarConfig.calendars.myCalendar.fullCalendar( 'getView' );
    BookingsService.selectedBuilding = $scope.selectedBuilding;
    BookingsService.getWeeklyBookings(week.start, week.end, $scope.selectedBuilding);
    $scope.calRender = BookingsService.setUpRoomTabs();
    BookingsService.setUpRoomsWeeklyEvents();
  }

  //detects when a tab is changed and provides the room id
  $scope.changeRoom=function(roomID){
    $scope.selectedTab = roomID;
    BookingsService.selectedroom = roomID;
    BookingsService.setUpRoomsWeeklyEvents();
  }

  /*tabs*/
  $scope.tabs = BookingsService.RoomTabs;
  $scope.selectedTab = BookingsService.RoomTabs[0];

  selectTab = function(){
    for(var key in $scope.tabs){
        if ($scope.tabs[key].title ==  $scope.selectedTab){
          $scope.tabs[key].active = true;
        }else{
          $scope.tabs[key].active = false;
        }
      }
  }

};




