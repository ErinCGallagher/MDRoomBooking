angular
.module('mainApp')
.controller('MyBookingsCtrl', MyBookingsCtrl);

function MyBookingsCtrl($scope, $uibModal, $log, MyBookingsService, SharedVariableService, ConstantTextSerivce) {

	$scope.pageClass = 'myBookings'; //used to change pages in index.html
	$scope.hours = 0;
	$scope.userName = SharedVariableService.name;
	$scope.userType = SharedVariableService.userType;
	$scope.department = SharedVariableService.department;
	$scope.email = SharedVariableService.netID + "@queensu.ca";
	$scope.bookings = MyBookingsService.userBookings;
	$scope.recurringBookings = MyBookingsService.recurringUserBookings;

	//retrieve future user bookings for display
	MyBookingsService.retrieveUserBookings();

	$scope.retrieveHours = function(){
		MyBookingsService.retrieveHoursRemaining()
		.then(function(retrievedHours){
			if(SharedVariableService.userType != "student"){
				$scope.hours = "Unlimited";
			}
			else{
				$scope.hours = retrievedHours
			}

		},
		function(err){

		});
	}

	$scope.retrieveHours();

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};

	$scope.cancelAllRecur = function(reBooking){
		var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancelAllRecur.html',
	        controller: 'ConfirmCancelAllRecurCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return reBooking;
	          	},
	          	sourcePage: function () {
	            	return "myBookings";
	          	},

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	        $scope.retrieveHours();
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}


	//cancel a booking, open modal for comfirmation
	$scope.cancel = function(bookingInfo,recurring){
		if(recurring){
			var i = 0;
			var j = 0;;
			while(i < MyBookingsService.recurringUserBookings.length){
				while(j < MyBookingsService.recurringUserBookings[i].recurringBooking.length){
					if(MyBookingsService.recurringUserBookings[i].recurringBooking[j].bookingID == bookingInfo.bookingID){
						bookingInfo.building = MyBookingsService.recurringUserBookings[i].building;
						bookingInfo.reason = MyBookingsService.recurringUserBookings[i].reason;
						bookingInfo.roomNum = MyBookingsService.recurringUserBookings[i].roomNum;
						bookingInfo.time = MyBookingsService.recurringUserBookings[i].time;
						bookingInfo.keyRequired = "N/A";
					}
					j++;
				}
				i++;
			}
		}

	    var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancel.html',
	        controller: 'ConfirmCancelCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return bookingInfo;
	          },
	          recurring: function () {
	            	return recurring;
	          },
	          sourcePage: function () {
	            	return "myBookings";
	          },

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	        $scope.retrieveHours();
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	//expands recurring bookin information
	$scope.toggleDetail = function(rID) {
        //$scope.isVisible = $scope.isVisible == 0 ? true : false;
        $scope.activePosition = $scope.activePosition == rID ? -1 : rID;
    };

    /* This Page's Text */

		$scope.user_info_title = ConstantTextSerivce.MY_BOOKINGS.USER_INFO.NAME.NAME;
		$scope.user_name = ConstantTextSerivce.MY_BOOKINGS.NAME.NAME;
		$scope.user_email = ConstantTextSerivce.MY_BOOKINGS.EMAIL.NAME;
		$scope.hours_remain = ConstantTextSerivce.MY_BOOKINGS.HOURS_REMAIN.NAME;
		$scope.header_date = ConstantTextSerivce.MY_BOOKINGS.DATE.NAME;
		$scope.header_time = ConstantTextSerivce.MY_BOOKINGS.TIME.NAME;
		$scope.header_building_name = ConstantTextSerivce.MY_BOOKINGS.BUILDING.NAME;
		$scope.header_room_num = ConstantTextSerivce.MY_BOOKINGS.ROOM_NUM.NAME;
		$scope.header_key_req = ConstantTextSerivce.MY_BOOKINGS.KEY_REQ.NAME;
		$scope.header_reason = ConstantTextSerivce.MY_BOOKINGS.REASON.NAME;
		$scope.header_click_cancel = ConstantTextSerivce.MY_BOOKINGS.CLICK_CANCEL.NAME;
		$scope.title_my_bookings = ConstantTextSerivce.MY_BOOKINGS.MY_BOOKINGS.NAME;
		$scope.title_rec_bookings = ConstantTextSerivce.MY_BOOKINGS.MY_REC_BOOKINGS.NAME;
		$scope.rec_info = ConstantTextSerivce.MY_BOOKINGS.REC_INFO.NAME;
		$scope.header_day_week = ConstantTextSerivce.MY_BOOKINGS.DAY_WEEK.NAME;
		$scope.header_bookings_remain = ConstantTextSerivce.MY_BOOKINGS.BOOKINGS_REMAIN.NAME;
		$scope.user_department = ConstantTextSerivce.MY_BOOKINGS.DEPARTMENT.NAME;
};
