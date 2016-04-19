<?php
//written by Shannon Klett & Lexi Flynn
	include("../connection.php");
	require_once("deleteUserListFromGroup.php");

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$uID = $data->uID;
	$groupID = $data->groupID;

	try {
		//begin transaction
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$db->beginTransaction();

		deleteUserListFromGroup($db, $groupID, array($uID));

		$db->commit();

		//Close the connection
		$db = NULL;

	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  Could not delete user $uID from group $groupID"; 
	    }

	    //Close the connection
		$db = NULL;
	}
   
?>

