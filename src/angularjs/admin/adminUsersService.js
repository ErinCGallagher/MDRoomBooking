angular
.module('mainApp')
.service('AdminUsersService', AdminUsersService);

function AdminUsersService(CommService, $q){
	var adminUsersService = {};
	
	adminUsersService.uploadMasterList = function(uploadFile, dept) {
		var fileFormData = new FormData();
		fileFormData.append('fileToUpload', uploadFile); 
		fileFormData.append('department', dept);
		return CommService.uploadMasterList(fileFormData);
	}	

	return adminUsersService;

};