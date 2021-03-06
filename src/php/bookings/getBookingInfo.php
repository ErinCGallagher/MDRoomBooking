<?php
//written by Laura Brooks
	include('../connection.php');
	
	//Get POST datastream from front-end
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from datastream 
	$BID = $data->bookingID;

	//Get booking info from database
   	$sth = $db->prepare("SELECT * FROM Bookings WHERE bookingID = ?;");
	$sth->execute(array($BID));
	$rows = $sth->fetchAll();

	$result = array();
	
	//Put result in an array 
	foreach($rows as $row) {
		$result[] = $row;
	}
	
	//Close the connection
	$db = NULL;
	
	//Convert to json
	$json = json_encode($result);
	
	// echo the json string
	echo $json;
?>
