<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  $fileName = $_POST["fileName"];

  // If not post and xhr request
  if (empty($fileName) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // Extract the filename and fix extension
  $fileName = pathinfo($fileName, PATHINFO_FILENAME).".yml";

  // Check if exists
  if (!in_array($fileName, $settings->files)) {
    // Not Found
    http_response_code(404);

    echo json_encode(["message" => "File does not exists"]);
    exit();
  }

  // Create the file
  Settings::deleteConfigFile($fileName);

  echo json_encode(["message" => "Deleted", "fileName" => $fileName]);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
