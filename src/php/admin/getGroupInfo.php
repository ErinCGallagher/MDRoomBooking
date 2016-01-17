<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;

	$stmt = $db->query("SELECT groupID, groupName, addHrsType, hours, startDate, endDate FROM UGroups WHERE GroupID = '$groupID' "); 

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
