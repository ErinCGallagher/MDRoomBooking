<html>
<head><title>Load Room Booking Database</title></head>
<body>

<?php

 $host = "localhost";
 $user = "root";
 $password = "KitKat94";
 $database = "mdroombooking";
 
 $db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', 'KitKat94');
 $stmt = $db->query('SELECT GroupID, GroupName FROM UGroups');
 $result = array();
 
 while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $result[] = $row;
 }

 //Convert to json
 $json = json_encode($result);
 // echo the json string
 echo $json;
   
   
?>
</body></html>
