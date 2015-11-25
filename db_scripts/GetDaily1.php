<?php


		$data = json_decode(file_get_contents("php://input"));

		$room = mysql_real_escape_string($data->Room);
		$nonFormattedDay = mysql_real_escape_string($data->Date);

		$host = "localhost";
		$user = "root";
		$password = "";
		$database = "mdroombooking";

    		$day = strtotime($nonFormattedDay);
    		$day = date('Y-m-d', $day);

		$cxn = mysqli_connect($host,$user,$password, $database);
		// Check connection
		if (mysqli_connect_errno()){
  			echo "Failed to connect to MySQL: " . mysqli_connect_error();
  			die();
  		}
   		
   		//get daily bookings
   		$query1 = "SELECT Bookings.BookingID, BookingSlots.BlockID, UID, BookingDate, BookingSlots.RoomID, StartTime, EndTime, Reason, COUNT(*) as numBlocks FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.BookingID = BookingSlots.BookingID AND BookingSlots.BlockID = Blocks.BlockID WHERE RoomID = '$room' AND BookingDate = '$day' GROUP BY BookingID ASC;";
      		$dailyBookings = mysqli_query($cxn, $query1);
   		date_default_timezone_set('America/New_York');
   		$result = array();
   		while ($row = mysqli_fetch_assoc($dailyBookings)) {
   			
   			//get number of blocks
   			$numBlocks = $row['numBlocks'];
   			
   			//add thirty minutes for each block
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
   			$result[] = $row;
   			}
   		}
   		
   		$json = json_encode($result);
   		echo $json;
  
   		mysqli_close($cxn);
?>
