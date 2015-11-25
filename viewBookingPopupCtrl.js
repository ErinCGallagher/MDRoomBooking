angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, date, startTime, endTime, BookingsService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.duration = 0;
  $scope.reason = reason;
  $scope.date = date;
  $scope.startTime = startTime;
  $scope.endTime = endTime;

  BookingsService.getBookingInformation(3)
	.then(function(bookingInfo){
		console.log(bookingInfo);
		$scope.numPeople = bookingInfo.data[0].NumParticipants;
		$scope.desc = bookingInfo.data[0].OtherDesc;
	},
	function(){
		alert("err");
	});
  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};