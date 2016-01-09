angular
.module('mainApp')
.service('AdminGroupsService', AdminGroupsService);

function AdminGroupsService(CommService, $q){
	var adminGroupsService = {};
	adminGroupsService.groups = [];	

	adminGroupsService.getAllGroups = function() {
		// var groupNames = [];
		// var groups = CommService.getAllGroups();

		// for (var i = 0; i < groups.length; i++){
		// 	groupNames.push(groups[i].groupName);
		// }

		// return groupNames;
		var q = $q.defer();
		CommService.getAllGroups()
			.then(function(retreivedGroups) {
				console.log("Here", retreivedGroups.data);
				for (var i = 0; i < retreivedGroups.data.length; i++){
					console.log("GroupID", retreivedGroups.data[i].GroupID);
					adminGroupsService.groups.push(retreivedGroups.data[i])
					console.log(retreivedGroups.data[i])
				}
				q.resolve(adminGroupsService.groups);
			},
			function(err) {
				alert("could not retrieve groups from database");
				q.resolve(err);
			});
		return q.promise;
	}

	adminGroupsService.createGroup = function(groupInfo) {
		return CommService.createGroup(groupInfo);
	}	

	adminGroupsService.getGroupInfo = function(groupId) {
		return CommService.getGroupInfo(groupId);
	}	

	return adminGroupsService;

};