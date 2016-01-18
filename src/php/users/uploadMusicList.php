<?php

	//include uploadFile.php ...

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	$query = "";
	$stmt = $db->query($query);

	// return if insert was successful or not
	echo $stmt
	
?>

