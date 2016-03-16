angular
.module('mainApp')
.controller('RecurringBookingConfirmationPopupCtrl', RecurringBookingConfirmationPopupCtrl);

function RecurringBookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, date, startTime, endTime, statusText, success, failedBookings,successfulBookings,reccurringID,sourcePage, BookingsService,SearchService) {
  $scope.building = building;
  $scope.roomNum = roomNum;
  $scope.date = date;
  $scope.statusText = statusText; //error or success text from backend
  $scope.success = success; //recurring bookings suceeded or failed
  $scope.failedBookings = failedBookings;
  $scope.successfulBookings = successfulBookings;
  $scope.startTime = startTime;
  $scope.endTime = endTime;


  $scope.allBookingsSucceeded = true;

  if(failedBookings.length != 0 ){
    $scope.allBookingsSucceeded = false;
    $scope.statusText = "Some of your bookings were not successful. Please decide how you wish to preceed."
  }

  $scope.closePopup = function(){
    $uibModalInstance.dismiss('cancel');
  }

  $scope.cancelAll =function(){
    if(sourcePage == "bookings"){
      BookingsService.cancelAllRecurringBookings(reccurringID)
        .then(function(response){
          $uibModalInstance.dismiss('cancel');
        }),
        function(response){
          $uibModalInstance.dismiss('cancel');
        };
    }
    else{
      SearchService.cancelAllRecurringBookings(reccurringID)
        .then(function(response){
          $uibModalInstance.dismiss('cancel');
        }),
        function(response){
          $uibModalInstance.dismiss('cancel');
        };
    }
  }

};