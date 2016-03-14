<?php

	include('../connection.php');

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
	
	$month = date('m');
	
	if ($month >= '09' && $month <= '12') { // It's currently the fall term
	
		$currYear = date('Y');
		$nextYear = date('Y')+1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $nextYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $nextYear . "-09-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $nextYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $nextYear . "-01-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $nextYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}		
	
	}
	else if ($month >= '01' && $month <= '04') { //It's the winter term
		
		$currYear = date('Y');
		$prevYear = date('Y')-1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate =  $currYear . "-09-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $prevYear . "-09-01";
			$endDate = $currYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $currYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}	
	
	}
	else { //It's summer
	
		$currYear = date('Y');
		$nextYear = date('Y')+1;
		$prevYear = date('Y')-1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate = $prevYear . "-09-01";
			$endDate =  $currYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $nextYear . "-01-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $currYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}	
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
