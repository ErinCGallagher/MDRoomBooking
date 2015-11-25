angular
.module('mainApp')
.controller('MakeBookingPopupCtrl', MakeBookingPopupCtrl);

function MakeBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, dateTime, BookingsService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.selectedDuration = "30 minutes"; //initializes the duration dropdown
  $scope.selectedReason = "Individual Rehearsal"; //initializes the reason dropdown
  $scope.reasons = ["Individual Rehearsal", "Ensemble Rehearsal", "Coursework", "Performance", "Meetings", "Other"];
  $scope.durations = ["30 minutes", "1 hour", "1.5 hour"];
  $scope.selectedNumPeople = "1";
  $scope.numPeople = ["1", "2", "3", "4", "5-9", "10-19", "20+"]
  $scope.date = dateTime.format("YYYY-MM-DD");
  $scope.startTime = dateTime.format("h:mm");
  $scope.description = "";

  $scope.submitBooking = function () {

    $scope.calcEndTime();

    var isSuccessful = BookingsService.bookRoom({
      title: $scope.selectedReason,
      start: new Date(dateTime),
      end: $scope.end,
      allDay: false,
      building: building, 
      roomNum: roomNum,
      duration: $scope.selectedDuration,  
      numPeople: $scope.selectedNumPeople, 
      description: $scope.description,
      stick:true
    });
    
    console.log("Booking Successful? ", isSuccessful);

    if (isSuccessful) {
      alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
    } else {
      alert = { type: 'danger', msg: 'Error: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime + '" conflicted with another booking.'};
    }


    $uibModalInstance.close(alert);
  };

  $scope.calcEndTime = function () {
    var durationHours = 0;
    for(var i=0; i<$scope.durations.length; i++) {
      if ($scope.selectedDuration == $scope.durations[i]){
        durationHours = (i+1) * 0.5;
      }
    }

    end = moment(dateTime).add(durationHours, 'h');

    $scope.endTime = end.format("h:mm");
    $scope.end = new Date(moment(dateTime).add(durationHours, 'h'));

  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};