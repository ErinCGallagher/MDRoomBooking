<?php

	require_once("../connection.php");
	require_once("../util.php");

	//set default time to UTC so it does not count daylight savings
  	//do not remove!
	date_default_timezone_set('UTC');

	

	updateUIDsForPrevSemester($db);


	
	function getToday() { //for testing purposes
		return new DateTime(); //today
		// return new DateTime('2015-05-30'); //for testing
	}

	function getPrevSemesterDates() {
		$startWinter = "01-01";
		$endWinter = "04-30";
		$startSummer = "05-01";
		$endSummer = "08-31";
		$startFall = "09-01";
		$endFall = "12-31";

		$today = getToday();
		$todayDate = date_format($today, "m-d");
		$year = date_format($today, "Y");

		if ($todayDate >= $startWinter && $todayDate <= $endWinter) {
			//we're in Winter semester, update last Fall
			$startDate = ($year-1)."-".$startFall;
			$endDate = ($year-1)."-".$endFall;
		} else if ($todayDate >= $startSummer && $todayDate <= $endSummer) {
			//we're in Summer semester, update Winter
			$startDate = $year."-".$startWinter;
			$endDate = $year."-".$endWinter;
		} else {
			//we're in Fall semester, update Summer
			$startDate = $year."-".$startWinter;
			$endDate = $year."-".$endWinter;
		}
		return array("start" => $startDate,"end" => $endDate);
	}

	function updateUIDsForPrevSemester ($db) {
		$datesArr = getPrevSemesterDates();
		$startDate = $datesArr["start"];
		$endDate = $datesArr["end"];

		try {
			$db->setAttribute (PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$db->beginTransaction();
			// echo 

			$updateBookingIdsQuery = "UPDATE Bookings JOIN BookingSlots ON Bookings.bookingID = BookingSlots.bookingID
								SET uID = CASE hrsSource
									WHEN 'Admin' THEN 'Admin'
									WHEN 'Faculty' THEN 'Faculty'
									WHEN 'Weekly' THEN 'Student'
									WHEN 'Special' THEN 'Student'
								END
								WHERE bookingDate >= '$startDate' AND bookingDate <= '$endDate'";
			runQuery($db, $updateBookingIdsQuery, []);
			
			$checkQuery = "SELECT BookingSlots.bookingID, bookingDate, uID, hrsSource 
				FROM Bookings JOIN BookingSlots ON Bookings.bookingID = BookingSlots.bookingID 
				ORDER BY BookingSlots.bookingID";
			$checkQueryStmt = runQuery($db, $checkQuery, []);
			$outputArray = $checkQueryStmt->fetchAll(PDO::FETCH_ASSOC);
			if (sizeof($outputArray) > 0 ) {
				foreach ($outputArray as $rows){
					print_r($rows);
					echo "<br>";
				}	
			} else {
				echo "<br>There are no bookings or booking slots in the database.<br>";
			}
			
			$db->commit();

		} catch (Exception $e) { 
			http_response_code(500); //Internal Server Error
		    if (isset ($db)) {
		       $db->rollback ();
		       echo "Error:  " . $e; 
		    }
		}
	}

?>
