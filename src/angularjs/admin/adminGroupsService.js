angular
.module('mainApp')
.service('AdminGroupsService', AdminGroupsService);

function AdminGroupsService(CommService, $q){
	var adminGroupsService = {};

	adminGroupsService.getAllGroups = function() {
		// var groupNames = [];
		// var groups = CommService.getAllGroups();

		// for (var i = 0; i < groups.length; i++){
		// 	groupNames.push(groups[i].groupName);
		// }

		// return groupNames;
		return CommService.getAllGroups();
	}

	adminGroupsService.createGroup = function(groupInfo) {
		return CommService.createGroup(groupInfo);
	}	

	adminGroupsService.getGroupInfo = function(groupId) {
		return CommService.getGroupInfo(groupId);
	}	

	return adminGroupsService;

};