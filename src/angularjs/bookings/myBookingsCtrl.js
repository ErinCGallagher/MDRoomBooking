angular
.module('mainApp')
.controller('MyBookingsCtrl', MyBookingsCtrl);

function MyBookingsCtrl($scope, $uibModal, $log, MyBookingsService, SharedVariableService) {

	$scope.pageClass = 'myBookings'; //used to change pages in index.html
	$scope.hours = 30;
	$scope.userName = SharedVariableService.name;
	$scope.email = SharedVariableService.netID + "@queensu.ca";
	$scope.bookings = MyBookingsService.userBookings;

	//retrieve future user bookings for display
	MyBookingsService.retrieveUserBookings();

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
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}

};
