angular
.module('mainApp')
.service('UserCommService', UserCommService);

//communication Service
function UserCommService($http){

	var userCommService = {};

	userCommService.initialRetrival = function(){
		var promisePost = $http.post('src/php/whitelist/initial.php')
			    .success(function(data, status) {
			    	console.log(data);
			    })
			    .error(function(data, status) {

			    });

		return promisePost;
	}

	userCommService.uploadMasterList = function(fileFormData){
		// send config object as well
		var promisePost =  $http.post('src/php/users/uploadUserList.php', fileFormData, {
			transformRequest: angular.identity,
           	headers: {'Content-Type': undefined}
       	})
		    .success(function(data, status) {
		    	console.log("uploadMasterList ", data);
		    	return data;
		    })
		    .error(function(data) { //request to the php scirpt failed
		    	return data;
		    });
		 return promisePost;
	}


	return userCommService;
}

