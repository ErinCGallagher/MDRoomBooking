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

	// Similar code exists in myBookingsService (all below)
	//cancel a users own booking from the my bookings page
	adminUsersService.cancelBooking = function(bookingID,startTime,recurring){
		var q = $q.defer();
		CommService.cancelBooking(bookingID,startTime)
		.then(function(){
			if(!recurring){
				adminUsersService.updateBookingsDisplay(bookingID);
			}else{
				adminUsersService.updateSingleRecurringBooking(bookingID)
			}

			q.resolve();
		},
		function(err){
			q.resolve(err);
		});
		return q.promise;
	}

	//cancel all bookings associated with a reccuring booking
	adminUsersService.cancelAllRecurringBookings = function(reccurringID){
		var q = $q.defer();
		CommService.cancelAllRecurringBookings(reccurringID)
		.then(function(){
			adminUsersService.updateRecurringDisplay(reccurringID);
			q.resolve();
		},
		function(err){
			q.resolve(err);
		});
		return q.promise;
	}

	//after a booking has been canceled successfully, remove it from the my bookings table
	adminUsersService.updateBookingsDisplay = function(bookingID){
		var i = 0
		while(i < adminUsersService.userBookings.length){
			if(adminUsersService.userBookings[i].bookingID == bookingID){
				adminUsersService.userBookings.splice(i, 1);
				i = adminUsersService.userBookings.length;
			}
		i++;
		}

	}

		//cancel a single booking from a reccuring booking group
	//remove the enitre group if no more bookings remain
	adminUsersService.updateSingleRecurringBooking = function(bookingID){
		var i = 0;
		var j = 0;;
		while(i < adminUsersService.recurringUserBookings.length){
			while(j < adminUsersService.recurringUserBookings[i].recurringBooking.length){
				if(adminUsersService.recurringUserBookings[i].recurringBooking[j].bookingID == bookingID){
					adminUsersService.recurringUserBookings[i].recurringBooking.splice(j, 1);
					adminUsersService.recurringUserBookings[i].weeksRemaining -=1;
					j = adminUsersService.recurringUserBookings[i].recurringBooking.length;
				}
				if(j == 0){//if no recurring bookings are left, cancel the entire group
					updateRecurringDisplay(adminUsersService.recurringUserBookings[i].recurringID);
					i = adminUsersService.recurringUserBookings.length;
					break;
				}
			j++;
			}

		i++;
		}	
	}

	//after a booking has been canceled successfully, remove it from the my bookings table
	adminUsersService.updateRecurringDisplay = function(reccurringID){
		var i = 0
		while(i < adminUsersService.recurringUserBookings.length){
			if(adminUsersService.recurringUserBookings[i].recurringID == reccurringID){
				adminUsersService.recurringUserBookings.splice(i, 1);
				i = adminUsersService.recurringUserBookings.length;
			}
		i++;
		}

	}

	return adminUsersService;

};