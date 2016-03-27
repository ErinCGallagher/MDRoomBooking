angular
.module('mainApp')
.controller('UsersCtrl', UsersCtrl);

function UsersCtrl($scope, $uibModal, AdminUsersService, ConstantTextSerivce, SharedVariableService, ConfirmationPopupService) {
	$scope.pageClass = 'users';  //used to change pages in index.php
	$scope.showUserInfo = false;
	$scope.showNoUser= false;
	$scope.userGroups = [];
	$scope.bookings = AdminUsersService.userBookings;
	$scope.recurringBookings = AdminUsersService.recurringUserBookings;
	$scope.num = 0;
	
	$scope.searchUser = function() {
		$scope.userGroups = [];
		$scope.userBookings = [];
		getUserInfo($scope.userSearch);
		AdminUsersService.retrieveUserBookings($scope.userSearch)
	}
	
	getUserInfo = function(uID){
		AdminUsersService.getUserInfo(uID)
			.then(function(userInfo){
			if (userInfo== "nothing") {
				$scope.user = userInfo;
				$scope.showUserInfo = false;
				$scope.showNoUser= true;
			}
			else {
				$scope.showNoUser= false;
				$scope.showUserInfo = true;
				$scope.user = uID;
				$scope.firstName = userInfo[0].firstName; 
				$scope.lastName = userInfo[0].lastName;
				$scope.searchedUserType = userInfo.class;
				if($scope.searchedUserType !="Student"){
					$scope.curHrs ="Unlimited";
					$scope.nextHrs = "Unlimited";
				}else{
					$scope.curHrs = userInfo.curWeekHrs;
					$scope.nextHrs = userInfo.nextWeekHrs;
				}
				$scope.userDepartment = userInfo.department;
				
				/*
				$scope.curWeekHrs = userInfo[0].curWeekHrs;
				$scope.nextWeekHrs = userInfo.data[0].nextWeekHrs;
				*/
				num = parseInt(userInfo[1].numGroups);	
				num = num + 2;	
				console.log(num);	
				for (var i = 2; i < num; i++) {
					//userInfo[i].startTime = new Date(userInfo[i].startTime)
					if (userInfo[i].addHrsType == "week") {
						userInfo[i].specialHrs = "N/A"
					}
					$scope.userGroups.push(userInfo[i])
				}	
			}
				
			},
			function() {
				alert("err");
			});
		
	}

	$scope.alerts = [];

	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};

	
	
	//cancel a booking, open modal for comfirmation
	$scope.cancel = function(bookingInfo,recurring){

	    var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancel.html',
	        controller: 'ConfirmCancelCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return bookingInfo;
	          },
	          recurring: function () {
	            	return recurring;
	          },
	          sourcePage: function () {
	            	return "users";
	          },

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	        getUserInfo($scope.userSearch); //refresh hours
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	    });
	}

	$scope.cancelAllRecur = function(reBooking){
		var confirmCancelPopupInstance = $uibModal.open({
	        templateUrl: 'confirmCancelAllRecur.html',
	        controller: 'ConfirmCancelAllRecurCtrl',
	        resolve: {
	        	bookingInfo: function () {
	            	return reBooking;
	          	},
	          	sourcePage: function () {
	            	return "users";
	          	},

	        }
	    });

	    confirmCancelPopupInstance.result.then(function (alert) {
	        $scope.alerts.push(alert);
	    }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
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

	$scope.confirmUploadMasterList = function(inputElem, dept) {
		var msg = "<div>Are you sure you want to replace the <b>" + dept + " Master List</b> with <b>" + inputElem.files[0].name + "</b> ?<br><br>This action may <b>delete users and their bookings</b>." 
		+ " Download the current master list first if you would like a backup.</div>";
		var functionInput = {inputElem:inputElem, department:dept};
		var popupInstance = ConfirmationPopupService.open(uploadMasterList, functionInput, msg);
		popupInstance.result.then(function () {
			inputElem.value = null;
		}, function () {
			inputElem.value = null;
		});
	}

	uploadMasterList = function(functionInput) {
		var inputElem = functionInput.inputElem;
		console.log(functionInput);
		var dept = functionInput.department;
		AdminUsersService.uploadMasterList(inputElem.files[0], dept)
		.then(function(data){
				openUploadPopup(data, dept);
			},
			function(errorMsg) {
				alert(errorMsg); 
			});
	}

	$scope.getUsersFile = function(dept) {
		AdminUsersService.getUsersFile(dept);
	}

	//expands recurring bookin information
	$scope.toggleDetail = function(rID) {
        //$scope.isVisible = $scope.isVisible == 0 ? true : false;
        $scope.activePosition = $scope.activePosition == rID ? -1 : rID;
    };


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

	/* from my bookings*/
	$scope.header_date = ConstantTextSerivce.MY_BOOKINGS.DATE.NAME;
	$scope.header_time = ConstantTextSerivce.MY_BOOKINGS.TIME.NAME;
	$scope.header_building_name = ConstantTextSerivce.MY_BOOKINGS.BUILDING.NAME;
	$scope.header_room_num = ConstantTextSerivce.MY_BOOKINGS.ROOM_NUM.NAME;
	$scope.header_key_req = ConstantTextSerivce.MY_BOOKINGS.KEY_REQ.NAME;
	$scope.header_reason = ConstantTextSerivce.MY_BOOKINGS.REASON.NAME;
	$scope.header_click_cancel = ConstantTextSerivce.MY_BOOKINGS.CLICK_CANCEL.NAME;
	$scope.title_my_bookings = ConstantTextSerivce.MY_BOOKINGS.MY_BOOKINGS.NAME;
	$scope.title_rec_bookings = ConstantTextSerivce.MY_BOOKINGS.MY_REC_BOOKINGS.NAME;
	$scope.rec_info = ConstantTextSerivce.MY_BOOKINGS.REC_INFO.NAME;
	$scope.header_day_week = ConstantTextSerivce.MY_BOOKINGS.DAY_WEEK.NAME;
	$scope.header_bookings_remain = ConstantTextSerivce.MY_BOOKINGS.BOOKINGS_REMAIN.NAME;

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
