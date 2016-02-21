angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, $uibModal, AdminGroupsService){
	$scope.pageClass = 'groups';  //used to change pages in index.html
	$scope.groupId; // used by addUsers(), set by showGroup()
	$scope.groups = [];
	$scope.showInfo = false;
	$scope.showNewGroup = false;
	$scope.showModGroup = false;
	
	getAllGroups = function () {
		AdminGroupsService.getAllGroups()
			.then(function(groupList) {
				$scope.groups = [];	
				for (var i = 0; i < groupList.length; i++){
					$scope.groups.push(groupList[i]);
				}
			},
			function(err) {
				alert("could not retrieve groups from database");
			});
	}

	getAllGroups();

	$scope.newGroup = function(){
		$scope.showNewGroup = true;
		$scope.showInfo = false;
		$scope.showModGroup = false;
	}

    //Function to change restriction value when 
    //selected by user creating a group
    $scope.changeRes = function(restriction) {
        if (restriction == 'YES') {
        	$scope.restriction = 'NO';
        	$scope.restrictionM = 'NO';
        }
        else if (restriction == 'NO'){
        	$scope.restriction = 'YES';
        	$scope.restrictionM = 'YES';
        }
    } 
    
    //Function to change fall value when 
    //selected by user creating a group
    $scope.changeFall = function(fall) {
        if (fall == 'YES') {
        	$scope.fall = 'NO';
        }
        else if (fall == 'NO'){
        	$scope.fall = 'YES';
        }
    } 
    
     //Function to change winter value when 
    //selected by user creating a group
    $scope.changeWinter = function(winter) {
        if (winter == 'YES') {
        	$scope.winter = 'NO';
        }
        else if (winter == 'NO') {
        	$scope.winter = 'YES';
        }
    }
     
    //Function to change summer value when 
    //selected by user creating a group
    $scope.changeSummer = function(summer) {
        if (summer == 'YES' ) {
        	$scope.summer = 'NO';
        }
        else if (summer == 'NO'){
        	$scope.summer = 'YES';
        }
    } 
    

	$scope.createGroup = function(){
		//Keep a record of the new group name
		var newGroupName = $scope.newName;
		
		//Set variables of inputs to send to back end 
		var info = {
			groupName: $scope.newName,
			hours: $scope.hours,
			addHrsType: $scope.addHrsType,
			hasBookingDurationRestriction: $scope.restriction,
			fall: $scope.fall,
			winter: $scope.winter,
			summer: $scope.summer,
			startDate: $scope.startDate,
			endDate: $scope.endDate
		}
		
		//Send info about new group to back end
		AdminGroupsService.createGroup(info)
			.then(function(newGroupId){
				$scope.groups.push({groupID: newGroupId, groupName: newGroupName});
			},
			function() {
				alert("err");
			});
	}
	
	$scope.saveModifyGroup = function(){
		
		//Set variables of inputs to send to back end 
		var info = {
			groupName: $scope.newNameM,
			hours: $scope.hoursM,
			addHrsType: $scope.addHrsTypeM,
			hasBookingDurationRestriction: $scope.restrictionM,
			//fall: $scope.fallM,
			//winter: $scope.winterM,
			//summer: $scope.summerM,
			startDate: $scope.startDateM,
			endDate: $scope.endDateM,
			groupID: $scope.groupId
		}
		
		//Send info about new group to back end
		AdminGroupsService.saveModifyGroup(info);
		//alert("Group Changes Saved");
		$scope.showGroup($scope.groupId);
	}
	
	$scope.showGroup = function(group) {
		$scope.group = group; // used by deleteGroup()
		$scope.groupId = group.groupID; // used by addUsers()
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		$scope.showModGroup = false;
		getGroupInfo($scope.groupId);
	}

	getGroupInfo = function(groupId){
		AdminGroupsService.getGroupInfo(groupId)
			.then(function(groupInfo){
				$scope.groupName = groupInfo.data[0].groupName; // used in add users popup
				$scope.addHrsType = groupInfo.data[0].addHrsType;
				$scope.setHours = groupInfo.data[0].hours;
				$scope.numUsers = groupInfo.data[1].numUsers;
				$scope.setStartDate = groupInfo.data[0].startDate;
				$scope.setEndDate = groupInfo.data[0].endDate;
				$scope.hasBookingDurationRestriction = groupInfo.data[0].hasBookingDurationRestriction;
			},
			function() {
				alert("err");
			});
		
	}

	$scope.modifyGroup = function() {
	
		$scope.newNameM = $scope.groupName;
	 
		if ($scope.hasBookingDurationRestriction == 'YES') {
			$scope.restrictionM = 'YES';
		}	
		if ($scope.hasBookingDurationRestriction == 'YES') {
			$scope.restrictrionM = 'NO';
		}
		if ($scope.addHrsType == "week") {
			$scope.addHrsTypeM = '1';
		}
		if ($scope.addHrsType == "special") {
			$scope.addHrsTypeM = '2';
		}
		if ($scope.hasBookingDurationRestriction == 'YES') {
			$scope.restrictionM = 'YES';
		}
		if ($scope.hasBookingDurationRestriction == 'NO') {
			$scope.restrictionM = 'NO';
		}

		
		$scope.hoursM = parseInt($scope.setHours);
		
		$scope.startDateM = new Date($scope.setStartDate);
		$scope.endDateM =  new Date($scope.setStartDate);
		
		$scope.showInfo = false;
		$scope.showNewGroup = false;
		$scope.showModGroup = true;
	}
	

	$scope.addUsers = function(uploadFile) {
		AdminGroupsService.addUsers(uploadFile, $scope.groupId)
			.then(function(data){
				openUsersPopup(data);
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.viewUsers = function() {
		AdminGroupsService.getUsersInGroup($scope.groupId)
			.then(function(data){
				openViewUsersPopup(data);
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.deleteGroup = function() {
		AdminGroupsService.deleteGroup($scope.groupId)
			.then(function(data){
				//update group list?
				var index = $scope.groups.indexOf($scope.group);
				$scope.groups.splice(index, 1);
				$scope.showInfo = false;
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

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
	};

	openViewUsersPopup = function(userList){
		var popupInstance = $uibModal.open({
			templateUrl: 'viewUsersPopup.html',
			controller: 'ViewUsersModalCtrl',
			resolve: {
				groupId: function () {
					return $scope.groupId; //set by getGroupInfo
				},
				groupName: function () {
					return $scope.groupName; //set by getGroupInfo
				},
				userList: function () {
					return userList;
				}
			}
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
		$uibModalInstance.dismiss('cancel');
	};
};