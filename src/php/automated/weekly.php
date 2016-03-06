<?php

	require_once("../connection.php");
	require_once("../util.php");

	//get all student users
	$getStudentQuery = "SELECT uID, nextWeekHrs, thirdWeekHrs FROM User WHERE class = 'Student'";
	$getStudentStmt = runQuery($db, $getStudentQuery, []);
	$studentArray = $getStudentStmt->fetchAll(PDO::FETCH_ASSOC);
	print_r($studentArray);

	$updateCurString = "curWeekHrs = CASE uID ";
	$updateNextString = "nextWeekHrs = CASE uID ";
	$updateThirdString = "thirdWeekHrs = CASE uID ";

	foreach ($studentArray as $userInfo) {
    	//Update user hours
		//Move next week hours into the current week hours position 
			//TODO: actually need to recalculate (if someone removed from music)
		$updateCurString .= sprintf("WHEN '%s' THEN %d ", $userInfo["uID"], $userInfo["nextWeekHrs"]);
		//Move third week hours into next week hours
		$updateNextString .= sprintf("WHEN '%s' THEN %d ", $userInfo["uID"], $userInfo["thirdWeekHrs"]);
		//calc third week hrs (default + active weekly group hours)
		$newThirdWeekHrs = 4.00;
		$updateThirdString .= sprintf("WHEN '%s' THEN %d ", $userInfo["uID"], $newThirdWeekHrs);

    }

    // update DB
	try {
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$db->beginTransaction();

		//Update user table
		if (sizeof($studentArray) > 0) {
			// $insertQuery = "INSERT INTO Permission (uID, groupID, specialHrs) VALUES $insertString";
			// $insertStmt = $db->prepare($insertQuery);
			// $insertStmt->execute($insertArray);

			$updateUsersQuery = "UPDATE User SET $updateCurString END, $updateNextString END, $updateThirdString END ";
			$uIDs = implode('\',\'', array_column($studentArray, "uID")); //comma separated list of uID column
			$updateUsersQuery .= "WHERE uID IN ('$uIDs')";
			echo $updateUsersQuery;

			runQuery($db, $updateUsersQuery, []);
		}
	
		$db->commit();

	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  " . $e; 
	    }
	}

?>
