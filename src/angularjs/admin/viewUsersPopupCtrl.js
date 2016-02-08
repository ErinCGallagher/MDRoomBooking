angular
.module('mainApp')
.controller('ViewUsersModalCtrl', ViewUsersModalCtrl);

function ViewUsersModalCtrl ($scope, $uibModalInstance, groupName, userList) {

	$scope.groupName = groupName;
	$scope.userList = userList;

	$scope.deleteUserFromGroup = function(userId) {
		console.log("DELETE " + userId);
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};