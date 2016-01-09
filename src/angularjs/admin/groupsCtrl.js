angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){

	$scope.groups = [{GroupID:1, GroupName:"Hey"}];
	var init = function () {
		//$scope.groups = AdminGroupsService.getAllGroups();
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
		//$scope.groups.push({groupId:newGroupId, groupName:newGroupName})
	}

	$scope.showGroup = function(groupId) {
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		getGroupInfo(groupId);
	}

	getGroupInfo = function(groupId){
		AdminGroupsService.getGroupInfo(groupId)
			.then(function(groupInfo){
				console.log("GROUP INFO ", groupInfo);
				$scope.groupName = groupInfo.data[0].GroupName;
				$scope.hoursPerWeek = groupInfo.data[0].HrsPerWeek;
			},
			function() {
				alert("err");
			});
		
	}

};