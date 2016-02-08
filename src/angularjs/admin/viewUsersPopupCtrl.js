angular
.module('mainApp')
.controller('ViewUsersModalCtrl', ViewUsersModalCtrl);

function ViewUsersModalCtrl ($scope, $uibModalInstance, AdminGroupsService, groupId, groupName, userList) {

	$scope.groupId = groupId;
	$scope.groupName = groupName;
	$scope.userList = userList;

	$scope.deleteUserFromGroup = function(userId) {
		AdminGroupsService.deleteUserFromGroup(userId, $scope.groupId)
			.then(function(){
				var index = $scope.userList.indexOf(userId);
				$scope.userList.splice(index, 1);
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};