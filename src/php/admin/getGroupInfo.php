<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;

	$stmt = $db->query("SELECT groupID, groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate FROM UGroups WHERE GroupID = '$groupID' "); 

	$stmt2 = $db->query("SELECT IFNULL(users,0) as numUsers FROM (SELECT COUNT(*) as users FROM UGroups JOIN Permission ON UGroups.GroupID = Permission.GroupID WHERE Permission.GroupID = '$groupID') as t1"); 

	$result = array();

	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	  $result[] = $row;
	}
	
	
	while($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
	 
	 $result[] = $row;
	}	
	
	
	
	//if ($stmt2->rowCount() == 0) {
  		//$result[] = [{numUsers: 0}];
//	}	 
	
	//Convert to json
	$json = json_encode($result);
	// echo the json string
	echo $json;
   
?>


include('../connection.php');
	
	//Get POST datastream from front-end
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from datastream 
	$BID = $data->bookingID;

	//Get booking info from database
   	$sth = $db->prepare("SELECT * FROM Bookings WHERE bookingID = ?;");
	$sth->execute(array($BID));
	$rows = $sth->fetchAll();