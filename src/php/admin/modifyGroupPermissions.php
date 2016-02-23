<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName; 
	$hours = $data->hours; //hours per week
	//$hasBookingDurationRestriction = $data->hasBookingDurationRestriction;
	//$fall = $data->fall;
	//$winter = $data->winter;
	//$summer = $data->summer;
	$startDate = $data->startDate;
	$endDate = $data->endDate;
	$addHrsType = $data->addHrsType;
	$groupID = $data->groupID;

	
	if ($addHrsType == "1") {
		$addHrsType = "week";
	}
	else {
		$addHrsType = "special";
	}
	
	/*
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
	*/
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
	//}		
	
	//Get booking info from database
   	//$sth = $db->prepare("UPDATE UGroups SET groupName = ?, addHrsType = ?, hasBookingDurationRestriction = ? , hours = ?, startDate = ?, endDate = ? WHERE groupID = ?");
	//$sth->execute(array($groupName, $addHrsType, $hasBookingDurationRestriction, $hours, $startDate, $endDate, $groupID));
	
	
	$sth = $db->prepare("UPDATE UGroups SET groupName = ?, addHrsType = ?, hours = ?, startDate = ?, endDate = ? WHERE groupID = ?");
	$sth->execute(array($groupName, $addHrsType, $hours, $startDate, $endDate, $groupID));
	
	//Select users who are in the group
	
	//Change the records for those users in both the permissions and user tables 
	
	//Close the connection
	$db = NULL;

 	//Return GroupID to front end
	echo $groupID;
   

?>

