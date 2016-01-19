<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	// reads in file and stores contents in $contents
	// each element is the userID of a user to be added to the group
	require '../uploadFile.php';

	// NEED TO GET THESE VALUES from frontend
	$groupID = 1; 
	$year = 2016;
	$hours = 3;
	
	//add users to group
	$insertString = "";
	$updateString = "";
	$unexpectedUserString = "";

	foreach ($contents as $user) {
		//need to check that user is in master list
		$checkUserQuery = "SELECT uID FROM User WHERE uID = '$user'";
		$checkUserStmt = $db->query($checkUserQuery);
		
		$row = $checkUserStmt->fetch(PDO::FETCH_ASSOC);
		if ($row) {
			//user is in master list
			$insertString .= "('$user', '$groupID', '$year'), ";
			$updateString .= "uID ='$user' OR ";
		} else {
			$unexpectedUserString .= "$user, ";
		}	
	}

	echo "Unexpected Users: " . $unexpectedUserString;

	//remove extra characters
	$insertString = chop($insertString, ", ");
	$updateString = chop($updateString, " OR ");

	echo $insertString;
	echo $updateString;

	$insertQuery = "INSERT IGNORE INTO Permission (uID, groupID, academicYr) VALUES $insertString";
	$insertStmt = $db->query($insertQuery);

	// only update hours if user inserted

	if ($insertStmt) {
		// insert successful
		$updateQuery = "UPDATE User SET addHrs = addHrs + '$hours' WHERE $updateString";
		$updateStmt = $db->query($updateQuery);

		if ($updateStmt) {
			// update successful
			echo "Successful";
		}

	} else {
		echo "Unsuccessful";
	}

?>
