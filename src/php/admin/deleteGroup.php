<?php

	include("../connection.php");
	require_once("../util.php");
	require_once("groupFunctions.php");
	require_once("deleteUserListFromGroup.php"); 

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;

	if (1==$groupID) { //This is the EMS group, cannot be deleted
		http_response_code(409); //Conflict
		die("Cannot delete EMS group."); 
	}

	// update DB
	try {
		//begin transaction
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->beginTransaction();

		//delete all users from group
		$userArray = getAllUsersInGroup($db, $groupID);
		deleteUserListFromGroup($db, $groupID, $userArray);

		//remove group from Ugroups
		$deleteQuery = "DELETE FROM UGroups WHERE groupID = ?";
		$deleteStmt = runQuery($db, $deleteQuery, array($groupID));

		$db->commit();

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