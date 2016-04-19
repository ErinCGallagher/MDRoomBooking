//written by Erin Gallagher
angular
.module('mainApp')
.controller('BookingConfirmationPopupCtrl', BookingConfirmationPopupCtrl);

function BookingConfirmationPopupCtrl ($scope, $uibModalInstance, building, roomNum, reason, numPeople, date, startTime, endTime, description, statusText, success, sourcePage, ConstantTextSerivce) {
	$scope.building = building;
	$scope.roomNum = roomNum;
	$scope.reason = reason;
	$scope.numPeople = numPeople;
	$scope.date = date;
	$scope.startTime = startTime;
	$scope.endTime = endTime;
	$scope.description = description;
	$scope.statusText = statusText;
	$scope.success = success;

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}

  $scope.popup_building_name = ConstantTextSerivce.POPUP_CONFIRM.BUILDING.NAME;
  $scope.popup_room_num = ConstantTextSerivce.POPUP_CONFIRM.ROOM_NUM.NAME;
  $scope.popup_date = ConstantTextSerivce.POPUP_CONFIRM.DATE.NAME;
  $scope.popup_time = ConstantTextSerivce.POPUP_CONFIRM.TIME.NAME;
  $scope.popup_num_people = ConstantTextSerivce.POPUP_CONFIRM.NUM_PEOPLE.NAME;
  $scope.popup_reason = ConstantTextSerivce.POPUP_CONFIRM.REASON.NAME;
  $scope.popup_descript = ConstantTextSerivce.POPUP_CONFIRM.DESCRIPT.NAME;
  $scope.popup_performance_title = ConstantTextSerivce.POPUP_CONFIRM.PERFORMANCE_TITLE.NAME;
  $scope.popup_course_code = ConstantTextSerivce.POPUP_CONFIRM.COURSE_CODE.NAME;
  $scope.popup_ok_button = ConstantTextSerivce.POPUP_CONFIRM.OK_BUTTON.NAME;

};