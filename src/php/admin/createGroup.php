<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');


	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName;
	$hours = $data->hours;
	// $hoursPerSemester = $data->hoursPerSemester
	// $fall = $data->fall;
	// $winter = $data->winter;
	//$summer = $data->summer);


	$query = "INSERT INTO UGroups(groupName, hours) VALUES ('$groupName' , '$hours')";
	$stmt = $db->query($query);

	$groupID = $db->lastInsertId();

	// don't need to encode value
	echo $groupID
   
?>
