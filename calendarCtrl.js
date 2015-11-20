angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal, $log, uiCalendarConfig, BookingsService){

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $scope.events = [{
    title: 'Erins Ballin party',
    start: new Date(y, m, d , 14, 30, 0), 
    end: new Date(y, m, d, 15, 0, 0),
    allDay: false
    }
  ];
  $scope.eventSources = [$scope.events];

  //add an event to the eventSource to be displayed on the calendar
  $scope.events.push({
    title: 'Lauras Fantastic Event',
    start: new Date(y, m, d , 10, 30, 0), 
    end: new Date(y, m, d, 12, 0, 0),
    allDay: false

  });

  console.log("hello");

  $scope.emptyClick = function(date, jsEvent, view){
    $scope.day = date.format("YYYY-MM-DD h:mm");
    console.log("empty timeslot: " +$scope.day);

    var makeBookingPopupInstance = $uibModal.open({
      templateUrl: 'makeBookingPopup.html',
      controller: 'MakeBookingPopupCtrl',
      resolve: {
        date: function () {
          return date.format("YYYY-MM-DD");
        },
        startTime: function () {
          return date.format("h:mm");
        }
      }
    });
  }

 /* alert on eventClick */
  $scope.alertOnEventClick = function(date, jsEvent, view){
    console.log("booked timeslot: " + date.title);
    console.log(date._start._d);

    var viewBookingPopupInstance = $uibModal.open({
      templateUrl: 'viewBookingPopup.html',
      controller: 'ViewBookingPopupCtrl',
      resolve: {
        duration: function () {
          return "30 min";
        },
        reason: function () {
          return "Coursework";
        },
        numPeople: function () {
          return "5";
        },
        date: function () {
          return date.start.format("YYYY-MM-DD");
        },
        startTime: function () {
          return date.start.format("h:mm");
        }
      }
    });
  };

	/* config object */
  $scope.uiConfig = {
    calendar:{
      editable: false, //allows you to drag events
      defaultView:'agendaDay',
      minTime : "07:00:00", //earliest time to display
      maxTime : "23:00:00",
      slotEventOverlap:false,
      allDaySlot:false,
      Timezone: 'UTC -5',
      //slotDuration:'00:30:00:00',//default
      header:{ //buttons at the top
        //left: 'month basicWeek basicDay agendaWeek agendaDay'
        center: 'Drama & Music Room Booking System',
        right: 'today prev,next'
      },
      dayClick : $scope.emptyClick,
      eventClick: $scope.alertOnEventClick,
    }
  };

  /*

  $scope.search = function(){
    var q = $q.defer();
    CalendarService.search($scope.keywords)
      .then(function(response){
        $scope.result = response;
        q.resolve();
      }),
      function(error){
        q.reject();
      };
  };

  */

  

};




