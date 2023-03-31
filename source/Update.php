<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  $schedule = $_POST["schedule"];

  // If not post and xhr request
  if (!isset($schedule) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // Try to interpolate if possible, otherwise will be null
  $schedule = @constant("Schedule::".$schedule);
  $custom   = $schedule === Schedule::CUSTOM ? trim($_POST["custom"]) : null;

  // Validate custom cron
  if (isset($custom) && !preg_match(Plugin::CRON_REGEX, $custom, $matches)) {
    // Not Acceptable
    http_response_code(406);

    echo json_encode(["message" => "Invalid cron"]);
    exit();
  }

  // Save with expression or enum
  Settings::saveSchedule(trim($matches[1]) ?: $schedule);

  echo json_encode(["message" => "Saved"]);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
