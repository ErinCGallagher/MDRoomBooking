<?php
	session_start();

	//Database connection
	include('../connection.php');

  	//set default time to UTC so it does not count daylight savings
  	//do not remove!
  	date_default_timezone_set('UTC');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$uID = $data->uID;
	$room = $data->roomID;
	$reason = $data->reason;
	$building = $data->building;
	$desc = $data->otherDesc;
	$year = "2015/2016";
	$numP = $data->numParticipants;
	$localStart = $data->start;
	$localEnd = $data->end;
	
	include('../whitelist/checkBooking.php');
	
	$allBuildings = $_SESSION["buildings"];
	
	if (!in_array($reason, $reasonsList)) {
		http_response_code(403); //Invalid Entry
	} else if (!in_array($numP, $numPeople)) {
		http_response_code(403); //Invalid Entry
	} else if (!array_key_exists($building, $allBuildings)) {
		http_response_code(403); //Invalid Entry (building)
	} else if (!in_array($room, $_SESSION["buildings"][$building]['rooms'])) {
		http_response_code(403); //Invalid Entry (room)
	} else {
		$utcStart = strtotime($localStart);
		$startDate = date('Y-m-d', $utcStart);
		$startTime = date('H:i:s', $utcStart);

		$utcEnd = strtotime($localEnd);
		$endDate = date('Y-m-d', $utcEnd);
		$endTime = date('H:i:s', $utcEnd);

		$currentDate = date('Y-m-d');
		$currentTime = date('H:i:s');
	
		if (($currentDate >= $startDate) && ($currentTime > $startTime)){
			//Booking has already started or has already passed
			http_response_code(406); //Invalid Entry
		} else {

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
			
			$sth = $db->prepare("INSERT INTO Bookings (uID, reason, otherDesc, academicYr, numParticipants) VALUES (?,?,?,?,?)");	
			$sth->execute(array($uID,$reason,$desc,$year,$numP));
			
			$bookingID = $db->lastInsertId();
			//add to blocks to BookingSlots
			$inserted = 0;
			$hrsSource = "Admin";
			foreach ($blocks as $blockID){
				$sth = $db->prepare("INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource) VALUES (?, ?, ?, ?, ?)");
				$sth->execute(array($bookingID, $blockID, $startDate, $room, $hrsSource));
				$inserted = $inserted + $sth->rowCount();
			}
			
			//If not all blocks inserted, delete booking
			if ($totalB != $inserted) {
				$sth = $db->prepare("DELETE FROM Bookingslots WHERE bookingID = ?");
				$sth->execute(array($bookingID));
				$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
				$sth->execute(array($bookingID));
				http_response_code(409); //conflict
				$msg = "Your booking could not be completed. Please try making another booking.";
			} else {
				http_response_code(200); //success
				$msg = 'Successfully booked: "' . $room . ', ' . $startDate . ' ' . $startTime . '-' . $endDate . ' ' . $endTime;
			}
				
			//Send bookingID to front end
			echo $bookingID;
		}
	}
	//Close the connection
	$db = NULL;
?>
