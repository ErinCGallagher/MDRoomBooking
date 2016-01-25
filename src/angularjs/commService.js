angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http, $q, BookingCommService, AdminCommService){

	var commService = {};

	var buildingWeeklyBookingss = [
		{"HLH 102" : [
			{blockID: "3",
			bookingDate: "2016-01-19",
			bookingID: "4",
			endTime: "09:00:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "08:30:00",
			uID: "11ecg5",
			numBlocks: "1"},
			{blockID: "3",
			bookingDate: "2016-01-19",
			bookingID: "5",
			endTime: "09:30:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "09:00:00",
			uID: "11ecg5",
			numBlocks: "1"}
		]},
		{"HLH 103" : [
			{blockID: "4",
			bookingDate: "2016-01-20",
			bookingID: "4",
			endTime: "10:30:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "09:30:00",
			uID: "11ecg5",
			numBlocks: "1"},
		]},
		{"HLH 104" : [
			{blockID: "4",
			bookingDate: "2016-01-18",
			bookingID: "4",
			endTime: "10:30:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "09:30:00",
			uID: "11ecg5",
			numBlocks: "1"},
		]},
		{"HLH 105" : [
			{blockID: "4",
			bookingDate: "2016-01-19",
			bookingID: "4",
			endTime: "10:30:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "09:30:00",
			uID: "11ecg5",
			numBlocks: "1"},
		]},
		{"HLH 106" : [
			{blockID: "4",
			bookingDate: "2016-01-22",
			bookingID: "4",
			endTime: "10:30:00",
			reason: "Individual Rehearsal",
			roomID: "HLH 102",
			startTime: "09:30:00",
			uID: "11ecg5",
			numBlocks: "1"},
		]}
	];

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

	return commService;
}