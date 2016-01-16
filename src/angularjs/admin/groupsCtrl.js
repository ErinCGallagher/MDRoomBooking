angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){
	$scope.pageClass = 'groups';  //used to change pages in index.html

	$scope.groups = AdminGroupsService.groups;
	
	AdminGroupsService.getAllGroups();

	$scope.showInfo = false;
	$scope.showNewGroup = false;

	$scope.newGroup = function(){
		$scope.showNewGroup = true;
		$scope.showInfo = false;
	}
	
	$scope.createGroup = function(){
		var newGroupName = $scope.newName;
		console.log("newGroupName ", newGroupName);
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
				$scope.groupName = groupInfo.data[0].groupName;
				$scope.hoursPerWeek = groupInfo.data[0].hours;
			},
			function() {
				alert("err");
			});
		
	}

};