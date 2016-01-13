angular
.module('mainApp')
.service('AdminGroupsService', AdminGroupsService);

function AdminGroupsService(CommService, $q){
	var adminGroupsService = {};
	adminGroupsService.groups = [];	

	adminGroupsService.getAllGroups = function() {
		var q = $q.defer();
		CommService.getAllGroups()
			.then(function(retreivedGroups) {
				for (var i = 0; i < retreivedGroups.data.length; i++){
					adminGroupsService.groups.push(retreivedGroups.data[i])
					console.log(retreivedGroups.data[i]);
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
		CommService.createGroup(groupInfo)
		.then(function(newGroupId){
				newGroupName = groupInfo.groupName;
				adminGroupsService.groups.push({groupID:newGroupId, groupName:newGroupName})
			},
			function(err){
				alert("error with createGroup");
			});
	}	

	adminGroupsService.getGroupInfo = function(groupId) {
		return CommService.getGroupInfo(groupId);
	}	

	return adminGroupsService;

};