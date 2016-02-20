<?php

	function runQuery ($db, $query, $inputArr) {
		$stmt = $db->prepare($query);
		$stmt->execute($inputArr);
		return $stmt;
	}

?>
</body>