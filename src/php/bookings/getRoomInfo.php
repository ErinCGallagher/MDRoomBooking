<?php
	//written by Laura Brooks
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
	
	
	
	//echo $building;
	
	//Put result in an array 
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$result[] = $row;
		$building = $row['building'];
	}
	//$building = $rows[0][building]
	
	//Query to get group information
	$sth2 = $db->prepare("SELECT openTime, closeTime FROM Building WHERE buildingID = ?"); 
	$sth2->execute(array($building));
	
	//Put result in an array 
	while($row2 = $sth2->fetch(PDO::FETCH_ASSOC)) {
		$result[] = $row2;
		$result[1]['closeTime'] =  date('g:i A', strtotime($row2['closeTime']));
		$result[1]['openTime'] = date('g:i A', strtotime($row2['openTime']));
	}
	

	//Close the connection
	$db = NULL;
	
	//Convert to json
	$json = json_encode($result);
	
	// echo the json string
	echo $json;
?>
