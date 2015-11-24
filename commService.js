angular
.module('mainApp')
.service('CommService', CommService);

//communication Service
function CommService($http){

	var commService = {};

	commService.getDailyBookingsFromDb = function(date, room){
		$http.post('script.php', { "date" : room, "roomNum":room })
		    .success(function(data, status) {
		      return data; //all the bookings for the given date and room
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });

		}

	commService.getBookingInformation = function(bookingId){
		$http.post('db_scripts/GetBookingInfo1.php', { "BookingID" : bookingId})
		    .success(function(data, status) {
		    	 console.log(data);
		      return data; //all the bookings for the given date and room
		    })
		    .error(function(data, status) {
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });

		   
		}		

	//call the php script that adds a booking to the DB
	//
	commService.bookRoomInDB = function(roomInformation){
		$http.post('script.php', { "data" : roomInformation})
		    .success(function(data, status) {
		    	if(data = 'success'){
		    		return true; //successfully added the booking
		    	}
		    	else{
		    		return false; //could not add the booking
		    	}
		    })
		    .error(function(data, status) { //request to the php scirpt failed
		    	return 'error';
		      //$rootScope.data = data || "Request failed";
		      //$rootScope.status = status;     
		    });
	}


	//convert the daily bookings information to the correct font end format
	//not called by anything outside this service so does not need commService.
	convertToExpectedFormat = function(){
		//do some converting baby!
	}

	return commService;
}