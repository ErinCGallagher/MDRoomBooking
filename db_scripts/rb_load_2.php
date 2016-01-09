<html>
<head><title>Load Room Booking Database</title></head>
<body>

<?php
/* Program: rb_load.php
 * Desc:    Creates and loads the roombooking database tables with 
 *          sample data.
 */
 
 $host = "localhost";
 $user = "root";
 $password = "";
 $database = "mdroombooking";
 $cxn = mysqli_connect($host,$user,$password, $database);
 // Check connection
 if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  die();
  }
   
   mysqli_query($cxn,"drop table Rooms;");
   mysqli_query($cxn,"drop table Bookings;");
   mysqli_query($cxn,"drop table BookingSlots;");
   mysqli_query($cxn,"drop table Blocks;");
   mysqli_query($cxn,"drop table UGroups;");
   mysqli_query($cxn,"drop table Permission;");
   mysqli_query($cxn,"drop table User;");
   
   mysqli_query($cxn,"CREATE TABLE Rooms(
					RoomID				VARCHAR(20)	NOT NULL,
					Building			VARCHAR(30)	NOT NULL,
					Capacity			INTEGER		NOT NULL,
					ReqKey				VARCHAR(3) 	NOT NULL,
					Upright				VARCHAR(3)	NOT NULL,	
					Grand				VARCHAR(3) 	NOT NULL,
					OpenSpace			VARCHAR(3) 	NOT NULL,
					Mirror				VARCHAR(3) 	NOT NULL,
					Projector			VARCHAR(3) 	NOT NULL,
					PRIMARY KEY(RoomID));");
				  
	mysqli_query($cxn,"CREATE TABLE Bookings(
					BookingID			INTEGER		NOT NULL 	AUTO_INCREMENT,
					UID					VARCHAR(10)	NOT NULL,
					Reason				VARCHAR(50)	NOT NULL,
					OtherDesc			VARCHAR(100),
					AcademicYr			VARCHAR(9)	NOT NULL,	
					NumParticipants		INTEGER		NOT NULL,
					PRIMARY KEY(BookingID));");
   mysqli_query($cxn,"CREATE TABLE BookingSlots(
					BookingID			INTEGER		NOT NULL,	
					BlockID				INT(3)		NOT NULL,
					BookingDate			DATE		NOT NULL,
					RoomID				VARCHAR(20)	NOT NULL,
					PRIMARY KEY(RoomId, BlockID, BookingDate));");
   mysqli_query($cxn,"CREATE TABLE Blocks(
					BlockID				INT(3)		NOT NULL,			
					StartTime			TIME		NOT NULL,
					EndTime				TIME		NOT NULL,
					PRIMARY KEY(BlockID));");
					
	mysqli_query($cxn,"CREATE TABLE UGroups(
					GroupID				INT			NOT NULL,
					GroupName			VARCHAR(35)	NOT NULL,
					HrsPerWeek			INT			NOT NULL,
					HrsPerTerm			INT			NOT NULL,
					Fall				BOOLEAN		NOT NULL,
					Winter				BOOLEAN		NOT NULL, 
					Summer				BOOLEAN		NOT NULL,
					PRIMARY KEY(GroupID));");
	
	mysqli_query($cxn,"CREATE TABLE Permission(
					UID					INT			NOT NULL,
					GroupID				INT			NOT NULL,
					AcademicYr			INT			NOT NULL,
					PRIMARY KEY(GroupID, UID));");		
	
	mysqli_query($cxn,"CREATE TABLE User(
					UID					INT			NOT NULL,
					FirstName			VARCHAR(35)	NOT NULL,
					LastName			VARCHAR(35)	NOT NULL,
					PRIMARY KEY(UID));");				
		
					
	 mysqli_query($cxn,"INSERT INTO Rooms (RoomID, Building, Capacity, ReqKey, Upright, Grand, OpenSpace, Mirror, Projector) VALUES
         		('HLH 102','Harrison LeCaine Hall','100','No','Yes','No','No','Yes', 'No'),
         		('HLH 103','Harrison LeCaine Hall','50', 'No','No', 'No', 'No', 'No', 'Yes'),
         		('HLH 104','Harrison LeCaine Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No')");
	
	mysqli_query($cxn,"INSERT INTO Bookings (UID, Reason, OtherDesc, AcademicYr, NumParticipants) VALUES
         		('11lmb23','Ensemble','','2015/16','10'),
         		('11lmb23','Individual Rehearsal','','2015/16','1'),
         		('12ajf','Other','Mostly Mischief','2015/16','4')");
	
	mysqli_query($cxn,"INSERT INTO BookingSlots (BookingID, BlockID, BookingDate, RoomID) VALUES
         		('1','1', '2015-11-27','HLH 102'),
				('1','2', '2015-11-27','HLH 102'),
				('1','3', '2015-11-27','HLH 102'),
				('2','15', '2015-11-24','HLH 102'),
				('2','16', '2015-11-24','HLH 102'),
				('3','8', '2015-11-26','HLH 102'),
				('3','9', '2015-11-26','HLH 102')");
				
	mysqli_query($cxn, "INSERT INTO Blocks (BlockID, StartTime, EndTime) VALUES
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
				
				
	mysqli_query($cxn, "INSERT INTO UGroups(GroupID, GroupName, HrsPerWeek, HrsPerTerm, Fall, Winter, Summer) VALUES
				('1', 'MUSC 100', '2', '0', True, True, False),
				('2', 'Ensemble A', '5', '0', False, True, False),
				('3', 'DRAM 205', '6', '0', True, False, False),
				('4', 'DRAM 100', '2', '0', False, False, True) 
				");
				
	mysqli_query($cxn, "INSERT INTO Permission (UID, GroupID, AcademicYr) VALUES
				('1', '2', '2016'),
				('2', '1', '2016'),
				('2', '3', '2016'),
				('3', '4', '2016'),
				('4', '1', '2016')
				");
	
	mysqli_query($cxn, "INSERT INTO User (UID, FirstName, LastName) VALUES
				('1', 'Lexi', 'Flynn'),
				('2', 'Erin', 'Gallagher'),
				('3', 'Shannon', 'Klett'),
				('4', 'Laura', 'Brooks')
				");
	
   mysqli_close($cxn); 
echo "MDRoomBooking database created.";
?>
</body></html>
