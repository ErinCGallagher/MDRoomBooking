angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, AdminUsersService) {

	$scope.uploadList = function(uploadFile, dept) {
		console.log("UsersCtrl ", dept);
		AdminUsersService.uploadMasterList(uploadFile, dept)
		.then(function(data){
				alert(data.numUsersInDept, data.numUsersDeleted);
			},
			function() {
				alert("error");
			});
	}

};
