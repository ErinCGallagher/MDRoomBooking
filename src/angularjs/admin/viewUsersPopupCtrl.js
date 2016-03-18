angular
.module('mainApp')
.controller('ViewUsersModalCtrl', ViewUsersModalCtrl);

function ViewUsersModalCtrl ($scope, $uibModal, $uibModalInstance, $sce, AdminGroupsService, groupId, groupName) {

	$scope.groupId = groupId;
	$scope.groupName = groupName;
	$scope.userList;

	getUsers = function() {
		AdminGroupsService.getUsersInGroup($scope.groupId)
			.then(function(data){
				$scope.userList = data;
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	getUsers();

	$scope.addUsers = function(inputElem) {
		AdminGroupsService.addUsers(inputElem.files[0], $scope.groupId)
			.then(function(data){
				openUsersPopup(data);
				inputElem.value = null;
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	openConfirmPopup = function(submitFunction, submitData, msgString) {
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

	$scope.confirmDeleteUserFromGroup = function(user) {
		var msg = "<div> Are you sure you want to remove user <b>" 
			+ user.firstName + " " + user.lastName + " (" + user.uID 
			+ ") </b> from group <b>" + $scope.groupName + "</b>?";
		var popupInstance = openConfirmPopup(deleteUserFromGroup, user, msg);
	    
	    popupInstance.result.then(function () {
			//TODO: fix so only removes user from list if they were successfully deleted
			var index = $scope.userList.indexOf(user);
			$scope.userList.splice(index, 1);
		});
	}

	deleteUserFromGroup = function(user) {
		AdminGroupsService.deleteUserFromGroup(user.uID, $scope.groupId)
			.then(function(){
				//handled on close of popup
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.confirmDeleteAllUsersFromGroup = function() {
		var userString = $scope.userList.length == 1 ? "1 user" : "all " + $scope.userList.length + " users";
		var msg = "<div> Are you sure you want to remove <b> " + userString + " </b> from group <b>" + $scope.groupName + "</b>?";
		var popupInstance = openConfirmPopup(deleteAllUsersFromGroup, null, msg);
	    
	    popupInstance.result.then(function () {
			$scope.userList = [];
		});
	}

	deleteAllUsersFromGroup = function() {
		AdminGroupsService.deleteAllUsersFromGroup($scope.groupId)
			.then(function(data){
				$scope.userList = [];
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.cancel = function () {
		$uibModalInstance.close();
	};

	openUsersPopup = function(data){
		var popupInstance = $uibModal.open({
			templateUrl: 'addUsersPopup.html',
			controller: 'AddUsersModalCtrl',
			resolve: {
				groupName: function () {
					return $scope.groupName; //set by getGroupInfo
				},
				addedUsers: function () {
					return data.addedUsers;
				},
				usersAlreadyInGroup: function () {
					return data.usersAlreadyInGroup;
				},
				usersNotInMaster: function () {
					return data.usersNotInMaster;
				}
			}
	    });

	    popupInstance.result.then(function () {
			getUsers();
		});
	};
};

angular.module('mainApp').controller('AddUsersModalCtrl', AddUsersModalCtrl);
function AddUsersModalCtrl ($scope, $uibModalInstance, groupName, addedUsers, usersAlreadyInGroup, usersNotInMaster) {

	$scope.groupName = groupName;
	$scope.addedUsers = addedUsers;
	$scope.usersAlreadyInGroup = usersAlreadyInGroup;
	$scope.usersNotInMaster = usersNotInMaster;

	$scope.cancel = function () {
		$uibModalInstance.close();
	};
};