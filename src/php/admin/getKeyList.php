<?php

	include('../connection.php');
	
	//set default time to UTC so it does not count daylight savings
  	//do not remove!
	date_default_timezone_set('UTC');
	
	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$date = $data->keyDate; 
	
	$result = [];
	
	$date = substr($date, 0, 10);
	
	//Get booking info from database
   	$sth = $db->prepare("SELECT DISTINCT Rooms.roomID, Bookings.uID, Bookings.bookingID, User.firstName, User.lastName, User.curWeekHrs as startTime, User.nextWeekHrs as endTime FROM Rooms JOIN BookingSlots JOIN Bookings JOIN User ON Rooms.roomID = BookingSlots.roomID AND BookingSlots.bookingID = Bookings.bookingID AND Bookings.uID = User.uID WHERE Rooms.reqKey = 'Yes' AND BookingSlots.bookingDate = ? ORDER BY Rooms.roomID ASC");
	$sth->execute(array($date));
	$rows = $sth->fetchAll();
	
	//foreach($rows as $row) {
	//	$result[] = $row;
	//}
	
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
			//Set count for eliminating duplicates
			$count = 0;	
		
			//Compare to last roomID for grouping
			if ($oldRoom != $row['roomID']){
				$current .= "\n". "\n";
			}
			
			//Loop through one room 
			foreach($row as $i) {
				//echo $i . "       ...         ";
				if ($count != 4 and $count != 5 and $count != 10 and $count != 11 and $count != 12 and $count != 13) { 
					if ($count % 2 == 0) {
					// Append a new person to the file
					$format = "%-16s";
					$string = sprintf($format, $i);
					$current .= $string;
					//$result[]
					
					}
				}
				$count = $count + 1;
				
			}
			//Get bookingID for time query 
			$bookingID = $row['bookingID'];
			
			//Query on booking ids to get time, and number of
			//blocks to correct end time
			$sth1 = $db->prepare("SELECT bookingID, startTime, endTime, COUNT(*) as numBlocks FROM BookingSlots JOIN Blocks ON BookingSlots.blockID = Blocks.blockID WHERE BookingSlots.bookingID = ?;");
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
				
				$row['startTime'] = $startTime;
				$row['endTime'] = $endTime;
				
				
				//$result[] = $time;	
			}
			$result[] = $row;
			// Write the contents back to the file
			file_put_contents($file, $current);
			//Set the new oldRoom value for next iteration
			$oldRoom = $row['roomID'];
			
			
			
			
		}
			
	}
	else {
		//No bookings that need keys
		$result[0] = "No data";
		$result[1] = $date;
	}
	
			//Convert to json
			$json = json_encode($result);
	
			// echo the json string
			echo $json;
	
	
	
   

?>
