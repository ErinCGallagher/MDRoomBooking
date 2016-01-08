angular
.module('mainApp')
.service('AdminCommService', AdminCommService);

function AdminCommService($http){
	var adminCommService = {};

	// returns list of groupID:groupName
	adminCommService.getAllGroups = function(){

		return [{groupId:1, groupName:"Hey"}, {groupId:2, groupName:"Yo"}, {groupId:3, groupName:"Sup"}];

		// var promisePost = $http.post('../php/admin/getAllGroups.php')
		//     .success(function(data, status) {
		//     	console.log("all groups from database:");
		//     	console.log(data);
		//     })
		//     .error(function(data, status) {
		//     	return 'error';   
		//     });

		// return promisePost;
	}

	adminCommService.createGroup = function(groupInfo) {
		var data = groupInfo;

		var promisePost =  $http.post('../php/admin/createGroup.php', data)
		    .success(function(data, status) {
		    	console.log(data);
		    	return data;
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		    });
		 // return promisePost;
		 return 4;
	}

	return adminCommService;

};