<?php

	require_once("deleteUserListFromGroup.php");

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$uID = $data->uID;
	$groupID = $data->groupID;

	deleteUserListFromGroup($groupID, array($uID));
   
?>

