<?php

	//include uploadFile.php ...

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

	$query = "INSERT INTO User (uID, firstName, lastName, class, defaultHrs, addHrs, usedHrs, academicYr) VALUES
				('12af', 'Lexi', 'Flynn', 'DStudent', '5', '0', '0', '2016'),
				('13eg', 'Erin', 'Gallagher', 'DStudent', '5', '0', '0', '2016'),
				('14sk', 'Shannon', 'Klett', 'MStudent', '0', '0' , '0', '2016'),
				('15lb', 'Laura', 'Brooks', 'MStudent', '0', '0', '0', '2016')
				";
	$stmt = $db->query($query);

	// return if insert was successful or not
	echo $stmt
	
?>

