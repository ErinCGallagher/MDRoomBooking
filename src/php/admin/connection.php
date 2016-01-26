<?php

	$host = "localhost";
	$user = "root";
	$password = "newpass";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

?>