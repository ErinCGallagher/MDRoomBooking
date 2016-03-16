angular
.module('mainApp')
.controller('RecurringBookingConfirmationPopupCtrl', RecurringBookingConfirmationPopupCtrl);

function RecurringBookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, numPeople, date, startTime, endTime, statusText, success, failedBookings,successfulBookings,sourcePage, SharedVariableService) {
  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.reason = reason;
  $scope.date = date;
  $scope.statusText = statusText;
  $scope.success = success;
  $scope.failedBookings = failedBookings;
  $scope.successfulBookings = successfulBookings;
  $scope.startTime = startTime;
  $scope.endTime = endTime;


  $scope.allBookingsSucceeded = true;

  if(failedBookings.length != 0 ){
    $scope.allBookingsSucceeded = false;
    $scope.statusText = "Some of your bookings were not successful. Please decide how you wish to preceed."
  }

    $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }

};