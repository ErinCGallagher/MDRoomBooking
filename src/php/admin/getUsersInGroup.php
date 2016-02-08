<?php

	include('connection.php');
	
		//Get post data stream 
		$data = json_decode(file_get_contents("php://input"));
		//Get parameters from 
		$groupID = $data->groupID;
		
		//Get users from the database
		$sth = $db->prepare('SELECT User.uID, firstName, lastName FROM Permission JOIN User ON Permission.uID = User.uID WHERE GroupID = ?');
		$sth->execute(array($groupID));
		$rows = $sth->fetchAll();
	
		$result = array();

		//Put result in an array 
		foreach($rows as $row) {
			$result[] = $row;
		}
	
		//Close the connection
		$db = NULL;

		//Convert to json
		$json = json_encode($result);
		// echo the json string
		echo $json;
   
?>

