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
  $scope.date = dateTime.format("MMM D, YYYY");
  $scope.startTime = dateTime.format("h:mm");
  $scope.description = "";

  //submit the booking to the database and notify user if successfully booked
  $scope.submitBooking = function () {

    //calculate the end time & date given the duration
    //only works for 30m, 1h & 1.5h
    var endTimestamp = BookingsService.calclEndTime($scope.durations, $scope.selectedDuration, dateTime);
    $scope.endTime = endTimestamp.format("h:mm");


   //call booking service to send booking info to the database
    var isSuccessful = BookingsService.bookRoom({
      title: $scope.selectedReason,
      start: dateTime,
      end: endTimestamp,
      allDay: false,
      building: building, 
      roomNum: roomNum,
      duration: $scope.selectedDuration,  
      numPeople: $scope.selectedNumPeople, 
      description: $scope.description,
      stick:true,
    });

    //user booking notifications
    if (isSuccessful) {
      alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
    } else { //not successful
      alert = { type: 'danger', msg: 'Error: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime + '" conflicted with another booking.'};
    }

    $uibModalInstance.close(alert);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};