
<?php

	include('../connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$uID = $data->userID;
	
	//array to hold results
	$result = array();
	$result2 = array();
	
	//Query to get group information
	$sth = $db->prepare("SELECT firstName, lastName, curWeekHrs, nextWeekHrs, hasBookingDurationRestriction FROM User WHERE uID = ?"); 
	$sth->execute(array($uID));
	
	
	
	if ($sth->rowCount() > 0) {
 		$rows = $sth->fetchAll();

		//Put result in an array 
		foreach($rows as $row) {
			$result[] = $row;
		}
		
		$sth = $db->prepare("SELECT COUNT(*) as numGroups FROM Permission WHERE uID = ? "); 
		$sth->execute(array($uID));
		$rows2 = $sth->fetchAll();
		
		//Put result in an array 
		foreach($rows2 as $row) {
			$result[] = $row;
		}
		
		$sth = $db->prepare("SELECT groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate, specialHrs FROM UGroups JOIN Permission ON Permission.groupID = UGroups.groupID WHERE Permission.uID = ? "); 
		$sth->execute(array($uID));
		$rows3 = $sth->fetchAll();
		
		//Put result in an array 
		foreach($rows3 as $row) {
			$result[] = $row;
		}
		
		//Format day
		date_default_timezone_set('America/Toronto');
		/*
		//determine current date so you only retrieve bookings after it
		$currentDate = date('Y-m-d');
		$currentTime = date('H:i:s');
		

		//get daily bookings from database
		$sth = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, uID, bookingDate, BookingSlots.roomID, startTime as start, endTime, reason, Rooms.building, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID JOIN Rooms on BookingSlots.roomID = Rooms.roomID WHERE (bookingDate >= ? and uID = ? and BookingSlots.blockID >= (SELECT blockID FROM Blocks WHERE startTime >= ? LIMIT 1) ) OR (bookingDate > ? and uID = ?) GROUP BY bookingID ORDER BY bookingDate, startTime ASC;");
		$sth->execute(array($currentDate, $uID, $currentTime, $currentDate, $uID));

		$rows = $sth->fetchAll();
		
		//Loop through each returned row 
		foreach($rows as $row) {
			//Get number of blocks
			$numBlocks = $row['numBlocks'];
			
			//Add thirty minutes to start time for each 
			//block in booking if there is more than one
			if ($numBlocks != 1) {
				$startTime = $row['start'];
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
		*/	
	
	} 
	else {
		 $result[0] = 'nothing';
		 $result[1] = $uID;
	}

	//Close the connection
	$db = NULL;

	//Convert to json
	$json = json_encode($result);

	echo $json;
	
	
?>