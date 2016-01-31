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
 	
 	//Connect to database
	$cxn = mysqli_connect($host,$user,$password, $database);
 	
 	// Check connection
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
		die();
	}
	
	//Insert sample data into tables
	
    mysqli_query($cxn, "INSERT INTO Master(uID, department) VALUES
				('12af', 'Drama'),
				('13eg', 'Drama'),
				('14sk', 'Music'),
				('15lb', 'Music') 
				");
                
	mysqli_query($cxn, "INSERT INTO User (uID, firstName, lastName, class, curWeekHrs, nextWeekHrs) VALUES
				('12af', 'Lexi', 'Flynn', 'Student', '5', '5'),
				('13eg', 'Erin', 'Gallagher', 'Student', '5', '5'),
				('14sk', 'Shannon', 'Klett', 'Student', '0', '0'),
				('15lb', 'Laura', 'Brooks', 'Student', '0', '0')
				");		
				
				
	mysqli_query($cxn, "INSERT INTO UGroups(groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate) VALUES
				('MUSC 100', 'week', '2', 'No', '2016-01-01', '2016-04-30'),
				('Ensemble A', 'week', '5', 'No', '2016-01-01', '2016-04-30'),
				('DRAM 205', 'week', '6', 'No', '2016-01-01', '2016-04-30'),
				('DRAM 100', 'week', '2', 'No', '2016-01-01', '2016-04-30') 
				");
		
					
	mysqli_query($cxn, "INSERT INTO Permission (uID, groupID, weeklyHrs, specialHrs) VALUES
				('12af', '2', '5', '0'),
				('13eg', '1', '2', '0'),
				('14sk', '3', '6', '0'),
				('14sk', '4', '2', '0'),
				('15lb', '1', '2', '0')
				");		
	
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
