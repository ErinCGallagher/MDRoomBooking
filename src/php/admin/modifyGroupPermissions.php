<?php

	include('../connection.php');
	require_once("groupFunctions.php");

	//Get post data stream 
	$data = json_decode(file_get_contents("php://input"));
	//Get parameters from 
	$groupName = $data->groupName; 
	$fall = $data->fall;
	$winter = $data->winter;
	$summer = $data->summer;
	$hours1 = $data->hours; 
	$addHrsType = $data->addHrsType;
	$startDate = $data->startDate;
	$endDate = $data->endDate;
	$groupID = $data->groupID;
	$hasBookingDurationRestriction = $data->hasBookingDurationRestriction;

	
	if ($addHrsType == "1") {
		$addHrsType = "week";
	}
	else {
		$addHrsType = "special";
	}
	
	$month = date('m');
	
	if ($month >= '09' && $month <= '12') { // It's currently the fall term
	
		$currYear = date('Y');
		$nextYear = date('Y')+1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $nextYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $nextYear . "-09-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $nextYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $nextYear . "-01-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $nextYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}		
	
	}
	else if ($month >= '01' && $month <= '04') { //It's the winter term
		
		$currYear = date('Y');
		$prevYear = date('Y')-1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate =  $currYear . "-09-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $prevYear . "-09-01";
			$endDate = $currYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $currYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}	
	
	}
	else { //It's summer
	
		$currYear = date('Y');
		$nextYear = date('Y')+1;
		$prevYear = date('Y')-1;
		
		if ($fall == "YES" && $winter == "YES" && $summer == "YES") {
			$startDate = $prevYear . "-09-01";
			$endDate =  $currYear . "-08-31";
		}
		else if ($fall == "YES" && $winter == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($winter == "YES" && $summer == "YES") {
			$startDate = $currYear . "-01-01";
			$endDate = $currYear . "-08-31";
		}
		else if ($fall == "YES") {
			$startDate = $currYear . "-09-01";
			$endDate = $currYear . "-12-31";
		}
		else if ($winter == "YES") {
			$startDate = $nextYear . "-01-01";
			$endDate = $nextYear . "-04-30";
		}
		else if ($summer == "YES") {
			$startDate = $currYear . "-05-01";
			$endDate = $currYear . "-08-31";
		}
		else {
		$startDate = substr($startDate, 0, 10);
		$endDate = substr($endDate, 0, 10);
		}	
	}
	
	function bookingRestrictionChange($user, $db) {

		global $hasBookingDurationRestriction;
			/*
			$rest = "SELECT hasBookingDurationRestriction FROM UGroups JOIN Permission ON UGroups.groupID = Permission.groupID AND uID = ? AND hasBookingDurationRestriction = 'Yes'";
			$stmt = $db->prepare($rest);
			$stmt->execute(array($user));
			//$spec = $stmt->fetchAll();
	
			if ($stmt->rowCount() > 0) {
				$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'Yes' WHERE uID = ?";
				$restUpdateStmt = $db->prepare($restUpdateQuery);
				$restUpdateStmt->execute(array($user));
			}
			else {
				$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = 'No' WHERE uID = ?";
				$restUpdateStmt = $db->prepare($restUpdateQuery);
				$restUpdateStmt->execute(array($user));
			}
			*/

			$restUpdateQuery = "UPDATE User SET hasBookingDurationRestriction = ? WHERE uID = ?";
				$restUpdateStmt = $db->prepare($restUpdateQuery);
				$restUpdateStmt->execute(array($hasBookingDurationRestriction,$user));

			
	}
	//Save the old group info
	$oldGroupInfo = getGroupInfo($db, $groupID);
	
	
	//try {
	//	$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	//	$db->beginTransaction();
	
	
	//update group
	$sth2 = $db->prepare("UPDATE UGroups SET groupName = ?, addHrsType = ?,  hasBookingDurationRestriction = ?, hours = ?, startDate = ?, endDate = ? WHERE groupID = ?");
	$sth2->execute(array($groupName, $addHrsType, $hasBookingDurationRestriction, $hours1, $startDate, $endDate, $groupID));
	
	$groupInfo = getGroupInfo($db, $groupID);

	$specialHrs = 0;
	if (strcmp($groupInfo['addHrsType'], "special") == 0) {
		$specialHrs =  $groupInfo['hours'];
	}	
	
	//Select users who are in the group
	$sth3 = $db->prepare("SELECT uID FROM Permission WHERE groupID = ?");
	$sth3->execute(array($groupID));
	$users = $sth3->fetchAll();
	
	if ((strcmp($groupInfo['addHrsType'], "special") == 0) && (strcmp($oldGroupInfo['addHrsType'], "special") == 0)) {
		
		if (strcmp($groupInfo['hours'], $oldGroupInfo['hours']) == 0) {
		foreach ($users as $user) {

			$tempUse = $user['uID'];
			bookingRestrictionChange($tempUse, $db);
			$diff = (($groupInfo['hours']) - ($oldGroupInfo['hours']));
			$newHrs = "SELECT specialHrs FROM Permission WHERE uID = ? AND groupID = ?";
			$stmt = $db->prepare($newHrs);
			$stmt->execute(array($tempUse, $groupID));
			$spec = $stmt->fetchAll();
			$tempHrs = $spec[0]['specialHrs'];
			
			$newHours = $tempHrs + $diff;
			if ($newHours < 0) {
				$newHours = 0;	
			}
			$insertQuery = "UPDATE Permission SET specialHrs = ? WHERE uID = ? AND groupID = ?";
			$insertStmt = $db->prepare($insertQuery);
			$insertStmt->execute(array($newHours, $tempUse, $groupID));	
		}
		}
	}
	else if ((strcmp($groupInfo['addHrsType'], "week") == 0) && (strcmp($oldGroupInfo['addHrsType'], "week") == 0)) {
	
			if (strcmp($groupInfo['hours'], $oldGroupInfo['hours']) == 0) {
			foreach ($users as $user) {
				
				// user is already in group, continue with addition
				$tempUse = $user['uID'];
				bookingRestrictionChange($tempUse, $db);
				$weekHours =  (($groupInfo['hours']) - ($oldGroupInfo['hours']));
				
				//update user table with current active weekly hours
				if(groupHasCurWeekHours($groupInfo)) {
					
					$oldHrs = "SELECT curWeekHrs FROM User WHERE uID = ?";
					$stmtA = $db->prepare($oldHrs);
					$stmtA->execute(array($tempUse));
					$weeks = $stmtA->fetchAll();
					//	echo $week[0];
					$tempHrs = $weeks[0]['curWeekHrs'];
				
					$newHrs = $tempHrs + $weekHours;
					if ($newHrs < 0) {
						$newHrs = 0;
					}
					$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = ? WHERE uID = ?";
					$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
					$curWeekUpdateStmt->execute(array($newHrs, $tempUse));
				}
				if(groupHasNextWeekHours($groupInfo)) {
					$oldHrs = "SELECT nextWeekHrs FROM User WHERE uID = ?";
					$stmtA = $db->prepare($oldHrs);
					$stmtA->execute(array($tempUse));
					$weeks = $stmtA->fetchAll();
					//	echo $week[0];
					$tempHrs = $weeks[0]['nextWeekHrs'];
				
					$newHrs = $tempHrs + $weekHours;
					if ($newHrs < 0) {
						$newHrs = 0;
					}
					$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = ? WHERE uID = ?";
					$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
					$nextWeekUpdateStmt->execute(array($newHrs, $tempUse));
				}
				//update user table with active weekly hours for next week
				if(groupHasThirdWeekHours($groupInfo)) {
					$oldHrs = "SELECT thirdWeekHrs FROM User WHERE uID = ?";
					$stmtA = $db->prepare($oldHrs);
					$stmtA->execute(array($tempUse));
					$weeks = $stmtA->fetchAll();
					//	echo $week[0];
					$tempHrs = $weeks[0]['thirdWeekHrs'];
				
					$newHrs = $tempHrs + $weekHours;
					if ($newHrs < 0) {
						$newHrs = 0;
					}
					$thirdWeekUpdateQuery = "UPDATE User SET thirdWeekHrs = ? WHERE uID = ?";
					$thirdWeekUpdateStmt = $db->prepare($thirdWeekUpdateQuery);
					$thirdWeekUpdateStmt->execute(array($newHrs, $tempUse));
				}

			}
			}
		}
	
		else if ((strcmp($groupInfo['addHrsType'], "special") == 0) && (strcmp($oldGroupInfo['addHrsType'], "week") == 0)) {
					//take away all week hours 
				foreach ($users as $user) {
					
					$tempUse = $user['uID'];
					bookingRestrictionChange($tempUse, $db);
					$old = ($oldGroupInfo['hours'] + 0);			
					//update user table with current active weekly hours
					if(groupHasCurWeekHours($oldGroupInfo)) {
					
						$oldHrs = "SELECT curWeekHrs FROM User WHERE uID = ?";
						$stmtA = $db->prepare($oldHrs);
						$stmtA->execute(array($tempUse));
						$weeks = $stmtA->fetchAll();
						//	echo $week[0];
						$tempHrs = $weeks[0]['curWeekHrs'];
						$newHrs = $tempHrs - $old;
						if ($newHrs < 0) {
							$newHrs = 0;
						}
						$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = ? WHERE uID = ?";
						$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
						$curWeekUpdateStmt->execute(array($newHrs, $tempUse));
					}
					if(groupHasNextWeekHours($oldGroupInfo)) {
						$oldHrs = "SELECT nextWeekHrs FROM User WHERE uID = ?";
						$stmtA = $db->prepare($oldHrs);
						$stmtA->execute(array($tempUse));
						$weeks = $stmtA->fetchAll();
						//	echo $week[0];
						$tempHrs = $weeks[0]['nextWeekHrs'];
				
						$newHrs = $tempHrs - $old;
						if ($newHrs < 0) {
							$newHrs = 0;
						}
						$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = ? WHERE uID = ?";
						$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
						$nextWeekUpdateStmt->execute(array($newHrs, $tempUse));
					}
					//update user table with active weekly hours for next week
					if(groupHasThirdWeekHours($oldGroupInfo)) {
						$oldHrs = "SELECT thirdWeekHrs FROM User WHERE uID = ?";
						$stmtA = $db->prepare($oldHrs);
						$stmtA->execute(array($tempUse));
						$weeks = $stmtA->fetchAll();
						//	echo $week[0];
						$tempHrs = $weeks[0]['thirdWeekHrs'];
					
						$newHrs = $tempHrs - $old;
						if ($newHrs < 0) {
							$newHrs = 0;
						}
						$thirdWeekUpdateQuery = "UPDATE User SET thirdWeekHrs = ? WHERE uID = ?";
						$thirdWeekUpdateStmt = $db->prepare($thirdWeekUpdateQuery);
						$thirdWeekUpdateStmt->execute(array($newHrs, $tempUse));
					}
				
					//Add special hours
					
					$newHours = $groupInfo['hours'];
					$insertQuery = "UPDATE Permission SET specialHrs = ? WHERE uID = ? AND groupID = ?";
					$insertStmt = $db->prepare($insertQuery);
					$insertStmt->execute(array($newHours, $tempUse, $groupID));	
				
				}			
				
			}
			else if ((strcmp($groupInfo['addHrsType'], "week") == 0) && (strcmp($oldGroupInfo['addHrsType'], "special") == 0)) {
					//remove special hours 
					foreach ($users as $user) {

						$tempUse = $user['uID'];
						bookingRestrictionChange($tempUse, $db);
						$insertQuery = "UPDATE Permission SET specialHrs = 0 WHERE uID = ? AND groupID = ?";
						$insertStmt = $db->prepare($insertQuery);
						$insertStmt->execute(array($tempUse, $groupID));		
					
						//Add week hours 
						$newHrs = ($groupInfo['hours'] + 0);			
						//update user table with current active weekly hours
						if(groupHasCurWeekHours($groupInfo)) {
							$curWeekUpdateQuery = "UPDATE User SET curWeekHrs = curWeekHrs + ? WHERE uID = ?";
							$curWeekUpdateStmt = $db->prepare($curWeekUpdateQuery);
							$curWeekUpdateStmt->execute(array($newHrs, $tempUse));
						}
						if(groupHasNextWeekHours($groupInfo)) {
							$nextWeekUpdateQuery = "UPDATE User SET nextWeekHrs = nextWeekHrs + ? WHERE uID = ?";
							$nextWeekUpdateStmt = $db->prepare($nextWeekUpdateQuery);
							$nextWeekUpdateStmt->execute(array($newHrs, $tempUse));
						}
						//update user table with active weekly hours for next week
						if(groupHasThirdWeekHours($groupInfo)) {
							$thirdWeekUpdateQuery = "UPDATE User SET thirdWeekHrs = thirdWeekHrs + ? WHERE uID = ?";
							$thirdWeekUpdateStmt = $db->prepare($thirdWeekUpdateQuery);
							$thirdWeekUpdateStmt->execute(array($newHrs, $tempUse));
						}	
					}
				}
	
	//Close the connection
	$db = NULL;

 	//Return GroupID to front end
	echo $groupID;
	
	//	} catch (Exception $e) { 
	//	http_response_code(500); //Internal Server Error
	  //  if (isset ($db)) {
	    //   $db->rollback ();
	      // echo "Error:  " . $e; 
	   // }
//	}

   

?>

