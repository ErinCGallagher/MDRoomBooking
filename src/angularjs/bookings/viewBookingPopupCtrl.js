angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, date, startTime, endTime, bookingID, BookingsService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.reason = reason;
  $scope.date = date;
  $scope.startTime = startTime;
  $scope.endTime = endTime;

  //retrieve booking information from the database
  BookingsService.getBookingInformation(bookingID)
  	.then(function(bookingInfo){
  		$scope.numPeople = bookingInfo.data[0].NumParticipants;
  		$scope.description = bookingInfo.data[0].OtherDesc;
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