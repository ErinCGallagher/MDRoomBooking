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


   mysqli_query($cxn,"CREATE TABLE Rooms(
					RoomID				VARCHAR(20)	NOT NULL,
					Building			VARCHAR(20)	NOT NULL,
					Capacity			INTEGER		NOT NULL,
					ReqKey					VARCHAR(3) 	NOT NULL,
					Upright				VARCHAR(3)	NOT NULL,	
					Grand				VARCHAR(3) 	NOT NULL,
					OpenSpace			VARCHAR(3) 	NOT NULL,
					Mirror				VARCHAR(3) 	NOT NULL,
					Projector			VARCHAR(3) 	NOT NULL,
					PRIMARY KEY(RoomID));");
				  
	mysqli_query($cxn,"CREATE TABLE Bookings(
					BookingID			INTEGER		NOT NULL 	AUTO_INCREMENT,
					UID					VARCHAR(10)	NOT NULL,
					RoomID				VARCHAR(20)	NOT NULL,
					Reason				VARCHAR(50)	NOT NULL,
					OtherDesc			VARCHAR(100),
					AcademicYr			VARCHAR(9)	NOT NULL,	
					NumParticipants		INTEGER		NOT NULL,
					BookingDate			DATE		NOT NULL,
					PRIMARY KEY(BookingID));");

   mysqli_query($cxn,"CREATE TABLE BookingSlots(
					BookingID			INTEGER		NOT NULL,	
					BlockID				VARCHAR(9)	NOT NULL,
					PRIMARY KEY(BookingID,BlockID));");


   mysqli_query($cxn,"CREATE TABLE Blocks(
					BlockID				VARCHAR(9) 	NOT NULL,			
					StartTime			TIME		NOT NULL,
					EndTime				TIME		NOT NULL,
					PRIMARY KEY(BlockID));");
					
	 mysqli_query($cxn,"INSERT INTO Rooms (RoomID, Building, Capacity, ReqKey, Upright, Grand, OpenSpace, Mirror, Projector) VALUES
         		('HLH 102','Harrison LeCaine Hall','100','No','Yes','No','No','Yes', 'No'),
         		('THEO 118','Theological Hall','50', 'No','No', 'No', 'No', 'No', 'Yes'),
         		('Chown 7','Chown Hall','10', 'Yes','Yes', 'No', 'Yes','Yes','No')");
	
	mysqli_query($cxn,"INSERT INTO Bookings (UID, RoomID, Reason, OtherDesc, AcademicYr, NumParticipants, BookingDate) VALUES
         		('11lmb23','HLH 102','Ensemble','','2015/16','10','2015-11-27'),
         		('11lmb23','Chown 7','Individual Rehearsal','','2015/16','1','2015-11-24'),
         		('12ajf','THEO 118','Other','Mostly Mischief','2015/16','4','2015-11-26')");
	
	mysqli_query($cxn,"INSERT INTO BookingSlots (BookingID, BlockID) VALUES
         		('1','Block1'),
				('1','Block2'),
				('1','Block3'),
				('2','Block15'),
				('2','Block16'),
				('3','Block8'),
				('3','Block9')");
				
	mysqli_query($cxn, "INSERT INTO Blocks (BlockID, StartTime, EndTime) VALUES
				('Block1', '07:30:00', '08:00:00'),
				('Block2', '08:00:00', '08:30:00'),
				('Block3', '08:30:00', '09:00:00'),
				('Block4', '09:00:00', '09:30:00'),
				('Block5', '09:30:00', '10:00:00'),
				('Block6', '10:00:00', '10:30:00'),
				('Block7', '10:30:00', '11:00:00'),
				('Block8', '11:00:00', '11:30:00'),
				('Block9', '11:30:00', '12:00:00'),
				('Block10', '12:00:00', '12:30:00'),
				('Block11', '12:30:00', '13:00:00'),
				('Block12', '13:00:00', '13:30:00'),
				('Block13', '13:30:00', '14:00:00'),
				('Block14', '14:00:00', '14:30:00'),
				('Block15', '14:30:00', '15:00:00'),
				('Block16', '15:00:00', '15:30:00'),
				('Block17', '15:30:00', '16:00:00'),
				('Block18', '16:00:00', '16:30:00'),
				('Block19', '16:30:00', '17:00:00'),
				('Block20', '17:00:00', '17:30:00'),
				('Block21', '17:30:00', '18:00:00'),
				('Block22', '18:00:00', '18:30:00'),
				('Block23', '18:30:00', '19:00:00'),
				('Block24', '19:00:00', '19:30:00'),
				('Block25', '19:30:00', '20:00:00'),
				('Block26', '20:00:00', '20:30:00'),
				('Block27', '20:30:00', '21:00:00'),
				('Block28', '21:00:00', '21:30:00'),
				('Block29', '21:30:00', '22:00:00'),
				('Block30', '22:00:00', '22:30:00'),
				('Block31', '22:30:00', '23:00:00')
				");
	
	
   mysqli_close($cxn); 

echo "MDRoomBooking database created.";

?>
</body></html>

