<?php
	session_start();
	//TODO, put stuff in PHP functions (CLEAN UP)

	//Database connection
	include('../connection.php');

  	//set default time to UTC so it does not count daylight savings
  	//do not remove!
	date_default_timezone_set('UTC');

  	//Get post datastream from front end
	$data = json_decode(file_get_contents("php://input"));

	//Set parameters from datastream
	$recurringID = $data->recurringID;
	
	date_default_timezone_set('America/Toronto');

	$currentDate = date('Y-m-d');
	$currentTime = date('H:i:s');

	$sth = $db->prepare("SELECT DISTINCT uID, Bookings.bookingID FROM Bookings INNER JOIN BookingSlots ON Bookings.bookingID=BookingSlots.bookingID WHERE bookingDate >= ? AND recurringID = ?;");
	$sth->execute(array($currentDate, $recurringID));
	
	$bookingIDList = array();
	
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$bookingIDList[] = $row['bookingID'];
		$bookingUserID = $row['uID'];
	}
	
	//Cancel booking	
	//This is not the user and the user is not an admin
	if($bookingUserID != $_SESSION["netID"] && $_SESSION["class"] != "Admin"){
		http_response_code(406); //Invalid Entry
	}
	else{ 
		//it is the user's own booking or they are admin
		foreach ($bookingIDList as $bid) {
			deleteBooking($db, $bid);
		}
		if ($_SESSION["class"] == "Admin" && $bookingUserID != $_SESSION["netID"]){
			//email user to announce cancellation
		}
		http_response_code(200); //success
	}

	//Close the connection
	$db = NULL;

	//removed a booking from the database
	function deleteBooking($db, $bookingID){
		$sth = $db->prepare("DELETE FROM BookingSlots WHERE bookingID = ?");
		$sth->execute(array($bookingID));
		$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
		$sth->execute(array($bookingID));
	}

?>