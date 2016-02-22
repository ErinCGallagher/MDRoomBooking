<?php
session_start();

include('../connection.php');

//Get all buildings
$allBuildings = array();

$sth = $db->prepare("SELECT * FROM Building");
$sth->execute();
//Put result in an array 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	$building = $row['buildingID'];
	$allBuildings[$building] = array();
	$allBuildings[$building]['openTime'] = $row['openTime'];
	$allBuildings[$building]['closeTime'] = $row['closeTime'];
	
	//get all rooms for building
	$allBuildings[$building]['rooms'] = array();
	$sth2 = $db->prepare("SELECT roomID FROM Rooms WHERE building = ?");
	$sth2->execute(array($building));
	while($room = $sth2->fetch(PDO::FETCH_ASSOC)) {
		$allBuildings[$building]['rooms'][] = $room['roomID'];
	}	
}

$_SESSION["buildings"] = $allBuildings;

//Check if user can book
//$user = $_SERVER["HTTP_QUEENSU_NETID"];
$user = "11ecg5";
$canBook = False;
$sth = $db->prepare("SELECT * FROM Master WHERE uID = ?");
$sth->execute(array($user));
//Loop through each returned row 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	$canBook = True;
}
if ($canBook) {
	$sth = $db-> prepare("SELECT class FROM User WHERE uID = ?");
	$sth->execute(array($user));
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$class = $row['class'];
	}
} else {
	//class is NonBooking
	$class = "NonBooking";
	//unless it is in admin.txt then class is Admin
	$file = fopen("admin.txt", "r") or die("Unable to open file!");
	// Output one line until end-of-file
	while(!feof($file)) {
		$check = fgets($file);
		$check = trim($check);
		if ($check == $user) {
			$class = "Admin";
		}
	}
	fclose($file);
}

$db = NULL;
$data = array();
$data["allBuildings"] = $allBuildings;
$_SESSION["class"] = $class;
$_SESSION["netID"] = $user;
$data["class"] = $class;
$data["netID"] = $user;

$json = json_encode($data);
echo $json;

?>