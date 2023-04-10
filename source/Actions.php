<?php
require "include/Includes.php";

try {
  // JSON header
  header("Content-Type: application/json");

  $requests = new Requests();
  $response = $requests->route($_REQUEST['action']);

  echo json_encode($response);
} catch(Throwable $e) {
  // Internal server error
  http_response_code($e->getCode() ?: 500);
  echo json_encode(["message" => $e->getMessage() ?: "Not Implemented"]);
}
