angular
.module('mainApp')
.service('AdminCommService', AdminCommService);

function AdminCommService($http){
	var adminCommService = {};

	// returns list of groupID:groupName
	adminCommService.getAllGroups = function(){

		var promisePost = $http.post('src/php/admin/getAllGroups.php')
		    .success(function(data, status) {
		    	console.log("getAllGroups ", data);
		    	return data;
		    })
		    .error(function(data, status) {
		    	return 'error';   
		    });

		return promisePost;
	}

	adminCommService.createGroup = function(groupInfo) {

		var promisePost =  $http.post('src/php/admin/createGroup.php', groupInfo)
		    .success(function(data, status) {
		    	console.log("createGroup  ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}
	
	adminCommService.keyList = function(info) {

		var promisePost =  $http.post('src/php/admin/getKeyList.php', info)
		    .success(function(data, status) {
		    	console.log("KeyList  ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}
	
	
	adminCommService.saveModifyGroup = function(groupInfo) {

		var promisePost =  $http.post('src/php/admin/modifyGroupPermissions.php', groupInfo)
		    .success(function(data, status) {
		    	console.log("Modified Group Saved ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}
	
	adminCommService.getGroupInfo = function(id) {
		var data = {groupID:id};

		var promisePost =  $http.post('src/php/admin/getGroupInfo.php', data)
		    .success(function(data, status) {
		    	console.log("getGroupInfo ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}

	adminCommService.addUsers = function(fileFormData){
		// send config object as well
		var promisePost =  $http.post('src/php/admin/addUsers.php', fileFormData, {
			transformRequest: angular.identity,
           	headers: {'Content-Type': undefined}
       	})
		    .success(function(data, status) {
		    	console.log("addUsers ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	console.log(data);
		    	return data;
		    });

		 return promisePost;
	}
		    
	adminCommService.deleteUserFromGroup = function(userID, groupID) {
		var sendData = {uID:userID, groupID:groupID};

		var promisePost =  $http.post('src/php/admin/deleteUserFromGroup.php', sendData)
		    .success(function(data, status) {
		    	console.log("deleteUserFromGroup ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}

	adminCommService.deleteAllUsersFromGroup = function(groupID) {
		var sendData = {groupID:groupID};

		var promisePost =  $http.post('src/php/admin/deleteAllUsersFromGroup.php', sendData)
		    .success(function(data, status) {
		    	console.log("deleteAllUsersFromGroup ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return data;
		    });
		 return promisePost;
	}

	adminCommService.deleteGroup = function(groupID) {
		var sendData = {groupID:groupID};

		var promisePost =  $http.post('src/php/admin/deleteGroup.php', sendData)
		    .success(function(data, status) {
		    	console.log("deleteGroup ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return data;
		    });
		 return promisePost;
	}

	adminCommService.getUsersInGroup = function(id) {
		var data = {groupID:id};

		var promisePost =  $http.post('src/php/admin/getUsersInGroup.php', data)
		    .success(function(data, status) {
		    	console.log("getUsersInGroup ", data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	console.log(data);
		    	return data;
		    });
		 return promisePost;
	}

	return adminCommService;

};