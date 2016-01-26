<?php

	include('connection.php');
	
	$stmt = $db->query('SELECT groupID, groupName FROM UGroups');
	$result = array();

	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	  $result[] = $row;
	}

	//Convert to json
	$json = json_encode($result);
	// echo the json string
	echo $json;
 
?>

