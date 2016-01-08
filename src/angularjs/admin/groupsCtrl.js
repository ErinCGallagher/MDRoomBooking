angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){

	$scope.groups = AdminGroupsService.getAllGroups();

	$scope.createGroup = function(){

	}

};