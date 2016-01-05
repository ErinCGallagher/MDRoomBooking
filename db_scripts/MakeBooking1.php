<?php

	//Database connection variables
	 $host = "localhost";
	 $user = "root";
	 $password = "";
	 $database = "mdroombooking";
	//Connecy to database
	$cxn = mysqli_connect($host,$user,$password, $database);
	//Check connection
	if (mysqli_connect_errno()){
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  		die();
  	}
  	
  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));
	//Set parameters from datastream
	$UID = mysqli_real_escape_string($cxn,$data->UID);
	$Room = mysqli_real_escape_string($cxn,$data->RoomID);
	$Reason = mysqli_real_escape_string($cxn,$data->Reason);
	$Desc = mysqli_real_escape_string($cxn,$data->OtherDesc);
	$Date = mysqli_real_escape_string($cxn,$data->date);
	$year = "2015/2016";
	$numP = mysqli_real_escape_string($cxn,$data->numParticipants);
	$startTime = mysqli_real_escape_string($cxn,$data->start);
	$endTime = mysqli_real_escape_string($cxn,$data->end);
	$dateTime = mysqli_real_escape_string($cxn,$data->dateTime);

	//echo $dateTime;
	
/*
	//Format startdate
	$startDate = strtotime($Date);
	$startDate = date('Y-m-d', $startDate);
*/
	$DateTime = strtotime($dateTime);
	$startDate = date('Y-m-d', $DateTime);
	$startTime = date('h:i:s', $DateTime);
	//$endTime = date('h:i:s', $endTime);

	//echo $endTime;

	//javascript formatted date for echo purposes!!!
	//echo date('D M d Y H:i:s O',$DateTime);

	/*
	//Get starting block
	$query = "SELECT blockID, endTime FROM Blocks WHERE startTime = '$startTime'";
	$rows = mysqli_query($cxn, $query);
	//Array to hold blocks 
	$blocks = [];
	//Set starting block
	foreach ($rows as $row) {
		$block = $row['blockID'];
		$blocks[] = $block;
	$blockend = $row['endTime'];
	}
	//Get all blocks for booking 
	while ($blockend != $endTime){
		$block = $block + 1;
		$blocks[] = $block;
		$query = "SELECT endTime FROM Blocks WHERE blockID = $block";
		$rows = mysqli_query($cxn, $query);
		foreach ($rows as $row) {
			$blockend = $row['endTime'];
		}
	}
	//mysqli_begin_transaction($cxn, MYSQLI_TRANS_START_READ_WRITE);
   	
   	//create a booking 
   	$query2 = "INSERT INTO Bookings (UID, Reason, OtherDesc, AcademicYr, NumParticipants) VALUES ('$UID','$Reason','$Desc','$year','$numP');";		
   	$makeBooking = mysqli_query($cxn, $query2);
	$bookingID = mysqli_insert_id($cxn);
	//add to blocks to BookingSlots
	foreach ($blocks as $blockID){
		$query = "INSERT INTO BookingSlots VALUES ($bookingID, $blockID, '$startDate', '$Room')";
		mysqli_query($cxn, $query);
	}
	//Send bookingID to front end
	echo $bookingID;
*/
	//mysqli_commit($cxn);
	//Close the connection
	mysqli_close($cxn);
?>
