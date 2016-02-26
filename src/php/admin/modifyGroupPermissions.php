<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName; 
	$fall = $data->fall;
	$winter = $data->winter;
	$summer = $data->summer;
	$hours = $data->hours; 
	$addHrsType = $data->addHrsType;
	$startDate = $data->startDate;
	$endDate = $data->endDate;
	$groupID = $data->groupID;
	$hasBookingDurationRestriction = $data->hasBookingDurationRestriction;

	
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
	
	//update group
	$sth2 = $db->prepare("UPDATE UGroups SET groupName = ?, addHrsType = ?,  hasBookingDurationRestriction = ?, hours = ?, startDate = ?, endDate = ? WHERE groupID = ?");
	$sth2->execute(array($groupName, $addHrsType, $hasBookingDurationRestriction, $hours, $startDate, $endDate, $groupID));
	
	//$startDate = substr($startDate, 0, 10);
	//$endDate = substr($endDate, 0, 10);
	/*
	$sth1 = $db->prepare("SELECT addHrsType, hours FROM UGroups WHERE groupID = ?");
	$sth1->execute(array($groupID));
	$oldHours = $sth1->fetchAll();
	
	foreach($oldHours as $oldHour) { 
		$old = $oldHour['hours'];
		$oldHrsType = $$oldHour['addHrsType'];
	}
	
	$diff = $old - $hours;
	
	//update group
	$sth2 = $db->prepare("UPDATE UGroups SET groupName = ?, addHrsType = ?,  hasBookingDurationRestriction = ?, hours = ?, startDate = ?, endDate = ? WHERE groupID = ?");
	$sth2->execute(array($groupName, $addHrsType, $hasBookingDurationRestriction, $hours, $startDate, $endDate, $groupID));
	
	//Select users who are in the group
	$sth3 = $db->prepare("SELECT * FROM Permission WHERE groupID = ?");
	$sth3->execute(array($groupID));
	$users = $sth1->fetchAll();
	
	
	foreach ($users as $user) {
		$uID = $user['uid'];
		$groupID = $user['groupID'];
		
		if ($oldHrsType == "week" && $addHrsType = "special")	{
				$sth3 = $db->prepare("UPDATE Permisson SET specialHrs = specialHrs + ? WHERE uID = ? AND groupID = ?");
				$sth3->execute(array($uID, $groupID, $diff));
		}
		else if ($oldHrsType == "special" && $addHrsType = "special")	{
				$sth4 = $db->prepare("UPDATE Permisson SET specialHrs = specialHrs + ? WHERE uID = ? AND groupID = ?");
				$sth3->execute(array($uID, $groupID, $diff));
		}
		
	}

	*/
	
	//Close the connection
	$db = NULL;

 	//Return GroupID to front end
	echo $groupID;
   

?>

