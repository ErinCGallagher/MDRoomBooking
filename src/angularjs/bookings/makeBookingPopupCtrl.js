angular
.module('mainApp')
.controller('MakeBookingPopupCtrl', MakeBookingPopupCtrl);

function MakeBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, dateTime, BookingsService) {

  $scope.building = building;
  $scope.roomNum = roomNum;
  //$scope.selectedDuration = "30 minutes"; //initializes the duration dropdown
  $scope.selectedReason = "Individual Rehearsal"; //initializes the reason dropdown
  $scope.reasons = ["Individual Rehearsal", "Ensemble Rehearsal", "Coursework", "Performance", "Meetings", "Other"];
 // $scope.durations = ["30 minutes", "1 hour", "1.5 hour"];
  $scope.selectedNumPeople = "1";
  $scope.numPeople = ["1", "2", "3", "4", "5-9", "10-19", "20+"]
  $scope.date = dateTime.format("MMM D, YYYY");
  $scope.startTime = dateTime.format("h:mm a");
  $scope.description = "";

  //submit the booking to the database and notify user if successfully booked
  $scope.submitBooking = function () {

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


   //call booking service to send booking info to the database
    BookingsService.bookRoom({
      title: $scope.selectedReason,
      start: dateTime,
      end: endTimestamp,
      allDay: false,
      building: building, 
      roomNum: roomNum,
      numPeople: $scope.selectedNumPeople, 
      description: $scope.description,
      stick:true
      })
      .then(function(response){
        alert = { type: 'success', msg: 'Successfully booked: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime +'"'};
        $uibModalInstance.close(alert);
      },
        function(response){
          alert = { type: 'danger', msg: 'Error: "' + building + ' ' + roomNum + ', ' + $scope.startTime + '-' + $scope.endTime + '" conflicted with another booking.'};
          $uibModalInstance.close(alert);
        });
    
  };

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