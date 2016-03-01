<html>
<head><title>Load Sample Data</title></head>
<body>

<?php
/* Program: rb_sample.php
 * Desc:    Loads the roombooking database tables with 
 *          sample data.
 */
	
 	//Database connection variables 
 	$host = "localhost";
 	$user = "root";
 	$password = "";
 	$database = "mdroombooking";
	
 	/*
	//development environment
	$host = "10.20.49.11:3306";
	$user = "DMRoomBooking";
	$password = "UYXE9F5o4f4V";
	$database = "DMRoomBooking";
 	*/
 	//Connect to database
	$cxn = mysqli_connect($host,$user,$password, $database);
 	
 	// Check connection
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
		die();
	}
	
	//Insert sample data into tables
    mysqli_query($cxn, "INSERT INTO Master (uID, department) VALUES
				('11lmb23', 'Drama'),
				('12ajf', 'Drama'),
				('12sak2', 'Music'),
				('11ecg5', 'Music')
				");
                
	mysqli_query($cxn, "INSERT INTO User (uID, firstName, lastName, class, curWeekHrs, nextWeekHrs, thirdWeekHrs, hasBookingDurationRestriction) VALUES
				('12ajf', 'Lexi', 'Admin', 'Admin', NULL, NULL, NULL, 'No'),
				('12sak2', 'Shannon', 'Klett', 'Student', '5', '7', '11', 'No'),
				('11lmb23', 'Laura', 'Brooks', 'Student', '5', '0', '5', 'No'),
				('11ecg5', 'Erin', 'Admin', 'Admin', NULL, NULL, NULL, 'No')
				");		
				
	/*			
	mysqli_query($cxn, "INSERT INTO UGroups(groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate) VALUES
				('MUSC 100', 'week', '2', 'Yes', '2016-01-01', '2016-04-30'),
				('Ensemble A', 'week', '5', 'Yes', '2016-01-01', '2016-04-30'),
				('DRAM 205', 'special', '6', 'No', '2016-01-01', '2016-04-30'),
				('DRAM 100', 'week', '2', 'Yes', '2016-01-01', '2016-04-30'),
				('DRAM 450', 'week', '3', 'No', '2016-01-01', '2016-04-30')  
				");
	*/	
	/*				
	mysqli_query($cxn, "INSERT INTO Permission (uID, groupID, specialHrs) VALUES
				('12af', '2', '0'),
				('13eg', '1', '0'),
				('14sk', '3', '6'),
				('14sk', '4', '0'),
				('15lb', '1', '0'),
				('14sk', '5', '0'),
				('15lb', '5', '0')
				");	
	*/	
	
	mysqli_query($cxn,"INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource) VALUES
         			('1','1', '2015-11-27','HLH 102', 'Admin'),
				('1','2', '2015-11-27','HLH 102', 'Admin'),
				('1','3', '2015-11-27','HLH 102', 'Admin'),
				('2','15', '2015-11-24','HLH 102', '2'),
				('2','16', '2015-11-24','HLH 102', '2'),
				('3','8', '2015-11-26','HLH 102', 'Faculty'),
				('3','9', '2015-11-26','HLH 102', 'Faculty')");
				
	mysqli_query($cxn,"INSERT INTO Bookings (uID, reason, otherDesc, academicYr, numParticipants) VALUES
         		('15lb','Ensemble','','2015/16','10'),
         		('15lb','Individual Rehearsal','','2015/16','1'),
         		('12af','Other','Mostly Mischief','2015/16','4')");
  	
  	//Close the connection
	mysqli_close($cxn); 

	echo "Sample Data Entered";
?>
</body></html>
