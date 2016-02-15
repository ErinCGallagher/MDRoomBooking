angular
.module('mainApp')
.controller('ConfirmCancelCtrl', ConfirmCancelCtrl)
function ConfirmCancelCtrl ($scope, $uibModalInstance, bookingInfo, $filter, MyBookingsService) {
	$scope.booking = bookingInfo;

	$scope.cancelBooking = function(){
		
		MyBookingsService.cancelBooking(bookingInfo.bookingID,bookingInfo.start) 
			.then(function(){
				alertSending("200");
			},
			function(){
				alertSending("200");
			});
		
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

