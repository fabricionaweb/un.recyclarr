<?php
require "include/Setup.php";

// JSON header
header("Content-Type: application/json");

try {
  // If not post and xhr request
  if (!isset($_POST["schedule"]) || !isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
    throw new Error("Not Implemented");
  }

  // Try to interpolate if possible, otherwise will be null
  $schedule = @constant("Schedule::".$_POST["schedule"]);
  $custom   = $schedule === Schedule::CUSTOM ? trim($_POST["custom"]) : null;

  // Validate custom cron
  if (isset($custom) && !preg_match(Plugin::CRON_REGEX, $custom, $matches)) {
    throw new Error("Invalid custom cron");
  }

  // Save with expression or enum
  Settings::saveSchedule(trim($matches[1]) ?: $schedule);

  echo json_encode(["message" => "Saved"]);
} catch(Throwable $e) {
  // Internal server error
  http_response_code(500);

  echo json_encode(["message" => $e->getMessage()]);
}
