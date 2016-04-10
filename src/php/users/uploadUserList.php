<?php

	include("../connection.php");
	require_once("../util.php");

	//Get parameters from frontend
	$department = htmlspecialchars($_POST['department']);

	// ensure user type is either Student, Faculty, or Admin
	function checkClass($str) {
		// TODO: trim and lowercase string?
		// $str = strtolower(trim($str));
		$val = strcmp($str, 'Student') == 0;
		$val |= strcmp($str, 'Faculty') == 0;
		$val |= strcmp($str, 'Admin') == 0;
		return $val;
	}

	// get user info from table
	function getCurUserInfo($db, $netid) {
		$userInfoQuery = "SELECT firstName, lastName, class FROM User WHERE uID = ?";
		$userInfoStmt = $db->prepare($userInfoQuery);
		$userInfoStmt->execute(array($netid));
		return $userInfoStmt->fetch(PDO::FETCH_ASSOC);
	}

	function potentiallyUpdateUserInfo($db, $netid, $userData, $curUserInfo){
		if (strcmp($userData[1], $curUserInfo['firstName']) != 0
			|| strcmp($userData[2], $curUserInfo['lastName']) != 0
			|| strcmp($userData[3], $curUserInfo['class']) != 0) {
				//update user info
				$updateInfoQuery = "UPDATE User SET firstName = ?, lastName = ?, class = ? WHERE uID = ?";
				$updateInfoStmt = $db->prepare($updateInfoQuery);
				$updateInfoStmt->execute(array($userData[1], $userData[2], $userData[3], $netid));
		}
	}
	
	// reads in file and stores contents in $contents
	// each element has format <email>,<firstName>,<lastName>,<type>
	// <type> = "Student" | "Faculty" | "Admin"
	require '../uploadFile.php';
	$fileLines = processFile();

	if (!$fileLines) {
		//error occured with file upload
		http_response_code(400); //Bad request
		die();
	}

	$defaultHrs = getDepartmentDefaultWeeklyHours($db, $department);

	try {
		$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$db->beginTransaction();

		//drop entries in master list that are from the department
		$dropMasterQuery = "DELETE FROM Master WHERE department= ?"; 
		$dropMasterStmt = $db->prepare($dropMasterQuery);
		$dropMasterStmt->execute(array($department));

		$insertMasterString = "";
		$insertUserString = "";
		$badFormatUsers = [];
		$badClassUsers = [];
		$badEmailUsers = [];

		//Arrays to hold query values
		$insertMasterArray = array();
		$insertUserArray = array();

		//process each user
		foreach ($fileLines as $user) { 
			$userData = explode(",", $user); 
			// userData should have format <netid@queensu.ca>,<firstName>,<lastName>,<type>
			
			if (4 == sizeof($userData)) {
				// userData has expected number of elements
				if (checkClass($userData[3])) {
					// type is expected format; "Student" | "Faculty" | "Admin"

					// TODO: check length and format of elements
					$netid = getNetId($userData[0]);
					if ($netid) { //$netid != false
						// ('id', 'department')
						$insertMasterString .= "(?, ?), ";
						array_push($insertMasterArray, $netid, $department);

						$curUserInfo = getCurUserInfo($db, $netid);
						// check if user is already in User table. If they are, update their personal info if it's different
						// if they are not in the User table, add them.
						if (empty($curUserInfo)) {
							//user not in User table, add them to user table
							//('uID', 'firstName', 'lastName', 'class', 'curWeekHrs', 'nextWeekHrs', 'thirdWeekHrs', 'hasBookingDurationRestriction')
							$insertUserString .= "(?, ?, ?, ?, ?, ?, ?, ?), ";
							array_push($insertUserArray, $netid, $userData[1], $userData[2], $userData[3], $defaultHrs, $defaultHrs, $defaultHrs, 'Yes');
							// get class, etc
						} else {
							potentiallyUpdateUserInfo($db, $netid, $userData, $curUserInfo);
						}

					} else {
						$badEmailUsers[] = $user;
					}

				} else {
					$badClassUsers[] = $user;
				}
				
			} else {
				$badFormatUsers[] = $user;
			}
		}

		//remove extra characters
		$insertMasterString = chop($insertMasterString, ", ");
		$insertUserString = chop($insertUserString, ", ");

		/* update DB */

		//insert users into master list
		//use ignore so you don't have duplicates
		if (!empty($insertMasterArray)) {
			$insertMasterQuery = "INSERT IGNORE INTO Master (uID, department) VALUES $insertMasterString";
			$insertMasterStmt = $db->prepare($insertMasterQuery);
			$insertMasterStmt->execute($insertMasterArray);
		}	

		//insert users into user list
		//use ignore so you don't have duplicates
		if (!empty($insertUserString)) {
			$insertUserQuery = "INSERT IGNORE INTO User (uID, firstName, lastName, class, curWeekHrs, nextWeekHrs, thirdWeekHrs, hasBookingDurationRestriction) VALUES $insertUserString";
			$insertUserStmt = $db->prepare($insertUserQuery);
			$insertUserStmt->execute($insertUserArray);
		}

		//Remove deleted users (no longer in master) from user table
		$deleteUserQuery = "DELETE FROM User WHERE uID NOT IN (SELECT uID FROM Master)";
		$deleteUserStmt = $db->query($deleteUserQuery);
		
		//Remove deleted users from groups as well
		$deleteGroupQuery = "DELETE FROM Permission WHERE uID NOT IN (SELECT uID FROM Master)";
		$deleteGroupStmt = $db->query($deleteGroupQuery);

		//Remove future bookings of deleted users.
		// Only remove bookings after today. Keep others for archival purposes.
		// TODO: check current time and delete bookings later today as well.
		$startDay = new DateTime();
		$todayDate = date_format(new DateTime(), "Y-m-d"); 
		$selectBookingsQuery = "SELECT DISTINCT Bookings.bookingID FROM Bookings JOIN BookingSlots ON BookingSlots.bookingID = Bookings.bookingID
			WHERE bookingDate > '$todayDate' AND uID NOT IN (SELECT uID FROM Master) ";
		$selectBookingsStmt = $db->query($selectBookingsQuery);
		$bookingIDs = $selectBookingsStmt->fetchAll(PDO::FETCH_COLUMN, 0);
		if (!empty($bookingIDs)) {
			$arrayStr = implode(",", $bookingIDs);
			$deleteSlotsQuery = "DELETE FROM BookingSlots WHERE bookingID IN ($arrayStr)";
			$deleteSlotsStmt = $db->query($deleteSlotsQuery);
			$deleteBookingsQuery = "DELETE FROM Bookings WHERE bookingID IN ($arrayStr)";
			$deleteBookingsSlot = $db->query($deleteBookingsQuery);
		}
		$db->commit();
		
		$result = array();
		$result["numUsersInDept"] = sizeof($insertMasterArray) > 0 ? $insertMasterStmt->rowCount() : "Unchanged"; // num users now in department
		$result["numUsersDeleted"] = $deleteUserStmt->rowCount();
		$result["badFormatUsers"] = $badFormatUsers; 
		$result["badClassUsers"] = $badClassUsers;
		$result["badEmailUsers"] = $badEmailUsers;
		
		//Close the connection
		$db = NULL;

		//Convert to json
		$json = json_encode($result);
		// echo the json string
		echo $json;
	} catch (Exception $e) { 
		http_response_code(500); //Internal Server Error
	    if (isset ($db)) {
	       $db->rollback ();
	       echo "Error:  Something went wrong with uploading the user list."; 
	    }
	    //Close the connection
		$db = NULL;
	}
?>

