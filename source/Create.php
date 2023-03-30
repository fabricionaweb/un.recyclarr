<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  // If not post and xhr request
  if (!isset($_POST["filename"]) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // Extract the filename and fix extension
  $filename = pathinfo($_POST["filename"], PATHINFO_FILENAME).".yml";

  // Check if exists
  if (in_array($filename, $settings->files)) {
    // Conflict
    http_response_code(409);

    echo json_encode(["message" => "This file name already exists"]);
    exit();
  }

  // Create the file
  Settings::createConfigFile($filename);

  echo json_encode(["message" => "Created", "filename" => $filename]);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
