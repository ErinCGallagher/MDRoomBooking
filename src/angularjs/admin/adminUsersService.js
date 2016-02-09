angular
.module('mainApp')
.service('AdminUsersService', AdminUsersService);

function AdminUsersService(CommService, $q){
	var adminUsersService = {};
	
	adminUsersService.uploadMasterList = function(uploadFile, dept) {
		var fileFormData = new FormData();
		fileFormData.append('fileToUpload', uploadFile); 
		fileFormData.append('department', dept);

		var q = $q.defer();
		CommService.uploadMasterList(fileFormData)
			.then(function(response) {
				q.resolve(response);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}	

	return adminUsersService;

};