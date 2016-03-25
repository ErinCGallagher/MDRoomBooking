<?php
		
//Database connection variables
include('../connection.php');	

//Get post data stream 
$data = json_decode(file_get_contents("php://input"));
//Get parameters from 
$building = $data->building;
$nonFormattedStart = $data->start;
$nonFormattedEnd = $data->end;
//Format day
$start = strtotime($nonFormattedStart);
$start = date('Y-m-d', $start);
$end = strtotime($nonFormattedEnd);
$end = date('Y-m-d', $end);

$result = array();
//Set timezone
date_default_timezone_set('America/New_York');
	
	//find all rooms for the given building
	$rooms = array();
	$sth = $db->prepare("SELECT DISTINCT roomID FROM Rooms WHERE building = ?;");
	$sth->execute(array($building));
	
	//Loop through each returned row and generate array of roomID for that building
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	  foreach($row as $room){
	  	array_push($rooms,$room);
	  }
	}

//loop through each room in the building collecting weekly bookings
foreach($rooms as $roomID){
	//all bookings are within a array under that classes roomID as the key
	$result[$roomID] = array(); 
	$tempStart = $start; //set temporary start date so as not to manipulate the original
	while ($tempStart <= $end){

		//get daily bookings from database
		$sth = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, User.uID, bookingDate, BookingSlots.roomID, startTime, endTime, reason, Bookings.otherDesc, Bookings.numParticipants, BookingSlots.hrsSource, User.firstName, User.lastName, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots ON Bookings.bookingID = BookingSlots.bookingID JOIN Blocks ON BookingSlots.blockID = Blocks.blockID LEFT JOIN User ON User.uID = Bookings.uID WHERE roomID = ? AND bookingDate = ? GROUP BY bookingID ASC;");
		$sth->execute(array($roomID,$tempStart));
		
		//Loop through each returned row 
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			
			//Get number of blocks
			$numBlocks = $row['numBlocks'];
			
			//Add thirty minutes to start time for each 
			//block in booking if there is more than one
			if ($numBlocks != 1) {
				$startTime = $row['startTime'];
				$endTime =  strtotime($startTime);
			
				while ($numBlocks >= 1) {
					$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
					$endTime = strtotime($endTime);
					$numBlocks = ($numBlocks - 1);
				}

				//change the endtime to appropriate value
				$row['endTime'] = date("H:i:s", $endTime);
			}
			//Add row to result 
			array_push($result[$roomID],$row);
		}
		$tempStart = date('Y-m-d', strtotime($tempStart. ' + 1 days'));
	}
	$tempStart = $start; //reset to the original start date for next room
}

//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;
?>
