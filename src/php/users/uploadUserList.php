<?php

	//include uploadFile.php ...

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');
	
	function checkType($str) {
		$val = strcmp($str, 'Student') == 0;
		$val |= strcmp($str, 'Faculty') == 0;
		$val |= strcmp($str, 'Admin') == 0;
		return $val;
	}
	
	// reads in file and stores contents in $contents
	// each element has format <id>,<firstName>,<lastName>,<type>
	// <type> = "Student" | "Faculty" | "Admin"
	require '../uploadFile.php';
	
	//prepend M or D to type based on department
	//get from frontend
	$departmentChar = "D";

	//drop all members of current department list (ie if music upload, drop M*)
	//need to update this
	$student = $departmentChar . 'Student';
	$faculty = $departmentChar . 'Faculty';
	$admin = $departmentChar . 'Admin';

	$dropMasterQuery = "DELETE FROM Master WHERE class='$student' OR class='$faculty' OR class='$admin"; 
	$dropMasterStmt = $db->query($dropMasterQuery);

	$insertMasterString = "";
	$insertUserString = "";
	$unexpectedUserString = "";
	//process each user
	
	foreach ($contents as $user) {
		$userData = explode(",", $user); 
		// userData should have format <id>,<firstName>,<lastName>,<type>
		
		if (4 == sizeof($userData)) {
			// userData has expected number of elements
			if (checkType($userData[3])) {
				// type is expected format; "Student" | "Faculty" | "Admin"

				// TODO: check length and format of elements

				// prepend department
				$userData[3] = $departmentChar . $userData[3];
				$insertMasterString .= "('$userData[0]', '$userData[3]'), ";
				$insertUserString .= "('$userData[0]', '$userData[1]', '$userData[2]', '$userData[3]', '0', '0', '0', '2016'), ";
			}

			
		} else {
			$unexpectedUserString .= "$user, ";
		}
		//keep track of any users not added

	}

	echo "Unexpected Users: " . $unexpectedUserString;

	//remove extra characters
	$insertMasterString = chop($insertMasterString, ", ");
	$insertUserString = chop($insertUserString, ", ");

	//insert users into master list
	//use ignore so you don't have duplicates
	$insertMasterQuery = "INSERT IGNORE INTO Master (uID, class) VALUES $insertMasterString";
	$insertMasterStmt = $db->query($insertMasterQuery);

	//insert users into user list
	// use ignore so you don't have duplicates
	$insertUserQuery = "INSERT IGNORE INTO User (uID, firstName, lastName, class, defaultHrs, addHrs, usedHrs, academicYr) VALUES $insertUserString";
	$insertUserStmt = $db->query($insertUserQuery);


	//need to add default hours in user table?

	
	
	// return if insert was successful or not
	
?>

