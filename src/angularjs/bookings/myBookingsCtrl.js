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


	//cancel a booking, open modal for comfirmation
	$scope.cancel = function(bookingInfo){
		console.log(bookingInfo);

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

	$scope.toggleDetail = function($index) {

		console.log($index);
        //$scope.isVisible = $scope.isVisible == 0 ? true : false;

        console.log($scope.activePosition);
        $scope.activePosition = $scope.activePosition == $index ? -1 : $index;
    };

};
