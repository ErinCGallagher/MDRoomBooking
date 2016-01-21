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
	
	mysqli_query($cxn, "INSERT INTO User (uID, firstName, lastName, class, defaultHrs, addHrs, usedHrs, academicYr) VALUES
				('12af', 'Lexi', 'Flynn', 'DStudent', '5', '0', '0', '2016'),
				('13eg', 'Erin', 'Gallagher', 'DStudent', '5', '0', '0', '2016'),
				('14sk', 'Shannon', 'Klett', 'MStudent', '0', '0' , '0', '2016'),
				('15lb', 'Laura', 'Brooks', 'MStudent', '0', '0', '0', '2016')
				");		
				
				
	mysqli_query($cxn, "INSERT INTO UGroups(groupName, addHrsType, hours) VALUES
				('MUSC 100', 'week', '2'),
				('Ensemble A', 'week', '5' ),
				('DRAM 205', 'week', '6' ),
				('DRAM 100', 'week', '2') 
				");
		
					
	mysqli_query($cxn, "INSERT INTO Permission (uID, groupID, academicYr) VALUES
				('12ajf', '2', '2016'),
				('13eg', '1', '2016'),
				('14sk', '3', '2016'),
				('14sk', '4', '2016'),
				('15lb', '1', '2016')
				");		
	
	mysqli_query($cxn,"INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID) VALUES
         		('1','1', '2015-11-27','HLH 102'),
				('1','2', '2015-11-27','HLH 102'),
				('1','3', '2015-11-27','HLH 102'),
				('2','15', '2015-11-24','HLH 102'),
				('2','16', '2015-11-24','HLH 102'),
				('3','8', '2015-11-26','HLH 102'),
				('3','9', '2015-11-26','HLH 102')");
				
	mysqli_query($cxn,"INSERT INTO Bookings (uID, reason, otherDesc, academicYr, numParticipants) VALUES
         		('11lmb23','Ensemble','','2015/16','10'),
         		('11lmb23','Individual Rehearsal','','2015/16','1'),
         		('12ajf','Other','Mostly Mischief','2015/16','4')");
         		
	 mysqli_query($cxn,"INSERT INTO Rooms (roomID, building, capacity, reqKey, upright, grand, openSpace, mirror, projector) VALUES
         		('HLH 102','Harrison LeCaine Hall','100','No','Yes','No','No','Yes', 'No'),
         		('HLH 103','Harrison LeCaine Hall','50', 'No','No', 'No', 'No', 'No', 'Yes'),
         		('HLH 104','Harrison LeCaine Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No')");
         			
  	mysqli_query($cxn,"INSERT INTO Building (buildingID, openTime, closeTime) VALUES
         		('HarrisonLecaine', '9:00', '8:00')");
  	
  	
  	
  	//Close the connection
	mysqli_close($cxn); 

	echo "Sample Data Entered";
  
  
  
?>
</body></html>
