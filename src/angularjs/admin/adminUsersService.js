angular
.module('mainApp')
.service('AdminUsersService', AdminUsersService);

function AdminUsersService(CommService, $q){
	var adminUsersService = {};
	adminUsersService.userBookings = [];
	adminUsersService.recurringUserBookings = [];
	
	adminUsersService.getUserInfo = function(info) {
		var q = $q.defer();
		CommService.getUserInfo(info)
		.then(function(success){
				q.resolve(success);
			},
			function(err){
				alert("error with UserInfo");
				q.reject();
			});
		return q.promise;
	}
	
	
	
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

	adminUsersService.getUsersFile = function(dept) {
		CommService.getUsersFile(dept);
	}	



	//retrieve the users future bookings for display
	adminUsersService.retrieveUserBookings = function(uID){

		CommService.retrieveUserBookings(uID)
			.then(function(bookingsResponse){
				//non recurring bookings
				adminUsersService.userBookings.splice(0,adminUsersService.userBookings.length);
				for(var  i = 0; i < bookingsResponse.bookings.length; i++){
					adminUsersService.userBookings.push(bookingsResponse.bookings[i]);
				}

				//recurring bookings
				adminUsersService.recurringUserBookings.splice(0,adminUsersService.recurringUserBookings.length);
				for(var  j = 0; j < bookingsResponse.recurringBookings.length; j++){
					adminUsersService.recurringUserBookings.push(bookingsResponse.recurringBookings[j]);
				}
			},
			function(error){

			});
	}

	return adminUsersService;

};