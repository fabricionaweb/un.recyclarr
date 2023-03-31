<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  // If not post and xhr request
  if (!isset($_GET["fileName"]) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // Extract the filename and fix extension
  $fileName = pathinfo($_GET["fileName"], PATHINFO_FILENAME).".yml";

  // Check if exists
  if (!in_array($fileName, $settings->files)) {
    // Not Found
    http_response_code(404);

    echo json_encode(["message" => "File does not exists"]);
    exit();
  }

  // Return the file
  header("Content-Type: application/x-yaml");

  echo Settings::getConfigContents($fileName);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
