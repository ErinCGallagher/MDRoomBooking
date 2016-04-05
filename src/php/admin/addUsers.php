<?php

	require_once("../connection.php");
	require_once("groupFunctions.php");
	require_once("../uploadFile.php");
	require_once("../util.php");

	//Get parameters from frontend
	$groupID = $_POST['groupID'];

	// reads in file and returns an array of contents, one for each non-empty line
	// each element should be the userID of a user to be added to the group
	$fileLines = processFile();

	// array of group info containing (addHrsType, hours, hasBookingDurationRestriction, startDate, endDate)
	$groupInfo = getGroupInfo($db, $groupID);

	$specialHrs = 0;
	if (strcmp($groupInfo['addHrsType'], "special") == 0) {
		$specialHrs =  $groupInfo['hours'];
	}

	$insertString = "";
	$curWeekUpdateString = "";
	$nextWeekUpdateString = "";
	$restUpdateString = "";
	
	//Array to hold users being added (error-free)
	$usersAddedArray = array();

	//Array holding users + info to be added to permission table
	$insertArray = array();

	//Arrays to hold error users
	$alreadyInGroupArray = array();
	$notInMasterArray = array();
	$badEmailUsers = array();
	
	foreach ($fileLines as $user) {
		$netid = getNetId($user);
		if ($netid) { //$netid != false
		
			if (!userInGroup($db, $netid, $groupID)) {
				// user is NOT already in group, continue with addition

				if (userInMasterList($db, $netid)) {

					array_push($usersAddedArray, $netid);

					// add user to permissions table
					// specialHrs = 0 if the group has weekly hours
					$insertString .= "(?,?,?), ";
					array_push($insertArray, $netid, $groupID, $specialHrs);

					if(groupHasCurWeekHours($groupInfo)) {
						// if group has weekly hours that are currently active, 
						// they should be immediately given to the user
						$curWeekUpdateString .= "uID = ? OR ";
					}

					if(groupHasNextWeekHours($groupInfo)) {
						// if group has hours that are active next week, 
						// they should be immediately given to the user
						$nextWeekUpdateString .= "uID = ? OR ";
					}

					// deal with booking restriction
					if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
						$restUpdateString .= "uID = ? OR ";
					}
					
					
				} else {
					// user not in master list
					array_push($notInMasterArray, $netid);
				}

			} else {
				// user is in group, don't re-add
				array_push($alreadyInGroupArray, $netid);
			}

		} else {
			//invalid email
			array_push($badEmailUsers,$user);
		}
	}

	//remove extra characters
	$insertString = chop($insertString, ", ");
	$curWeekUpdateString = chop($curWeekUpdateString, " OR ");
	$nextWeekUpdateString = chop($nextWeekUpdateString, " OR ");
	$restUpdateString = chop($restUpdateString, " OR ");

	// update DB
	try {
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$db->beginTransaction();

		//Insert Permissions
		if (sizeof($insertArray) > 0) {
			$insertQuery = "INSERT INTO Permission (uID, groupID, specialHrs) VALUES $insertString";
			$insertStmt = $db->prepare($insertQuery);
			$insertStmt->execute($insertArray);
		}

		if (sizeof($usersAddedArray) > 0) {
			$weekHours = $groupInfo['hours'];
			//update user table with current active weekly hours
			if(groupHasCurWeekHours($groupInfo)) {
				$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = curWeekHrs + $weekHours WHERE $curWeekUpdateString";
				$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
				$curWeekUpdateStmt->execute($usersAddedArray);
			}

			//update user table with active weekly hours for next week
			if(groupHasNextWeekHours($groupInfo)) {
				$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = nextWeekHrs + $weekHours WHERE $nextWeekUpdateString";
				$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
				$nextWeekUpdateStmt->execute($usersAddedArray);
			}

			//update user table with active weekly hours for next week
			if(groupHasThirdWeekHours($groupInfo)) {
				$thirdWeekUpdateQuery = "UPDATE User SET thirdWeekHrs = thirdWeekHrs + $weekHours WHERE $nextWeekUpdateString";
				$thirdWeekUpdateStmt = $db->prepare($thirdWeekUpdateQuery);
				$thirdWeekUpdateStmt->execute($usersAddedArray);
			}

			if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
				$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'No' WHERE $restUpdateString";
				$restUpdateStmt = $db->prepare($restUpdateQuery);
				$restUpdateStmt->execute($usersAddedArray);
			}
		}

		$db->commit();

		$result = array();
		$result["addedUsers"] = $usersAddedArray; 
		$result["usersAlreadyInGroup"] = $alreadyInGroupArray;
		$result["usersNotInMaster"] = $notInMasterArray; 
		$result["badEmailUsers"] = $badEmailUsers;
		
		//Convert to json
		$json = json_encode($result);
		// echo the json string
		echo $json;
		//Close the connection
		$db = NULL;
	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  " . $e; 
	    }
	    //Close the connection
		$db = NULL;
	}

	

?>
