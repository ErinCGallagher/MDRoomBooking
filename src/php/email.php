<?php

function userEmail(){
	$user = $_SESSION['netID'] . "@queensu.ca";
	//$user = $_SERVER['HTTP_QUEENSU_MAIL'];
	return $user;
}

function roomDetails($room, $db){
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
	
	$details = array("fee"=>$fee, "key"=>$key); 
	return $details;
}

function recurringConf($room, $building, $startTime, $endTime, $reason, $desc, $numP, $db, $success){
	$to = userEmail();
	
	$details = roomDetails($room, $db);
	$key = $details['key'];
	$fee = $details['fee'];
	
	$msg = "You successfully booked a recurring booking on the following dates:";
	foreach ($success as $day){
		$msg .= "\n$day";
	}
	$dayOfWeek = date("l", strtotime($success[0])); 
	$msg .= "\n\nDetails:";
	$msg .= "\nBuilding: $building";
	$msg .= "\nRoom: $room";
	$msg .= "\nDay: $dayOfWeek";
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
	sendEmail($to, "Booking Confirmation", $msg);
}

function bookingConf($room, $building, $startDate, $startTime, $endTime, $reason, $desc, $numP, $db) {
	$notifyAdmin = False;
	$to = userEmail();
	
	$details = roomDetails($room, $db);
	$key = $details['key'];
	$fee = $details['fee'];

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
	if ($notifyAdmin == True) {
		$name = $_SERVER['HTTP_COMMON_NAME'];
		otherBooking($msg, $name, $to);
	}
}

function cancelBooking($room, $building, $startDate, $startTime, $endTime, $reason, $desc, $numP, $db, $to, $admin) {
	
	$details = roomDetails($room, $db);
	$key = $details['key'];
	$fee = $details['fee'];
	
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

function cancelRecurring($room, $building, $cancelDates, $startTime, $endTime, $reason, $desc, $numP, $db, $to, $admin) {
	
	$details = roomDetails($room, $db);
	$key = $details['key'];
	$fee = $details['fee'];
	
	if ($admin) {
		$msg = "The following dates of your recurring booking were cancelled by an administrator:";
	} else {
		$msg = "You cancelled the following dates of your recurring booking:";
	}
	
	foreach ($cancelDates as $day){
		$msg .= "\n$day";
	}

	$msg .= "\n\nDetails";
	$msg .= "\nBuilding: $building";
	$msg .= "\nRoom: $room";
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

function otherBooking($msg, $name, $email) {
	$msg2 = "A booking was made with the reason being stated as 'Other'. The booking was made by:";
	$msg2 .= "\nName: $name";
	$msg2 .= "\nEmail: $email";
	$msg = $msg2 . "\n\n" . $msg;
	
	$admins = getAdmins();
	foreach ($admins as $adminEmail){
		sendEmail($adminEmail, "Other Booking", $msg);
	}

}

function sendEmail($to, $subject, $msg) {
	if(array_key_exists('HTTP_QUEENSU_NETID', $_SERVER)){

		$msg .= "\n\nIf you are booking a room in Harrison-LeCaine Hall that requires a key, please come to the Main Office during the following times for key pick up";
		$msg .= "\n8:30 am-9:30 am (except Fridays)";
		$msg .= "\n11:00 am - 12:00 noon";
		$msg .= "\n2:30 pm - 3:30 pm";

		$msg .= "\n\nThis is an automatically generated notification. Please do not reply. For any questions or concerns, contact the School of Drama and Music administration.";
		// use wordwrap() if lines are longer than 70 characters
		$msg = wordwrap($msg,70);
		mail($to,$subject,$msg);
	}
}

function getAdmins(){
	$admins = array("11lmb23@queensu.ca");
	//$admins = array("belloa@queensu.ca","isonk@queensu.ca","redisha@queensu.ca");
	return $admins;
}


?>