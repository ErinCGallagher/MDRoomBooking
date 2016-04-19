//written by Shannon Klett & Lexi Flynn
angular
.module('mainApp')
.service('AdminGroupsService', AdminGroupsService);

function AdminGroupsService(CommService, $q){
	var adminGroupsService = {};

	adminGroupsService.getAllGroups = function() {
		var q = $q.defer();
		CommService.getAllGroups()
			.then(function(retreivedGroups) {
				q.resolve(retreivedGroups.data);
			},
			function(err) {
				alert("could not retrieve groups from database");
				q.resolve(err);
			});
		return q.promise;
	}

	adminGroupsService.createGroup = function(groupInfo) {
		var q = $q.defer();
		CommService.createGroup(groupInfo)
			.then(function(newGroupId) {
				q.resolve(newGroupId);
				//adminGroupsService.groups.push({groupID:newGroupId, groupName:newGroupName})
			},
			function(err){
				alert("error with saveModifyGroup");
			});
		return q.promise;
	}	

	adminGroupsService.saveModifyGroup = function(groupInfo) {
		var q = $q.defer();
		CommService.saveModifyGroup(groupInfo)
		.then(function(info){
				q.resolve(info);
				//adminGroupsService.groups.push({groupID:newGroupId, groupName:newGroupName})
			},
			function(err){
				alert("error with saveModifyGroup");
			});
		return q.promise;
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

	adminGroupsService.deleteAllUsersFromGroup = function(groupId){
		var q = $q.defer();
		CommService.deleteAllUsersFromGroup(groupId)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}

	adminGroupsService.deleteGroup = function(groupId){
		var q = $q.defer();
		CommService.deleteGroup(groupId)
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