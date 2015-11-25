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
   		$query1 = "SELECT Bookings.BookingID, BookingSlots.BlockID, UID, BookingDate, BookingSlots.RoomID, StartTime, EndTime, Reason FROM Bookings JOIN BookingSlots JOIN Blocks ON Bookings.BookingID = BookingSlots.BookingID AND BookingSlots.BlockID = Blocks.BlockID WHERE BookingDate = '$day' AND RoomID = '$room' ORDER BY BookingID, StartTime ASC;";
      $dailyBookings = mysqli_query($cxn, $query1);
   		
   		$result = array();
   		while ($row = mysqli_fetch_assoc($dailyBookings)) {
   			$result[] = $row;
   		}
   		
   		$json = json_encode($result);
   		echo $json;
  
   		mysqli_close($cxn);

  

?>
