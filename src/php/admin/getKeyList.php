<?php

	include('connection.php');
	
	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$date = $data->keyDate; 
	
	$date = substr($date, 0, 10);
	
	//Get booking info from database
   	$sth = $db->prepare("SELECT DISTINCT Rooms.roomID, Bookings.uID, Bookings.bookingID, User.firstName, User.lastName FROM Rooms JOIN BookingSlots JOIN Bookings JOIN User ON Rooms.roomID = BookingSlots.roomID AND BookingSlots.bookingID = Bookings.bookingID AND Bookings.uID = User.uID WHERE Rooms.reqKey = 'Yes' AND BookingSlots.bookingDate = ? ORDER BY Rooms.roomID ASC");
	$sth->execute(array($date));
	$rows = $sth->fetchAll();
	
	//Clear File
	$myfile = fopen("../KeyList.txt", "w");
	$txt = "Key List For " . $date . "\n";
	fwrite($myfile, $txt);
	fclose($myfile);
	
	//Check if result is empty, meaning no keys needed that day
	if ($rows != NULL) {
	
		//Set file
		$file = '../KeyList.txt';
		$current = file_get_contents($file);
		
		//Format headers
		$format = "%-15s %-15s %-15s %-15s %-15s %-15s \n";
		$string = sprintf($format, "Room", "NetID", "FName", "LName", "Start", "End");
		$current .= $string;
		
		//Set initial oldRoom 
		$firstRow = $rows[0];
		$oldRoom = $firstRow['roomID'];
		//Loop through romm results
		foreach($rows as $row) {
			
			//Compare to last roomID for grouping
			if ($oldRoom != $row['roomID']){
				$current .= "\n". "\n";
			}
			//Set count for eliminating duplicates
			$count = 0;	
			//Loop through one room 
			foreach($row as $i) {
				echo $i;
				if ($count != 4 and $count != 5) { 
					if ($count % 2 == 0) {
					// Append a new person to the file
					$format = "%-16s";
					$string = sprintf($format, $i);
					$current .= $string;
					
					}
				}
				$count = $count + 1;
				
			}
			//Get bookingID for time query 
			$bookingID = $row['bookingID'];
			
			//Query on booking ids to get time, and number of
			//blocks to correct end time
			$sth1 = $db->prepare("SELECT startTime, endTime, COUNT(*) as numBlocks FROM BookingSlots JOIN Blocks ON BookingSlots.blockID = Blocks.blockID WHERE BookingSlots.bookingID = ?;");
			$sth1->execute(array($bookingID));
			$times = $sth1->fetchAll();
			
			//Set time
			foreach($times as $time) {
				
				$numBlocks = $time['numBlocks'];
				$startTime = $time['startTime'];
				$endTime = strtotime($startTime);
				//Convert end time by calculatning 
				while ($numBlocks >= 1) {
					$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
					$endTime = strtotime($endTime);
					$numBlocks = ($numBlocks - 1);
				}
				//change the endtime to appropriate value
				$time['endTime'] = date("H:i:s", $endTime);
				$endTime = $time['endTime'];
				//append start and end time to current
				$current .= $startTime . "\t  " ;
				$current .= $endTime . "\n";	
			}
		
			// Write the contents back to the file
			file_put_contents($file, $current);
			//Set the new oldRoom value for next iteration
			$oldRoom = $row['roomID'];
		}
		
		echo "sucess";
	}
	else {
		echo "No data";
	}
	
   

?>
