<?php

	include('../connection.php');
	require_once('../util.php');
	
	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$department = $data->department; 
	
	//Get info from database
   	$getUsersQuery = "SELECT user.uID, firstName, lastName, class FROM user JOIN master ON user.UID = master.uID WHERE department = ? ORDER BY class DESC, lastName";
   	$getUsersStmt = runQuery($db, $getUsersQuery, array($department));

	$fileText = "";

	while ($row = $getUsersStmt->fetch(PDO::FETCH_ASSOC)) {
		$fileText.= implode(",", $row)."\n";
	}
	
	$myfile = fopen('../../../user_list_'.$department.'.csv', "w");
	fwrite($myfile, $fileText);
	fclose($myfile); 

?>
