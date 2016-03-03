<?php
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
echo $query;
fclose($file);





?>