angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){

	$scope.groups = [];
	var init = function () {
		$scope.groups = AdminGroupsService.getAllGroups();
		console.log("This is groups ", $scope.groups)
	
	};
	// and fire it after definition
	init();
	

	$scope.showInfo = false;
	$scope.showNewGroup = false;

	$scope.newGroup = function(){
		$scope.showNewGroup = true;
		$scope.showInfo = false;
		createGroup();
	}
	
	createGroup = function(){
		var newGroupName = "New";
		var newHoursPerWeek = 10;
		var info = {
			groupName: newGroupName,
			hoursPerWeek: newHoursPerWeek
		}
		var newGroupId = AdminGroupsService.createGroup(info);
		$scope.groups.push({groupId:newGroupId, groupName:newGroupName})
	}

	$scope.showGroup = function(groupId) {
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		getGroupInfo(groupId);
	}

	getGroupInfo = function(groupId){
		var groupInfo = AdminGroupsService.getGroupInfo(groupId);
		$scope.groupName = groupInfo.groupName;
		$scope.hoursPerWeek = groupInfo.hoursPerWeek;
	}

};