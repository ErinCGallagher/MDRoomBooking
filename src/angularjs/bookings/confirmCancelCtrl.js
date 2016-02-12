angular
.module('mainApp')
.controller('ConfirmCancelCtrl', ConfirmCancelCtrl)
function ConfirmCancelCtrl ($scope, $uibModalInstance, bookingInfo) {
	$scope.booking = bookingInfo;

	$scope.cancelBooking = function(){
		console.log("canceled booking");
		alertSending("200");

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

