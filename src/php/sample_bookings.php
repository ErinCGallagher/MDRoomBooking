<html>
<head><title>Load Sample Bookings</title></head>
<body>

<?php
/* Program: rb_sample.php
 * Desc:    Loads the roombooking database tables with 
 *          sample data.
 */
	
 	// //Database connection variables 
 	$host = "localhost";
 	$user = "root";
 	$password = "";
 	$database = "mdroombooking";
	
 	
	//development environment
	// $host = "10.20.49.11:3306";
	// $user = "DMRoomBooking";
	// $password = "UYXE9F5o4f4V";
	// $database = "DMRoomBooking";
 	
 	//Connect to database
	$cxn = mysqli_connect($host,$user,$password, $database);
 	
 	// Check connection
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
		die();
	}

	mysqli_query($cxn,"DELETE FROM BookingSlots;");
	mysqli_query($cxn,"DELETE FROM Bookings;");

	$startDay = new DateTime();
	$curYear = date_format($startDay, "Y");
	$lastYear = $curYear - 1;
	$nextYear = $curYear + 1;

	mysqli_query($cxn,"INSERT INTO Bookings (bookingID, uID, reason, otherDesc, numParticipants) VALUES
				(1, 'facID', 'Individual Rehearsal', '', '1'),
				(2, 'adID', 'Individual Rehearsal', '', '1'),
				(3, 'studID', 'Individual Rehearsal', '', '1'),
				(4, 'adID', 'Individual Rehearsal', '', '1'),
				(5, 'facID', 'Individual Rehearsal', '', '1'),
				(6, 'studID', 'Individual Rehearsal', '', '1'),
				(7, 'studID', 'Individual Rehearsal', '', '1'),
				(8, 'adID', 'Individual Rehearsal', '', '1'),
				(9, 'facID', 'Individual Rehearsal', '', '1'),

				(10, 'facID', 'Individual Rehearsal', '', '1'),
				(11, 'adID', 'Individual Rehearsal', '', '1'),
				(12, 'studID', 'Individual Rehearsal', '', '1'),
				(13, 'adID', 'Individual Rehearsal', '', '1'),
				(14, 'facID', 'Individual Rehearsal', '', '1'),
				(15, 'studID', 'Individual Rehearsal', '', '1'),
				(16, 'studID', 'Individual Rehearsal', '', '1'),
				(17, 'adID', 'Individual Rehearsal', '', '1'),
				(18, 'facID', 'Individual Rehearsal', '', '1'),

				(19, 'facID', 'Individual Rehearsal', '', '1'),
				(20, 'adID', 'Individual Rehearsal', '', '1'),
				(21, 'studID', 'Individual Rehearsal', '', '1'),
				(22, 'adID', 'Individual Rehearsal', '', '1'),
				(23, 'facID', 'Individual Rehearsal', '', '1'),
				(24, 'studID', 'Individual Rehearsal', '', '1'),
				(25, 'studID', 'Individual Rehearsal', '', '1'),
				(26, 'adID', 'Individual Rehearsal', '', '1'),
				(27, 'facID', 'Individual Rehearsal', '', '1');");
				
	mysqli_query($cxn,"INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource) VALUES
				(1, 2, '$lastYear-01-01', 'Chown 5', 'Faculty'),
				(2, 8, '$lastYear-04-12', 'HLH 213', 'Admin'),
				(3, 26, '$lastYear-04-30', 'HLH 213', 'Weekly'),
				(4, 2, '$lastYear-05-01', 'HLH 213', 'Admin'),
				(5, 7, '$lastYear-06-09', 'THEO 307', 'Faculty'),
				(6, 26, '$lastYear-08-31', 'THEO 106', 'Weekly'),
				(7, 2, '$lastYear-09-01', 'THEO 106', 'Special'),
				(8, 4, '$lastYear-10-29', 'Chown 5', 'Admin'),
				(9, 17, '$lastYear-12-31', 'Chown 5', 'Faculty'),

				(10, 2, '$curYear-01-01', 'Chown 5', 'Faculty'),
				(11, 8, '$curYear-04-12', 'HLH 213', 'Admin'),
				(12, 26, '$curYear-04-30', 'HLH 213', 'Weekly'),
				(13, 1, '$curYear-05-01', 'HLH 213', 'Admin'),
				(14, 8, '$curYear-06-09', 'THEO 307', 'Faculty'),
				(15, 25, '$curYear-08-31', 'THEO 106', 'Weekly'),
				(16, 2, '$curYear-09-01', 'THEO 106', 'Special'),
				(17, 3, '$curYear-10-29', 'Chown 5', 'Admin'),
				(18, 21, '$curYear-12-31', 'Chown 5', 'Faculty'),

				(19, 1, '$nextYear-01-01', 'Chown 5', 'Faculty'),
				(20, 7, '$nextYear-04-12', 'HLH 213', 'Admin'),
				(21, 26, '$nextYear-04-30', 'HLH 213', 'Weekly'),
				(22, 3, '$nextYear-05-01', 'HLH 213', 'Admin'),
				(23, 7, '$nextYear-06-09', 'THEO 307', 'Faculty'),
				(24, 26, '$nextYear-08-31', 'THEO 106', 'Weekly'),
				(25, 2, '$nextYear-09-01', 'THEO 106', 'Special'),
				(26, 5, '$nextYear-10-29', 'Chown 5', 'Admin'),
				(27, 20, '$nextYear-12-31', 'Chown 5', 'Faculty');");
				
  	//Close the connection
	mysqli_close($cxn); 

	echo "Sample Bookings Entered";
?>
</body></html>
