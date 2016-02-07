angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal, $log, $location, uiCalendarConfig, BookingsService, SharedVariableService){

  $scope.buildings = SharedVariableService.buildings;
  $scope.selectedBuilding = "Harrison LeCaine Hall";
  $scope.events = BookingsService.weeklyBookings;
  $scope.pageClass = 'calendar'; //used to change pages in index.html

  //stores the current events displayed on the calendar
  //updated by the bookingServce
  $scope.eventSources = [$scope.events]; 

  //change the previous calendar date
  $scope.previousDate = function(){
      uiCalendarConfig.calendars.myCalendar.fullCalendar('prev');
  }

  //change the next calendar date
  $scope.nextDate = function(){
      uiCalendarConfig.calendars.myCalendar.fullCalendar('next');
  }

  $scope.alerts = [];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  //called when emtpy calendar timeslot is selected
  $scope.bookRoomInCalendar = function(date, jsEvent, view){
    //ensure this user cannot book if not in drama or music
    if (SharedVariableService.userType != "nonBooking"){

      $scope.day = date.format("YYYY-MM-DD h:mm z");

      var makeBookingPopupInstance = $uibModal.open({
        templateUrl: 'makeBookingPopup.html',
        controller: 'MakeBookingPopupCtrl',
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
        $scope.calRender = BookingsService.setUpRoomTabs();
        BookingsService.getWeeklyBookings(start, end);
      },

      dayClick : $scope.bookRoomInCalendar,
      eventClick: $scope.viewBookingInformation,
    }
  };

  $scope.calRender = false; //if there are no rooms for the building hide the calendar
  //retirves the selected building when the go button is pressed
  //sets the selected building
  $scope.retrieveRooms = function(){
    var week = uiCalendarConfig.calendars.myCalendar.fullCalendar( 'getView' );
    BookingsService.selectedBuilding = $scope.selectedBuilding;
    BookingsService.getWeeklyBookings(week.start, week.end);
    $scope.calRender = BookingsService.setUpRoomTabs();
    BookingsService.setUpRoomsWeeklyEvents();
  }

  //detects when a tab is changed and provides the room id
  $scope.changeRoom=function(roomID){
    BookingsService.selectedroom = roomID;
    BookingsService.setUpRoomsWeeklyEvents();
  }


  /*tabs*/
  $scope.tabs = BookingsService.RoomTabs;

};




