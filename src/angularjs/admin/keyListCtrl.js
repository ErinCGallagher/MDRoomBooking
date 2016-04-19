//written by Shannon Klett & Lexi Flynn
angular
.module('mainApp')
.controller('KeyListCtrl', KeyListCtrl);

function KeyListCtrl($scope, $uibModal, AdminKeyService) {
	 $scope.pageClass = 'keyList';  //used to change pages in index.php
	 //$scope.showDownload = true;
	 //$scope.showDate = false;
	// $scope.showNoData = false;
	 $scope.keyDate = new Date();
	 $scope.keyUsers = [];
	 
	 //convert the offset from local to UTC time
  	//return an integer that represents the UTC offset from the local time
  	KeyListCtrl.generateOffset = function(timestamp){
  		//date manipulation crap
		var jsDate = new Date(timestamp); //converts to javascript date object
		var offset = jsDate.getTimezoneOffset() * 60000; //retrieves offset from utc time
		return offset;
 	 }
	
	//convert javascript date back to local from UTC time
	//do this before sending data back to the database
	//the database is going to convert this back to its version of UTC time 
  	KeyListCtrl.convertFromUTCtoLocal = function(timestamp){
  		//date manipulation crap
	  	var jsDate = new Date(timestamp); //converts to javascript date object
	  	var offset = KeyListCtrl.generateOffset(timestamp);

	  	var selectedTime = jsDate.getTime(); //retrieves the time selected
	  	var utc = selectedTime - offset; //convert to UTC time by adding the offset
	  	var TimeZoned = new Date(utc) //create new date object with this time

	  	return TimeZoned;
  	}
  	
	var prevDate = new Date($scope.keyDate);
	prevDate.setDate($scope.keyDate.getDate());
	prevDate = KeyListCtrl.convertFromUTCtoLocal(prevDate);
	
	var today = {keyDate: prevDate}
	
	$scope.noDate = prevDate;
	AdminKeyService.keyList(today)
				.then(function(keyInfo){
				if (keyInfo.data[0] == "No data") {
					
					$scope.showDownload = false;
					$scope.showDate = true;
					$scope.showNoData = true;
				}
				else {
				
				i = 0 
				while (i < keyInfo.data.length) {
					$scope.keyUsers.push(keyInfo.data[i]);
					
					//$scope.keyTimes.push(keyInfo.data[i+1]);
					i++;
				}
				$scope.showNoData = false;
				$scope.showDownload = true;
				$scope.showDate = false;
				
				}
			},
			function() {
				alert("err"); 
			});
	
	
	
	
	$scope.generateKeyList = function() {
		$scope.keyUsers = [];
		var prevDate = new Date($scope.keyDate);
		prevDate.setDate($scope.keyDate.getDate());
		prevDate = KeyListCtrl.convertFromUTCtoLocal(prevDate);
		$scope.noDate = prevDate; 
	
		var info = {
			keyDate: prevDate
		}
			
			AdminKeyService.keyList(info)
				.then(function(keyInfo){
				if (keyInfo.data[0] == "No data") {
					
					$scope.showDownload = false;
					$scope.showDate = true;
					$scope.showNoData = true;
				}
				else {
				
				i = 0 
				while (i < keyInfo.data.length) {
					$scope.keyUsers.push(keyInfo.data[i]);
					
					//$scope.keyTimes.push(keyInfo.data[i+1]);
					i++;
				}
				$scope.showNoData = false;
				$scope.showDownload = true;
				$scope.showDate = false;
				
				}
			},
			function() {
				alert("err"); 
			});
					
			
	}

	$scope.removeKeyList = function() {
		$scope.showDownload = false;
		$scope.showDate = true;		
		$scope.showNoData = false;
	}


}