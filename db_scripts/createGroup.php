
<?php

 $host = "localhost";
 $user = "root";
 $password = "KitKat94";
 $database = "mdroombooking";
 
 $db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', 'KitKat94');
 
 
 //Get post data stream 
 $data = json_decode(file_get_contents("php://input"));
 //Get parameters from 
 $groupName = $data->groupName;
 $hoursPerWeek = $data->hours;
 // $hoursPerSemester = $data->hoursPerSemester
 // $fall = $data->fall;
 // $winter = $data->winter;
 //$summer = $data->summer);
 
 
 $query = "INSERT INTO UGroups(GroupName, HrsPerWeek) VALUES ('$groupName' , '$hoursPerWeek')";
 $stmt = $db->query($query);

 //Convert to json
 $json = json_encode($result);
 // echo the json string
 echo $json;
   
   
?>
