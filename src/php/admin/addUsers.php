<?php

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	// reads in file and stores contents in $contents
	require '../uploadFile.php';

	$groupID = 1;
	$year = 2016;
	
	//add users to group
	$valueString = "";

	foreach ($contents as $line) {
		//want format ('uID', 'groupID', 'year'),
		echo("LINE\n".$line);
		$valueString .= "('" . $line . "', '" . $groupID . "', '" . $year . "'),\n";
	}

	echo $valueString;

	$query = "INSERT INTO Permission (uID, groupID, academicYr) VALUES $valueString";
	$stmt = $db->query($query);

	// return if insert was successful or not
	echo $stmt

?>
