<?php
session_start();

$data = json_decode(file_get_contents("php://input"));

$class = $data->userPermision;

$_SESSION["class"] = $class;
$response = $_SESSION["class"];

echo $response;
?>