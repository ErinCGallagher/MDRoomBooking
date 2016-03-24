<?php
$notProduction = true; //change to false when on production, for testing purposes
function userEmail(){
	//$user = $_SESSION['netID'] . "@queensu.ca";
	//$user = $_SERVER['HTTP_QUEENSU_MAIL'];
	$user = "11lmb23@queensu.ca";
	return $user;
}

function recurringConf(){

}

function bookingConf($room, $building, $startDate, $startTime, $endTime, $reason, $desc, $numP, $db) {
	global $notProduction;
	if(!$notProduction){
		$notifyAdmin = False;
		$to = userEmail();
		
		$sth = $db->prepare("SELECT reqKey, fee FROM Rooms WHERE roomID = ?");
		$sth->execute(array($room));
		$rows = $sth->fetchAll();
		
		foreach($rows as $row) {
			$key = $row['reqKey'];
			if (is_null($row['fee']) || $row['fee'] == ""){
				$fee = "No";
			} else { 
				$fee = $row['fee'];
			}
		}

		$msg = "";

		$msg2 = "You have successfully booked:\n";
		$msg .= "\nBuilding: $building";
		$msg .= "\nRoom: $room";
		$msg .= "\nDate: $startDate";
		$msg .= "\nTime: $startTime - $endTime";
		$msg .= "\nNumber of Participants: $numP";
		$msg .= "\nKey Required: $key";
		$msg .= "\nFee: $fee";
		$msg .= "\nReason: $reason";
		if ($reason == "Other"){
			$msg .= "\nDescription: $desc";
			$notifyAdmin = True;
		} elseif ($reason == "Coursework" || $reason == "Course") {
			$msg .= "\nCourse Code: $desc"; 
		}
		$msg2 .= $msg;
		sendEmail($to, "Booking Confirmation", $msg2);
		
		//Admins must be notified of all bookings with Reason: Other
		if ($notifyAdmin) {
			$name = $_SERVER['HTTP_COMMON_NAME'];
			otherBooking($msg, $name, $to);
		}
	}
}

function cancelBooking($room, $building, $startDate, $startTime, $endTime, $reason, $desc, $numP, $db, $to, $admin) {
	global $notProduction;
	if(!$notProduction){
		$sth = $db->prepare("SELECT reqKey, fee FROM Rooms WHERE roomID = ?");
		$sth->execute(array($room));
		$rows = $sth->fetchAll();
		
		foreach($rows as $row) {
			$key = $row['reqKey'];
			if (is_null($row['fee']) || $row['fee'] == ""){
				$fee = "No";
			} else { 
				$fee = $row['fee'];
			}
		}
		
		if ($admin) {
			$msg = "Your booking was cancelled by an administrator:\n";
		} else {
			$msg = "You cancelled the following booking:\n";
		}

		$msg .= "\nBuilding: $building";
		$msg .= "\nRoom: $room";
		$msg .= "\nDate: $startDate";
		$msg .= "\nTime: $startTime - $endTime";
		$msg .= "\nNumber of Participants: $numP";
		$msg .= "\nKey Required: $key";
		$msg .= "\nFee: $fee";
		$msg .= "\nReason: $reason";
		if ($reason == "Other"){
			$msg .= "\nDescription: $desc";
		} elseif ($reason == "Coursework" || $reason == "Course") {
			$msg .= "\nCourse Code: $desc"; 
		}
		sendEmail($to, "Booking Cancellation", $msg);
	}
}

function otherBooking($msg, $name, $email) {
	global $notProduction;
	if(!$notProduction){
		$msg2 = "A booking was made with the reason being stated as 'Other'. The booking was made by:";
		$msg2 .= "\nName: $name";
		$msg2 .= "\nEmail: $email";
		$msg = $msg2 . "\n\n" . $msg;
		//$adminEmail = "";
		//sendEmail($adminEmail, "Other Booking", $msg);
	}
}

function sendEmail($to, $subject, $msg) {
	global $notProduction;
	if(!$notProduction){
		$msg .= "\n\nThis is an automatically generated notification. Please do not reply. For any questions or concerns, contact the School of Drama and Music administration.";
		// use wordwrap() if lines are longer than 70 characters
		$msg = wordwrap($msg,70);
		mail($to,$subject,$msg);
	}
}


?>