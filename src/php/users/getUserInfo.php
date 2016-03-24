
<?php

	include('../connection.php');

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$uID = $data->userID;
	
	//array to hold results
	$result = array();

	//Query to get group information
	$sth = $db->prepare("SELECT Master.department, User.class FROM User JOIN Master ON Master.uID = User.uID WHERE User.uID = ?"); 
	$sth->execute(array($uID));
	$rows = $sth->fetchAll();
	$departmentStr = "";
	//Put result in an array 
		foreach($rows as $row) {
			$result["class"] = $row["class"];
			$departmentStr .= " ". $row["department"];
		}
		$result["department"] = $departmentStr;

	
	//Query to get group information
	$sth = $db->prepare("SELECT firstName, lastName, curWeekHrs, nextWeekHrs, hasBookingDurationRestriction FROM User WHERE uID = ?"); 
	$sth->execute(array($uID));
	
	
	
	if ($sth->rowCount() > 0) {
 		$rows = $sth->fetchAll();

		//Put result in an array 
		foreach($rows as $row) {
			$result[] = $row;
		}
		
		$sth = $db->prepare("SELECT COUNT(*) as numGroups FROM Permission WHERE uID = ? "); 
		$sth->execute(array($uID));
		$rows2 = $sth->fetchAll();
		
		//Put result in an array 
		foreach($rows2 as $row) {
			$result[] = $row;
		}
		
		$sth = $db->prepare("SELECT groupName, addHrsType, hours, hasBookingDurationRestriction, startDate, endDate, specialHrs FROM UGroups JOIN Permission ON Permission.groupID = UGroups.groupID WHERE Permission.uID = ? "); 
		$sth->execute(array($uID));
		$rows3 = $sth->fetchAll();
		
		//Put result in an array 
		foreach($rows3 as $row) {
			$result[] = $row;
		}
		
		//Format day
		date_default_timezone_set('America/Toronto');

		$firstDay = date("Y-m-d", strtotime('monday this week'));  
		$firstDayNextWeek = date("Y-m-d", strtotime('monday next week'));



		//get daily bookings from database
		$sth = $db->prepare("SELECT curWeekHrs, nextWeekHrs FROM User where uID = ?;");
		$sth->execute(array($uID));

		//Loop through each returned row 
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			$result["curWeekHrs"] = floatval($row["curWeekHrs"]);
			$result["nextWeekHrs"] = floatval($row["nextWeekHrs"]);
		}
		$result["curWeekHrs"] += weeksSpecialHours($db, $uID, $firstDay);
		$result["nextWeekHrs"] += weeksSpecialHours($db, $uID, $firstDayNextWeek);

	
	
	} 
	else {
		 $result[0] = 'nothing';
		 $result[1] = $uID;
	}

	//Close the connection
	$db = NULL;

	//Convert to json
	$json = json_encode($result);

	echo $json;

	//given a date, determines the specicial hours whch are active
	function weeksSpecialHours($db, $uID, $startDate){
		$usableSpecialHours = 0;
		$sth = $db->prepare("SELECT SUM(Permission.specialHrs) totalHrs FROM Permission JOIN UGroups on UGroups.groupID = Permission.groupID WHERE uID = ? and ? BETWEEN UGroups.startDate and UGroups.endDate");
		$sth->execute(array($uID, $startDate));
		while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
			//Get number of blocks
			$usableSpecialHours = $row['totalHrs'];
		}
		
		return floatval($usableSpecialHours);
	}
	
?>