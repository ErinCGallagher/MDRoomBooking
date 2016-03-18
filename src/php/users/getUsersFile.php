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

   	print_r($getUsersStmt->fetchAll(PDO::FETCH_ASSOC));
	
	//Clear File
	// $myfile = fopen("../KeyList.txt", "w");
	// $txt = "Key List For " . $date . "\n";
	// fwrite($myfile, $txt);
	// fclose($myfile);
	
	//Check if result is empty, meaning no keys needed that day
	// if ($rows != NULL) {
	
		
		
	// 	echo "sucess";
	// }
	// else {
	// 	echo "No data";
	// }  

?>
