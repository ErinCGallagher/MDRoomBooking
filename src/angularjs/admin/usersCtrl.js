angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, AdminUsersService) {

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.uploadList = function(uploadFile, dept) {
		console.log("UsersCtrl ", dept);
		AdminUsersService.uploadMasterList(uploadFile, dept)
		.then(function(data){
				$msg = 'Users Uploaded. ' + data.numUsersInDept + ' users in ' + dept + '.';
				$msg += data.numUsersDeleted + ' users deleted.';
				alert = { type: 'info', msg: $msg};
				$scope.alerts.push(alert);
			},
			function() {
				alert = { type: 'danger', msg: 'Error: No users were uploaded.'};
				$scope.alerts.push(alert);
			});
		
	}

};
