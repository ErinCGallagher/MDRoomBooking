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

	// TODO: this function runs a query for each user. Perhaps update to execute with a list of users
	function shouldUpdateBookingRest($db, $uID, $groupInfo) {
		//if group is the only one that gives user no booking restriction
		// then they should now have a booking restriction
		if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
			//find all the groups that the user in that give them no booking duration restriction
			$restQuery = "SELECT UGroups.groupID FROM UGroups JOIN Permission ON Permission.groupID = ugroups.groupID 
				WHERE hasBookingDurationRestriction = 'No' AND uID = ?";
			$restStmt = $db->prepare($restQuery);
			$restStmt->execute(array($uID));

			// If rowcount is 0, user was removed from the only group that gave them this permission. Remove it.
			// Otherwise, they should still have this permission
			return ($restStmt->rowCount() == 0); 

		} else {
			return FALSE;
		}
	}

	// TODO: this function runs a query for each user. Perhaps update to execute with a list of users
	function maybeUpdateUserHours($db, $uID, $groupInfo) {
		if(groupHasCurWeekHours($groupInfo) || groupHasNextWeekHours($groupInfo) || groupHasThirdWeekHours($groupInfo)) {
			//get user's hours
			$hrsQuery = "SELECT curWeekHrs, nextWeekHrs, thirdWeekHrs FROM User WHERE uID = ?";
			$hrsStmt = $db->prepare($hrsQuery);
			$hrsStmt->execute(array($uID));
			$hrs = $hrsStmt->fetch(PDO::FETCH_ASSOC);

			// calculate new user hours. subtract group hours from the hours they have.
			// can't be less than 0.
			$newCurHrs = max($hrs['curWeekHrs']-$groupInfo['hours'], 0);
			$newNextHrs = max($hrs['nextWeekHrs']-$groupInfo['hours'], 0);
			$newThirdHrs = max($hrs['thirdWeekHrs']-$groupInfo['hours'], 0);

			//decrement user's hours
			if(groupHasCurWeekHours($groupInfo)) {
				$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = $newCurHrs WHERE uID= ?";
				$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
				$curWeekUpdateStmt->execute(array($uID));
			}

			if(groupHasNextWeekHours($groupInfo)) {
				$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = $newNextHrs WHERE uID= ?";
				$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
				$nextWeekUpdateStmt->execute(array($uID));
			}

			if(groupHasThirdWeekHours($groupInfo)) {
				$thirdWeekUpdateQuery = "UPDATE User SET thirdWeekHrs = $newThirdHrs WHERE uID= ?";
				$thirdWeekUpdateStmt = $db->prepare($thirdWeekUpdateQuery);
				$thirdWeekUpdateStmt->execute(array($uID));
			}

		}
	}

?>