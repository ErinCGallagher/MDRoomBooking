<?php

	include("connection.php");

	// check that user is not already in group
	function userInGroup($db, $user, $groupID) {
		$checkGroupQuery = "SELECT uID FROM Permission WHERE uID = ? AND groupID = ?";
		$checkGroupStmt = $db->prepare($checkGroupQuery);
		$checkGroupStmt->execute(array($user, $groupID));
		
		return $checkGroupStmt && $checkGroupStmt->rowCount() > 0;
	}

	// check that user is in master list
	function userInMasterList($db, $user) {
		$checkUserQuery = "SELECT uID FROM Master WHERE uID = ?";
		$checkUserStmt = $db->prepare($checkUserQuery);
		$checkUserStmt->execute(array($user));

		return $checkUserStmt && $checkUserStmt->rowCount() > 0;
	}

	function getGroupInfo($db, $groupID) {
		$groupInfoQuery = "SELECT addHrsType, hours, hasBookingDurationRestriction, startDate, endDate FROM UGroups WHERE groupID = ?";
		$groupInfoStmt = $db->prepare($groupInfoQuery);
		$groupInfoStmt->execute(array($groupID));

		if ($groupInfoStmt) {
			return $groupInfoStmt->fetch(PDO::FETCH_ASSOC);
		} else {
			die("Error in getGroupInfo query in addUsers.php."); // TODO: Check if this is the best way to handle error.
		}	
	}

	function groupHasCurWeekHours($db, $groupInfo) {
		$today = date("Y-m-d");
		return strcmp($groupInfo['addHrsType'], "week") == 0 &&
			strcmp($today, $groupInfo['startDate']) > 0 &&
			strcmp($today, $groupInfo['endDate']) < 0;
	}

	function groupHasNextWeekHours($db, $groupInfo) {
		$today = new DateTime();
		echo "TODAY ". date_format($today, "Y-m-d");
		date_add($today, date_interval_create_from_date_string('7 days'));
		$nextWeek  = date_format($today, "Y-m-d");
		echo "NEXT ". $nextWeek;

		return strcmp($groupInfo['addHrsType'], "week") == 0 &&
			strcmp($nextWeek, $groupInfo['startDate']) > 0 &&
			strcmp($nextWeek, $groupInfo['endDate']) < 0;
	}

	//Get parameters from frontend
	$groupID = $_POST['groupID'];

	// reads in file and stores contents in $contents
	// each element is the userID of a user to be added to the group
	require '../uploadFile.php';

	// array of group info containing (addHrsType, hours, hasBookingDurationRestriction, startDate, endDate)
	$groupInfo = getGroupInfo($db, $groupID);

	$specialHrs = 0;
	if (strcmp($groupInfo['addHrsType'], "special") == 0) {
		$specialHrs =  $groupInfo['hours'];
	}


	//add users to group
	$insertString = "";
	$curWeekUpdateString = "";
	$nextWeekUpdateString = "";
	$restUpdateString = "";
	$unexpectedUserString = "";
	
	//Arrays to hold query values
	$insertArray = array();
	$curWeekUpdateArray = array();
	$nextWeekUpdateArray = array();
	$restUpdateArray = array();
	
	foreach ($contents as $user) {
		
		if (!userInGroup($db, $user, $groupID)) {
			// user is NOT already in group, continue with addition

			if (userInMasterList($db, $user)) {

				// add user to permissions table
				// specialHrs = 0 if the group has weekly hours
				$insertString .= "(?,?,?), ";
				array_push($insertArray, $user, $groupID, $specialHrs);

				if(groupHasCurWeekHours($db, $groupInfo)) {
					// if group has weekly hours that are currently active, 
					// they should be immediately given to the user
					$curWeekUpdateString .= "uID = ? OR ";
					array_push($curWeekUpdateArray, $user);
				}

				if(groupHasNextWeekHours($db, $groupInfo)) {
					// if group has hours that are active next week, 
					// they should be immediately given to the user
					$nextWeekUpdateString .= "uID = ? OR ";
					array_push($nextWeekUpdateArray, $user);
				}

				// deal with booking restriction
				if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
					echo "HAS BOOKING DURATION RESTRICTION = NO";
					$restUpdateString .= "uID = ? OR ";
					array_push($restUpdateArray, $user);
				}
				
				
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
	$curWeekUpdateString = chop($curWeekUpdateString, " OR ");
	$nextWeekUpdateString = chop($nextWeekUpdateString, " OR ");
	$restUpdateString = chop($restUpdateString, " OR ");

	//Insert Permissions
	$insertQuery = "INSERT INTO Permission (uID, groupID, specialHrs) VALUES $insertString";
	$insertStmt = $db->prepare($insertQuery);
	$insertStmt->execute($insertArray);

	if ($insertStmt) {
		// insert successful

		$weekHours = $groupInfo['hours'];
		//update user table with current active weekly hours
		if(groupHasCurWeekHours($db, $groupInfo)) {
			$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = curWeekHrs + $weekHours WHERE $curWeekUpdateString";
			$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
			$curWeekUpdateStmt->execute($curWeekUpdateArray);
		}

		//update user table with active weekly hours for next week
		if(groupHasNextWeekHours($db, $groupInfo)) {
			$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = nextWeekHrs + $weekHours WHERE $nextWeekUpdateString";
			$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
			$nextWeekUpdateStmt->execute($nextWeekUpdateArray);
		}

		if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
			echo $restUpdateString;
			print_r($restUpdateArray);
			$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'No' WHERE $restUpdateString";
			$restUpdateStmt = $db->prepare($restUpdateQuery);
			$restUpdateStmt->execute($restUpdateArray);
		}

	}

?>
