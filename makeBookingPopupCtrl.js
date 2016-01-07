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
  $scope.startTime = dateTime.format("h:mm");
  $scope.description = "";

  $scope.submitBooking = function () {

    var endTimestamp = BookingsService.calclEndTime($scope.durations, $scope.selectedDuration, dateTime);
    $scope.endTime = endTimestamp.format("h:mm");

    console.log(dateTime);

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
    
    console.log("Booking Successful? ", isSuccessful);

    if (isSuccessful) {
      alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
    } else {
      alert = { type: 'danger', msg: 'Error: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime + '" conflicted with another booking.'};
    }


    $uibModalInstance.close(alert);
  };



  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};