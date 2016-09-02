angular
.module('mainApp')
.controller('RecurringBookingConfirmationPopupCtrl', RecurringBookingConfirmationPopupCtrl);

function RecurringBookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, date, startTime, endTime, statusText, success, failedBookings,successfulBookings,reccurringID,sourcePage, BookingsService,SearchService, ConstantTextSerivce) {
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

  $scope.popup_building_name = ConstantTextSerivce.POPUP_CONFIRM.BUILDING.NAME;
  $scope.popup_room_num = ConstantTextSerivce.POPUP_CONFIRM.ROOM_NUM.NAME;
  $scope.popup_time = ConstantTextSerivce.POPUP_CONFIRM.TIME.NAME;
  $scope.success_title = ConstantTextSerivce.POPUP_CONFIRM.SUCCESSFUL_BOOKINGS.NAME;
  $scope.failed_title = ConstantTextSerivce.POPUP_CONFIRM.FAILED_BOOKINGS.NAME;
  $scope.continue_button = ConstantTextSerivce.POPUP_CONFIRM.CONTINUE_BUTTON.NAME;
  $scope.ok_button = ConstantTextSerivce.POPUP_CONFIRM.OK_BUTTON.NAME;
  $scope.cancel_button = ConstantTextSerivce.POPUP_CONFIRM.CANCEL_BOOKING.NAME;

};