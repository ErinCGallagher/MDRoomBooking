angular
.module('mainApp')
.controller('ConfirmCancelCtrl', ConfirmCancelCtrl)
function ConfirmCancelCtrl ($scope, $uibModalInstance, bookingInfo, BookingsService) {
	$scope.booking = bookingInfo;

	$scope.cancelBooking = function(){
		/*
		BookingsService.cancelBooking(booking.id,booking.start) 
			.then(function{
				alertSending("200");
			},
			function(){
				alertSending("200");
			});
		*/
	}

	$scope.back = function(){
		$uibModalInstance.dismiss('cancel');
	}

	//sends out differen alerts bassed on response
	alertSending = function(errorStatus){
	    if(errorStatus == 406){
	      //trying to make booking in the past
	      alert = { type: 'danger', msg: 'Error: You cannot create a booking in the past'};
	    }
	    else{
	    	alert = { type: 'success', msg: 'You Successfully cancelled your booking'};
	    }
	    $uibModalInstance.close(alert);
	}

}

