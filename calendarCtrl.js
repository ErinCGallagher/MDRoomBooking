angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal, $log, uiCalendarConfig, BookingsService){


  $scope.events = BookingsService.dailyBookings;

  $scope.eventSources = [$scope.events];

  console.log("hello");

  $scope.emptyClick = function(date, jsEvent, view){
    $scope.day = date.format("YYYY-MM-DD h:mm z");
    console.log("empty timeslot: " +$scope.day);

    var makeBookingPopupInstance = $uibModal.open({
      templateUrl: 'makeBookingPopup.html',
      controller: 'MakeBookingPopupCtrl',
      resolve: {
        building: function () {
          return "Harrison-LeCaine Hall";
        },
        roomNum: function () {
          return "101";
        },
        dateTime: function () {
          return date;
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
        building: function () {
          return date.building;
        },
        roomNum: function () {
          return date.roomNum;
        },
        duration: function () {
          return date.duration;
        },
        reason: function () {
          return date.reason;
        },
        numPeople: function () {
          return date.numPeople;
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
      timezone: 'local',
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




