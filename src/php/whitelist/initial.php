<?php
session_start();

include('../connection.php');

//Get all buildings
$sth = $db->prepare("SELECT * FROM Building");
$sth->execute();
$rows = $sth->fetchAll();

$allBuildings = array();

//Put result in an array 
foreach($rows as $row){ 
	$building = $row['buildingID'];
	$allBuildings[$building] = array();
	$allBuildings[$building]['openTime'] = $row['openTime'];
	$allBuildings[$building]['closeTime'] = $row['closeTime'];
	
	//get all rooms for building
	$allBuildings[$building]['rooms'] = array();
	$sth = $db->prepare("SELECT roomID FROM Rooms WHERE building = ?");
	$sth->execute(array($building));
	$rooms = $sth->fetchAll();
	foreach($rooms as $room){ 
		$allBuildings[$building]['rooms'][] = $room['roomID'];
	}	
}

$_SESSION["buildings"] = $allBuildings;
/*
//Check if user can book
$user = $_SERVER["HTTP_QUEENSU_NETID"];
$canBook = False;
$sth = $db->prepare("SELECT * FROM Master WHERE uID = ?");
$sth->execute(array($user));
$rows = $sth->fetchAll();
foreach ($rows as $row){
	$canBook = True;
}
if ($canBook) {
	$sth = $db-> prepare("SELECT * FROM User WHERE uID = ?");
	$sth->execute(array($user));
	$rows = $sth->fetchAll();
	foreach($rows as $row){
		$class = $row['class'];
	}
} else {
	$class = "none";
}
*/
$_SESSION["canBook"] = $canBook;

$db = NULL;

$json = json_encode($allBuildings, $canBook, $class);
echo $json;

?>