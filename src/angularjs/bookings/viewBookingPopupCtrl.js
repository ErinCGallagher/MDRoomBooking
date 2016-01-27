angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, date, startTime, endTime, bookingID, BookingsService, SharedVariableService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.reason = reason;
  $scope.date = date;
  $scope.startTime = startTime.format("h:mm a");
  $scope.endTime = endTime.format("h:mm a");
  $scope.userType = SharedVariableService.userType;

  //retrieve booking information from the database
  BookingsService.getBookingInformation(bookingID)
  	.then(function(bookingInfo){
  		$scope.numPeople = bookingInfo.data[0].numParticipants;
  		$scope.description = bookingInfo.data[0].otherDesc;
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

    $scope.cancelBooking = function () {
    BookingsService.cancelBooking(bookingID,startTime)
      .then(function(){
         alert = { type: 'success', msg: 'Successfully canceled: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
      function(err){
          alert = { type: 'danger', msg: 'Error: You may not cancel a booking which has already occured'};
          $uibModalInstance.close(alert);
      });
  };
};