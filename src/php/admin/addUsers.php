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
	$hours = 3;
	
	//add users to group
	$insertString = "";
	$updateString = "";
	$unexpectedUserString = "";

	foreach ($contents as $user) {
		// check that user is not already in group
		$checkGroupQuery = "SELECT uID FROM Permission WHERE uID = '$user' AND groupID = '$groupID'";
		$checkGroupStmt = $db->query($checkGroupQuery);
		
		if ($checkGroupStmt->rowCount() == 0) {
			// user is NOT in group, continue with addition

			// check that user is in master list
			$checkUserQuery = "SELECT uID FROM Master WHERE uID = '$user'";
			$checkUserStmt = $db->query($checkUserQuery);
			
			if ($checkUserStmt->rowCount() > 0) {
				//user is in master list, continue with addition

				$insertString .= "('$user', '$groupID', '3', '0'), ";
				$updateString .= "uID ='$user' OR ";
			} else {
				$unexpectedUserString .= "$user, ";
			}

		} else {
			// user is in group, don't re-add
			echo "User $user is already in group $groupID.";
		}
	}

	echo "Unexpected Users: " . $unexpectedUserString;

	//remove extra characters
	$insertString = chop($insertString, ", ");
	$updateString = chop($updateString, " OR ");

	$insertQuery = "INSERT INTO Permission (uID, groupID, weeklyHrs, specialHrs) VALUES $insertString";
	$insertStmt = $db->query($insertQuery);

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
