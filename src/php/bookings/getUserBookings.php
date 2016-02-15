<?php
		
//Database connection variables
include('../connection.php');	
session_start();

//Format day
date_default_timezone_set('America/Toronto');
	
	//determine current date so you only retrieve bookings after it
	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');
	$user = $_SESSION["netID"];

	$result = array();


	//get daily bookings from database
	$sth = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, uID, bookingDate, BookingSlots.roomID, startTime, endTime, reason, Rooms.building, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID JOIN Rooms on BookingSlots.roomID = Rooms.roomID WHERE bookingDate >= ? and uID = ? GROUP BY bookingID ASC;");
	$sth->execute(array($currentDate, $user));
	
	//Loop through each returned row 
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		//Get number of blocks
		$numBlocks = $row['numBlocks'];
		
		//Add thirty minutes to start time for each 
		//block in booking if there is more than one
		if ($numBlocks != 1) {
			$startTime = $row['startTime'];
			$endTime =  strtotime($startTime);
		
			while ($numBlocks >= 1) {
				$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
				$endTime = strtotime($endTime);
				$numBlocks = ($numBlocks - 1);
			}

			//change the endtime to appropriate value
			$row['endTime'] = date("H:i:s", $endTime);
		}
		array_push($result, $row);
	}	

//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;
?>
