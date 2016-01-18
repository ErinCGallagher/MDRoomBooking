<?php

	$uploadOk = 1;
	// $_FILES is a global variable that gets the files from HTTP POST
	$fileType = pathinfo($_FILES["fileToUpload"]["name"],PATHINFO_EXTENSION);
	
	// Check file size
	if ($_FILES["fileToUpload"]["size"] > 500000) {
	    echo "Sorry, your file is too large.";
	    $uploadOk = 0;
	}
	// Check file format
	if($fileType != "csv") {
	    echo "File must be a .csv file.";
	    $uploadOk = 0;
	}

	// Check that we are processig the correct file (not being hacked)
	if (!is_uploaded_file(realpath($_FILES['fileToUpload']['tmp_name']))) {
    	echo "Not processing expected file.";
	    $uploadOk = 0;
    }

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    echo "Sorry, your file was not uploaded.";
	// if everything is ok, read in file to $contents
	} else {
         $contents = str_getcsv(file_get_contents($_FILES["fileToUpload"]["tmp_name"]));
	}
?>
