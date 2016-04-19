<?php
	//written by Shannon Klett & Lexi Flynn
	function deleteUserListFromGroup ($db, $groupID, $userArray){
		if (sizeof($userArray) == 0) {
			return;
		}

		require_once("groupFunctions.php");
		require_once("../util.php");

		//$deleteArray = array(); //just use userArray
		$deleteString = "";
		
		$restUpdateArray = array();
		$restUpdateString = "";

		//get group hours
		$groupInfo = getGroupInfo($db, $groupID);

		foreach ($userArray as $uID){
			// create delete string and array
			$deleteString .= "uID = ? OR ";

			maybeUpdateUserHours($db, $uID, $groupInfo);

			// create updateBookingRest string and array
			if(shouldUpdateBookingRest($db, $uID, $groupInfo, false)) {
				$restUpdateString .= "uID = ? OR ";
				array_push($restUpdateArray, $uID);
			}
		}

		//remove extra characters
		$deleteString = chop($deleteString, " OR ");
		$restUpdateString = chop($restUpdateString, " OR ");

		// execute delete
		$deleteQuery = "DELETE FROM Permission WHERE groupID= ? AND $deleteString";
		$deleteArray = $userArray;
		array_unshift($deleteArray, $groupID);
		runQuery($db, $deleteQuery, $deleteArray);

		// execute updateBookingRest
		if (sizeof($restUpdateArray) > 0) {
			$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'Yes' WHERE $restUpdateString";
			runQuery($db, $restUpdateQuery, $restUpdateArray);
		}
   }
?>

