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

		maybeUpdateUserHours($db, $uID, $groupInfo);

		//if group is the only one that gives user no booking restriction
		// then they should now have a booking restriction
		if(shouldUpdateBookingRest($db, $uID, $groupInfo)) {
			$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'Yes' WHERE uID= ?";
			$restUpdateStmt = $db->prepare($restUpdateQuery);
			$restUpdateStmt->execute(array($uID));
		}

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

