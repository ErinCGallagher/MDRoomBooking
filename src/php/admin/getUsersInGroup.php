<?php

	include('connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupID = $data->groupId;
	
	//Get users from the database
	$sth = $db->prepare('SELECT User.uID, firstName, lastName FROM Permission JOIN User ON Permission.uID = User.uID WHERE GroupID = ?');
	$sth->execute(array($groupID));
	$rows = $sth->fetchAll();
	
	//To be removed
	//$stmt = $db->query('SELECT User.uID, firstName, lastName FROM Permission JOIN User ON Permission.uID = User.uID WHERE GroupID =' . $groupID); 
	//while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	  //$result[] = $row;
	//}
	
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