<?php

	function runQuery ($db, $query, $inputArr) {
		$stmt = $db->prepare($query);
		$stmt->execute($inputArr);
		return $stmt;
	}

	function getDepartmentDefaultWeeklyHours ($db, $department) {
		if ('Music' == $department) {
			return 5;
		} else { // Drama
			return 0;
		}
	}

	// get netid from queen's email
	function getNetId($email) {
		$netid = false;

		$email = strtolower(trim($email));
		$isQueensEmail = strlen($email) > 12 && strcmp('@queensu.ca', substr($email, -11)) == 0; //$email is a queen's email
		if ($isQueensEmail) {
			$netid = substr_replace($email, '', -11);
		}
		return $netid;
	}

?>