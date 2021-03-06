//written by Erin Gallagher, Shannon Klett & Lexi Flynn
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
	
	commService.getRoomInfo = function(info) {
		var q = $q.defer();
		BookingCommService.getRoomInfo(info)
		.then(function(data){
				q.resolve(data);
			},
			function(err){
				alert("error with getRoomInfo");
				q.reject();
			});
		return q.promise;
	}



	commService.createGroup = function(groupInfo) {
		var q = $q.defer();
		AdminCommService.createGroup(groupInfo)
		.then(function(groupID){
				// don't know why, but the return from adminCommService is an object
				//q.resolve(groupID.data);
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
				// don't know why, but the return is an object
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
	
	commService.getUserInfo = function(uID) {
		var q = $q.defer();
		AdminCommService.getUserInfo(uID)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(errorMsg){
				q.reject(errorMsg.data);
			});
		return q.promise;	
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

	commService.getUsersFile = function(dept){
		var q = $q.defer();
		UserCommService.getUsersFile(dept)
			.then(function(response) {
				q.resolve(response.data);
			},
			function(data){
				q.reject(data.data);
			});
		return q.promise;
	}

	commService.getWeeklyBookingsFromDb = function(start, end, building, userType){
		var q = $q.defer();
		BookingCommService.getWeeklyBookingsFromDb(start, end, building)
			.then(function(buildingWeeklyBookings){
				var formattedBuildingWeeklyBookings = BookingCommService.formatBuildingWeeklyBookings(buildingWeeklyBookings.data, userType);
				console.log(formattedBuildingWeeklyBookings);
				q.resolve(formattedBuildingWeeklyBookings);
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
				console.log(bookingObject);
				console.log(bookingObject.data.bookingID);
				q.resolve(bookingObject.data.bookingID);
			},function(errorStatus){
				q.reject(errorStatus.data.msg);
			});
		return q.promise;
	}

	commService.bookRoomRecurrInDB = function(roomInformation){
		var q = $q.defer();
		BookingCommService.bookRoomRecurrInDB(roomInformation)
			.then(function(bookingObject){
				q.resolve(bookingObject.data);
			},function(errorStatus){
				q.reject(errorStatus.data.msg);
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

	commService.cancelAllRecurringBookings = function(reccurringID){
		var q = $q.defer();
		BookingCommService.cancelAllRecurringBookings(reccurringID)
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
				console.log(response.data);
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

	commService.search = function(searchCriteria,userType){
		var q = $q.defer();
		BookingCommService.search(searchCriteria)
		.then(function(reponse){
			var formattedBuildingWeeklyBookings = BookingCommService.formatBuildingWeeklyBookings(reponse.data,userType);
				q.resolve(formattedBuildingWeeklyBookings);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}

	//retirieve a users bookings
	commService.retrieveUserBookings = function(uID){
		var q = $q.defer();
		BookingCommService.retrieveUserBookings(uID)
			.then(function(userBookings){
				var formatteduserBookings = {};
				 formatteduserBookings.bookings = BookingCommService.convertUserBookingsToExpectedFormat(userBookings.data.bookings);
				 formatteduserBookings.recurringBookings = BookingCommService.convertRecurringUserBookingsToExpectedFormat(userBookings.data.recurringBookings);
				q.resolve(formatteduserBookings);
			},
			function(err){
				q.reject(err);
			});
		return q.promise;
	}

	//retirve the hours remaining for a week.
	//determines the week based on the date provided and the week it is within
	commService.hoursRemaining = function(date){
		var q = $q.defer();
		BookingCommService.hoursRemaining(date)
			.then(function(remainingHours){
				q.resolve(remainingHours.data);
			},
			function(err){
				q.reject(err);
			});
		return q.promise;
	}

	commService.eventColourPicker = function(reason){
		return BookingCommService.eventColourPicker(reason);
	}

	return commService;
}