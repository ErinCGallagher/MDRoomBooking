<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	// reads in file and stores contents in $contents
	require '../uploadFile.php';

	// NEED TO GET THESE VALUES from frontend
	$groupID = 2; 
	$year = 2016;
	
	//add users to group
	$valueString = "";

	foreach ($contents as $user) {
		//want format ('uID', 'groupID', 'year'),
		
		// need to check that user doesn't already have permission!!!!
		$valueString .= "('" . $user . "', '" . $groupID . "', '" . $year . "'),\n";
	}

	$valueString = chop($valueString, ",\n"); //remove extra characters
	echo $valueString;

	// Update the permissions of each member of the group
 	// foreach($contents as $user) {
		// $query = "INSERT INTO Permission (uID, groupId, acdemicYr) VALUES ('$user', '$groupID', '$year')";
		// $stmt = $db->query($query);
		// //Give
		// //user is not in user table??
		// $query = "UPDATE User SET addHrs = addHrs + '$hours' WHERE uID = '$user'";
		// $stmt = $db->query($query);
  // 	}


	$query = "INSERT INTO Permission (uID, groupID, academicYr) VALUES $valueString";
	$stmt = $db->query($query);

	// return if insert was successful or not
	//echo ("RESULT ".$stmt);

?>
