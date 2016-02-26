angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http, $q, BookingCommService, AdminCommService, UserCommService){

	var commService = {};

	commService.getAllGroups = function() {
		var q = $q.defer();
		AdminCommService.getAllGroups()
		.then(function(data){
				q.resolve(data);
			},
			function(err){
				alert("error with getAllGroups");
				q.reject();
			});
		return q.promise;
	}

	commService.createGroup = function(groupInfo) {
		var q = $q.defer();
		AdminCommService.createGroup(groupInfo)
		.then(function(groupID){
				// don't know why, but the return from adminCommService is an object
				q.resolve(groupID.data);
			},
			function(err){
				alert("error with createGroup");
				q.reject();
			});
		return q.promise;
	}
	
	commService.keyList = function(info) {
		var q = $q.defer();
		AdminCommService.keyList(info)
		.then(function(success){
				// don't know why, but the return from adminCommService is an object
				q.resolve(success);
			},
			function(err){
				alert("error with createGroup");
				q.reject();
			});
		return q.promise;
	}
	
	commService.saveModifyGroup = function(groupInfo) {
		var q = $q.defer();
		AdminCommService.saveModifyGroup(groupInfo)
		.then(function(groupID){
				// don't know why, but the return from adminCommService is an object
				q.resolve(groupID.data);
			},
			function(err){
				alert("error with createGroup");
				q.reject();
			});
		return q.promise;
	}

	commService.getGroupInfo = function(groupID) {
		return AdminCommService.getGroupInfo(groupID);
	}

	commService.addUsers = function(fileFormData){
		var q = $q.defer();
		AdminCommService.addUsers(fileFormData)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg.data);
			});
		return q.promise;
	}

	commService.getUsersInGroup = function(id){
		var q = $q.defer();
		AdminCommService.getUsersInGroup(id)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}

	commService.deleteUserFromGroup = function(userId, groupId){
		var q = $q.defer();
		AdminCommService.deleteUserFromGroup(userId, groupId)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg);
			});
		return q.promise;
	}

	commService.deleteAllUsersFromGroup = function(groupId){
		var q = $q.defer();
		AdminCommService.deleteAllUsersFromGroup(groupId)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg.data);
			});
		return q.promise;
	}

	commService.deleteGroup = function(groupId){
		var q = $q.defer();
		AdminCommService.deleteGroup(groupId)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg.data);
			});
		return q.promise;
	}

	commService.uploadMasterList = function(fileFormData){
		var q = $q.defer();
		UserCommService.uploadMasterList(fileFormData)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(data){
				q.reject(data.data);
			});
		return q.promise;
	}

	commService.getWeeklyBookingsFromDb = function(start, end, building){
		var q = $q.defer();
		BookingCommService.getWeeklyBookingsFromDb(start, end, building)
			.then(function(buildingWeeklyBookings){
				var formattedBuildingWeeklyBookings = BookingCommService.formatBuildingWeeklyBookings(buildingWeeklyBookings.data);
				q.resolve(formattedBuildingWeeklyBookings);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	commService.getBookingInformation = function(bookingId){
		var q = $q.defer();
		BookingCommService.getBookingInformation(bookingId)
			.then(function(bookingInformation){
				q.resolve(bookingInformation);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}		

	//call the php script that adds a booking to the DB
	commService.bookRoomInDB = function(roomInformation){
		var q = $q.defer();
		BookingCommService.bookRoomInDB(roomInformation)
			.then(function(bookingObject){
				q.resolve(bookingObject.data);
			},function(errorStatus){
				q.reject(errorStatus.status);
			});
		return q.promise;
	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need commService.
	commService.convertToExpectedFormat = function(dailyBookings){

		return BookingCommService.convertToExpectedFormat(dailyBookings);

	}

	commService.cancelBooking = function(bookingID,startTime) {
		var q = $q.defer();
		BookingCommService.cancelBooking(bookingID,startTime)
			.then(function(){
				q.resolve();
			},
			function(err){
				q.reject(err);
			});
		return q.promise;
	}

	// USER COMM SERVICE FUNCTIONS
	commService.initialRetrival = function(){
		var q = $q.defer();
		UserCommService.initialRetrival()
			.then(function(response){
				q.resolve(response.data);
			},
			function(err){
				q.reject(err);
			});
		return q.promise;
	}

	commService.signOut = function(){
		var q = $q.defer();
		UserCommService.signOut()
			.then(function(){
				q.resolve();
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	commService.search = function(searchCriteria){
		var q = $q.defer();
		BookingCommService.search(searchCriteria)
		.then(function(reponse){
			var formattedBuildingWeeklyBookings = BookingCommService.formatBuildingWeeklyBookings(reponse.data);
				q.resolve(formattedBuildingWeeklyBookings);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//for user testing only
	commService.changeUserType = function(userPermision){
		var q = $q.defer();
		UserCommService.changeUserType(userPermision)
			.then(function(response){
				q.resolve();
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	



	return commService;
}