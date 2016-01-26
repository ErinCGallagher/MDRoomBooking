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
	mysqli_query($cxn, "INSERT INTO Blocks (blockID, startTime, endTime) VALUES
				('1', '07:30:00', '08:00:00'),
				('2', '08:00:00', '08:30:00'),
				('3', '08:30:00', '09:00:00'),
				('4', '09:00:00', '09:30:00'),
				('5', '09:30:00', '10:00:00'),
				('6', '10:00:00', '10:30:00'),
				('7', '10:30:00', '11:00:00'),
				('8', '11:00:00', '11:30:00'),
				('9', '11:30:00', '12:00:00'),
				('10', '12:00:00', '12:30:00'),
				('11', '12:30:00', '13:00:00'),
				('12', '13:00:00', '13:30:00'),
				('13', '13:30:00', '14:00:00'),
				('14', '14:00:00', '14:30:00'),
				('15', '14:30:00', '15:00:00'),
				('16', '15:00:00', '15:30:00'),
				('17', '15:30:00', '16:00:00'),
				('18', '16:00:00', '16:30:00'),
				('19', '16:30:00', '17:00:00'),
				('20', '17:00:00', '17:30:00'),
				('21', '17:30:00', '18:00:00'),
				('22', '18:00:00', '18:30:00'),
				('23', '18:30:00', '19:00:00'),
				('24', '19:00:00', '19:30:00'),
				('25', '19:30:00', '20:00:00'),
				('26', '20:00:00', '20:30:00'),
				('27', '20:30:00', '21:00:00'),
				('28', '21:00:00', '21:30:00'),
				('29', '21:30:00', '22:00:00'),
				('30', '22:00:00', '22:30:00'),
				('31', '22:30:00', '23:00:00')
				");
	
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
				('12ajf', '2', '5', '0'),
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
