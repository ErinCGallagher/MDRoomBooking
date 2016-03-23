<?php
include('../connection.php');

//Get post datastream from front end
$data = json_decode(file_get_contents("php://input"));

//Set parameters from datastream
$building = $data->building;
$start = $data->startTime;
$end = $data->endTime;
$date = $data->date;

//Contents
$upright = $data->uprightPiano;
$grand = $data->grandPiano;
$chairs = $data->chairs;
$mirror = $data->mirror;
$stands = $data->stands;

date_default_timezone_set('UTC');

$utcDate = strtotime($date);
$startDate = date('Y-m-d', $utcDate);
$endDate = date('Y-m-d', $utcDate);

$utcStart = strtotime($start);
$startTime = date('H:i:s', $utcStart);

$utcEnd = strtotime($end);
$endTime = date('H:i:s', $utcEnd);


/*
// USED FOR TESTING

//Set parameters from datastream
$building = 'Theological Hall';

date_default_timezone_set('UTC');

$stamp = strtotime('2016-02-02 10:00:00');
$startDate = date('Y-m-d', $stamp);
$startTime = date('H:i:s', $stamp);

$stamp = strtotime('2016-02-02 16:00:00');
$startDate = date('Y-m-d', $stamp);
$endTime = date('H:i:s', $stamp);

//Contents
$upright = True;
$grand = False;
$openSpace = True;
$mirror = True; 
$projector = False;
*/



//Find Start BlockID
$query = "SELECT blockID FROM Blocks WHERE startTime = ?";
$sth = $db->prepare($query);
$sth->execute(array($startTime));
while($block = $sth->fetch(PDO::FETCH_ASSOC)) { 
	$startBlock = $block['blockID'];
}

//Find End BlockID
$query = "SELECT blockID FROM Blocks WHERE endTime = ?";
$sth = $db->prepare($query);
$sth->execute(array($endTime));
while($block = $sth->fetch(PDO::FETCH_ASSOC)) { 
	$endBlock = $block['blockID'];
}
$usedBlocks = $endBlock - $startBlock + 1;
$usedBlocks = (int) $usedBlocks;

//Find rooms that match contents
$query = "SELECT roomID FROM Rooms WHERE building = ?";
if ($upright){
	$query = $query . " AND upright = 'Yes'";
}
if ($grand){
	$query = $query . " AND grand = 'Yes'";
}
if ($chairs){
	$query = $query . " AND chairs = 'Yes'";
}
if ($mirror){
	$query = $query . " AND mirror = 'Yes'";
}
if ($stands){
	$query = $query . " AND stands = 'Yes'";
}	
$search = array();

$sth = $db->prepare($query);
$sth->execute(array($building));

if ($sth->rowCount() > 0) {

	while($room = $sth->fetch(PDO::FETCH_ASSOC)) {
		
		//Check if room has availability between times
		$query = "SELECT * FROM BookingSlots WHERE roomID = ? AND blockID >= ? AND blockID <= ? AND bookingDate = ?";
		$sth2 = $db->prepare($query);
		$sth2->execute(array($room['roomID'], $startBlock, $endBlock, $startDate));
		$bookedBlocks = (int) $sth2->rowCount();
		if ($bookedBlocks < $usedBlocks) {
			//there is at least one block available
			$search[$room['roomID']] = array();
			
			$sth3 = $db->prepare("SELECT Bookings.bookingID, BookingSlots.blockID, User.uID, bookingDate, BookingSlots.roomID, Bookings.otherDesc, Bookings.numParticipants, startTime, endTime, reason, User.firstName, User.lastName, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks JOIN User ON Bookings.bookingID = BookingSlots.bookingID AND BookingSlots.blockID = Blocks.blockID AND User.uID = Bookings.uID WHERE roomID = ? AND bookingDate = ? GROUP BY bookingID ASC;");
			$sth3->execute(array($room['roomID'],$startDate));
			
			//Loop through each returned row 
			while($row = $sth3->fetch(PDO::FETCH_ASSOC)) {
				
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
				$search[$room['roomID']][] = $row;
			}	
		} else {
			
		}
	}
} else {
	//No rooms match search criteria
	$search = array();
}

//Convert to json
$json = json_encode($search);

// echo the json string
echo $json;

	
?>