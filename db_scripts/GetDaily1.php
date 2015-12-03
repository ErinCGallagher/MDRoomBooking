<?php
		
		//Database connection variables
   $host = "localhost";
   $user = "root";
   $password = "";
   $database = "mdroombooking";
		//Connent to database
		$cxn = mysqli_connect($host,$user,$password, $database);
		// Check connection
		if (mysqli_connect_errno()){
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  			die();
  		}
  		//Get post data stream 
		$data = json_decode(file_get_contents("php://input"));
		//Get parameters from 
		$room = mysqli_real_escape_string($cxn,$data->Room);
		$nonFormattedDay = mysqli_real_escape_string($cxn,$data->Date);
		//Format day
    		$day = strtotime($nonFormattedDay);
    		$day = date('Y-m-d', $day);

   		//get daily bookings from database
   		$query1 = "SELECT Bookings.BookingID, BookingSlots.BlockID, UID, BookingDate, BookingSlots.RoomID, StartTime, EndTime, Reason, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.BookingID = BookingSlots.BookingID AND BookingSlots.BlockID = Blocks.BlockID WHERE RoomID = '$room' AND BookingDate = '$day' GROUP BY BookingID ASC;";
      		$dailyBookings = mysqli_query($cxn, $query1);

   		
   		$result = array();
   		
   		//Set timezone
   		date_default_timezone_set('America/New_York');
   		
   		//Loop through each returned row 
   		while ($row = mysqli_fetch_assoc($dailyBookings)) {
   			
   			//Get number of blocks
   			$numBlocks = $row['numBlocks'];
   			
   			//Add thirty minutes to start time for each 
   			//block in booking if there is more than one
   			if ($numBlocks != 1) {
   			$startTime = $row['StartTime'];
   			$endTime =  strtotime($startTime);
   			
   				while ($numBlocks >= 1) {
   					$endTime = date("H:i:s", strtotime('+30 minutes', $endTime));
   					$endTime = strtotime($endTime);
   					$numBlocks = ($numBlocks - 1);
   				}
   			
   			//change the endtime to appropriate value
   			$row['EndTime'] = date("H:i:s", $endTime);
   			}
   		//Add row to result 
   		$result[] = $row;
   		}
   		//encode result to json format
   		$json = json_encode($result);
   		echo $json;
  		
  		//Close the database connection
   		mysqli_close($cxn);
?>
