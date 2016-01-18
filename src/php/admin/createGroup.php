<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');


	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName;
	$hoursPerWeek = $data->hours;
	$totalHoursPerSem = $data->toatalHoursPerSem;
	$totalHoursPerTime = $data->totalHoursPerTime;
	$hasBookingDurationRestriction = $data->hasBookingDurationRestriction;
	$fall = $data->fall;
	$winter = $data->winter;
	$summer = $data->summer;
	$startDate = $data->startDate;
	$endDate = $data->endDate;

	$year = ('Y');

	$query = "INSERT INTO UGroups(groupName, addHrsType, hours, startDate, endDate, academicYr) VALUES ('$groupName' , '$addHrsType' , '$hours' , '$startDate', '$endDate', '$academicYr')";
 	$stmt = $db->query($query);
 	$groupID = $db->lastInsertId();
 
	echo $groupID;
   
   ///////////////// new script addUsers.php
   
   
 	// Get the users list in the new group 
 	$userList = array("12af", "13eg", "14sk", "15lb");
  

 	// Update the permissions of each member of the group
 	foreach($userList as $user) {
		$query = "INSERT INTO Permission (uID, groupId, acdemicYr) VALUES ('$user', '$groupID', '$year')";
		$stmt = $db->query($query);
		//Give
		//user is not in user table??
		$query = "UPDATE User SET addHrs = addHrs + '$hours' WHERE uID = '$user'";
		$stmt = $db->query($query);
  	}

?>
