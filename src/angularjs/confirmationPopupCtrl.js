//written by Shannon Klett
angular
.module('mainApp')
.controller('ConfirmationPopupCtrl', ConfirmationPopupCtrl);

function ConfirmationPopupCtrl ($scope, $uibModalInstance, submitFunction, submitData, msg) {

	$scope.msg = msg; // shown in modal body, can contain html tags

	$scope.submit = function () {
		submitFunction(submitData); 
		$uibModalInstance.close();
	};


	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
  };