<?php
	session_start();
	//TODO, put stuff in PHP functions (CLEAN UP)

	//Database connection
	include('../connection.php');
	include('../email.php');

  	//set default time to UTC so it does not count daylight savings
  	//do not remove!
	date_default_timezone_set('UTC');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$recurringID = $data->recurringID;
	
	date_default_timezone_set('America/Toronto');

	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');

	$sth = $db->prepare("SELECT DISTINCT uID, BookingSlots.bookingDate, Bookings.bookingID FROM Bookings INNER JOIN BookingSlots ON Bookings.bookingID=BookingSlots.bookingID WHERE bookingDate >= ? AND recurringID = ?;");
	$sth->execute(array($currentDate, $recurringID));
	
	$bookingIDList = array();
	$cancelDates = array();
	
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$bookingIDList[] = $row['bookingID'];
		$bookingUserID = $row['uID'];
		$cancelDates[] = $row['bookingDate'];
	}
	
	//Get Booking Information (for email purposes)
	$sth = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, bookingDate, BookingSlots.roomID, startTime, endTime, reason, otherDesc, Rooms.building, numParticipants, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID JOIN Rooms on BookingSlots.roomID = Rooms.roomID WHERE Bookings.bookingID = ? GROUP BY bookingID ORDER BY startTime ASC;");
	$sth->execute(array($bookingIDList[0]));
	
	//Loop through each returned row 
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$room = $row['roomID'];
		$building = $row['building'];
		$reason = $row['reason'];
		$desc = $row['otherDesc'];
		$numP = $row['numParticipants'];
		$end = $row['endTime'];
		$start = $row['startTime'];
		
		//Get number of blocks
		$numBlocks = $row['numBlocks'];
		
		//Add thirty minutes to start time for each 
		//block in booking if there is more than one
		if ($numBlocks != 1) {
			$s = $row['startTime'];
			$endTime =  strtotime($s);
		
			while ($numBlocks >= 1) {
				$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
				$endTime = strtotime($endTime);
				$numBlocks = ($numBlocks - 1);
			}

			//change the endtime to appropriate value
			$row['endTime'] = date("H:i:s", $endTime);
			$end = $row['endTime'];
		}
	}
	
	//Cancel booking	
	//This is not the user and the user is not an admin
	if($bookingUserID != $_SESSION["netID"] && $_SESSION["class"] != "Admin"){
		http_response_code(406); //Invalid Entry
	}
	else{ 
		//it is the user's own booking or they are admin
		foreach ($bookingIDList as $bid) {
			deleteBooking($db, $bid);
		}
		$admin = false;
		if ($_SESSION["class"] == "Admin" && $bookingUserID != $_SESSION["netID"]){
			//cancelled by admin
			$admin = true;
			$to = $bookingUserID . "@queensu.ca";
		} else {
			$to = userEmail();
		}
		cancelRecurring($room, $building, $cancelDates, $start, $end, $reason, $desc, $numP, $db, $to, $admin);
		http_response_code(200); //success
	}

	//Close the connection
	$db = NULL;

	//removed a booking from the database
	function deleteBooking($db, $bookingID){
		$sth = $db->prepare("DELETE FROM BookingSlots WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
		$sth->execute(array($bookingID));
	}

?>