<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;

	$stmt = $db->query("SELECT groupID, groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate FROM UGroups WHERE GroupID = '$groupID' "); 

	$stmt2 = $db->query("SELECT COUNT(*) as numUsers FROM UGroups JOIN Permission ON UGroups.GroupID = Permission.GroupID WHERE Permission.GroupID = '$groupID' GROUP BY Permission.GROUPID"); 

	$result = array();

	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	  $result[] = $row;
	}

	while($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
	  $result[] = $row;
	}

	//Convert to json
	$json = json_encode($result);
	// echo the json string
	echo $json;
   
?>
