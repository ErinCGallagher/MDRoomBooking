<?php
//written by Erin Gallagher	
//Database connection variables
include('../connection.php');	
session_start();

date_default_timezone_set('UTC');

//Get post data stream 
$data = json_decode(file_get_contents("php://input"));
//Get parameters from 
$date = $data->date;
$uID = $_SESSION["netID"];

$start = strtotime($date);
$startDate = date('Y-m-d', $start);

//Format day
date_default_timezone_set('America/Toronto');
	
//determine current date so you only retrieve bookings after it

$currentDate = date('Y-m-d');
//if the current day is a sunday
if(date('N',strtotime($currentDate)) == 7){
	//for some reason if it's sunday it detects tomorrow as the first monday
	//determine current date so you can determine where to return hours
	$firstDay = date("Y-m-d", strtotime('monday last week'));  
	$firstDayNextWeek = date("Y-m-d", strtotime('monday this week'));
	$firstDayWeek3 = date("Y-m-d", strtotime('monday next week'));
}
else{
	//determine current date so you can determine where to return hours
	$firstDay = date("Y-m-d", strtotime('monday this week'));  
	$firstDayNextWeek = date("Y-m-d", strtotime('monday next week'));
	$firstDayWeek3 = date("Y-m-d", strtotime('monday next week next week'));  
} 

//if booking made in the current week
if($startDate >= $firstDay && $startDate < $firstDayNextWeek) {
	$week = 'curWeekHrs';

} else if($startDate < $firstDayWeek3)  {
    $week = 'nextWeekHrs';
} 
else{
	$week ='thirdWeekHrs';
}

$result = array();

//get daily bookings from database
$sth = $db->prepare("SELECT $week FROM User where uID = ?;");
$sth->execute(array($uID));

//Loop through each returned row 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	$result = floatval($row[$week]);
}
$result += SufficientSpecialHours($db, $uID, $startDate);




//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;

	//determine if there are sufficient special hours for the user to make the booking
	//return true if they have sufficient time, otherwise return false
	function SufficientSpecialHours($db, $uID, $startDate){
		$usableSpecialHours = 0;
		$sth = $db->prepare("SELECT SUM(Permission.specialHrs) totalHrs FROM Permission JOIN UGroups on UGroups.groupID = Permission.groupID WHERE uID = ? and ? BETWEEN UGroups.startDate and UGroups.endDate");
		$sth->execute(array($uID, $startDate));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$usableSpecialHours = $row['totalHrs'];
		}
		
		return floatval($usableSpecialHours);
	}
?>
