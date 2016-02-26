angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, $uibModal, AdminUsersService) {

	$scope.showDownload = true;
	$scope.showDate = false;
	$scope.keyDate = new Date();
	
	var myDate = new Date();
	var prevDate = new Date(myDate);
	prevDate.setDate(myDate.getDate()-1);
	
	var today = {
					keyDate: prevDate
				}
	AdminUsersService.keyList(today);
	
	
	$scope.generateKeyList = function() {
	
			var prevDate = new Date($scope.keyDate);
			prevDate.setDate($scope.keyDate.getDate()-1);
		
			var info = {
				keyDate: prevDate
			}
			
 			AdminUsersService.keyList(info);
 			//$scope.keyDate = 
 			$scope.showDate = false;
 			$scope.showDownload = true;	
 				
	}
	
	
	$scope.removeKeyList = function() {
		$scope.showDownload = false;
		$scope.showDate = true;		
	}

	openUploadPopup = function(data, dept){

	    var popupInstance = $uibModal.open({
			templateUrl: 'uploadPopup.html',
			controller: 'ModalInstanceCtrl',
			resolve: {
				department: function () {
					return dept;
				},
				numUsersInDept: function () {
					return data.numUsersInDept;
				},
				numUsersDeleted: function () {
					return data.numUsersDeleted;
				},
				badFormatUsers: function () {
					return data.badFormatUsers;
				},
				badClassUsers: function () {
					return data.badClassUsers;
				}
			}
	    });
	};

	$scope.uploadMasterList = function(uploadFile, dept) {
		AdminUsersService.uploadMasterList(uploadFile, dept)
		.then(function(data){
				openUploadPopup(data, dept);
			},
			function(errorMsg) {
				alert(errorMsg); 
			});
	}

};

angular.module('mainApp').controller('ModalInstanceCtrl', ModalInstanceCtrl);

function ModalInstanceCtrl ($scope, $uibModalInstance, department, numUsersInDept, numUsersDeleted, badFormatUsers, badClassUsers) {

	$scope.department = department;
	$scope.numUsersInDept = numUsersInDept;
	$scope.numUsersDeleted = numUsersDeleted;
	$scope.badFormatUsers = badFormatUsers;
	$scope.badClassUsers = badClassUsers;


	$scope.ok = function () {
		$uibModalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};
