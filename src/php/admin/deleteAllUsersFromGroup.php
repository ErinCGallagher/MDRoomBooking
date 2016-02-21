<?php

	include("../connection.php");
	require_once("../util.php");
	require_once("groupFunctions.php");
	require_once("deleteUserListFromGroup.php");

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupID;

	// update DB
	try {
		//begin transaction
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->beginTransaction();

		//get all users in group
		$selectQuery = "SELECT uID FROM Permission WHERE groupID = ?";
		$selectStmt = runQuery($db, $selectQuery, array($groupID));

		$db->commit();

	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  " . $e; 
	    }
	}

	deleteUserListFromGroup($groupID, $selectStmt->fetchAll(PDO::FETCH_COLUMN,0));
   
?>

