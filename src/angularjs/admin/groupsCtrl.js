angular
.module('mainApp')
.controller('GroupsCtrl', GroupsCtrl);

function GroupsCtrl($scope, AdminGroupsService){
	$scope.pageClass = 'groups';  //used to change pages in index.html

	$scope.groups = AdminGroupsService.groups;
	
	AdminGroupsService.getAllGroups();

	$scope.showInfo = false;
	$scope.showNewGroup = false;

	$scope.newGroup = function(){
		$scope.showNewGroup = true;
		$scope.showInfo = false;
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
    
    //Function to change fall value when 
    //selected by user creating a group
    $scope.changeFall = function(fall) {
        if (fall == 'YES') {
        	$scope.fall = 'NO';
        }
        else if (fall == 'NO'){
        	$scope.fall = 'YES';
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
     
    //Function to change summer value when 
    //selected by user creating a group
    $scope.changeSummer = function(summer) {
        if (summer == 'YES' ) {
        	$scope.summer = 'NO';
        }
        else if (summer == 'NO'){
        	$scope.summer = 'YES';
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
		AdminGroupsService.createGroup(info);
	}

	$scope.showGroup = function(groupId) {
		$scope.showInfo = true;
		$scope.showNewGroup = false;
		getGroupInfo(groupId);
	}

	getGroupInfo = function(groupId){
		AdminGroupsService.getGroupInfo(groupId)
			.then(function(groupInfo){
				$scope.groupName = groupInfo.data[0].groupName;
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

};