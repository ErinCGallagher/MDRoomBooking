<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName; 
	$hours = $data->hours; //hours per week
	$hasBookingDurationRestriction = $data->hasBookingDurationRestriction;
	$fall = $data->fall;
	$winter = $data->winter;
	$summer = $data->summer;
	$startDate = $data->startDate;
	$endDate = $data->endDate;
	$addHrsType = $data->addHrsType;

	
	if ($addHrsType == "1") {
		$addHrsType = "week";
	}
	else {
		$addHrsType = "special";
	}
	
	$currYear = "2016";
	$nextYear = "2017";
	
	
	if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
		$startDate = "09-01-" . $currYear;
		$endDate = "08-31-" . $nextYear;
	}
	else if ($fall == "YES" && $winter == "YES") {
		$startDate = "09-01-" . $currYear;
		$endDate = "04-30-" . $nextYear;
	}
	else if ($winter == "YES" && $summer == "YES") {
		$startDate = "01-01-" . $currYear;
		$endDate = "08-31-" . $nextYear;
	}
	else if ($fall == "YES") {
		$startDate = "09-01-" . $currYear;
		$endDate = "12-31-" . $currYear;
	}
	else if ($winter == "YES") {
		$startDate = "01-01-" . $currYear;
		$endDate = "04-30-" . $currYear;
	}
	else if ($summer == "YES") {
		$startDate = "05-01-" . $currYear;
		$endDate = "08-31-" . $nextYear;
	}
	else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
	}		
		
	//Add Group to database
	$query = "INSERT INTO UGroups(groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate) VALUES (?,?,?,?,?,?)";
	
	
	//Get booking info from database
   	$sth = $db->prepare("INSERT INTO UGroups(groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate) VALUES (?,?,?,?,?,?)");
	$sth->execute(array($groupName, $addHrsType, $hours, $hasBookingDurationRestriction, $startDate, $endDate));
	
	//Get the groupID of group just creeated
	$groupID = $db->lastInsertId();
	
	//Close the connection
	$db = NULL;

 	//Return GroupID to front end
	echo $groupID;
   

?>
