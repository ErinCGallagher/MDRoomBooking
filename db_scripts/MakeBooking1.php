<?php


		$data = json_decode(file_get_contents("php://input"));
		$UID = mysql_real_escape_string($data->UID);
		$Room = mysql_real_escape_string($data->RoomID);
		$Reason = mysql_real_escape_string($data->Reason);
		$Desc = mysql_real_escape_string($data->OtherDesc);
		$Date = mysql_real_escape_string($data->date);
		$year = "2015/2016";
		$numP = mysql_real_escape_string($data->numParticipants);
		$startTime = mysql_real_escape_string($data->start);
		$endTime = mysql_real_escape_string($data->end);
		
		//separate start and end to separate date and time variables
		/*$convertStart = strtotime($start);
		$convertEnd = strtotime($end);
		if ($convertStart !== false) {
			$startDate = date('Y-m-d', $convertStart);
			$startTime = date('h:i:s', $convertStart);
		}
		if ($convertEnd !== false){
			$endDate = date('Y-m-d', $convertEnd);
			$endTime = date('h:i:s', $convertEnd);
		}		*/

		$startDate = strtotime($Date);
		$startDate = date('Y-m-d', $startDate);

		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "mdroombooking";
		
		$blocks = [];
		
		$cxn = mysqli_connect($host,$user,$password, $database);
		if (mysqli_connect_errno()){
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  			die();
  		}
		
		$query = "SELECT blockID, endTime FROM blocks WHERE startTime = '$startTime'";
		echo $query;
		$rows = mysqli_query($cxn, $query);
		echo '$endTime =' . $endTime . '<br>';
		foreach ($rows as $row) {
			$block = $row['blockID'];
			$blocks[] = $block;
			$blockend = $row['endTime'];
		}
		
		
		while ($blockend != $endTime){
			$block = $block + 1;
			$blocks[] = $block;
			$query = "SELECT endTime FROM blocks WHERE blockID = $block";
			echo $query;
			$rows = mysqli_query($cxn, $query);
			foreach ($rows as $row) {
				$blockend = $row['endTime'];
			}
		}
		
		$cxn = mysqli_connect($host,$user,$password, $database);
		// Check connection
		if (mysqli_connect_errno()){
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  			die();
  		}
		
		//mysqli_begin_transaction($cxn, MYSQLI_TRANS_START_READ_WRITE);
		
   		//create a booking 
   		$query2 = "INSERT INTO Bookings (UID, Reason, OtherDesc, AcademicYr, NumParticipants) VALUES ('$UID','$Reason','$Desc','$year','$numP');";		
   		echo $query2;
   		$makeBooking = mysqli_query($cxn, $query2);
		$bookingID = mysqli_insert_id($cxn);


		
		//add to blocks to BookingSlots
		foreach ($blocks as $blockID){
			$query = "INSERT INTO BookingSlots VALUES ($bookingID, $blockID, '$startDate', '$Room')";
			echo $query;
			mysqli_query($cxn, $query);
		}
		
		//mysqli_commit($cxn);
		mysqli_close($cxn);

   		echo "Made Booking!";
   		

		
?>
