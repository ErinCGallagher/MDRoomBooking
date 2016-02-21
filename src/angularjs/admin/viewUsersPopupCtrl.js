angular
.module('mainApp')
.controller('ViewUsersModalCtrl', ViewUsersModalCtrl);

function ViewUsersModalCtrl ($scope, $uibModalInstance, AdminGroupsService, groupId, groupName, userList) {

	$scope.groupId = groupId;
	$scope.groupName = groupName;
	$scope.userList = userList;

	$scope.deleteUserFromGroup = function(user) {
		AdminGroupsService.deleteUserFromGroup(user.uID, $scope.groupId)
			.then(function(){

				//TODO: fix so only removes user from list if they were successfully deleted
				var index = $scope.userList.indexOf(user);
				$scope.userList.splice(index, 1);
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.deleteAllUsersFromGroup = function() {
		AdminGroupsService.deleteAllUsersFromGroup($scope.groupId)
			.then(function(data){
				$scope.userList = [];
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};