angular
.module('mainApp')
.controller('ViewBookingPopupCtrl', ViewBookingPopupCtrl);

function ViewBookingPopupCtrl ($scope, $uibModalInstance, booking, sourcePage, BookingsService, SharedVariableService, SearchService, ConstantTextSerivce) {

  $scope.building = booking.building;
  $scope.roomNum = booking.roomNum;
  $scope.reason = booking.title;
  $scope.date = booking.start.format("MMM D, YYYY");
  $scope.startTime = booking.start.format("h:mm a");
  $scope.endTime = booking.end.format("h:mm a");
  $scope.numPeople = booking.numPeople;
  $scope.description = booking.description;
  $scope.bookingUserType = booking.bookingUserType;
  $scope.userType = SharedVariableService.userType;
  var bookingID = booking.bookingID;
  console.log(booking);

  if(SharedVariableService.userType != "student" && SharedVariableService.userType != "nonbooking"){
    $scope.userName = booking.userName;
    if($scope.userName == "null"){
      $scope.userName = "User was removed from the system"
    }
  }
  if(SharedVariableService.userType == "admin" || SharedVariableService.userType == "faculty"){
     $scope.userEmail = booking.userEmail;
     if($scope.userEmail == "null"){
      $scope.userEmail = "User was removed from the system"
    }
  }

  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cancelBooking = function () {
    if(sourcePage == "bookings"){
    BookingsService.cancelBooking(bookingID,booking.start)
      .then(function(){
         alert = { type: 'success', msg: 'Successfully canceled: "' + $scope.building + ' ' + $scope.roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
      function(err){
          alert = { type: 'danger', msg: 'Error: You may not cancel a booking which has already occured'};
          $uibModalInstance.close(alert);
      });
    }
    else{
      SearchService.cancelBooking(bookingID,booking.start)
      .then(function(){
         alert = { type: 'success', msg: 'Successfully canceled: "' + $scope.building + ' ' + $scope.roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
      function(err){
          alert = { type: 'danger', msg: 'Error: You may not cancel a booking which has already occured'};
          $uibModalInstance.close(alert);
      });
    }

  };

  //constant text service

  //view booking
  $scope.popup_info_title = ConstantTextSerivce.POPUP_VIEW_BOOKING.BOOKING_INFO_TITLE.NAME;
  $scope.popup_building_name = ConstantTextSerivce.POPUP_VIEW_BOOKING.BUILDING.NAME;
  $scope.popup_room_num = ConstantTextSerivce.POPUP_VIEW_BOOKING.ROOM_NUM.NAME;
  $scope.popup_date = ConstantTextSerivce.POPUP_VIEW_BOOKING.DATE.NAME;
  $scope.popup_time = ConstantTextSerivce.POPUP_VIEW_BOOKING.TIME.NAME;
  $scope.popup_num_people = ConstantTextSerivce.POPUP_VIEW_BOOKING.NUM_PEOPLE.NAME;
  $scope.popup_reason = ConstantTextSerivce.POPUP_VIEW_BOOKING.REASON.NAME;
  $scope.popup_descript = ConstantTextSerivce.POPUP_VIEW_BOOKING.DESCRIPT.NAME;
  $scope.popup_performance_title = ConstantTextSerivce.POPUP_VIEW_BOOKING.PERFORMANCE_TITLE.NAME;
  $scope.popup_course_code = ConstantTextSerivce.POPUP_VIEW_BOOKING.COURSE_CODE.NAME;
  $scope.popup_user_info_title = ConstantTextSerivce.POPUP_VIEW_BOOKING.BOOKING_USER_INFO.NAME;
  $scope.popup_name = ConstantTextSerivce.POPUP_VIEW_BOOKING.NAME.NAME;
  $scope.popup_type = ConstantTextSerivce.POPUP_VIEW_BOOKING.TYPE.NAME;
  $scope.popup_email = ConstantTextSerivce.POPUP_VIEW_BOOKING.EMAIL.NAME;
  $scope.popup_cancel_button = ConstantTextSerivce.POPUP_VIEW_BOOKING.CANCEL_BUTTON.NAME;
  $scope.popup_back_button = ConstantTextSerivce.POPUP_VIEW_BOOKING.BACK_BUTTON.NAME;
};