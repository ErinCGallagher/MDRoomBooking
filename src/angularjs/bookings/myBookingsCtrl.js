angular
.module('mainApp')
.controller('MyBookingsCtrl', MyBookingsCtrl);

function MyBookingsCtrl($scope, $uibModal, $log, MyBookingsService, SharedVariableService) {

	$scope.pageClass = 'myBookings'; //used to change pages in index.html
	$scope.hours = 0;
	$scope.userName = SharedVariableService.name;
	$scope.email = SharedVariableService.netID + "@queensu.ca";
	$scope.bookings = MyBookingsService.userBookings;
	$scope.recurringBookings = MyBookingsService.recurringUserBookings;

	//retrieve future user bookings for display
	MyBookingsService.retrieveUserBookings();

	$scope.retrieveHours = function(){
		MyBookingsService.retrieveHoursRemaining()
		.then(function(retrievedHours){
			if(SharedVariableService.userType != "student"){
				$scope.hours = "Unlimited";
			}
			else{
				$scope.hours = retrievedHours
			}

		},
		function(err){

		});
	}

	$scope.retrieveHours();

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};

	$scope.cancelAllRecur = function(reBooking){
		var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancelAllRecur.html',
	        controller: 'ConfirmCancelAllRecurCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return reBooking;
	          },

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	        $scope.retrieveHours();
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}


	//cancel a booking, open modal for comfirmation
	$scope.cancel = function(bookingInfo){

	    var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancel.html',
	        controller: 'ConfirmCancelCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return bookingInfo;
	          },

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	        $scope.retrieveHours();
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	$scope.toggleDetail = function(rID) {
        //$scope.isVisible = $scope.isVisible == 0 ? true : false;
        $scope.activePosition = $scope.activePosition == rID ? -1 : rID;
    };

};
