<?php

	include("../connection.php");
	require_once("groupFunctions.php");

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$uID = $data->uID;
	$groupID = $data->groupID;


	// update DB
	try {
		//begin transaction
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->beginTransaction();

		//get group hours
		$groupInfo = getGroupInfo($db, $groupID);


		//remove permission
		$deleteQuery = "DELETE FROM Permission WHERE uID= ? AND groupID= ?";
		$deleteStmt = $db->prepare($deleteQuery);
		$deleteStmt->execute(array($uID, $groupID));

		if(groupHasCurWeekHours($groupInfo) || groupHasNextWeekHours($groupInfo)) {
			//get user's hours
			$hrsQuery = "SELECT curWeekHrs, nextWeekHrs FROM User WHERE uID = ?";
			$hrsStmt = $db->prepare($hrsQuery);
			$hrsStmt->execute(array($uID));
			$hrs = $hrsStmt->fetch(PDO::FETCH_ASSOC);

			// calculate new user hours. subtract group hours from the hours they have.
			// can't be less than 0.
			$newCurHrs = max($hrs['curWeekHrs']-$groupInfo['hours'], 0);
			$newNextHrs = max($hrs['nextWeekHrs']-$groupInfo['hours'], 0);

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

		}

		// //has booking restriction
		// if(strcmp($groupInfo['hasBookingDurationRestriction'], 'No') == 0) {
		// 	$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'No' WHERE $restUpdateString";
		// 	$restUpdateStmt = $db->prepare($restUpdateQuery);
		// 	$restUpdateStmt->execute($usersAddedArray);
		// }

		$db->commit();

		// don't need to encode value
		echo true;
	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  " . $e; 
	    }
	}
   
?>
</body>

