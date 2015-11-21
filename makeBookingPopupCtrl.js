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

  $scope.submitBooking = function () {
    var isSuccessful = BookingsService.bookRoom({
      title: $scope.selectedReason,
      start: new Date(dateTime),
      end: new Date(dateTime),
      allDay: false,
      building: building, 
      roomNum: roomNum,
      duration: $scope.selectedDuration,  
      numPeople: $scope.selectedNumPeople, 
      description: $scope.description
    });
    
    console.log(isSuccessful);
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};