//written by Shannon Klett & Lexi Flynn
angular
.module('mainApp')
.controller('ViewUsersModalCtrl', ViewUsersModalCtrl);

//This popup appears after a user clicks the "Manage Users" button on the Groups page.
//Admins can view users in the group, then add or remove users
function ViewUsersModalCtrl ($scope, $uibModal, $uibModalInstance, ConfirmationPopupService, AdminGroupsService, groupId, groupName) {

	$scope.groupId = groupId;
	$scope.groupName = groupName;
	$scope.userList;

	// get current users in group
	getUsers = function() {
		AdminGroupsService.getUsersInGroup($scope.groupId)
			.then(function(data){
				$scope.userList = data;
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	getUsers(); //called when popup initially opened

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

	$scope.confirmDeleteUserFromGroup = function(user) {
		var msg = "<div> Are you sure you want to remove user <b>" 
			+ user.firstName + " " + user.lastName + " (" + user.uID 
			+ ") </b> from group <b>" + $scope.groupName + "</b>?";
		var popupInstance = ConfirmationPopupService.open(deleteUserFromGroup, user, msg);
	    
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
		var popupInstance = ConfirmationPopupService.open(deleteAllUsersFromGroup, null, msg);
	    
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


	// Open popup after adding users to group - shows result of addition.
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
				},
				badEmailUsers: function () {
					return data.badEmailUsers;
				}
			}
	    });

	    popupInstance.result.then(function () {
			getUsers(); // update user list displayed
		});
	};
};

// Popup that appears after adding users to group - shows result of addition.
angular.module('mainApp').controller('AddUsersModalCtrl', AddUsersModalCtrl);
function AddUsersModalCtrl ($scope, $uibModalInstance, groupName, addedUsers, usersAlreadyInGroup, usersNotInMaster, badEmailUsers) {

	$scope.groupName = groupName;
	$scope.addedUsers = addedUsers;
	$scope.usersAlreadyInGroup = usersAlreadyInGroup;
	$scope.usersNotInMaster = usersNotInMaster;
	$scope.badEmailUsers = badEmailUsers;

	$scope.cancel = function () {
		$uibModalInstance.close();
	};
};