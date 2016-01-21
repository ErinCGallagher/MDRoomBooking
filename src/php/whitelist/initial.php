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

$db = NULL;

$_SESSION["buildings"] = $allBuildings;

/*foreach($allBuildings as $building => $info){
	echo "Building: " . $building . " Open: " . $info['openTime'] . " Close: " . $info['closeTime'] . "<br>";
	echo "Rooms: ";
	foreach ($info['rooms'] as $room){
		echo $room . "<br>";
	}
}*/


?>