angular
.module('mainApp')
.service('AdminCommService', AdminCommService);

function AdminCommService($http){
	var adminCommService = {};

	// returns list of groupID:groupName
	adminCommService.getAllGroups = function(){

		// return [{groupId:1, groupName:"Hey"}, {groupId:2, groupName:"Yo"}, {groupId:3, groupName:"Sup"}];

		var promisePost = $http.post('src/php/admin/getAllGroups.php')
		    .success(function(data, status) {
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
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}

	adminCommService.getGroupInfo = function(id) {
		var data = {groupId:id};

		var promisePost =  $http.post('src/php/admin/getGroupInfo.php', data)
		    .success(function(data, status) {
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 return promisePost;
	}

	return adminCommService;

};