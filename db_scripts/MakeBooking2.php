<?php


		$data = json_decode(file_get_contents("php://input"));

		$UID = mysql_real_escape_string($data->UID);
		$Room = mysql_real_escape_string($data->RoomID);
		$Reason = mysql_real_escape_string($data->Reason);
		$Desc = mysql_real_escape_string($data->OtherDesc);
		$year = mysql_real_escape_string($data->AcademicYr);
		$numP = mysql_real_escape_string($data->numParticipants);
		$day = mysql_real_escape_string($data->day);							

		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "mdroombooking";
		
		
		// connect to the database
        $dbh = new PDO("mysql:host=$host; dbname=$database", $user, $password);

        // a query get all the records from the users table
        $sql = "INSERT INTO Bookings VALUES ('$UID','$Room','$Reason','$Desc','$year','$numP','$day');"

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
