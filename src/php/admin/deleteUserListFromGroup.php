<?php

	function deleteUserListFromGroup ($groupID, $userArray){
		if (sizeof($userArray) == 0) {
			return true;
		}

		include("../connection.php");
		require_once("groupFunctions.php");
		require_once("../util.php");

		//$deleteArray = array(); //just use userArray
		$deleteString = "";
		
		$restUpdateArray = array();
		$restUpdateString = "";

		try {
			//begin transaction
			$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$db->beginTransaction();

			//get group hours
			$groupInfo = getGroupInfo($db, $groupID);

			foreach ($userArray as $uID){
				// create delete string and array
				$deleteString .= "uID = ? OR ";

				maybeUpdateUserHours($db, $uID, $groupInfo);

				// create updateBookingRest string and array
				if(shouldUpdateBookingRest($db, $uID, $groupInfo)) {
					$restUpdateString .= "uID = ? OR ";
					array_push($restUpdateArray, $uID);
				}
			}

			//remove extra characters
			$deleteString = chop($deleteString, " OR ");
			$restUpdateString = chop($restUpdateString, " OR ");

			// execute delete
			$deleteQuery = "DELETE FROM Permission WHERE groupID= ? AND $deleteString";
			runQuery($db, $deleteQuery, $userArray);

			// execute updateBookingRest
			$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'Yes' WHERE $restUpdateString";
			runQuery($db, $restUpdateQuery, $restUpdateArray);

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
   }
?>
</body>

