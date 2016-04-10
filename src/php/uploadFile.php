<?php

	function processFile(){
		$uploadOk = 1;
		// $_FILES is a global variable that gets the files from HTTP POST
		$fileType = pathinfo($_FILES["fileToUpload"]["name"],PATHINFO_EXTENSION);
		
		// Check file size
		if ($_FILES["fileToUpload"]["size"] > 500000) {
		    echo "Error: Uploaded file is too large.";
		    $uploadOk = 0;
		}
		// Check file format
		if($fileType != "csv") {
		    echo "Error: File must be a .csv file.";
		    $uploadOk = 0;
		}

		// Check that we are processig the correct file (not being hacked)
		if (!is_uploaded_file(realpath($_FILES['fileToUpload']['tmp_name']))) {
	    	echo "Error: No file uploaded.";
		    $uploadOk = 0;
	    }

		// Check if $uploadOk is set to 0 by an error
		if ($uploadOk == 0) {
		    http_response_code(500);
		    return false;
			// die( "Error: File could not be uploaded."); // TODO: Check if this is the best way to handle error.
		// if everything is ok, read in file to $contents
		} else {
			// return an array with an element for each line of the file (newlines removed)
	    	return file($_FILES["fileToUpload"]["tmp_name"], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		}
	}
	
?>
