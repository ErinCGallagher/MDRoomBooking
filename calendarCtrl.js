angular
.module('mainApp')
.controller('CalendarCtrl', CalendarCtrl);


function CalendarCtrl($scope, $uibModal, $log, uiCalendarConfig, BookingsService){

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $scope.selectedDuration = "30 minutes"; //initializes the duration dropdown
  $scope.selectedReason = "Individual Rehearsal"; //initializes the reason dropdown
  $scope.reasons = ["Individual Rehearsal", "Ensemble Rehearsal", "Coursework", "Performance", "Meetings", "Other"];
  $scope.durations = ["30 minutes", "1 hour", "1.5 hour"];
  $scope.date = "";
  $scope.startTime = "";

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
    $scope.date = date.format("YYYY-MM-DD");
    $scope.startTime = date.format("h:mm");
  }

 /* alert on eventClick */
  $scope.alertOnEventClick = function(date, jsEvent, view){
    console.log("booked timeslot: " + date.title);
    console.log(date._start._d);
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

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'bookRoom.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

};


// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('mainApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

