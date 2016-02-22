<?php
	session_start();

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

	if ($currentDate > $startDate){
		//Booking has already started or has already passed
		//currently not working because of timezones
		http_response_code(406); //Invalid Entry
	} else if(($currentDate == $startDate) && ($currentTime > $startTime)){
		echo $startTime;
		echo $currentTime;
		http_response_code(406); //Invalid Entry
	} else {
		//Cancel booking

		//if user is not admin, confirm they are trying to cancel their own booking
		if ($_SESSION["class"] != "admin"){
			$sth = $db->prepare("SELECT uID FROM Bookings WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
				$userID = $row['uID'];
			}
			
			//confirm this is the user's booking
			if($userID != $_SESSION["netID"]){
				http_response_code(406); //Invalid Entry
			}
			else{
				//determine amount of time booking was

				$sth = $db->prepare("SELECT bookingDate, COUNT(*) as numBlocks FROM BookingSlots WHERE bookingID = ?");
				$sth->execute(array($bookingID));
				
				while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
					//Get number of blocks
					$numBlocks = $row['numBlocks'];
					$bookingDate = $row['bookingDate'];
				}
				$bookingLength = ($numBlocks*30.0)/60.0; //hours to be returned to the user
				echo $bookingLength;

				//cancel booking
				$sth = $db->prepare("DELETE FROM BookingSlots WHERE bookingID = ?");
				$sth->execute(array($bookingID));
				$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
				$sth->execute(array($bookingID));

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
				echo $week;

				//determine the number of hours the user currently has for that week
				$sth = $db->prepare("SELECT $week FROM User WHERE uID = ?");
				$sth->execute(array($userID));
				while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
					//Get number of blocks
					$bookingLength = $row[$week] + $bookingLength;
				}
				echo $bookingLength;

				//update the user table with the retruned hours from the canceled booking
				$sth = $db->prepare("UPDATE User SET $week = ? WHERE uID = ?");
				$sth->execute(array($bookingLength,$userID));

				http_response_code(200); //sucess
			}

		}
		else{ //user is admin
			$sth = $db->prepare("DELETE FROM BookingSlots WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			$sth = $db->prepare("DELETE FROM Bookings WHERE bookingID = ?");
			$sth->execute(array($bookingID));
			http_response_code(200); //sucess
		}
		
	}

	//Close the connection
	$db = NULL;
?>
