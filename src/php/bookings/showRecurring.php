<?php

/*
THIS FILE IS USED FOR TESTING


	include('../connection.php');
	date_default_timezone_set('America/Toronto');
	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');
	$user = "11ecg5";
	
	//get all recurringIDs and amount of remainingBookings
	$sth = $db->prepare("SELECT DISTINCT recurringID FROM BookingSlots JOIN Bookings ON Bookings.bookingID = BookingSlots.bookingID WHERE bookingDate >= ? AND uID = ? and BookingSlots.blockID >= (SELECT blockID FROM Blocks WHERE startTime >= ? LIMIT 1) OR (bookingDate > ? and uID = ?);");
	$sth->execute(array($currentDate, $user, $currentTime, $currentDate, $user));
	
	$recurring = array();
	$recurringResults = array();
	
	
	while($row = $sth->fetch(PDO::FETCH_ASSOC)){
		if (!is_null($row['recurringID'])){
			$rid = $row['recurringID'];
			$recurring[$rid] = array();
			$recurring[$rid]['recurringID'] = $rid;
			$recurring[$rid]['bookings'] = array();
			
			$count = 0;
			//get information about each recurring booking
			$sth2 = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, uID, bookingDate, BookingSlots.roomID, startTime, endTime, reason, Rooms.building, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID JOIN Rooms on BookingSlots.roomID = Rooms.roomID WHERE (BookingSlots.recurringID = ? AND bookingDate >= ? AND uID = ? and BookingSlots.blockID >= (SELECT blockID FROM Blocks WHERE startTime >= ? LIMIT 1) ) OR (bookingDate > ? and uID = ?) GROUP BY bookingID ORDER BY bookingDate, startTime ASC;");
			$sth2->execute(array($rid, $currentDate, $user, $currentTime, $currentDate, $user));
			
			//Loop through each returned row 
			while($row2 = $sth2->fetch(PDO::FETCH_ASSOC)) {
				
				$recurring[$rid]['building'] = $row2['building'];
				$recurring[$rid]['room'] = $row2['roomID'];
				$recurring[$rid]['dayOfWeek'] = date("l", strtotime($row2['bookingDate'])); 
				$recurring[$rid]['reason'] = $row2['reason'];
				$recurring[$rid]['bookings'][] = [$row2['bookingID'], $row2['bookingDate']];
			
				//Get number of blocks
				$numBlocks = $row2['numBlocks'];
				
				$startTime = $row2['startTime'];
				$endTime = $row2['endTime'];
				
				//Add thirty minutes to start time for each 
				//block in booking if there is more than one
				if ($numBlocks != 1) {
					$startTime = $row2['startTime'];
					$endTime =  strtotime($startTime);
				
					while ($numBlocks >= 1) {
						$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
						$endTime = strtotime($endTime);
						$numBlocks = ($numBlocks - 1);
					}

					//change the endtime to appropriate value
					$row2['endTime'] = date("H:i:s", $endTime);
				}
				
				$recurring[$rid]['weeksRemaining'] = $count;
				$recurring[$rid]['time'] = $startTime . " - " . $endTime;
		
				$count = $count + 1;
			}
			$recurringResults[] = $recurring[$rid];
		}
	}
	
	foreach ($recurringResults as $r) {
		echo "<br>RecurringID: " . $r['recurringID'];
		echo "<br>DayOfWeek: " . $r['dayOfWeek'];
		echo "<br>Time: " . $r['time'];
		echo "<br>Building: " . $r['building'];
		echo "<br>Room: " . $r['room'];
		echo "<br>Reason: " . $r['reason'];
		echo "<br>Remaining: " . $r['weeksRemaining'];
		foreach ($r['bookings'] as $b){
			echo "<br>Bid:" . $b[0];
			echo "<br>Date:" . $b[1];
		}
	}
	
*/
	
	
?>
	
	
