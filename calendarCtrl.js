angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);

function CalendarCtrl($scope, uiCalendarConfig){
		$scope.events = [
		{
		    title: 'Test Birthday Party',
	        start: new Date(2015, 11, 11 + 1, 19, 0),
	        end: new Date(2015, 11, 11 + 1, 22, 30),
	        allDay: false
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