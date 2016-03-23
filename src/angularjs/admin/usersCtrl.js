angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, $uibModal, AdminUsersService, ConstantTextSerivce) {
	$scope.pageClass = 'users';  //used to change pages in index.php
	$scope.showUserInfo = false;
	$scope.showNoUser= false;
	$scope.userGroups = [];
	$scope.userBookings = [];
	$scope.num = 0;
	
	$scope.searchUser = function() {
		$scope.userGroups = [];
		$scope.userBookings = [];
		getUserInfo($scope.userSearch);
	}
	
	getUserInfo = function(uID){
		AdminUsersService.getUserInfo(uID)
			.then(function(userInfo){
			if (userInfo.data[0] == "nothing") {
				$scope.user = userInfo.data[1];
				$scope.showUserInfo = false;
				$scope.showNoUser= true;
			}
			else {
				$scope.showNoUser= false;
				$scope.showUserInfo = true;
				$scope.user = uID;
				$scope.firstName = userInfo.data[0].firstName; 
				$scope.lastName = userInfo.data[0].lastName;
				$scope.curWeekHrs = userInfo.data[0].curWeekHrs;
				$scope.nextWeekHrs = userInfo.data[0].nextWeekHrs;
				num = parseInt(userInfo.data[1].numGroups);
				console.log("NUM GROUPS");
				console.log(num);		
				num = num + 2;	
				console.log(num);	
				for (var i = 2; i < num; i++) {
					//userInfo.data[i].startTime = new Date(userInfo.data[i].startTime)
					if (userInfo.data[i].addHrsType == "week") {
						userInfo.data[i].specialHrs = "N/A"
					}
					$scope.userGroups.push(userInfo.data[i])
				}
				
				for (var i = num; i < userInfo.data.length; i++) {
					$scope.userBookings.push(userInfo.data[i])
				}	
			}
				
			},
			function() {
				alert("err");
			});
		
	}
	

	
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
	     //   $scope.alerts.push(alert);
	     $scope.userGroups = [];
		 $scope.userBookings = [];
	     getUserInfo($scope.user);
	        
	    }, function () {
	       // $log.info('Modal dismissed at: ' + new Date());
	    });
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


	/* This Page's Text */
	$scope.upload_music = ConstantTextSerivce.USERS.UPLOAD_MUSIC.NAME;
	$scope.upload_drama = ConstantTextSerivce.USERS.UPLOAD_DRAMA.NAME;
	$scope.download_music = ConstantTextSerivce.USERS.DOWNLOAD_MUSIC.NAME;
	$scope.download_drama = ConstantTextSerivce.USERS.DOWNLOAD_DRAMA.NAME;
	$scope.user_search_title = ConstantTextSerivce.USERS.USER_SEARCH_TITLE.NAME;
	$scope.sarch_netID = ConstantTextSerivce.USERS.SEARCH_NETID.NAME;
	$scope.search_button = ConstantTextSerivce.USERS.SEARCH_BUTTON.NAME;
	$scope.netID = ConstantTextSerivce.USERS.NETID.NAME; 
	$scope.netID_not_found = ConstantTextSerivce.USERS.NETID_NOT_FOUND.NAME;
	$scope.netID_search_results = ConstantTextSerivce.USERS.NETID_SARCH_RESULT.NAME;
	$scope.user_name = ConstantTextSerivce.USERS.NAME.NAME; 
	$scope.weekly_hrs_remain = ConstantTextSerivce.USERS.WEEKLY_HRS_REMAIN.NAME;
	$scope.this_week = ConstantTextSerivce.USERS.THIS_WEEK.NAME;
	$scope.next_week = ConstantTextSerivce.USERS.NEXT_WEEK.NAME;
	$scope.week = ConstantTextSerivce.USERS.WEEK.NAME; 
	$scope.groups_ending = ConstantTextSerivce.USERS.GROUPS.NAME;
	$scope.groups_name = ConstantTextSerivce.USERS.GROUP_NAME.NAME;
	$scope.hrs_given = ConstantTextSerivce.USERS.HOURS_GIVEN.NAME;
	$scope.spec_hrs_remain = ConstantTextSerivce.USERS.SPEC_HRS_REMAIN.NAME;
	$scope.start_date = ConstantTextSerivce.USERS.START_DATE.NAME;
	$scope.end_date = ConstantTextSerivce.USERS.END_DATE.NAME;
	$scope.duration_restrict = ConstantTextSerivce.USERS.DURATION_RESTRICT.NAME;
	$scope.hours_type = ConstantTextSerivce.USERS.HOURS_TYPE.NAME;

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
