<?php
	
	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');
	
	/*
	//development environment
	$host = "10.20.49.11:3306";
	$user = "DMRoomBooking";
	$password = "UYXE9F5o4f4V";
	$database = "DMRoomBooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  $user, $password);
	*/
/*
	//production environment
	$host = "10.28.49.11:3306";
	$user = "DMRoomBooking";
	$password = "72iCjkExCXoj";
	$database = "DMRoomBooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  $user, $password);
*/	

?>
