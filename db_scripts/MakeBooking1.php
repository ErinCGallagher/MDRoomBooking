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
		
		
		$cxn = mysqli_connect($host,$user,$password, $database);
		// Check connection
		if (mysqli_connect_errno()){
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  			die();
  		}
   		//create a booking 
   		$query2 = "INSERT INTO Bookings VALUES ('$UID','$Room','$Reason','$Desc','$year','$numP','$day');"		
   		$makeBooking = mysqli_query($cxn, $query2);

   		echo "Made Booking!"

		
?>
