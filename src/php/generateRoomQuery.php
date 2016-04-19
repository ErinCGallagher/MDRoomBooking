<?php
//written by Laura Brooks
//can run with rb_load
mysqli_query($cxn,"drop table Rooms;");

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

$file = fopen("rooms.csv","r");
fgetcsv($file);

$query = "INSERT INTO Rooms (roomID, building, capacity, reqKey, fee, contents, setup, upright, grand, mirror, stands, chairs) VALUES ";
$firstRoom = True;
$count = 0;

while(! feof($file)){
	$line = fgetcsv($file);
	if ($line[0] != "Ignore"){
		$roomID = $line[1];
		if ($roomID != "" && !empty($roomID)){
			$building = $line[2];
			$capacity = $line[3];
			$reqKey = $line[4];
			$fee = $line[5];
			$contents = $line[6];
			$setup = $line[7];
			$upright = $line[8];
			$grand = $line[9];
			$mirror = $line[10];
			$stands = $line[11];
			$chairs = $line[12];
			if ($firstRoom == False) {
				$query = $query . ", ";
			}
			$query = $query . "('$roomID','$building','$capacity','$reqKey','$fee', '$contents', '$setup', '$upright', '$grand', '$mirror', '$stands', '$chairs')";
		}
		$firstRoom = False;
		
	}
}
fclose($file);





?>