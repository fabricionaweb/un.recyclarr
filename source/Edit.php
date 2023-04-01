<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  $fileName = $_POST["fileName"];
  $contents = $_POST["contents"];

  // If not post and xhr request
  if (!isset($fileName) || !isset($contents) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // If is the secrets
  if ($fileName === "secrets") {
    $fileName = "../secrets.yml";
  } else {
    // Fix file extension
    $fileName = pathinfo($fileName, PATHINFO_FILENAME).".yml";

    // Check if exists in configs folder
    if (!in_array($fileName, $settings->files)) {
      // Not Found
      http_response_code(404);

      echo json_encode(["message" => "File does not exists"]);
      exit();
    }
  }

  // Save the file
  Settings::saveConfigContents($fileName, $contents);

  echo json_encode(["message" => "Saved", "fileName" => $fileName]);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
