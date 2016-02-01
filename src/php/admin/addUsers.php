<?php

	include("connection.php");

	//Get parameters from frontend
	$groupID = $_POST['groupID'];

	// reads in file and stores contents in $contents
	// each element is the userID of a user to be added to the group
	require '../uploadFile.php';

	// TODO: GET THIS VALUE
	$hours = 3;
	
	//add users to group
	$insertString = "";
	$updateString = "";
	$unexpectedUserString = "";
	
	//Arrays to hold query values
	$insertArray = array();
	$updateArray = array();
	

	foreach ($contents as $user) {
		// check that user is not already in group
		$checkGroupQuery = "SELECT uID FROM Permission WHERE uID = ? AND groupID = ?";
		$checkGroupStmt = $db->prepare($checkGroupQuery);
		$checkGroupStmt->execute(array($user, $groupID));
		
		if ($checkGroupStmt->rowCount() == 0) {
			// user is NOT in group, continue with addition
			// check that user is in master list
			$checkUserQuery = "SELECT uID FROM Master WHERE uID = ?";
			$checkUserStmt = $db->prepare($checkUserQuery);
			$checkUserStmt->execute(array($user));
			
			if ($checkUserStmt->rowCount() > 0) {
				//user is in master list, continue with addition

				// TODO: get hours and type (if they are active?)
					// need to get current date somehow

				// TODO: deal with booking restriction


				$insertString .= "(?,?,?,?), ";
				array_push($insertArray, $user, $groupID, $hours, $hours);
				
				
				$updateString .= "uID = ? OR ";
				array_push($updateArray, $user);
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

	//Insert Permissions
	$insertQuery = "INSERT INTO Permission (uID, groupID, weeklyHrs, specialHrs) VALUES $insertString";
	$insertStmt = $db->prepare($insertQuery);
	$insertStmt->execute($insertArray);

	if ($insertStmt) {
		// insert successful

		//TODO: fix this
		
		$updateQuery = "UPDATE User SET addHrs = addHrs + '$hours' WHERE $updateString";
		$updateStmt = $db->prepare($updateQuery);
		$updateStmt->execute($updateArray);

		if ($updateStmt) {
			// update successful
			echo "Successful";
		}

	} else {
		echo "Unsuccessful";
	}

?>
