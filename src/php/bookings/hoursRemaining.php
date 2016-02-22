<?php
		
//Database connection variables
include('../connection.php');	
session_start();

date_default_timezone_set('UTC');

//Get post data stream 
$data = json_decode(file_get_contents("php://input"));
//Get parameters from 
$date = $data->date;
$user = $_SESSION["netID"];

$start = strtotime($date);
$start = date('Y-m-d', $start);

//Format day
date_default_timezone_set('America/Toronto');
	
//determine current date so you only retrieve bookings after it

//if today is Sunday, then must use Monday last week to retrieve hours for the current week
//TODO

$firstDay = date("Y-m-d", strtotime('monday this week'));  
$firstDayNextWeek = date("Y-m-d", strtotime('monday next week'));
$firstDayWeek3 = date("Y-m-d", strtotime('monday next week next week'));  

//if booking made in the current week
if($start >= $firstDay && $start < $firstDayNextWeek) {
	$week = 'curWeekHrs';

} else if($start < $firstDayWeek3)  {
    $week = 'nextWeekHrs';
} 
else{
	$week ='thirdWeekHrs';
}

$result = array();

//get daily bookings from database
$sth = $db->prepare("SELECT $week FROM User where uID = ?;");
$sth->execute(array($user));

//Loop through each returned row 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	$result = floatval($row[$week]);
}




//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;
?>
