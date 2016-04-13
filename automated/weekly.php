<?php

	require_once("/home/users/DMRoomBooking/wwws/artsci/DMRoomBooking/src/php/connection.php");
	require_once("/home/users/DMRoomBooking/wwws/artsci/DMRoomBooking/src/php/util.php");

	function getGroupsWeeklyHours($db, $userID) {
		//TODO check this is the correct date to use
		$startThirdWeek = date("Y-m-d", strtotime('monday next week next week')); 
		$getWeeklyHrsQuery = "SELECT Sum(UGroups.hours) weeklyHours
			FROM Permission JOIN UGroups on UGroups.groupID = Permission.groupID 
			WHERE uID = '$userID' and '$startThirdWeek' BETWEEN UGroups.startDate and UGroups.endDate";
		$getStudentStmt = runQuery($db, $getWeeklyHrsQuery, []);
		return $getStudentStmt->fetch(PDO::FETCH_ASSOC)["weeklyHours"];
	}

	function getDefaultWeeklyHours($db, $userID) {
		$getDeptQuery = "SELECT department FROM Master WHERE uID = '$userID'";
		$getDeptStmt = $db->prepare($getDeptQuery);
		$getDeptStmt->execute([]);

		$defaultHrs = 0;
		while($dept = $getDeptStmt->fetch(PDO::FETCH_ASSOC)["department"]) {
			//can be multiple departments
			$defaultHrs += getDepartmentDefaultWeeklyHours($db, $dept);
		}
		return $defaultHrs;
	}

	//get all student users
	$getStudentQuery = "SELECT uID, nextWeekHrs, thirdWeekHrs FROM User WHERE class = 'Student'";
	$getStudentStmt = runQuery($db, $getStudentQuery, []);
	$studentArray = $getStudentStmt->fetchAll(PDO::FETCH_ASSOC);

	//TODO: Need to use PDO? No user input
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
		$newThirdWeekHrs = getGroupsWeeklyHours($db, $userInfo["uID"]) + getDefaultWeeklyHours($db, $userInfo["uID"]);
		$updateThirdString .= sprintf("WHEN '%s' THEN %d ", $userInfo["uID"], $newThirdWeekHrs);

    }

    // update DB
	try {
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$db->beginTransaction();

		//Update user table
		if (sizeof($studentArray) > 0) {
			$updateUsersQuery = "UPDATE User SET $updateCurString END, $updateNextString END, $updateThirdString END ";
			$uIDs = implode('\',\'', array_column($studentArray, "uID")); //comma separated list of uID column
			$updateUsersQuery .= "WHERE uID IN ('$uIDs')";
			runQuery($db, $updateUsersQuery, []);
		}
	
		$db->commit();
		$db = NULL;

	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  " . $e; 
	    }
	    $db = NULL;
	}

?>
