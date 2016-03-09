angular
.module('mainApp')
.controller('RecurringBookingConfirmationPopupCtrl', RecurringBookingConfirmationPopupCtrl);

function RecurringBookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, date, startTime, endTime, bookingID, bookingUserType, userType, sourcePage, SharedVariableService) {
  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.reason = reason;
  $scope.date = date;
  $scope.startTime = startTime.format("h:mm a");
  $scope.endTime = endTime.format("h:mm a");
  $scope.statusText;

};