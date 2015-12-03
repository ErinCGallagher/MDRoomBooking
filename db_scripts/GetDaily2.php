<?php

		$data = json_decode(file_get_contents("php://input"));

		$room = mysql_real_escape_string($data->Room);
		$day = mysql_real_escape_string($data->Date);r

   $host = "localhost";
   $user = "root";
   $password = "";
   $database = "mdroombooking";

		
		// connect to the database
        $dbh = new PDO("mysql:host=$host; dbname=$database", $user, $password);

        // a query get all the records from the users table
        $sql = "Select BookingID, Reason, StartTime, EndTime, UID from Bookings WHERE Date = '$day' and Room = '$room';"

        // use prepared statements, even if not strictly required is good practice
        $stmt = $dbh->prepare( $sql );

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;
  		
  		
  		
  		
   		
   	
?>
