<?php
	//Set database connection variables
	$host = "localhost";
 	$user = "root";
 	$password = "";
 	$database = "mdroombooking";
	//Connect to database
	$cxn = mysqli_connect($host,$user,$password, $database);
	//Check connection
	if (mysqli_connect_errno()){
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  		die();
  	}
	
	//Get POST datastream from front-end
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from datastream 
	$BID = mysqli_real_escape_string($cxn, $data->BookingID);

	//Get booking info from database
   	$query3 = "SELECT * FROM Bookings WHERE BookingID = '$BID';";
	$bookingInfo = mysqli_query($cxn, $query3);
        $result = array();
        
        //Put result in an array 
        while ($row = mysqli_fetch_assoc($bookingInfo)){
            $result[] = $row;
        }
	
	//Convert to json
	$json = json_encode( $result);
       	// echo the json string
        echo $json;
	
	//Close the connection
	mysqli_close($cxn);
?>
