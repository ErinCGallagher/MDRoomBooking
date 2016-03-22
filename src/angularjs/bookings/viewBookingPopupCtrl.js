angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, booking, sourcePage, BookingsService, SharedVariableService, SearchService) {

  $scope.building = booking.building;
  $scope.roomNum = booking.roomNum;
  $scope.reason = booking.title;
  $scope.date = booking.start.format("MMM D, YYYY");
  $scope.startTime = booking.start.format("h:mm a");
  $scope.endTime = booking.end.format("h:mm a");
  $scope.bookingUserType = booking.bookingUserType;
  $scope.userType = SharedVariableService.userType;
  var bookingID = booking.bookingID;
  console.log(booking);

  if(SharedVariableService.userType != "student"){
    $scope.userName = booking.userName;
  }
  if(SharedVariableService.userType == "admin"){
     $scope.userEmail = booking.userEmail;
  }

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
    if(sourcePage == "bookings"){
    BookingsService.cancelBooking(bookingID,startTime)
      .then(function(){
         alert = { type: 'success', msg: 'Successfully canceled: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
      function(err){
          alert = { type: 'danger', msg: 'Error: You may not cancel a booking which has already occured'};
          $uibModalInstance.close(alert);
      });
    }
    else{
      SearchService.cancelBooking(bookingID,startTime)
      .then(function(){
         alert = { type: 'success', msg: 'Successfully canceled: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
      function(err){
          alert = { type: 'danger', msg: 'Error: You may not cancel a booking which has already occured'};
          $uibModalInstance.close(alert);
      });
    }

  };
};