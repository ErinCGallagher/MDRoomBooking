angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, duration, reason, numPeople, date, startTime) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.duration = duration;
  $scope.reason = reason;
  $scope.numPeople = numPeople;
  $scope.date = date;
  $scope.startTime = startTime;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};