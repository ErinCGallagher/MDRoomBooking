angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal, $log, uiCalendarConfig, BookingsService){

  $scope.buildings = ["Harrison-LeCaine Hall","Theological Hall", "The Isabel", "Chown Hall"];
  $scope.selectedBuilding = "Harrison-LeCaine Hall";
  $scope.events = BookingsService.dailyBookings;

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

  $scope.alerts = [
  ];

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  //called when emtpy calendar timeslot is selected
  $scope.bookRoomInCalendar = function(date, jsEvent, view){
    $scope.day = date.format("YYYY-MM-DD h:mm z");

    var makeBookingPopupInstance = $uibModal.open({
      templateUrl: 'makeBookingPopup.html',
      controller: 'MakeBookingPopupCtrl',
      resolve: {
        building: function () {
          return "Harrison-LeCaine Hall";
        },
        roomNum: function () {
          return "HLH 102";
        },
        dateTime: function () {
          return date;
        }
      }
    });

    makeBookingPopupInstance.result.then(function (alert) {
      $scope.alerts.push(alert);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }


 /* alert on eventClick */
 //called when a booking is clicked
  $scope.viewBookingInformation = function(date, jsEvent, view){

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
          return date.start.format("h:mm");
        },
        endTime: function () {
          return date.end.format("h:mm");
        },
        bookingID: function () {
          return date.bookingID;
        }
      }
    });
  };


	/* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false, //allows you to drag events
      defaultView:'agendaWeek',
      minTime : "07:00:00", //earliest time to display
      maxTime : "23:00:00",
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
        $scope.date = start.format("MMM D, YYYY") + " - "+ end.format("MMM D, YYYY")
        BookingsService.getDailyBookings(start, end);
      },

      dayClick : $scope.bookRoomInCalendar,
      eventClick: $scope.viewBookingInformation,
    }
  };

};




