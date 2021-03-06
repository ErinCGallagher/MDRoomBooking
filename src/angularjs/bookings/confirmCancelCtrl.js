//written by Erin Gallagher
angular
.module('mainApp')
.controller('ConfirmCancelCtrl', ConfirmCancelCtrl)
function ConfirmCancelCtrl ($scope, $uibModalInstance, bookingInfo, recurring, sourcePage, $filter, MyBookingsService, AdminUsersService) {
	$scope.booking = bookingInfo;
	$scope.recurring = recurring;

	//called on "Cancel Booking" buton press
	$scope.cancelBooking = function(){

		if(recurring){
			var bookingID = bookingInfo.bookingID;
			var start = bookingInfo.date;


		}
		else{
			var bookingID = bookingInfo.bookingID;
			var start = bookingInfo.start;
		}

		if(sourcePage == "myBookings"){
		
			MyBookingsService.cancelBooking(bookingID,start,recurring) 
				.then(function(){
					alertSending("200");
				},
				function(){
					alertSending("406");
				});
		}else{
			AdminUsersService.cancelBooking(bookingID,start,recurring) 
				.then(function(){
					alertSending("200");
				},
				function(){
					alertSending("406");
				});
		}
		
	}
	
	
	

	$scope.back = function(){
		$uibModalInstance.dismiss('cancel');
	}

	//sends out differen alerts bassed on response
	alertSending = function(errorStatus){
	    if(errorStatus == 406){
	      //trying to make booking in the past
	      alert = { type: 'danger', msg: 'Error: Your Booking in ' + bookingInfo.building + ' on ' + $filter('date')(bookingInfo.date, 'EEE, MMM d yyyy') + ' from ' + $filter('date')(bookingInfo.start, 'h:mm a') + ' to ' + $filter('date')(bookingInfo.end, 'h:mm a') +  ' Could not be deleted'};
	    }
	    else{
	    	alert = { type: 'success', msg: 'You Successfully cancelled your booking in ' + bookingInfo.building + ' on ' + $filter('date')(bookingInfo.date, 'EEE, MMM d yyyy') + ' from ' + $filter('date')(bookingInfo.start, 'h:mm a') + ' to ' + $filter('date')(bookingInfo.end, 'h:mm a')};
	    }
	    $uibModalInstance.close(alert);
	}

}

