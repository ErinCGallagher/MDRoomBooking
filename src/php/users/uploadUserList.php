<?php

	//include uploadFile.php ...

	$host = "localhost";
	$user = "root";
	$password = "";
	$database = "mdroombooking";

	$db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  'root', '');
	
	//Get parameters from frontend
	$department = json_decode($_POST['department']);

	// ensure user type is either Student, Faculty, or Admin
	function checkClass($str) {
		// TODO: trim and lowercase string
		$val = strcmp($str, 'Student') == 0;
		$val |= strcmp($str, 'Faculty') == 0;
		$val |= strcmp($str, 'Admin') == 0;
		return $val;
	}
	
	// reads in file and stores contents in $contents
	// each element has format <id>,<firstName>,<lastName>,<type>
	// <type> = "Student" | "Faculty" | "Admin"
	require '../uploadFile.php';

	if ('Music' == $department) {
		$defaultHrs = 5;
	} else {
		$defaultHrs = 0;
	}

	//drop entries in master list that are from the department
	$dropMasterQuery = "DELETE FROM Master WHERE department='$department'"; 
	$dropMasterStmt = $db->query($dropMasterQuery);

	$insertMasterString = "";
	$insertUserString = "";
	$badFormatUserString = "";
	$badClassUserString = "";
	//process each user
	
	foreach ($contents as $user) { //$contents is from uploadFile.php
		$userData = explode(",", $user); 
		// userData should have format <id>,<firstName>,<lastName>,<type>
		
		if (4 == sizeof($userData)) {
			// userData has expected number of elements
			if (checkClass($userData[3])) {
				// type is expected format; "Student" | "Faculty" | "Admin"

				// TODO: check length and format of elements

				// ('id', 'department')
				$insertMasterString .= "('$userData[0]', '$department'), ";
				//('uID', 'firstName', 'lastName', 'class', 'curWeekHrs', 'nextWeekHrs')
				$insertUserString .= "('$userData[0]', '$userData[1]', '$userData[2]', '$userData[3]', '$defaultHrs', '$defaultHrs'), ";
			} else {
				$badClassUserString .= "$user, ";
			}
			
		} else {
			$badFormatUserString .= "$user, ";
		}
		//keep track of any users not added

	}

	//remove extra characters
	$insertMasterString = chop($insertMasterString, ", ");
	$insertUserString = chop($insertUserString, ", ");

	//insert users into master list
	//use ignore so you don't have duplicates
	$insertMasterQuery = "INSERT IGNORE INTO Master (uID, department) VALUES $insertMasterString";
	$insertMasterStmt = $db->query($insertMasterQuery);

	//insert users into user list
	//use ignore so you don't have duplicates
	//TODO: check if user should have default hours from music 
	$insertUserQuery = "INSERT IGNORE INTO User (uID, firstName, lastName, class, curWeekHrs, nextWeekHrs) VALUES $insertUserString";
	$insertUserStmt = $db->query($insertUserQuery);

	//Remove deleted users (no longer in master) from user table
	$deleteUserQuery = "DELETE FROM User WHERE uID NOT IN (SELECT uID FROM Master)";
	$deleteUserStmt = $db->query($deleteUserQuery);
	

	//Remove deleted users from groups as well
	$deleteGroupQuery = "DELETE FROM Permission WHERE uID NOT IN (SELECT uID FROM Master)";
	$deleteGroupStmt = $db->query($deleteGroupQuery);


	//TODO: return if insert was successful or not
	$result = "";
	if (!empty($badFormatUserString)){
		$result .= "The following users were not added because of unexpected format: ";
		$result .= $badFormatUserString;
	}
	if (!empty($badClassUserString)){
		$result .= "The following users were not added because of unexpected type: ";
		$result .= $badClassUserString;
	}

	//Convert to json
	//$json = json_encode($result);
	// echo the json string
	echo $result;
?>

