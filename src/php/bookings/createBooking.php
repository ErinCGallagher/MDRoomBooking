<?php

	//Database connection
	include('../connection.php');

  	//set default time to UTC so it does not count daylight savings
  	//do not remove!
  	date_default_timezone_set('UTC');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$UID = $data->UID;
	$Room = $data->RoomID;
	$Reason = $data->Reason;
	$Desc = $data->OtherDesc;
	$year = "2015/2016";
	$numP = $data->numParticipants;
	$localStart = $data->start;
	$localEnd = $data->end;

	$utcStart = strtotime($localStart);
	$startDate = date('Y-m-d', $utcStart);
	$startTime = date('H:i:s', $utcStart);

	$utcEnd = strtotime($localEnd);
	$endDate = date('Y-m-d', $utcEnd);
	$endTime = date('H:i:s', $utcEnd);

	//Array to hold blocks 
	$blocks = [];
	
	$sth = $db->prepare("SELECT blockID, endTime FROM Blocks WHERE startTime = ?");
	$sth->execute(array($startTime));
	$rows = $sth->fetchAll();
	
	foreach($rows as $row) {
		$block = $row['blockID'];
		$blocks[] = $block;
		$blockend = $row['endTime'];
	}
	
	//Get all blocks for booking 
	$totalB = 1;
	while ($blockend != $endTime){
		$block = $block + 1;
		$totalB = $totalB + 1;
		$blocks[] = $block;
		
		$sth = $db->prepare("SELECT endTime FROM Blocks WHERE blockID = ?");
		$sth->execute(array($block));
		$rows = $sth->fetchAll();
		
		foreach($rows as $row) {
			$blockend = $row['endTime'];
		}
	}
   	
   	//create a booking 
	
   	$sth = $db->prepare("INSERT INTO Bookings (UID, Reason, OtherDesc, AcademicYr, NumParticipants) VALUES (?,?,?,?,?)");	
	$sth->execute(array($UID,$Reason,$Desc,$year,$numP));
	
	$bookingID = $db->lastInsertId();
	//add to blocks to BookingSlots
	$inserted = 0;
	foreach ($blocks as $blockID){
		$sth = $db->prepare("INSERT INTO BookingSlots VALUES (?, ?, ?, ?)");
		$sth->execute(array($bookingID, $blockID, $startDate, $Room));
		$inserted = $inserted + $sth->rowCount();
	}

	//echo '$totalB: ' . $totalB . '<br>$inserted: ' . $inserted . '<br>'; 
	
	//If not all blocks inserted, delete booking
	if ($totalB != $inserted) {
		$sth = $db->prepare("DELETE FROM bookingslots WHERE BookingID = ?");
		$sth->execute(array($bookingID));
		$sth = $db->prepare("DELETE FROM bookings WHERE BookingID = ?");
		$sth->execute(array($bookingID));
		http_response_code(409); //conflict
		$msg = "Your booking could not be completed. Please try making another booking.";
	} else {
		http_response_code(200); //success
		$msg = 'Successfully booked: "' . $Room . ', ' . $startDate . ' ' . $startTime . '-' . $endDate . ' ' . $endTime;
	}
	
	//Close the connection
	$db = NULL;
	
	//Send bookingID to front end
	echo $bookingID;
?>
