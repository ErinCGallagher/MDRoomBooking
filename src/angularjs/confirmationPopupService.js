angular
.module('mainApp')
.service('ConfirmationPopupService', ConfirmationPopupService);

function ConfirmationPopupService($sce, $uibModal){ //$sce is for sanitizing html string
	var confirmationPopupService = {};

	confirmationPopupService.open = function(submitFunction, submitData, msgString) {
		//need to sanitize msg first if using html tags
		var htmlMsg = $sce.trustAsHtml(msgString);
		var popupInstance = $uibModal.open({
			templateUrl: 'confirmation.html',
			controller: 'ConfirmationPopupCtrl',
			resolve: {
				submitFunction: function () {
					return submitFunction; //set by getGroupInfo
				},
				submitData: function () {
					return submitData;
				},
				msg: function () {
					return htmlMsg;
				}
			}
	    });
	    return popupInstance;
	}

	return confirmationPopupService;
};