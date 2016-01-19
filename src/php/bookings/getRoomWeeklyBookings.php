<?php
		
//Database connection variables
include('../connection.php');	

//Get post data stream 
$data = json_decode(file_get_contents("php://input"));
//Get parameters from 
$room = $data->Room;
$nonFormattedStart = $data->Start;
$nonFormattedEnd = $data->End;
//Format day
$start = strtotime($nonFormattedStart);
$start = date('Y-m-d', $start);
$end = strtotime($nonFormattedEnd);
$end = date('Y-m-d', $end);

$result = array();
//Set timezone
date_default_timezone_set('America/New_York');

while ($start <= $end){

	//get daily bookings from database
	$sth = $db->prepare("SELECT Bookings.BookingID, BookingSlots.BlockID, UID, BookingDate, BookingSlots.RoomID, StartTime, EndTime, Reason, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.BookingID = BookingSlots.BookingID AND BookingSlots.BlockID = Blocks.BlockID WHERE RoomID = ? AND BookingDate = ? GROUP BY BookingID ASC;");
	$sth->execute(array($room,$start));
	$rows = $sth->fetchAll();
	
	//Loop through each returned row 
	foreach($rows as $row) {
		
		//Get number of blocks
		$numBlocks = $row['numBlocks'];
		
		//Add thirty minutes to start time for each 
		//block in booking if there is more than one
		if ($numBlocks != 1) {
			$startTime = $row['StartTime'];
			$endTime =  strtotime($startTime);
		
			while ($numBlocks >= 1) {
				$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
				$endTime = strtotime($endTime);
				$numBlocks = ($numBlocks - 1);
			}

			//change the endtime to appropriate value
			$row['EndTime'] = date("H:i:s", $endTime);
		}
		//Add row to result 
		$result[] = $row;
	}
	$start = date('Y-m-d', strtotime($start. ' + 1 days'));
}

//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;
?>
