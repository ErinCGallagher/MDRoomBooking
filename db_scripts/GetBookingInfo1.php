<?php
		$data = json_decode(file_get_contents("php://input"));

		$BID = mysql_real_escape_string($data->BookingID);

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

   		$query3 = "SELECT * FROM Bookings WHERE BookingID = '$BID';";
        
		$bookingInfo = mysqli_query($cxn, $query3);
        $result = array();
		// convert to json
        

        while ($row = mysqli_fetch_assoc($bookingInfo)){
            $result[] = $row;
        }
		$json = json_encode( $result);
        
		// echo the json string
        echo $json;
            
		
?>
