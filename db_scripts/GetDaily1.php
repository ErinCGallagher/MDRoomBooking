<?php


		$data = json_decode(file_get_contents("php://input"));

		$room = mysql_real_escape_string($data->Room);
		$day = mysql_real_escape_string($data->Date);r

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
   		
   		//get daily bookings
   		$query1 = "Select BookingID, Reason, StartTime, EndTime, UID from Bookings WHERE Date = '$day' and Room = '$room';"
   		$dailyBookings = mysqli_query($cxn, $query1);
   		

?>
