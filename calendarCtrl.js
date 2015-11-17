angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, uiCalendarConfig){

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

$scope.events = [
    {
        title: 'All Day Event',start: new Date(y, m, d)
      }
  ];
  $scope.eventSources = [$scope.events];

	/* config object */
    $scope.uiConfig = {
      calendar:{
        editable: true,
        defaultView:'agendaDay',
        slotEventOverlap:false,
        //allDaySlot:false,
        //slotDuration:'00:30:00:00',//default
        header:{ //buttons at the top
          //left: 'month basicWeek basicDay agendaWeek agendaDay'
          center: 'Drama & Music Room Booking System',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
  }