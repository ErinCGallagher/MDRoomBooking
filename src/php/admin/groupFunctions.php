<?php

	// check if user is  already in group
	function userInGroup($db, $user, $groupID) {
		$checkGroupQuery = "SELECT uID FROM Permission WHERE uID = ? AND groupID = ?";
		$checkGroupStmt = $db->prepare($checkGroupQuery);
		$checkGroupStmt->execute(array($user, $groupID));
		
		return $checkGroupStmt->errorCode() == 0  
			&& $checkGroupStmt->rowCount() > 0;
	}

	// check that user is in master list
	function userInMasterList($db, $user) {
		$checkUserQuery = "SELECT uID FROM Master WHERE uID = ?";
		$checkUserStmt = $db->prepare($checkUserQuery);
		$checkUserStmt->execute(array($user));

		return $checkUserStmt->errorCode() == 0 
			&& $checkUserStmt->rowCount() > 0;
	}

	function getGroupInfo($db, $groupID) {
		$groupInfoQuery = "SELECT addHrsType, hours, hasBookingDurationRestriction, startDate, endDate FROM UGroups WHERE groupID = ?";
		$groupInfoStmt = $db->prepare($groupInfoQuery);
		$groupInfoStmt->execute(array($groupID));

		if ($groupInfoStmt->errorCode() == 0) { 
			return $groupInfoStmt->fetch(PDO::FETCH_ASSOC);
		} else {
			http_response_code(500);
			die( "Error in getGroupInfo query in addUsers.php."); // TODO: Check if this is the best way to handle error.
		}	
	}

	function groupHasCurWeekHours($groupInfo) {
		$today = date("Y-m-d");
		return strcmp($groupInfo['addHrsType'], "week") == 0 &&
			strcmp($today, $groupInfo['startDate']) > 0 &&
			strcmp($today, $groupInfo['endDate']) < 0;
	}

	function groupHasNextWeekHours($groupInfo) {
		$today = new DateTime();
		date_add($today, date_interval_create_from_date_string('7 days'));
		$nextWeek  = date_format($today, "Y-m-d");

		return strcmp($groupInfo['addHrsType'], "week") == 0 &&
			strcmp($nextWeek, $groupInfo['startDate']) > 0 &&
			strcmp($nextWeek, $groupInfo['endDate']) < 0;
	}

	function groupHasThirdWeekHours($groupInfo) {
		$today = new DateTime();
		date_add($today, date_interval_create_from_date_string('14 days'));
		$nextWeek  = date_format($today, "Y-m-d");

		return strcmp($groupInfo['addHrsType'], "week") == 0 &&
			strcmp($nextWeek, $groupInfo['startDate']) > 0 &&
			strcmp($nextWeek, $groupInfo['endDate']) < 0;
	}

	function getGroupWeeklyHours($groupInfo) {
		$weeklyHrs = 0;
		if (strcmp($groupInfo['addHrsType'], "week") == 0) {
			$specialHrs =  $groupInfo['hours'];
		}
		return $weeklyHrs;
	}

	function getGroupSpecialHours($groupInfo) {
		$specialHrs = 0;
		if (strcmp($groupInfo['addHrsType'], "special") == 0) {
			$specialHrs =  $groupInfo['hours'];
		}
		return $specialHrs;
	}

?>