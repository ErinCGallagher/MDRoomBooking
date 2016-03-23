<?php
    //development environment
    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "mdroombooking";

    $db = new PDO('mysql:host=' . $host . ';dbname=' . $database . ';charset=utf8',  $user, $password);

    $sth = $db->prepare("INSERT INTO UGroups (groupName, addHrsType, hours) VALUE ('Heyy', 'week', 10)");
    $sth->execute(array());

    $db = NULL;

?>
