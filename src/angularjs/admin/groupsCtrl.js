angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){

	$scope.groups = AdminGroupsService.getAllGroups();

	$scope.createGroup = function(){
		var newGroupName = "New";
		var newHoursPerWeek = 10;
		var info = {
			groupName: newGroupName,
			hoursPerWeek: newHoursPerWeek
		}
		console.log(info);
		var newGroupId = AdminGroupsService.createGroup(info);
		$scope.groups.push({groupId:newGroupId, groupName:newGroupName})
	}

	$scope.getGroupInfo = function(groupId){
		//var groupInfo = AdminGroupsService.getGroupInfo(groupId);
		//console.log("getGroupInfo " + groupInfo);
		console.log("getGroupInfo " + groupId);
	}

};