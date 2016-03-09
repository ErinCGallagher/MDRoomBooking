<html>
<head><title>Load Room Booking Database</title></head>
<body>

<?php
/* Program: rb_load_3.php
 * Desc:    Creates the roombooking database tables
 *          
 */

	//Databse connection 
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
 	
 	/*
 	//production environment
 	$host = "10.28.49.11:3306";
	$user = "DMRoomBooking";
	$password = "72iCjkExCXoj";
	$database = "DMRoomBooking";
 	*/

 	
 	//Connect to database
 	$cxn = mysqli_connect($host,$user,$password,$database);
 	
 	//Check connection
	if (mysqli_connect_errno())
	{
  		echo "Failed to connect to MySQL: " . mysqli_connect_error();
  		die();
	}
  
  	//Drop all tables
  	mysqli_query($cxn,"drop table Blocks;");
    mysqli_query($cxn,"drop table Master;");
  	mysqli_query($cxn,"drop table User;");
  	mysqli_query($cxn,"drop table UGroupsPermanent;"); //must drop before UGroups
  	mysqli_query($cxn,"drop table UGroups;");
  	mysqli_query($cxn,"drop table Permission;");
  	mysqli_query($cxn,"drop table BookingSlots;");
  	mysqli_query($cxn,"drop table Bookings;");
  	mysqli_query($cxn,"drop table Building;");
  	mysqli_query($cxn,"drop table Rooms;");
  	
  	
  	//Create all tables 
	mysqli_query($cxn,"CREATE TABLE Blocks(
					blockID				INT(3)		NOT NULL,			
					startTime			TIME		NOT NULL,
					endTime				TIME		NOT NULL,
					PRIMARY KEY(blockID));");
                    
    	mysqli_query($cxn,"CREATE TABLE Master(
					uID			 	VARCHAR(10)	NOT NULL,		
					department			VARCHAR(35) 	NOT NULL,
					PRIMARY KEY(uID, department));"); 
  
	mysqli_query($cxn,"CREATE TABLE User(
					uID			 	VARCHAR(10)	NOT NULL,
					firstName			VARCHAR(35)	NOT NULL,
					lastName			VARCHAR(35)	NOT NULL,
					class				VARCHAR(35) 	NOT NULL,
					curWeekHrs			DECIMAL(11,2),
					nextWeekHrs			DECIMAL(11,2),
					thirdWeekHrs		DECIMAL(11,2),
					hasBookingDurationRestriction 	VARCHAR(5) 	NOT NULL,
					PRIMARY KEY(uID));");				

	mysqli_query($cxn,"CREATE TABLE UGroups(
					groupID				INT		NOT NULL  	AUTO_INCREMENT,
					groupName			VARCHAR(35)	NOT NULL,
					addHrsType			VARCHAR(35) 	NOT NULL,
					hours				DECIMAL(11,2)		NOT NULL,
					hasBookingDurationRestriction 	VARCHAR(5) 	NOT NULL,
					startDate			VARCHAR(35)	NOT NULL,
					endDate				VARCHAR(35) 	NOT NULL,		
					PRIMARY KEY(groupID));");

	mysqli_query($cxn,"CREATE TABLE UGroupsPermanent(
		groupID INT NOT NULL, FOREIGN KEY (groupID) REFERENCES UGroups(groupID) ON DELETE RESTRICT);");
  
	mysqli_query($cxn,"CREATE TABLE Permission(
					uID		VARCHAR(10)	NOT NULL,
					groupID		INT		NOT NULL,
					specialHrs	DECIMAL(11,2)		DEFAULT '0',
					PRIMARY KEY(groupID, uID));");						
 
	mysqli_query($cxn,"CREATE TABLE BookingSlots(
					bookingID			INTEGER		NOT NULL,	
					blockID				INT(3)		NOT NULL,
					bookingDate			DATE		NOT NULL,
					roomID				VARCHAR(20)	NOT NULL,
					hrsSource			VARCHAR(20)	NOT NULL,
					PRIMARY KEY(roomId, blockID, bookingDate));");
  
	mysqli_query($cxn,"CREATE TABLE Bookings(
					bookingID			INTEGER	  	NOT NULL 	AUTO_INCREMENT,
					uID				VARCHAR(10)	NOT NULL,
					reason				VARCHAR(50) 	NOT NULL,
					otherDesc			VARCHAR(100),	
					numParticipants			VARCHAR(9)	NOT NULL,
					PRIMARY KEY(bookingID));");

	mysqli_query($cxn,"CREATE TABLE Building(
					buildingID			VARCHAR(50)	NOT NULL,				 
					openTime			VARCHAR(5)	NOT NULL,
					closeTime			VARCHAR(5)	NOT NULL,
					PRIMARY KEY(buildingID));");
					
	mysqli_query($cxn,"CREATE TABLE Rooms(
					roomID				VARCHAR(50)	NOT NULL,
					building			VARCHAR(30)	NOT NULL,
					capacity			INTEGER		NOT NULL,
					reqKey				VARCHAR(100) 	NOT NULL,
					fee					VARCHAR(100) NOT NULL,
					contents			TEXT 		NOT NULL,
					setup				VARCHAR(50) NOT NULL,
					upright				VARCHAR(3)	NOT NULL,					
					grand				VARCHAR(3) 	NOT NULL,
					mirror				VARCHAR(3) 	NOT NULL,
					stands				VARCHAR(3) 	NOT NULL,
					chairs				VARCHAR(3) 	NOT NULL,
					PRIMARY KEY(roomID));");	
	
	//Insert Rooms
	include('generateRoomQuery.php');
	mysqli_query($cxn, $query);

	// Create Sonic Arts Studio group that can't be deleted for Sonic Arts Studio students
	$startDay = new DateTime();
	$today = date_format($startDay, "Y-m-d");
	date_add($startDay, date_interval_create_from_date_string('1 year')); //will be updated in semester update script
	$oneYear  = date_format($startDay, "Y-m-d");
	mysqli_query($cxn, "INSERT INTO UGroups(groupID, groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate) VALUES
		('1', 'Sonic Arts Studio', 'week', '0', 'Yes', '$today', '$oneYear');");

	mysqli_query($cxn, "INSERT INTO UGroupsPermanent(groupID) VALUES ('1');");

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

	mysqli_query($cxn,"INSERT INTO Building (buildingID, openTime, closeTime) VALUES
         		('Upper Harrison LeCaine Hall', '8:00', '23:00'),
         		('Lower Harrison LeCaine Hall', '8:00', '23:00'),
         		('Theological Hall', '7:30', '23:00'),
         		('Chown Hall', '7:30', '23:00'),
         		('The Isabel', '8:00', '20:00')");

	mysqli_query($cxn,"INSERT INTO Rooms (roomID, building, capacity, reqKey, upright, grand, openSpace, mirror, projector) VALUES
     		('HLH 102','Harrison LeCaine Hall','100','No','Yes','No','No','Yes', 'No'),
     		('HLH 103','Harrison LeCaine Hall','50', 'No','No', 'No', 'No', 'No', 'Yes'),
     		('HLH 104','Harrison LeCaine Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('THEO 119','Theological Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('THEO 102','Theological Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('THEO 330','Theological Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('ISABEL 104','The Isabel','50', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('CHOWN 104','Chown Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('CHOWN 105','Chown Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('CHOWN 106','Chown Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No'),
     		('CHOWN 107','Chown Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No')");
		
		
		
			
					
		
		
			
	//Close the connection
	mysqli_close($cxn); 

	echo "MDRoomBooking database created.";
	
  ?>
</body></html>
