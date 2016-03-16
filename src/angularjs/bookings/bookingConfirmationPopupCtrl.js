angular
.module('mainApp')
.controller('BookingConfirmationPopupCtrl', BookingConfirmationPopupCtrl);

function BookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, numPeople, date, startTime, endTime, statusText, success, sourcePage) {
	$scope.building = building;
	$scope.roomNum = roomNum;
	$scope.reason = reason;
	$scope.numPeople = numPeople;
	$scope.date = date;
	$scope.startTime = startTime;
	$scope.endTime = endTime;
	$scope.statusText = statusText;
	$scope.success = success;

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
};