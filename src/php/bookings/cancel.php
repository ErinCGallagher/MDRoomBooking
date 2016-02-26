<?php
	session_start();
	//TODO, put stuff in PHP functions (CLEAN UP)

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
				//if faculty, delete booking because they have unlimited hours
				if($_SESSION["class"] == "Faculty"){
					deleteBooking($db, $bookingID);
					http_response_code(200); //sucess
				}
				else{ //student, must return booking hours to the student

					///determine the length of a given booking in hours
					$response = determineBookingLength($db,$bookingID);

					$bookingLength = $response[0];
					$bookingDate = $response[1];

					$hrsSourceList = array();
					//retrieve hrsSource for each block
					retrieveHrsSource($db, $bookingID);

					//cancel booking
					deleteBooking($db, $bookingID);

					//determnes which week the booking was booked in
					$week = determineWhichWeek($bookingDate);
					echo count($hrsSourceList);
					//return hours to the appropriate week and group
					for($i = 0; $i < count($hrsSourceList); $i++){
						if($hrsSourceList[$i] == "weekly"){
							echo "weekly";
							returnWeeklyHoursToUser($db, $week, $bookingUserID, 0.5);
						}
						else{
							echo "special";
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
				$class = $row['class'];			}

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

				//determnes which week the booking was booked in
				$week = determineWhichWeek($bookingDate);

				//return hours to the appropriate week and group
				for($i = 0; $i < count($hrsSourceList); $i++){
					if($hrsSourceList[$i] == "weekly"){
						returnWeeklyHoursToUser($db, $week, $bookingUserID, 0.5);
					}
					else{
						returnSpecialHoursToUser($db, $bookingUserID, $hrsSourceList[$i], 0.5);
					}
				}

				http_response_code(200); //sucess
			}

			//otherwise they are admin or deleting a faculty booking
			deleteBooking($db, $bookingID);
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
		$sth = $db->prepare("SELECT $week FROM User WHERE uID = ?;");
		$sth->execute(array($bookingUserID));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$bookingLength = $row[$week] + $bookingLength;
		}
		echo " New hours ".$bookingLength;

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
		echo "current hrs:".$currentHrs."   ";
		$currentHrs +=$bookingLength;
		echo $currentHrs;
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
		echo "hours to return ".$bookingLength;

		return [$bookingLength, $bookingDate];
	}
?>





