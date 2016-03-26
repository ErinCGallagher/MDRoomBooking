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
	$uID = $_SESSION["netID"];
	$room = $data->roomID;
	$reason = $data->reason;
	$building = $data->building;
	$desc = $data->otherDesc;
	$numP = $data->numParticipants;
	$localStart = $data->start;
	$localEnd = $data->end;
	
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
	
	// quick checks
	if($_SESSION["class"] == "NonBooking"){
		http_response_code(403); //Invalid Entry
	}else if (!in_array($reason, $reasonsList)) {
		$result['msg'] = "The reason provided is not valid";
		http_response_code(403); //Invalid Entry
	} else if (!in_array($numP, $numPeople)) {
		$result['msg'] = "the number of people provided is not valid";
		http_response_code(403); //Invalid Entry
	} else if (!array_key_exists($building, $allBuildings)) {
		$result['msg'] = "the building provided is not valid";
		http_response_code(403); //Invalid Entry (building)
	} else if (!in_array($room, $_SESSION["buildings"][$building]['rooms'])) {
		$result['msg'] = "the room provided is not valid";
		http_response_code(403); //Invalid Entry (room)
	} else if ($startTime < $openTime ||  $endTime > $closeTime) {
		//Booking is outside of building hours
		$result['msg'] = "the building is not open during your booking";
		http_response_code(403);
	} else {
	
		date_default_timezone_set('America/Toronto');

		$currentDate = date('Y-m-d');
		$currentTime = date('H:i:s');
		$class = $_SESSION['class'];
		
		$twoWeeks = strtotime('+2 weeks', strtotime($currentDate));
		$twoWeeks = date('Y-m-d', $twoWeeks);
		
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
		else if ($class == "Student" AND $startDate > $twoWeeks){
			$result['msg'] = "As a student user, you cannot book a room more than 2 weeks in the future from the current day.";
			http_response_code(402);
		}
		else {

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

			//determine if the user has the required hours to make the booking
			if($class == 'Student'){
				$hoursSourecList = array();
				$hrsSource = $_SESSION["class"];
				$duration = ($totalB * 30.0) / 60.0;
				//echo $duration;

				$hasBookingDurationRestriction = getHasBookingDurationRestriction($db, $uID);
				// check booking duration restrictions
				if()
				if ($hasBookingDurationRestriction && isOverDailyMusicMax($db, $uID, $totalB, $startDate) 
					&& ($building != "Theological Hall" && $building != "The Isabel")) {
					$result['msg'] = "As a Music student, you cannot book rooms for more than 1 hour a day.";
					http_response_code(406);
				} else if ($hasBookingDurationRestriction && $duration > 1 && ($building == "Chown Hall")) {
					$result['msg'] = "As a student user, you cannot book a room in Chown Hall for more than 1 hour.";
					http_response_code(406);
				} else if ($hasBookingDurationRestriction && $duration > 1 && ($building == "Upper Harrison LeCaine Hall" || $building == "Lower Harrison LeCaine Hall"
					|| $building == "Sonic Arts Studio")) { 
					$result['msg'] = "As a student user, you cannot book a room in Harrison LeCaine Hall for more than 1 hour.";
					http_response_code(406);
				} else if ($hasBookingDurationRestriction && $duration > 1.5 && ($building == "Theological Hall")) { 
					$result['msg'] = "As a student user, you cannot book a room in Theological Hall for more than 1.5 hours.";
					http_response_code(406);
				} else {

					//determnes which week the booking was booked in
					$week = determineWhichWeek($startDate);
					$hoursRemaining = 0;

					//confirm if there are weekly hours for that week
					$sth = $db->prepare("SELECT $week FROM User WHERE uID = ?");
					$sth->execute(array($uID));
					while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
						//Get number of blocks

						$hoursRemaining = $row[$week];
					}
					

					//if there are more weekly hours remaining than the hours required for the book
					if($hoursRemaining >= $duration ){
						$hrsSource = "Weekly"; //because they used their weekly hours to book it
						
						//create booking
						$bookingID = createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $hrsSource);
						//Send bookingID to front end
						$result['bookingID'] = $bookingID;

						$sth = $db->prepare("SELECT $week FROM User WHERE uID = ?");
						$sth->execute(array($uID));
						while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
							//Get number of blocks
							$newWeeklyHrs = $row[$week] - $duration;
						}

						for($k = 0; $k<$totalB; $k++){
							array_push($hoursSourecList, "weekly");
						}

						//only if the booking is successful do you remove the hours
						$sth = $db->prepare("UPDATE User SET $week = ? WHERE uID = ?");
						$sth->execute(array($newWeeklyHrs,$uID));

						//update hours Source for the booking the appropraite values
						//in this case it will all be weekly
						updateHrsSource($db, $uID, $bookingID, $hoursSourecList);

						http_response_code(200); //success
					}
					//still has some weekly hours left
					else if($hoursRemaining > 0){

						//calculate the new duration after using weekly hours
						$remainingDuration = $duration - $hoursRemaining;

						//check and see if the user has special hours valid this week
						//if there are sufficien special hours to make the booking, book the room
						if(SufficientSpecialHours($db, $uID, $startDate, $remainingDuration)){

							//book the room
							$bookingID = createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $hrsSource);

							//Send bookingID to front end
							$result['bookingID'] = $bookingID;

							//only if the booking is successful do you remove the hours
							$sth = $db->prepare("UPDATE User SET $week = ? WHERE uID = ?");
							$sth->execute(array(0,$uID));

							for($k = 0; $k<(($hoursRemaining * 60) / 30); $k++){
								array_push($hoursSourecList, "weekly");
							}

							//remove the hours from the user's special groups
							useSpecialHours($db, $uID, $startDate, $remainingDuration);

							//update the hourse source for the blocks of the booking
							updateHrsSource($db, $uID, $bookingID, $hoursSourecList);

							http_response_code(200); //success
						}
						else{ //not sufficient hours
							
							$result['msg'] = "You do not have sufficient special hours to complete this booking after using all your weekly hours";
							http_response_code(406);
						}
		
					}
					//no weekly hours left, does the user have enough secial hours to make the booking?
					else if ($hoursRemaining <= 0){
						//check and see if the user has special hours valid this week
						//if there are sufficien special hours to make the booking, book the room
						if(SufficientSpecialHours($db, $uID, $startDate,  $duration)){
							//book the room
							$bookingID = createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $hrsSource);
							//Send bookingID to front end
							$result['bookingID'] = $bookingID;

							//remove the hours from the user's special groups
							useSpecialHours($db, $uID, $startDate, $duration);

							
							//update the hourse source for the blocks of the booking
							updateHrsSource($db, $uID, $bookingID, $hoursSourecList);

							http_response_code(200); //success
						}
						else{ //not sufficient hours
							$result['msg'] = "You do not have sufficient special hours to complete this booking, you also have no general weekly hours.";
							
							http_response_code(406);
						}
					}

				}
			}
			else{//faculty & admin have unlimited hours
				//create booking
				$bookingID = createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $class);
				//Send bookingID to front end
				$result['bookingID'] = $bookingID;
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
	function createBookingInDB($db,$uID,$reason,$desc,$numP,$blocks, $startDate, $room, $totalB, $startTime, $endDate, $endTime, $hrsSource){

		global $result;
		global $building;
		//echo $totalB;
		//create a booking 
		$sth = $db->prepare("INSERT INTO Bookings (uID, reason, otherDesc, numParticipants) VALUES (?,?,?,?)");	
		$sth->execute(array($uID,$reason,$desc,$numP));
		
		$bookingID = $db->lastInsertId();
		//add to blocks to BookingSlots
		$inserted = 0;

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
			
			$result['msg'] = "Your booking could not be completed because it conflicted with another booking";
			http_response_code(409); //conflict
		} else {
			bookingConf($room, $building, $startDate, $startTime, $endTime, $reason, $desc, $numP, $db);
			$result['msg'] = 'Successfully booked: "' . $room . ', ' . $startDate . ' ' . $startTime . '-' . $endDate . ' ' . $endTime;
		}

		return $bookingID;

	}

	//determnes which week the booking was booked in
	//useful when returning hours to users after a booking was canceled
	function determineWhichWeek($bookingDate){

		global $currentDate;
		//if the current day is a sunday
		if(date('N',strtotime($currentDate)) == 7){
			//for some reason if it's sunday it detects tomorrow as the first monday
			//determine current date so you can determine where to return hours
			$firstDay = date("Y-m-d", strtotime('monday last week'));  
			$firstDayNextWeek = date("Y-m-d", strtotime('monday this week'));
			$firstDayWeek3 = date("Y-m-d", strtotime('monday next week'));
		}
		else{
			//determine current date so you can determine where to return hours
			$firstDay = date("Y-m-d", strtotime('monday this week'));  
			$firstDayNextWeek = date("Y-m-d", strtotime('monday next week'));
			$firstDayWeek3 = date("Y-m-d", strtotime('monday next week next week'));  
		}

		//if booking made in the current week
		if($bookingDate >= $firstDay && $bookingDate < $firstDayNextWeek) {
			$week = 'curWeekHrs';

		} else if($bookingDate < $firstDayWeek3)  {
		    $week = 'nextWeekHrs';
		} 
		else{
			$week ='thirdWeekHrs';
		}
		//echo " to ".$week.";";

		return $week;
	}

	//determine if there are sufficient special hours for the user to make the booking
	//return true if they have sufficient time, otherwise return false
	function SufficientSpecialHours($db, $uID, $startDate, $duration){
		$usableSpecialHours = 0;
		$sth = $db->prepare("SELECT SUM(Permission.specialHrs) totalHrs FROM Permission JOIN Ugroups on Ugroups.groupID = Permission.groupID WHERE uID = ? and ? BETWEEN Ugroups.startDate and Ugroups.endDate");
		$sth->execute(array($uID, $startDate));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$usableSpecialHours = $row['totalHrs'];
		}
		//are there enough speicial hours given the duration of the booking
		if(($usableSpecialHours - $duration) >= 0){
			return true;
		}
		else{
			return false;
		}
	}

	//determine how many special group hours a user needs to take to make the booking
	//update the permissions table in order to use the hours
	function useSpecialHours($db, $uID, $startDate, $duration){
		global $hoursSourecList;
		$sth = $db->prepare("SELECT Ugroups.groupID, Permission.specialHrs FROM Permission JOIN Ugroups on Ugroups.groupID = Permission.groupID WHERE uID = ? and ? BETWEEN Ugroups.startDate and Ugroups.endDate ORDER BY Ugroups.endDate ASC");
		$sth->execute(array($uID, $startDate));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//use these special hours and determine if you need more
			if($row['specialHrs'] - $duration < 0){
				updateSpecialHours($db, $uID, $row['groupID'], 0);
				$duration = $duration - $row['specialHrs'];

				//determine how many blocks were used
				for($k = 0; $k<(($row['specialHrs'] * 60) / 30); $k++){
					array_push($hoursSourecList, $row['groupID']);
				}
			}
			else if($duration == 0){
				//do nothing
			}
			else{
				$newHours = $row['specialHrs'] - $duration;
				updateSpecialHours($db, $uID, $row['groupID'], $newHours);

				//determine how many blocks were used
				for($k = 0; $k<(($duration * 60) / 30); $k++){
					array_push($hoursSourecList, $row['groupID']);
				}

				$duration = 0;
			}
		}
	}

	//update the speciial hours left for a user's group
	function updateSpecialHours($db, $uID, $groupID, $newHours){
		$sth = $db->prepare("UPDATE Permission SET specialHrs = ? WHERE uID = ? and groupID = ?;");
		$sth->execute(array($newHours,$uID, $groupID));
	}

	function updateHrsSource($db, $uID, $bookingID, $hoursSourecList){
	
		$numBlock = 0;
		$sth = $db->prepare("SELECT blockID FROM BookingSlots WHERE bookingID = ?;");
		$sth->execute(array($bookingID));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			update($db, $row['blockID'], $bookingID, $hoursSourecList[$numBlock]);
			$numBlock ++;
		}
	}

	// updates hours source for all of the booking slots
	function update($db, $blockID, $bookingID, $hoursSoure){
		$sth = $db->prepare("UPDATE BookingSlots SET hrsSource = ? WHERE bookingID = ? and blockID = ?;");
		$sth->execute(array($hoursSoure, $bookingID, $blockID));
	}

	function getHasBookingDurationRestriction($db, $uID) {
		// see if user is in any groups that has no booking duration restriction
		$sth = $db->prepare("SELECT hasBookingDurationRestriction FROM User WHERE uID = ?");
		$sth->execute(array($uID));
		$queryOutput = $sth->fetch(PDO::FETCH_NUM);
		return sizeof($queryOutput) != 0 && $queryOutput[0] == 'Yes';
	}

	function isOverDailyMusicMax($db, $uID, $totalBookingSlots, $bookingDate) {
		// Music students can only book for an hour a day
		$sth = $db->prepare("SELECT COUNT(*) FROM BookingSlots JOIN Bookings ON BookingSlots.bookingID = Bookings.bookingID 
			JOIN Master ON Bookings.uID = Master.uID WHERE Bookings.uID = ? AND department = 'Music' AND bookingDate = ?");
		$sth->execute(array($uID, $bookingDate));
		$queryOutput = $sth->fetch(PDO::FETCH_NUM);
		// print_r($queryOutput) ;
		return (sizeof($queryOutput)) != 0 && (($queryOutput[0] + $totalBookingSlots) > 2);
	}


?>
