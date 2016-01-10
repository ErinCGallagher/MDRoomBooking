angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){

	$scope.groups = AdminGroupsService.groups;
	
	AdminGroupsService.getAllGroups();

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
		AdminGroupsService.createGroup(info);
	}

	$scope.showGroup = function(groupId) {
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		getGroupInfo(groupId);
	}

	getGroupInfo = function(groupId){
		AdminGroupsService.getGroupInfo(groupId)
			.then(function(groupInfo){
				$scope.groupName = groupInfo.data[0].GroupName;
				$scope.hoursPerWeek = groupInfo.data[0].HrsPerWeek;
			},
			function() {
				alert("err");
			});
		
	}

};