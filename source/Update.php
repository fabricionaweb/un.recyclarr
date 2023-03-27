<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  // If not valid post and xhr
  if (!isset($_POST["schedule"]) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  Settings::saveSchedule(@constant("Schedule::".$_POST["schedule"]));

  echo json_encode(array("message" => "Saved"));
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(array("message" => $e->getMessage()));
}
