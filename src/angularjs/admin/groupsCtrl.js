angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, $uibModal, AdminGroupsService){
	$scope.pageClass = 'groups';  //used to change pages in index.html
	$scope.groupId; // used by addUsers(), set by showGroup()
	$scope.groups = [];
	$scope.showInfo = false;
	$scope.showNewGroup = false;
	$scope.showModGroup = false;
	$scope.startDate = new Date();
	$scope.endDate = new Date();
	
	getAllGroups = function () {
		AdminGroupsService.getAllGroups()
			.then(function(groupList) {
				$scope.groups = [];	
				for (var i = 0; i < groupList.length; i++){
					$scope.groups.push(groupList[i]);
				}
				
			},
			function(err) {
				alert("could not retrieve groups from database");
			});
	}

	getAllGroups();

	$scope.newGroup = function(){
		$scope.newName = "New Group";
		$scope.hours = 1;
		$scope.addHrsType = "1";
		$scope.hasBookingDurationRestriction = true;
		$scope.fall = 'NO';
		$scope.winter = 'NO';
		$scope.summer = 'NO';
		$scope.startDate = new Date();
		$scope.endDate = new Date();
		$scope.showGroupTwo();
		$scope.showNewGroup = true;
		$scope.showInfo = false;
		$scope.showModGroup = false;
	}

    //Function to change restriction value when 
    //selected by user creating a group
    $scope.changeRes = function(restriction) {
        if (restriction == 'YES') {
        	$scope.restriction = 'NO';
        }
        else if (restriction == 'NO'){
        	$scope.restriction = 'YES';
        }
    } 
    
    
      //Function to change restriction value when 
    //selected by user creating a group
    $scope.changeResM = function(restrictionM) {
        if (restrictionM == 'YES') {
        	$scope.restrictionM = 'NO';
        }
        else if (restrictionM == 'NO'){
        	$scope.restrictionM = 'YES';
        }
    } 
    
    
    //Function to change fall value when 
    //selected by user creating a group
    $scope.changeFall = function(fall) {
        if (fall == 'YES') {
        	$scope.fall = 'NO';
        	
        }
        else if (fall == 'NO'){
        	$scope.startDate = new Date();
        	$scope.fall = 'YES';
        }
    } 
    
       //Function to change fall value when 
    //selected by user creating a group
    $scope.changeFallM = function(fallM) {
        if (fallM == 'YES') {
        	$scope.fallM = 'NO';
        	
        }
        else if (fallM == 'NO'){
        	$scope.startDate = new Date();
        	$scope.fallM = 'YES';
        }
    } 
    
     //Function to change winter value when 
    //selected by user creating a group
    $scope.changeWinter = function(winter) {
        if (winter == 'YES') {
        	$scope.winter = 'NO';
        }
        else if (winter == 'NO') {
        	$scope.winter = 'YES';
        }
    }
     
    //Function to change winter value when 
    //selected by user creating a group
    $scope.changeWinterM = function(winterM) {
        if (winterM == 'YES') {
        	$scope.winterM = 'NO';
        }
        else if (winterM == 'NO') {
        	$scope.winterM = 'YES';
        }
    }
    
    //Function to change summer value when 
    //selected by user creating a group
    $scope.changeSummer = function(summer) {
        if (summer == 'YES' ) {
        	$scope.summer = 'NO';
        	$scope.summerM = 'NO';
        }
        else if (summer == 'NO'){
        	$scope.summer = 'YES';
        	$scope.summerM = 'YES';
        }
    } 

	//Function to change summer value when 
    //selected by user creating a group
    $scope.changeSummerM = function(summerM) {
        if (summerM == 'YES' ) {
        	$scope.summerM = 'NO';
        }
        else if (summerM == 'NO'){
        	$scope.summerM = 'YES';
        }
    } 
	
	$scope.createGroup = function(){
		//Keep a record of the new group name
		var newGroupName = $scope.newName;	
		//Set variables of inputs to send to back end 
		var info = {
			groupName: $scope.newName,
			hours: $scope.hours,
			addHrsType: $scope.addHrsType,
			hasBookingDurationRestriction: $scope.restriction,
			fall: $scope.fall,
			winter: $scope.winter,
			summer: $scope.summer,
			startDate: $scope.startDate,
			endDate: $scope.endDate
		}
		
		//Send info about new group to back end
		AdminGroupsService.createGroup(info)
			.then(function(newGroupID){
				getGroupInfo(newGroupID);
				getAllGroups();
		
			//	$scope.group = ({groupID: newGroupId, groupName: newGroupName});
			},
			function() {
				alert("err");
			});
		$scope.showGroupTwo();
		
	}
	
	$scope.cancelCreateGroup = function() {
		$scope.showInfo = false;
		$scope.showNewGroup = false;
		$scope.showModGroup = false;
	}
	
	$scope.saveModifyGroup = function(){
		//Set variables of inputs to send to back end 
		var info = {
			groupName: $scope.newNameM,
			hours: $scope.hoursM,
			addHrsType: $scope.addHrsTypeM,
			hasBookingDurationRestriction: $scope.restrictionM,
			fall: $scope.fallM,
			winter: $scope.winterM,
			summer: $scope.summerM,
			startDate: $scope.startDateM,
			endDate: $scope.endDateM,
			groupID: $scope.groupId
		}
		
		//Send info about new group to back end
		AdminGroupsService.saveModifyGroup(info)
			.then(function(groupID){
				getGroupInfo(groupID);
				getAllGroups();
			//	$scope.showGroup($scope.group);
				$scope.showGroupTwo();
				
			},
			function() {
				alert("err");
			});		
		//getAllGroups();

	}
	
	$scope.cancelModifyGroup = function() {
		$scope.showGroup($scope.group);
	}
	
	
	$scope.showGroup = function(group) {
		$scope.group = group; // used by deleteGroup()
		$scope.groupId = group.groupID; // used by addUsers()
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		$scope.showModGroup = false;
		getGroupInfo($scope.groupId);
	}
	
	$scope.showGroupTwo = function() {
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		$scope.showModGroup = false;
	}
	
	getGroupInfo = function(groupId){
		AdminGroupsService.getGroupInfo(groupId)
			.then(function(groupInfo){
				$scope.groupName = groupInfo.data[0].groupName; // used in add users popup
				$scope.addHrsType = groupInfo.data[0].addHrsType;
				$scope.setHours = groupInfo.data[0].hours;
				$scope.numUsers = groupInfo.data[1].numUsers;
				$scope.setStartDate = groupInfo.data[0].startDate;
				$scope.setEndDate = groupInfo.data[0].endDate;
				$scope.hasBookingDurationRestriction = groupInfo.data[0].hasBookingDurationRestriction;
			},
			function() {
				alert("err");
			});
		
	}

    //TODO: probably a more efficient way to do this
	updateNumUsers = function(){
	    AdminGroupsService.getGroupInfo($scope.groupId)
	        .then(function(groupInfo){
	            $scope.numUsers = groupInfo.data[1].numUsers;
	        },
	        function() {
	            alert("err");
	        });
	}

	$scope.modifyGroup = function() {
	
		$scope.newNameM = $scope.groupName;
		
		if ($scope.addHrsType == "week") {
			$scope.addHrsTypeM = '1';
		}
		if ($scope.addHrsType == "special") {
			$scope.addHrsTypeM = '2';
		}
		
		if ($scope.hasBookingDurationRestriction == 'YES') {
			$scope.restrictionM = 'YES';
		}
		if ($scope.hasBookingDurationRestriction == 'NO') {
			$scope.restrictionM = 'NO';
		}
		
		var start = $scope.setStartDate;
		start = start.substring(5,10);
		
		var end = $scope.setEndDate;
		end = end.substring(5,10);
		
		if (start == "09-01" && end == "08-31")  { //starts in fall ends in summer
			$scope.fallM = "YES";
			$scope.winterM = "YES";
			$scope.summerM = "YES";
		}
		else if (start == "09-01" && end == "04-30") { //starts in fall ends in winter
			$scope.fallM = "YES";
			$scope.winterM = "YES";
		}
		else if (start == "09-01" && end == "12-31") { // starts and ends in fall 
			$scope.fallM = "YES";
		}
		else if (start == "01-01" && end == "08-31") { //starts in winter ends in summer
			$scope.winterM = "YES";
			$scope.summerM = "YES";
		}
		else if (start == "01-01" && end == "04-30") { //starts in winter ends in summer
			$scope.winterM = "YES";
		}
		else if (start == "05-01" && end == "08-30") {
			$scope.summerM = "YES";
		}
		//console.log(start);
		//console.log(end);
		
		$scope.hoursM = parseInt($scope.setHours);
		
	
		$scope.startDateM = new Date($scope.setStartDate);
		$scope.endDateM =  new Date($scope.setEndDate);
		
		$scope.startDateM.setDate($scope.startDateM.getDate()+1);
		$scope.endDateM.setDate($scope.endDateM.getDate()+1);

		
		$scope.showInfo = false;
		$scope.showNewGroup = false;
		$scope.showModGroup = true;
	}

	$scope.deleteGroup = function() {
		AdminGroupsService.deleteGroup($scope.groupId)
			.then(function(data){
				//update group list?
				var index = $scope.groups.indexOf($scope.group);
				$scope.groups.splice(index, 1);
				$scope.showInfo = false;
			},
			function(errorMsg) {
				alert("The following unexpected error occured. Please inform a system administrator.\n\n" + errorMsg);
			});
	}

	$scope.openViewUsersPopup = function(){
		var popupInstance = $uibModal.open({
			templateUrl: 'viewUsersPopup.html',
			controller: 'ViewUsersModalCtrl',
			resolve: {
				groupId: function () {
					return $scope.groupId; //set by getGroupInfo
				},
				groupName: function () {
					return $scope.groupName; //set by getGroupInfo
				}
			}
	    });

	    popupInstance.result.then(function () {
			updateNumUsers();
		});
	};

};