angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http, $q, BookingCommService, AdminCommService, UserCommService){

	var commService = {};

	commService.getAllGroups = function() {
		return AdminCommService.getAllGroups();
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
			},			function(err){
				q.reject();
			});
		return q.promise;
	}

	commService.getRooms = function(){
		var unFormattedRooms = BookingCommService.getRooms();
		return BookingCommService.formatRooms(unFormattedRooms);
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



	return commService;
}