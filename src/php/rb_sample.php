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
					
	
	$startDay = new DateTime();
	$today = date_format($startDay, "Y-m-d");
	date_add($startDay, date_interval_create_from_date_string('1 day'));
	$twoDays  = date_format($startDay, "Y-m-d");
	date_add($startDay, date_interval_create_from_date_string('1 day'));
	$threeDays  = date_format($startDay, "Y-m-d");
	date_add($startDay, date_interval_create_from_date_string('1 day'));
	$fourDays  = date_format($startDay, "Y-m-d");

	mysqli_query($cxn,"INSERT INTO BookingSlots (bookingID, blockID, bookingDate, roomID, hrsSource) VALUES
         		(13, 9, '$twoDays', 'CHOWN 104', 'Faculty'),
         		(16, 10, '$fourDays', 'CHOWN 104', 'Faculty'),
				(14, 11, '$today', 'CHOWN 104', 'Faculty'),
				(16, 11, '$fourDays', 'CHOWN 104', 'Faculty'),
				(14, 12, '$today', 'CHOWN 104', 'Faculty'),
				(15, 14, '$today', 'CHOWN 104', 'Faculty'),
				(15, 15, '$today', 'CHOWN 104', 'Faculty'),
				(15, 16, '$today', 'CHOWN 104', 'Faculty'),
				(20, 6, '$twoDays', 'CHOWN 107', 'Faculty'),
				(20, 7, '$twoDays', 'CHOWN 107', 'Faculty'),
				(20, 8, '$twoDays', 'CHOWN 107', 'Faculty'),
				(19, 12, '$threeDays', 'CHOWN 107', 'Admin'),
				(17, 13, '$today', 'CHOWN 107', 'Faculty'),
				(17, 14, '$today', 'CHOWN 107', 'Faculty'),
				(18, 20, '$today', 'CHOWN 107', 'Faculty'),
				(30, 6, '$twoDays', 'HLH 102', 'Faculty'),
				(6, 6, '$fourDays', 'HLH 102', 'Faculty'),
				(30, 7, '$twoDays', 'HLH 102', 'Faculty'),
				(6, 7, '$fourDays', 'HLH 102', 'Faculty'),
				(1, 8, '$today', 'HLH 102', 'Faculty'),
				(6, 8, '$fourDays', 'HLH 102', 'Faculty'),
				(1, 9, '$today', 'HLH 102', 'Faculty'),
				(1, 10, '$today', 'HLH 102', 'Faculty'),
				(5, 10, '$twoDays', 'HLH 102', 'Faculty'),
				(4, 10, '$threeDays', 'HLH 102', 'Weekly'),
				(5, 11, '$twoDays', 'HLH 102', 'Faculty'),
				(8, 11, '$threeDays', 'HLH 102', 'Faculty'),
				(34, 11, '$fourDays', 'HLH 102', 'Admin'),
				(8, 12, '$threeDays', 'HLH 102', 'Faculty'),
				(34, 12, '$fourDays', 'HLH 102', 'Faculty'),
				(8, 13, '$threeDays', 'HLH 102', 'Faculty'),
				(34, 13, '$fourDays', 'HLH 102', 'Admin'),
				(2, 14, '$today', 'HLH 102', 'Weekly'),
				(8, 14, '$threeDays', 'HLH 102', 'Faculty'),
				(34, 14, '$fourDays', 'HLH 102', 'Admin'),
				(2, 15, '$today', 'HLH 102', 'Weekly'),
				(3, 16, '$twoDays', 'HLH 102', 'Faculty'),
				(9, 16, '$threeDays', 'HLH 102', 'Faculty'),
				(3, 17, '$twoDays', 'HLH 102', 'Faculty'),
				(9, 17, '$threeDays', 'HLH 102', 'Faculty'),
				(3, 18, '$twoDays', 'HLH 102', 'Faculty'),
				(7, 22, '$today', 'HLH 102', 'Weekly'),
				(10, 6, '$today', 'HLH 103', 'Admin'),
				(10, 7, '$today', 'HLH 103', 'Admin'),
				(10, 8, '$today', 'HLH 103', 'Admin'),
				(12, 10, '$twoDays', 'HLH 103', 'Admin'),
				(11, 13, '$today', 'HLH 103', 'Weekly'),
				(33, 4, '$twoDays', 'HLH 104', 'Faculty'),
				(33, 5, '$twoDays', 'HLH 104', 'Faculty'),
				(33, 6, '$twoDays', 'HLH 104', 'Faculty'),
				(33, 7, '$twoDays', 'HLH 104', 'Faculty'),
				(33, 8, '$twoDays', 'HLH 104', 'Faculty'),
				(31, 8, '$threeDays', 'HLH 104', 'Faculty'),
				(32, 14, '$today', 'HLH 104', 'Faculty'),
				(32, 15, '$today', 'HLH 104', 'Faculty'),
				(32, 16, '$today', 'HLH 104', 'Faculty'),
				(22, 11, '$threeDays', 'ISABEL 104', 'Faculty'),
				(22, 12, '$threeDays', 'ISABEL 104', 'Faculty'),
				(22, 13, '$threeDays', 'ISABEL 104', 'Faculty'),
				(21, 16, '$today', 'ISABEL 104', 'Faculty'),
				(23, 9, '$twoDays', 'THEO 102', 'Faculty'),
				(23, 10, '$twoDays', 'THEO 102', 'Faculty'),
				(23, 11, '$twoDays', 'THEO 102', 'Faculty'),
				(23, 12, '$twoDays', 'THEO 102', 'Faculty'),
				(24, 14, '$today', 'THEO 102', 'Faculty'),
				(24, 15, '$today', 'THEO 102', 'Faculty'),
				(25, 18, '$twoDays', 'THEO 102', 'Faculty'),
				(28, 8, '$twoDays', 'THEO 119', 'Faculty'),
				(29, 9, '$today', 'THEO 119', 'Faculty'),
				(26, 8, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 9, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 10, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 11, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 12, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 13, '$fourDays', 'THEO 330', 'Faculty'),
				(27, 14, '$today', 'THEO 330', 'Faculty'),
				(26, 14, '$fourDays', 'THEO 330', 'Faculty'),
				(27, 15, '$today', 'THEO 330', 'Faculty'),
				(26, 15, '$fourDays', 'THEO 330', 'Faculty'),
				(27, 16, '$today', 'THEO 330', 'Faculty'),
				(26, 16, '$fourDays', 'THEO 330', 'Faculty'),
				(27, 17, '$today', 'THEO 330', 'Faculty'),
				(26, 17, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 18, '$fourDays', 'THEO 330', 'Faculty'),
				(26, 19, '$fourDays', 'THEO 330', 'Faculty');");
				
				
	mysqli_query($cxn,"INSERT INTO Bookings (bookingID, uID, reason, otherDesc, academicYr, numParticipants) VALUES
         		(1, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(2, '12sak2', 'Meetings', '', '2015/2016', '5-9'),
         		(3, '12ajf', 'Ensemble Rehearsal', '', '2015/2016', '4'),
         		(4, '12sak2', 'Coursework', 'Dram 332', '2015/2016', '1'),
         		(5, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(6, '12ajf', 'Performance', '', '2015/2016', '1'),
         		(7, '12sak2', 'Other', 'Party XD', '2015/2016', '20+'),
         		(8, '12ajf', 'Course', 'Musc 100', '2015/2016', '20+'),
         		(9, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(10, '11ecg5', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(11, '12sak2', 'Performance', '', '2015/2016', '1'),
         		(12, '11ecg5', 'Course', 'Musc 101', '2015/2016', '5-9'),
         		(13, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(14, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(15, '12ajf', 'Performance', '', '2015/2016', '1'),
         		(16, '12ajf', 'Coursework', 'Dram 100', '2015/2016', '3'),
         		(17, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(18, '12ajf', 'Ensemble Rehearsal', '', '2015/2016', '3'),
         		(19, '11ecg5', 'Course', '888', '2015/2016', '1'),
         		(20, '12ajf', 'Other', 'Study time', '2015/2016', '1'),
         		(21, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(22, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(23, '12ajf', 'Ensemble Rehearsal', '', '2015/2016', '1'),
         		(24, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(25, '12ajf', 'Course', 'Dram 100', '2015/2016', '1'),
         		(26, '12ajf', 'Coursework', 'Dram 100', '2015/2016', '10-19'),
         		(27, '12ajf', 'Performance', '', '2015/2016', '3'),
         		(28, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(29, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(30, '12ajf', 'Performance', '', '2015/2016', '1'),
         		(31, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(32, '12ajf', 'Individual Rehearsal', '', '2015/2016', '1'),
         		(33, '12ajf', 'Course', '', '2015/2016', '1'),
         		(34, '11ecg5', 'Other', 'Queen''s Musical Theatre AGM', '2015/2016', '10-19')");

  	
  	//Close the connection
	mysqli_close($cxn); 

	echo "Sample Data Entered";
?>
</body></html>
