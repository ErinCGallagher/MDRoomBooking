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
$firstDay = date("Y-m-d", strtotime('monday this week'));  

$lastDay = date("Y-m-d", strtotime('monday next week'));  


if($start >= $firstDay && $start < $lastDay) {
	$week = 'curWeekHrs';

} else {
    $week = 'nextWeekHrs';
} 

$result = array();

//get daily bookings from database
$sth = $db->prepare("SELECT $week FROM User where uID = ?;");
$sth->execute(array($user));

//Loop through each returned row 
while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
	$result = intval($row[$week]);
}




//Close the connection
$db = NULL;

//encode result to json format
$json = json_encode($result);
echo $json;
?>
