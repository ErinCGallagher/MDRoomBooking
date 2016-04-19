<?php
	//written by Shannon Klett & Lexi Flynn
	include('../connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;
	
	//array to hold results
	$result = array();
	
	//Query to get group information
	$sth = $db->prepare("SELECT groupID, groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate FROM UGroups WHERE GroupID = ? "); 
	$sth->execute(array($groupID));
	$rows = $sth->fetchAll();
	
	//Put result in an array 
	foreach($rows as $row) {
		$result[] = $row;
	}
	
	//Query to get number of users
	$sth2 = $db->prepare("SELECT IFNULL(users,0) as numUsers FROM (SELECT COUNT(*) as users FROM UGroups JOIN Permission ON UGroups.GroupID = Permission.GroupID WHERE Permission.GroupID = ?) as t1"); 
	$sth2->execute(array($groupID));
	$rows2 = $sth2->fetchAll();
	
	//Put result in an array 
	foreach($rows2 as $row) {
		$result[] = $row;
	}
	
	//Close the connection
	$db = NULL;
	
	//Convert to json
	$json = json_encode($result);
	
	// echo the json string
	echo $json;
?>
