angular
.module('mainApp')
.controller('MakeBookingPopupCtrl', MakeBookingPopupCtrl);

function MakeBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, dateTime, sourcePage, BookingsService, SearchService, SharedVariableService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  //$scope.selectedDuration = "30 minutes"; //initializes the duration dropdown
  $scope.selectedReason = SharedVariableService.reasonList[0]; //initializes the reason dropdown
  $scope.reasons = SharedVariableService.reasonList;
 // $scope.durations = ["30 minutes", "1 hour", "1.5 hour"];
  $scope.selectedNumPeople = SharedVariableService.numPeopleList[0];
  $scope.numPeople = SharedVariableService.numPeopleList;
  $scope.date = dateTime.format("MMM D, YYYY");
  $scope.startTime = dateTime.format("h:mm a");
  $scope.description = "";
  $scope.reccurBool = false;
  $scope.userType = SharedVariableService.userType;
  //submit the booking to the database and notify user if successfully booked
  $scope.submitBooking = function (validForm) {

    if(validForm){

      /* convert end time from local (with offset added) back to UTC moment object*/
      var endTimestamp = $scope.mytime - BookingsService.generateOffset(dateTime);
      endTimestamp =moment(endTimestamp).utc();
      console.log(endTimestamp);

      /*
      //calculate the end time & date given the duration
      //only works for 30m, 1h & 1.5h
      var endTimestamp = BookingsService.calclEndTime($scope.durations, "1.5 hour", dateTime);
      */
      $scope.endTime = endTimestamp.format("h:mm a");

      var bookingInfo = {
          title: $scope.selectedReason,
          start: dateTime,
          end: endTimestamp,
          allDay: false,
          building: building, 
          roomNum: roomNum,
          numPeople: $scope.selectedNumPeople, 
          description: $scope.description,
          stick:true,
          bookingUserType: SharedVariableService.userType
          };

      if(sourcePage == "bookings"){

        //call booking service to send booking info to the database
        BookingsService.bookRoom(bookingInfo)
          .then(function(response){
            alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
            $uibModalInstance.close(alert);
          },
            function(errorStatus){
              alertSending(errorStatus);
            });
          }
      else{ //search page
        //call booking service to send booking info to the database
        SearchService.bookRoom(bookingInfo)
          .then(function(response){
            alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
            $uibModalInstance.close(alert);
          },
            function(errorStatus){
              alertSending(errorStatus);
            });
      }
    }
    
  };

  //sends out differen alerts bassed on response
  alertSending = function(errorStatus){
    alert = { type: 'danger', msg:errorStatus};
  
    $uibModalInstance.close(alert);
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  /* Date Picker */
  console.log(dateTime);

  $scope.hstep = 1;
  $scope.mstep = 30;

  $scope.ismeridian = true;

  var TimeZoned = BookingsService.convertoUTCForDisplay(dateTime);

  //add 30 minutes because the minimum booking time is 30 minutes
  var TimeZoned = TimeZoned.setMinutes(TimeZoned.getMinutes() + 30)

  //local time with UTC offset (so actually UTC time but javascript wants it to be local)
  $scope.mytime = TimeZoned; //displayed to user 

  $scope.minTime = TimeZoned; //min time restriction
};