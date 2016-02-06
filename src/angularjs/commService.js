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

	commService.search = function(searchCriteria){
		var q = $q.defer();
		BookingCommService.search(searchCriteria)
		.then(function(reponse){
				q.resolve(reponse.data);
			},
			function(err){
				q.reject();
			});
		return q.promise;
	}



	return commService;
}