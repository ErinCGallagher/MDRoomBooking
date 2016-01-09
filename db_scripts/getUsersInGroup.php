
<?php

 $host = "localhost";
 $user = "root";
 $password = "";
 $database = "mdroombooking";
 
 $db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');

 //Get post data stream 
 $data = json_decode(file_get_contents("php://input"));
 //Get parameters from 
 $groupID = $data->groupId);

 $stmt = $db->query('SELECT User.UID, FirstName, LastName FROM Permission JOIN User ON Permission.UID = User.UID WHERE GroupID =' . $groupID); 
 

 $result = array();
 
 while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $result[] = $row;
 }

 //Convert to json
 $json = json_encode($result);
 // echo the json string
 echo $json;
   
   
?>
