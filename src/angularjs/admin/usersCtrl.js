angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, $uibModal, AdminUsersService) {
	$scope.pageClass = 'users';  //used to change pages in index.php

	$scope.showDownload = true;
	$scope.showDate = false;
	$scope.keyDate = new Date();
	
	//convert the offset from local to UTC time
  	//return an integer that represents the UTC offset from the local time
  	UsersCtrl.generateOffset = function(timestamp){
  		//date manipulation crap
		var jsDate = new Date(timestamp); //converts to javascript date object
		var offset = jsDate.getTimezoneOffset() * 60000; //retrieves offset from utc time
		return offset;
 	 }
	
	//convert javascript date back to local from UTC time
	//do this before sending data back to the database
	//the database is going to convert this back to its version of UTC time 
  	UsersCtrl.convertFromUTCtoLocal = function(timestamp){
  		//date manipulation crap
	  	var jsDate = new Date(timestamp); //converts to javascript date object
	  	var offset = UsersCtrl.generateOffset(timestamp);

	  	var selectedTime = jsDate.getTime(); //retrieves the time selected
	  	var utc = selectedTime - offset; //convert to UTC time by adding the offset
	  	var TimeZoned = new Date(utc) //create new date object with this time

	  	return TimeZoned;
  	}
  	
	var prevDate = new Date($scope.keyDate);
	prevDate.setDate($scope.keyDate.getDate());
	prevDate = UsersCtrl.convertFromUTCtoLocal(prevDate);
	
	var today = {keyDate: prevDate}
	AdminUsersService.keyList(today);
	
	$scope.generateKeyList = function() {
	
		var prevDate = new Date($scope.keyDate);
		prevDate.setDate($scope.keyDate.getDate());
		prevDate = UsersCtrl.convertFromUTCtoLocal(prevDate);
	
		var info = {
			keyDate: prevDate
		}
			AdminUsersService.keyList(info);
			$scope.showDate = false;
			$scope.showDownload = true;	
	}
	
	
	$scope.removeKeyList = function() {
		$scope.showDownload = false;
		$scope.showDate = true;		
	}

	openUploadPopup = function(data, dept){

	    var popupInstance = $uibModal.open({
			templateUrl: 'uploadPopup.html',
			controller: 'ModalInstanceCtrl',
			resolve: {
				department: function () {
					return dept;
				},
				numUsersInDept: function () {
					return data.numUsersInDept;
				},
				numUsersDeleted: function () {
					return data.numUsersDeleted;
				},
				badFormatUsers: function () {
					return data.badFormatUsers;
				},
				badClassUsers: function () {
					return data.badClassUsers;
				},
				badEmailUsers: function () {
					return data.badEmailUsers;
				}
			}
	    });
	};

	$scope.uploadMasterList = function(inputElem, dept) {
		AdminUsersService.uploadMasterList(inputElem.files[0], dept)
		.then(function(data){
				openUploadPopup(data, dept);
				inputElem.value = null;
			},
			function(errorMsg) {
				alert(errorMsg); 
			});
	}

	$scope.getUsersFile = function(dept) {
		AdminUsersService.getUsersFile(dept);
	}

};

angular.module('mainApp').controller('ModalInstanceCtrl', ModalInstanceCtrl);

function ModalInstanceCtrl ($scope, $uibModalInstance, department, numUsersInDept, numUsersDeleted, badFormatUsers, badClassUsers, badEmailUsers) {

	$scope.department = department;
	$scope.numUsersInDept = numUsersInDept;
	$scope.numUsersDeleted = numUsersDeleted;
	$scope.badFormatUsers = badFormatUsers;
	$scope.badClassUsers = badClassUsers;
	$scope.badEmailUsers = badEmailUsers;


	$scope.ok = function () {
		$uibModalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
};
