<?php
	require_once('../connection.php');
	require_once('../util.php');

	//Get parameters from frontend
	$department = htmlspecialchars($_POST['department']);


	createUsersFile($db, $department);
	downloadFile($department);

	//Close the connection
	$db = NULL;

	function createUsersFile ($db, $department){ 
		
		//Get info from database
	   	$getUsersQuery = "SELECT User.uID, firstName, lastName, class FROM User JOIN Master ON User.UID = Master.uID WHERE department = ? ORDER BY class DESC, lastName";

	   	$getUsersStmt = $db->prepare($getUsersQuery);
	   	$getUsersStmt->execute(array($department));

		$fileText = "";

		while ($row = $getUsersStmt->fetch(PDO::FETCH_ASSOC)) {
			$row["uID"].="@queensu.ca"; //turn netid into email address
			$fileText.= implode(",", $row)."\n";
		}
		
		$myfile = fopen('../../../user_list_'.$department.'.csv', "w");
		fwrite($myfile, $fileText);
		fclose($myfile); 
	}

	function downloadFile($department) {
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
		header("Content-type: application/octet-stream"); 
		header("Content-Disposition: attachment; filename=\"user_list_".$department.".csv\"");
		header("Content-Length: ".filesize('../../../user_list_'.$department.'.csv'));

		readfile('../../../user_list_'.$department.'.csv');
	}

?>
