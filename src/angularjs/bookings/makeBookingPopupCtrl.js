angular
.module('mainApp')
.controller('MakeBookingPopupCtrl', MakeBookingPopupCtrl);

function MakeBookingPopupCtrl ($scope, $uibModalInstance, building, roomNum, dateTime, sourcePage, BookingsService, SearchService, SharedVariableService,  $uibModal) {

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
  
  $scope.cancelled = false; //informs if the user cancelled out of the popup

  
  loadRoomInfo = function(){
  	var info = {
		roomID: $scope.roomNum	
	}
  
  	BookingsService.getRoomInfo(info)
			.then(function(roomInfo){
				$scope.infoBuilding = roomInfo.data[0].building;
				$scope.capacity = roomInfo.data[0].capacity;
				$scope.contents = roomInfo.data[0].contents;
				
				if (roomInfo.data[0].fee == ""){
					$scope.fee = "None";
				}
				else {
					$scope.fee = roomInfo.data[0].fee;
				}
				$scope.reqKey = roomInfo.data[0].reqKey;
				$scope.roomID = roomInfo.data[0].roomID;
				$scope.setup = roomInfo.data[0].setup;
				
				$scope.openTime = roomInfo.data[1].openTime;
				$scope.closeTime = roomInfo.data[1].closeTime;
				
			},
			function() {
				alert("err");
			});

  }
  
  loadRoomInfo();
  
  
  //submit the booking to the database and notify user if successfully booked
  $scope.submitBooking = function (validForm) {

    //confirm the form is valid before preceeding to try and make the booking
    if(validForm && !$scope.cancelled && reccurBoolValid()){

      /* convert end time from local (with offset added) back to UTC moment object*/
      var endTimestamp = $scope.myTime - BookingsService.generateOffset(dateTime);
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
          bookingUserType: SharedVariableService.userType,
          recurringBooking:$scope.reccurBool, //true or false
          numWeeksRecur: $scope.numWeeks //including the current week
          };

      if(sourcePage == "bookings"){ //main calendar page

        if($scope.reccurBool){

           //call booking service to send booking info to the database
          BookingsService.bookRoomRecurring(bookingInfo)
            .then(function(response){
              $uibModalInstance.dismiss('cancel');
              $scope.reccurringBookingConfirmation(true,"Your booking was successfully made",response.failed, response.success,response.bookingID);
            },
              function(errorStatus){
                $uibModalInstance.dismiss('cancel');
                $scope.reccurringBookingConfirmation(false,"Error: You booking was not successful. " + errorStatus,[],[],"");
            });

        }else{
          //call booking service to send booking info to the database
          BookingsService.bookRoom(bookingInfo)
            .then(function(response){
              $uibModalInstance.dismiss('cancel');
              $scope.bookingConfirmation(true,"Your booking was successfully made");
            },
              function(errorStatus){
                $uibModalInstance.dismiss('cancel');
                $scope.bookingConfirmation(false,"Error: You booking was not successful. " + errorStatus);
            });
          }
        }


      else{ //search page
         
         if($scope.reccurBool){
          //call booking service to send booking info to the database
          SearchService.bookRoomRecurring(bookingInfo)
            .then(function(response){
              $uibModalInstance.dismiss('cancel');
              $scope.reccurringBookingConfirmation(true,"Your booking was successfully made",response.failed, response.success,response.bookingID);
            },
              function(errorStatus){
                $uibModalInstance.dismiss('cancel');
                $scope.reccurringBookingConfirmation(false,"Error: You booking was not successful. " + errorStatus,[],[],"");
            });

        }else{
          //call booking service to send booking info to the database
          SearchService.bookRoom(bookingInfo)
            .then(function(response){
              $uibModalInstance.dismiss('cancel');
              $scope.bookingConfirmation(true,"Your booking was successfully made");
              
            },
              function(errorStatus){
                $uibModalInstance.dismiss('cancel');
                $scope.bookingConfirmation(false,"Error: " + errorStatus);
                
            });
        }
      }
    }
    
  };

  $scope.cancel = function(){
    $scope.cancelled = true;
    $uibModalInstance.dismiss('cancel');
  }

   /* Date Picker */
  console.log(dateTime);

  $scope.hstep = 1;
  $scope.mstep = 30;
  $scope.ismeridian = true;

  var TimeZoned = BookingsService.convertoUTCForDisplay(dateTime);

  //add 30 minutes because the minimum booking time is 30 minutes
  TimeZoned.setMinutes(TimeZoned.getMinutes() + 30)


  //local time with UTC offset (so actually UTC time but javascript wants it to be local)
  $scope.myTime = TimeZoned; //displayed to user 
  $scope.minTime = TimeZoned; //min time restriction

  
  /*Reccur Weekly settings*/
  $scope.maxReccur = BookingsService.determineMaxReccuringWeeks(dateTime);

  //if reccuring booking is chosen, return true if the number of reccurings is 
  //less than or equal to maxReccur
  reccurBoolValid = function(){
    if($scope.reccurBool){
      if($scope.numWeeks <= $scope.maxReccur){
        return true;
      }
      else{
        return false;
      }
    }
    return true; 
  }
  

  //called when a non reccuring booking is attempted
  //either confirms the sucess or informs the user of the failure
  $scope.bookingConfirmation = function(success,statusText){

    console.log(SharedVariableService.userType);
    var viewBookingPopupInstance = $uibModal.open({
      templateUrl: 'bookingConfirmationPopup.html',
      controller: 'BookingConfirmationPopupCtrl',
      backdrop: 'static',
      resolve: {
        building: function () {
          return $scope.building;
        },
        roomNum: function () {
          return $scope.roomNum;
        },
        reason: function () {
          return $scope.selectedReason;
        },
        numPeople:function() {
          return $scope.selectedNumPeople;
        },
        date: function () {
          return $scope.date;
        },
        startTime: function () {
          return $scope.startTime;
        },
        endTime: function () {
          return moment($scope.myTime).format("h:mm a");
        },
        statusText: function () {
          return statusText;
        },
        success: function(){
          return success;
        },
        sourcePage: function () {
          return sourcePage;
        }
      }
    });
  };

  //caled when a recurring booking is attempted
  //either confirms the sucess or informs the user of the failure
  $scope.reccurringBookingConfirmation = function(success,statusText,failedBookings,successfulBookings, bookingID){

    var viewRecurringBookingPopupInstance = $uibModal.open({
      templateUrl: 'recurringBookingConfirmationPopup.html',
      controller: 'RecurringBookingConfirmationPopupCtrl',
      backdrop: 'static',
      resolve: {
        building: function () {
          return $scope.building;
        },
        roomNum: function () {
          return $scope.roomNum;
        },
        date: function () {
          return $scope.date;
        },
        startTime: function () {
          return $scope.startTime;
        },
        endTime: function () {
          return moment($scope.myTime).format("h:mm a");
        },
        statusText: function () {
          return statusText;
        },
        success: function(){
          return success;
        },
        failedBookings: function(){
          return failedBookings;
        },
        successfulBookings: function(){
          return successfulBookings;
        },
        reccurringID: function(){
          return bookingID;
        },
        sourcePage: function () {
          return sourcePage;
        }
      }
    });
  };

 
};