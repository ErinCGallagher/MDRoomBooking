<?php
		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "mdroombooking";

		$data = json_decode(file_get_contents("php://input"));

		$UID = mysql_real_escape_string($data->UID);
		$Room = mysql_real_escape_string($data->RoomID);
		$Reason = mysql_real_escape_string($data->Reason);
		$Desc = mysql_real_escape_string($data->OtherDesc);
		$year = mysql_real_escape_string($data->AcademicYr);
		$numP = mysql_real_escape_string($data->numParticipants);
		$day = mysql_real_escape_string($data->day);
		$start = mysql_real_escape_string($data->start);
		$end = mysql_real_escape_string($data->end);
		
		//separate start and end to separate date and time variables
		$convertStart = strtotime($start);
		$convertEnd = strtotime($start);
		if ($convertStart !== false) {
			$startDate = date('Y-m-d', $convertStart);
			$startTime = date('h:i:s', $convertStart);
		}
		if ($convertEnd !== false){
			$endDate = date('Y-m-d', $convertEnd);
			$endTime = date('h:i:s', $convertEnd);
		}
		
		// connect to the database
        $dbh = new PDO("mysql:host=$host; dbname=$database", $user, $password);

        // a query find startblock
        $sql = "SELECT BlockID FROM Blocks WHERE StartTime ='$startTime'";
		
        // use prepared statements, even if not strictly required is good practice
        $stmt = $dbh->prepare( $sql );

        // execute the query
        $stmt->execute();
		
		// fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );
		
		foreach ($result as $row) {
			
		}
		
		
		// connect to the database
        $dbh = new PDO("mysql:host=$host; dbname=$database", $user, $password);

        // a query get all the records from the users table
        $sql = "INSERT INTO Bookings VALUES ('$UID','$Room','$Reason','$Desc','$year','$numP','$day');"

        // use prepared statements, even if not strictly required is good practice
        $stmt = $dbh->prepare( $sql );

        // execute the query
        $stmt->execute();

		//get BookingID
		$bookingID = $dbh ->lastInsertId();
		
		//--------
		//INSERT INTO BOOKINGSLOTS LOOP
		//--------
		
        // fetch the results into an array
        $result = $stmt->fetchAll( PDO::FETCH_ASSOC );
		
		$dbh = NULL;

        // convert to json
        $json = json_encode( $result );

        // echo the json string
        echo $json;

		
?>
