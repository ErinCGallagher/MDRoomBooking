<?php

	include('../connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$roomID = $data->roomID;
	
	//array to hold results
	$result = array();
	
	//Query to get group information
	$sth = $db->prepare("SELECT * FROM Rooms WHERE RoomID = ?"); 
	$sth->execute(array($roomID));
	$rows = $sth->fetchAll();
	
	
	
	//echo $building;
	
	//Put result in an array 
	foreach($rows as $row) {
		$result[] = $row;
		$firstRow = $rows[0];
		$building = $firstRow['building'];
	}
	//$building = $rows[0][building]
	
	//Query to get group information
	$sth2 = $db->prepare("SELECT openTime, closeTime FROM Building WHERE buildingID = ?"); 
	$sth2->execute(array($building));
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
