<?php
	session_start();

	//Database connection
	include('../connection.php');

  	//set default time to UTC so it does not count daylight savings
  	//do not remove!
  	date_default_timezone_set('America/Toronto');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$bookingID = $data->bookingID;
	$start = $data->start;
	
	$utcStart = strtotime($start);

	$startDate = date('Y-m-d', $utcStart);
	$startTime = date('H:i:s', $utcStart);

	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');
	
	if (($currentDate >= $startDate) && ($currentTime > $startTime)){
		//Booking has already started or has already passed
		http_response_code(403); //Invalid Entry
	} else {
		//Cancel booking
		$sth = $db->prepare("DELETE FROM Bookingslots WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		http_response_code(200);		
	}

	//Close the connection
	$db = NULL;
?>
