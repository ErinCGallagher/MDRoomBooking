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

	adminGroupsService.saveModifyGroup = function(groupInfo) {
		CommService.saveModifyGroup(groupInfo)
		.then(function(newGroupId){
				
				//adminGroupsService.groups.push({groupID:newGroupId, groupName:newGroupName})
			},
			function(err){
				alert("error with saveModifyGroup");
			});
	}	

	adminGroupsService.getGroupInfo = function(groupId) {
		return CommService.getGroupInfo(groupId);
	}

	adminGroupsService.addUsers = function(uploadFile, groupId) {
		var fileFormData = new FormData();
		fileFormData.append('fileToUpload', uploadFile); 
		fileFormData.append('groupID', groupId);

		var q = $q.defer();
		CommService.addUsers(fileFormData)
		.then(function(data){
				q.resolve(data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}	

	adminGroupsService.getUsersInGroup = function(id) {
		var q = $q.defer();
		CommService.getUsersInGroup(id)
		.then(function(data){
				q.resolve(data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}

	adminGroupsService.deleteUserFromGroup = function(userId, groupId){
		var q = $q.defer();
		CommService.deleteUserFromGroup(userId, groupId)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}

	return adminGroupsService;

};