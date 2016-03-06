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

?>