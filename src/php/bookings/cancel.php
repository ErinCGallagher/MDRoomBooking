<?php
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
	$bookingID = $data->bookingID;
	$start = $data->start;
	
	$utcStart = strtotime($start);
	$startDate = date('Y-m-d', $utcStart);
	$startTime = date('H:i:s', $utcStart);

	date_default_timezone_set('America/Toronto');

	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');
	
	//Get Booking Information (for email purposes)
	$sth = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, uID, bookingDate, BookingSlots.roomID, startTime, endTime, reason, otherDesc, Rooms.building, numParticipants, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID JOIN Rooms on BookingSlots.roomID = Rooms.roomID WHERE Bookings.bookingID = ? GROUP BY bookingID ORDER BY startTime ASC;");
	$sth->execute(array($bookingID));
	
	//Loop through each returned row 
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$user = $row['uID'];
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
	
	
	

	//determine if the booking has already occured
	if ($currentDate > $startDate){
		//Booking has already started or has already passed
		//currently not working because of timezones
		http_response_code(406); //Invalid Entry
	} else if(($currentDate == $startDate) && ($currentTime > $startTime)){
		//Booking has already started or has already passed
		http_response_code(406); //Invalid Entry
	} else {
		//Cancel booking
		
		//if user is not admin, confirm they are trying to cancel their own booking
		if ($_SESSION["class"] != "Admin"){
			$sth = $db->prepare("SELECT uID FROM Bookings WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
				$bookingUserID = $row['uID'];
			}
			
			//confirm this is the user's booking
			if($bookingUserID != $_SESSION["netID"]){
				http_response_code(406); //Invalid Entry
			}
			else{ //it is the user's own booking
				$to = userEmail();
				//if faculty, delete booking because they have unlimited hours
				if($_SESSION["class"] == "Faculty"){
					deleteBooking($db, $bookingID);
					
					//email user
					cancelBooking($room, $building, $startDate, $start, $end, $reason, $desc, $numP, $db, $to, false);
					
					http_response_code(200); //sucess
				}
				else{ //student, must return booking hours to the student

					//determine the length of a given booking in hours
					$response = determineBookingLength($db,$bookingID);

					$bookingLength = $response[0];
					$bookingDate = $response[1];

					$hrsSourceList = array();
					//retrieve hrsSource for each block
					retrieveHrsSource($db, $bookingID);

					//cancel booking
					deleteBooking($db, $bookingID);
					
					//email user
					cancelBooking($room, $building, $startDate, $start, $end, $reason, $desc, $numP, $db, $to, false);

					//determnes which week the booking was booked in
					$week = determineWhichWeek($bookingDate);
					
					//return hours to the appropriate week and group
					for($i = 0; $i < count($hrsSourceList); $i++){
						if(strtolower($hrsSourceList[$i]) == "weekly"){
							returnWeeklyHoursToUser($db, $week, $bookingUserID, 0.5);
						}
						else{
							returnSpecialHoursToUser($db, $bookingUserID, $hrsSourceList[$i], 0.5);
						}
					}

					http_response_code(200); //sucess
				}
			}

		}
		else{ //user is admin
			//determine if the booking belongs to the admin
			$sth = $db->prepare("SELECT Bookings.uID, User.class FROM Bookings JOIN User ON User.uID = Bookings.uID WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
				$bookingUserID = $row['uID'];
				$class = $row['class'];			
			}

			if($bookingUserID != $_SESSION["netID"] && $class == "Student"){
				//determine the length of a given booking in hours
				$response = determineBookingLength($db,$bookingID);

				$bookingLength = $response[0];
				$bookingDate = $response[1];

				$hrsSourceList = array();
				
				//retrieve hrsSource for each block
				retrieveHrsSource($db, $bookingID);

				//cancel booking
				deleteBooking($db, $bookingID);
				
				//email user who made booking
				$to = $bookingUserID . "@queensu.ca";
				cancelBooking($room, $building, $startDate, $start, $end, $reason, $desc, $numP, $db, $to, true);

				//determnes which week the booking was booked in
				$week = determineWhichWeek($bookingDate);

				//return hours to the appropriate week and group
				for($i = 0; $i < count($hrsSourceList); $i++){
					if(strtolower($hrsSourceList[$i]) == "weekly"){
						returnWeeklyHoursToUser($db, $week, $bookingUserID, 0.5);
					}
					else{
						returnSpecialHoursToUser($db, $bookingUserID, $hrsSourceList[$i], 0.5);
					}
				}

				http_response_code(200); //success
			} else {
				//otherwise they are admin or deleting a faculty booking
				deleteBooking($db, $bookingID);
				
				//check if admin is deleting a different user's booking
				if ($bookingUserID != $_SESSION["netID"]) {
					$to = $bookingUserID . "@queensu.ca";
					cancelBooking($room, $building, $startDate, $start, $end, $reason, $desc, $numP, $db, $to, true);
				} else {
					$to = userEmail();
					cancelBooking($room, $building, $startDate, $start, $end, $reason, $desc, $numP, $db, $to, false);
				}
			}
			http_response_code(200); //sucess
		}
		
	}

	//Close the connection
	$db = NULL;

	//retrieve the hrsSource for each 30 minute block of a booking
	//return an array with the hours to return
	function retrieveHrsSource($db, $bookingID){
		global $hrsSourceList;
		$sth = $db->prepare("SELECT hrsSource FROM BookingSlots where bookingID = ?");
		$sth->execute(array($bookingID));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			array_push($hrsSourceList, $row['hrsSource']);
		}

	}

	//removed a booking from the database
	function deleteBooking($db, $bookingID){
		$sth = $db->prepare("DELETE FROM BookingSlots WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
		$sth->execute(array($bookingID));
	}

	//determnes which week the booking was booked in
	//useful when returning hours to users after a booking was canceled
	function determineWhichWeek($bookingDate){
		//if today is Sunday, then must use Monday last week to retrieve hours for the current week
		//TODO

		//determine current date so you can determine where to return hours
		$firstDay = date("Y-m-d", strtotime('monday this week'));  
		$firstDayNextWeek = date("Y-m-d", strtotime('monday next week'));
		$firstDayWeek3 = date("Y-m-d", strtotime('monday next week next week'));  

		//if booking made in the current week
		if($bookingDate >= $firstDay && $bookingDate < $firstDayNextWeek) {
			$week = 'curWeekHrs';

		} else if($bookingDate < $firstDayWeek3)  {
		    $week = 'nextWeekHrs';
		} 
		else{
			$week ='thirdWeekHrs';
		}
		echo " to ".$week.";";

		return $week;
	}

	//returns hours to user from a deleted booking
	function returnWeeklyHoursToUser($db, $week, $bookingUserID, $bookingLength){
		//determine the number of hours the user currently has for that week
		$query = "SELECT $week FROM User WHERE uID = ?;";
		$sth = $db->prepare($query);
		$sth->execute(array($bookingUserID));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$bookingLength = $row[$week] + $bookingLength;
		}
		

		//update the user table with the retruned hours from the canceled booking
		$sth = $db->prepare("UPDATE User SET $week = ? WHERE uID = ?;");
		$sth->execute(array($bookingLength,$bookingUserID));
	}

	function returnSpecialHoursToUser($db, $bookingUserID, $groupID, $bookingLength){
		$currentHrs = 0;
		$sth = $db->prepare("SELECT specialHrs FROM Permission WHERE uID = ? and groupID = ?;");
		$sth->execute(array($bookingUserID, $groupID));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$currentHrs = $row['specialHrs'];
		}

		$currentHrs +=$bookingLength;
		//update the user table with the retruned hours from the canceled booking
		$sth = $db->prepare("UPDATE Permission SET specialHrs = ? WHERE uID = ? and groupID = ?;");
		$sth->execute(array($currentHrs,$bookingUserID, $groupID));

	}

	//determine the length of a given booking in hours
	function determineBookingLength($db,$bookingID){
		//determine amount of time booking was
		$sth = $db->prepare("SELECT bookingDate, COUNT(*) as numBlocks FROM BookingSlots WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$numBlocks = $row['numBlocks'];
			$bookingDate = $row['bookingDate'];
		}
		$bookingLength = ($numBlocks*30.0)/60.0; //hours to be returned to the user


		return [$bookingLength, $bookingDate];
	}
?>





