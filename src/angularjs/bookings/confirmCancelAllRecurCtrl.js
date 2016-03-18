angular
.module('mainApp')
.controller('ConfirmCancelAllRecurCtrl', ConfirmCancelAllRecurCtrl)
function ConfirmCancelAllRecurCtrl ($scope, $uibModalInstance, bookingInfo, MyBookingsService) {
	$scope.recurrBookings = bookingInfo;

	//called on "Cancel Booking" buton press
	$scope.cancelBooking = function(){
		
		MyBookingsService.cancelAllRecurringBookings(bookingInfo.recurringID
)
			.then(function(){
				alertSending("200");
			},
			function(){
				alertSending("406");
			});
		
	}

	$scope.back = function(){
		$uibModalInstance.dismiss('cancel');
	}

	//sends out differen alerts bassed on response
	alertSending = function(errorStatus){
	    if(errorStatus == 406){
	      //trying to make booking in the past
	      alert = { type: 'danger', msg: 'Error: Your Booking in ' + bookingInfo.building + ' with ' + bookingInfo.weeksRemaining + ' recurrings remaining could not be deleted'};
	    }
	    else{
	    	alert = { type: 'success', msg: 'You Successfully cancelled your booking in ' + bookingInfo.building + ' with ' + bookingInfo.weeksRemaining + ' recurrings remaining'};
	    }
	    $uibModalInstance.close(alert);
	}

}

