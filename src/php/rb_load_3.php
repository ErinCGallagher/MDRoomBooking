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
  	mysqli_query($cxn,"drop table UGroups;");
  	mysqli_query($cxn,"drop table Permission;");
  	mysqli_query($cxn,"drop table BookingSlots;");
  	mysqli_query($cxn,"drop table Bookings;");
  	mysqli_query($cxn,"drop table Building;");
  	mysqli_query($cxn,"drop table Rooms;");
  	
  	
  	//Create all tables 
	mysqli_query($cxn,"CREATE TABLE Blocks(
					blockID				INT(3)		  NOT NULL,			
					startTime			TIME		  NOT NULL,
					endTime				TIME		  NOT NULL,
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
					curWeekHrs			INT		DEFAULT '0',
					nextWeekHrs				INT		DEFAULT '0',
					PRIMARY KEY(uID));");				

	mysqli_query($cxn,"CREATE TABLE UGroups(
					groupID				INT		NOT NULL  	AUTO_INCREMENT,
					groupName			VARCHAR(35)	NOT NULL,
					addHrsType			VARCHAR(35) NOT NULL,
					hours				INT		NOT NULL,
					hasBookingDurationRestriction VARCHAR(5) NOT NULL,
					startDate			VARCHAR(35)	NOT NULL,
					endDate				VARCHAR(35) NOT NULL,		
					PRIMARY KEY(groupID));");
  
	mysqli_query($cxn,"CREATE TABLE Permission(
					uID		VARCHAR(10)	NOT NULL,
					groupID		INT		NOT NULL,
					weeklyHrs	INT		DEFAULT '0',
					specialHrs	INT		DEFAULT '0',
					PRIMARY KEY(groupID, uID));");						
 
	mysqli_query($cxn,"CREATE TABLE BookingSlots(
					bookingID			INTEGER		NOT NULL,	
					blockID				INT(3)		NOT NULL,
					bookingDate			DATE		NOT NULL,
					roomID				VARCHAR(20)	NOT NULL,
					hrsSource			VARCHAR(20)	NOT NULL,
					PRIMARY KEY(roomId, blockID, bookingDate));");
  
	mysqli_query($cxn,"CREATE TABLE Bookings(
					bookingID			INTEGER	  	  NOT NULL 	AUTO_INCREMENT,
					uID					  VARCHAR(10)	  NOT NULL,
					reason				VARCHAR(50) 	NOT NULL,
					otherDesc			VARCHAR(100),
					academicYr			VARCHAR(9)	  NOT NULL,	
					numParticipants		VARCHAR(9)		NOT NULL,
					PRIMARY KEY(bookingID));");

	mysqli_query($cxn,"CREATE TABLE Building(
					buildingID			VARCHAR(50)		NOT NULL,				 
					openTime			VARCHAR(4)	    NOT NULL,
					closeTime			VARCHAR(4)	    NOT NULL,
					PRIMARY KEY(buildingID));");
					
	mysqli_query($cxn,"CREATE TABLE Rooms(
					roomID				VARCHAR(20)	NOT NULL,
					building			VARCHAR(30)	NOT NULL,
					capacity			INTEGER		  NOT NULL,
					reqKey				VARCHAR(3) 	NOT NULL,
					upright				VARCHAR(3)	NOT NULL,	
					grand				  VARCHAR(3) 	  NOT NULL,
					openSpace			VARCHAR(3) 	NOT NULL,
					mirror				VARCHAR(3) 	NOT NULL,
					projector			VARCHAR(3) 	NOT NULL,
					PRIMARY KEY(roomID));");		
					
						

	//Close the connection
	mysqli_close($cxn); 

	echo "MDRoomBooking database created.";
	
  ?>
</body></html>
