<?php
//written by Erin Gallagher & Laura Brooks
session_start();

include('../connection.php');
include('checkBooking.php');


//Check if user can book
//$user = $_SERVER["HTTP_QUEENSU_NETID"];


//for testin1ecg5urposes only, use above otherwise
$user = "11ecg5"; //check rb_sample.php for users to input here for testing


$firstName = " ";
$lastName = " ";

$canBook = False; //nonbooking users are the only users who can't book rooms
$department = 'Music'; //default department is Music
$sth = $db->prepare("SELECT department FROM Master WHERE uID = ?");
$sth->execute(array($user));
$departmentStr = "";
//Loop through each returned row 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	//if a user is found in the database then they can book a room
	$canBook = True;
	//determine user department (music or drama)
	$departmentStr .= " ". $row["department"];
}
$department = $departmentStr;


if ($canBook) {
	$sth = $db-> prepare("SELECT class, firstName, lastName FROM User WHERE uID = ?");
	$sth->execute(array($user));
	$class="NonBooking";
	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$class = $row['class'];
		$firstName = $row['firstName'];
		$lastName = $row['lastName'];
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

//determine if the user is not admin and remove course as a reason option
if($class != 'Admin'){
	if(($key = array_search('Course',$reasonsList) ) != false){
		unset($reasonsList[$key]);
	}

}
//confirm if student user that they have permission to view the Sonic Music Studio
$studentWithSonicPermission = false;
if($class == "Student"){
	$sth = $db->prepare("SELECT * FROM Permission WHERE uID=$user and groupID=1");
	$sth->execute();

	while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
		$studentWithSonicPermission = true;
	}
}

//Get all buildings, rooms & building hours
$allBuildings = array();

if(($class=='Student' && !$studentWithSonicPermission) || $class == "NonBooking"){
	$sth = $db->prepare("SELECT * FROM Building WHERE buildingID <> 'Sonic Arts Studio';");
	$sth->execute();
}
else{
	$sth = $db->prepare("SELECT * FROM Building;");
	$sth->execute();
}


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

$db = NULL;
$data = array();
$data["allBuildings"] = $allBuildings;
$_SESSION["class"] = $class;
$_SESSION["netID"] = $user;
$data["name"] = $firstName." ".$lastName;
$data["class"] = $class;
$data["netID"] = $user;
$data["department"] = $department;
$data["reasonList"] = $reasonsList;
$data["numPeopleList"] = $numPeople;

$json = json_encode($data);
echo $json;

?>