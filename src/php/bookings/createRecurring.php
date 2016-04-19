<?php
	//written by Laura Brooks & Erin Gallagher
	session_start();

	//Database connection
	include('../connection.php');
	include('../email.php');
	
	//set default time to UTC so it does not count daylight savings
  	//do not remove!
	date_default_timezone_set('UTC');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$uID = $_SESSION["netID"];
	$room = $data->roomID;
	$reason = $data->reason;
	$building = $data->building;
	$desc = $data->otherDesc;
	$year = "2015/2016";
	$numP = $data->numParticipants;
	$localStart = $data->start;
	$localEnd = $data->end;
	$totalWeeks = $data->totalWeeks;
	
	$utcStart = strtotime($localStart);
	$startDate = date('Y-m-d', $utcStart);
	$startTime = date('H:i:s', $utcStart);

	$utcEnd = strtotime($localEnd);
	$endDate = date('Y-m-d', $utcEnd);
	$endTime = date('H:i:s', $utcEnd);

	include('../whitelist/checkBooking.php');
	
	$allBuildings = $_SESSION["buildings"];
	
	$openTime = strtotime($_SESSION["buildings"][$building]['openTime']);
	$openTime = date('H:i:s', $openTime);
	$closeTime = strtotime($_SESSION["buildings"][$building]['closeTime']);
	$closeTime = date('H:i:s', $closeTime);
	
	$result = array();

	//don't need a transaction here because we handle conflicting bookings
	
	if($_SESSION["class"] == "NonBooking" || $_SESSION["class"] == "Student"){
		http_response_code(403); //Invalid User
	}else if (!in_array($reason, $reasonsList)) {
		$result['msg'] = "The reason provided is not valid.";
		http_response_code(403); //Invalid Entry
	} else if (!in_array($numP, $numPeople)) {
		$result['msg'] = "The number of people provided is not valid.";
		http_response_code(403); //Invalid Entry
	} else if (!array_key_exists($building, $allBuildings)) {
		$result['msg'] = "The building provided is not valid.";
		http_response_code(403); //Invalid Entry (building)
	} else if (!in_array($room, $_SESSION["buildings"][$building]['rooms'])) {
		$result['msg'] = "The room provided is not valid.";
		http_response_code(403); //Invalid Entry (room)
	} else if ($startTime < $openTime ||  $endTime > $closeTime) {
		//Booking is outside of building hours
		$result['msg'] = "The building is not open during your booking.";
		http_response_code(403);
	} else {
		
		date_default_timezone_set('America/Toronto');

		$currentDate = date('Y-m-d');
		$currentTime = date('H:i:s');
		$class = $_SESSION['class'];
		
		if ($currentDate > $startDate){
			//Booking has already started or has already passed
			//currently not working because of timezones
			$result['msg'] = "You cannot make a booking in the past.";
			http_response_code(406); //Invalid Entry
		}
		else if(($currentDate == $startDate) && ($currentTime > $startTime)){
			$result['msg'] = "You cannot make a booking in the past.";
			http_response_code(406); //Invalid Entry
		}
		else {
			//faculty can only book for current semester
			$bookingSem = currentSemester($startDate);
			$currentSem = currentSemester($currentDate);
			$addMonth = date("Y-m-d", strtotime("+1 month", strtotime($currentDate)));
			$semInMonth = currentSemester($addMonth);
			
			if (($class == "Faculty") && ($currentSem == $bookingSem)){ //Current Semester
				if ($totalWeeks <= weeksLeftInSemester($currentDate, $startDate)){
					$canBook = True;
				} else {
					$result['msg'] = "You may only book within one semester at a time.";
					$canBook = False;
					http_response_code(406); //Invalid Entry
				}
			} else if (($class == "Faculty") && ($semInMonth == $bookingSem)){ //Within Month of Next Semester
				if ($totalWeeks <= weeksLeftInSemester($startDate, $startDate)) {
					$canBook = True;
				} else {
					$result['msg'] = "You may only book within one semester at a time.";
					$canBook = False;
					http_response_code(406); //Invalid Entry
				}	
			} else if (($class == "Faculty") && ($currentSem != $bookingSem) && ($semInMonth != $bookingSem)) {	
				$result['msg'] = "You may only make booking for the current semester. You may start making bookings for the next semester one month in advance.";
				$canBook = False;
				http_response_code(406); //Invalid Entry
			} else if ($class == "Admin" && $totalWeeks < 53) {
				$canBook = True;
			}else if ($class == "Admin" && $totalWeeks > 52) {
				$canBook = False;
				$result['msg'] = "Faculty may only make bookings 52 weeks in advance";
				http_response_code(406); //Invalid Entry
			} else {
				$canBook = False;
				$result['msg'] = "There has been an unexpected error with your booking. Please try again.";
				http_response_code(406); //Invalid Entry
			}
			
			if ($canBook) {			
				//Array to hold blocks 
				$blocks = [];
				$sth = $db->prepare("SELECT blockID, endTime FROM Blocks WHERE startTime = ?");
				$sth->execute(array($startTime));
				$rows = $sth->fetchAll();
				
				foreach($rows as $row) {
					$block = $row['blockID'];
					$blocks[] = $block; //put starting block in blocks array
					$blockend = $row['endTime'];
				}
				
				//Get all blocks for booking 
				$totalB = 1; //duration of the booking
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
				
				$datesCreated = array();
				$datesFailed = array();

				//create first booking of total
				$recurringID = -1;
				$bookingID = createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $class, $recurringID);

				//confirm the first booking was successful
				$sth2 = $db->prepare("SELECT * FROM Bookings WHERE bookingID = ?");
				$sth2->execute(array($bookingID));
				$firstSuccessful = false;
				while($row = $sth2->fetch(PDO::FETCH_ASSOC)) {
					$firstSuccessful = true;
				}
				if(!$firstSuccessful){
					$result['msg'] = "Your booking could not be completed because the original booking conflicted with another booking. Please refresh the browser and retry.";
					http_response_code(406); //Invalid Entry
				}
				else{
				
					$sth = $db->prepare("UPDATE BookingSlots SET recurringID = ? WHERE bookingID = ?");
					$sth->execute(array($bookingID, $bookingID));
					
					$recurringID = $bookingID;
					$created = 1;
					//echo "<br> created = $created, total = $totalWeeks<br>";
					while ($created <= $totalWeeks-1) {
						$startDate = strtotime('+1 weeks', strtotime($startDate));
						$startDate = date('Y-m-d', $startDate);
						createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $class, $recurringID);
						$created = $created + 1;
					}
					$result['success'] = $datesCreated;
					$result['failed'] = $datesFailed;
					$result['bookingID'] = $recurringID;
					recurringConf($room, $building, $startTime, $endTime, $reason, $desc, $numP, $db, $datesCreated);
				}
			}
		}
	
	}

	//Close the connection
	$db = NULL;
	//Convert to json
	$json = json_encode($result);
	
	//echo the json string
	echo $json;
	


	//after determining the user has the hours to make a booking, insert the booking into the database
	function createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $hrsSource, $recurringID){

		global $result, $datesCreated, $datesFailed;
		
		//create a booking 
		$sth = $db->prepare("INSERT INTO Bookings (uID, reason, otherDesc, numParticipants) VALUES (?,?,?,?)");	
		$sth->execute(array($uID,$reason,$desc,$numP));
		
		$bookingID = $db->lastInsertId();
		//add to blocks to BookingSlots
		$inserted = 0;

		foreach ($blocks as $blockID){
			if ($recurringID == -1) {
				$sth = $db->prepare("INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource) VALUES (?, ?, ?, ?, ?)");
				$sth->execute(array($bookingID, $blockID, $startDate, $room, $hrsSource));
			} else {
				$sth = $db->prepare("INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource, recurringID) VALUES (?, ?, ?, ?, ?, ?)");
				$sth->execute(array($bookingID, $blockID, $startDate, $room, $hrsSource, $recurringID));
			}
			$inserted = $inserted + $sth->rowCount();
		}
		
		//If not all blocks inserted, delete booking
		if ($totalB != $inserted) {
			$sth = $db->prepare("DELETE FROM Bookingslots WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			$datesFailed[] = $startDate;
			$result['msg'] = "Your booking could not be completed because it conflicted with another booking";
		} else {	
			$datesCreated[] = $startDate;
			$result['msg'] = 'Successfully booked: "' . $room . ', ' . $startDate . ' ' . $startTime . '-' . $endDate . ' ' . $endTime;
		}

		return $bookingID;
	}

	function weeksLeftInSemester($currentDate, $startDate) {
		$semester = currentSemester($currentDate);
		$startDate = date('Y-m-d', strtotime($startDate));
		$currentDate = date('Y-m-d', strtotime($currentDate));
		$count = 0;
		if ($semester == "Winter"){
			$endSem = date('Y-m-d', strtotime("April 30, " . date("Y")));
			$nextSem = date('Y-m-d', strtotime("April 1, " . date("Y")));
			if($currentDate >= $nextSem){//can start booking for next semester
				$endSem = date('Y-m-d', strtotime("August 31, " . date("Y")));
			}
		} else if ($semester == "Summer"){
			$endSem = date('Y-m-d', strtotime("August 31, " . date("Y")));
			$nextSem = date('Y-m-d', strtotime("August 1, " . date("Y")));
			if($currentDate >= strtotime("August 1, " . date("Y"))){//can start booking for next semester
				$endSem = date('Y-m-d', strtotime("December 31, " . date("Y")));
			}
		} else if ($semester == "Fall"){
			$endSem = date('Y-m-d', strtotime("December 31, " . date("Y")));
			$nextSem = date('Y-m-d', strtotime("April 30, " . date("Y")));
			if($currentDate >= strtotime("December 1, " . date("Y"))){//can start booking for next semester
				$endSem = date('Y-m-d', strtotime("April 30, " . date("Y")));
			}
		}
		while ($startDate <= $endSem) {
			$count = $count + 1;
			$startDate = date('Y-m-d',strtotime('+1 week', strtotime($startDate)));
		}
		return $count;
	}
	
	function currentSemester($currentDate) {
		$currentDate = date('m-d', strtotime($currentDate));
		if ($currentDate <= date('m-d', strtotime("April 30"))){
			$semester = "Winter";
		} else if ($currentDate <= date('m-d', strtotime("August 31"))) {
			$semester = "Summer";
		} else {
			$semester = "Fall";
		}
		return $semester;
	}



?>