angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, AdminUsersService) {

	$scope.uploadList = function(uploadFile, dept) {
		AdminUsersService.uploadMasterList(uploadFile, dept)
		.then(function(data){
				alert(data);
			},
			function() {
				alert("error");
			});
	}

};
