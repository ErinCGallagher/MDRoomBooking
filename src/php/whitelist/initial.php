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
$class = "admin"; //hard codded for lacal env
$user = "11ecg5"; //hard codded for local env
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

$db = NULL;
$data = array();
$data["allBuildings"] = $allBuildings;
$data["class"] = $class;
$data["netID"] = $user;

$json = json_encode($data);
echo $json;

?>