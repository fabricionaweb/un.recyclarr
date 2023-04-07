<?php
require "include/Setup.php";

class Requests {
  private $schedule;
  private $custom;
  private $fileName;

  function __construct() {
    $this->schedule = $this->handleScheduleEnum($_POST["schedule"]);
    $this->custom   = $this->handleCustomCron($_POST["custom"]);
    $this->fileName = $this->handleFileName($_REQUEST["fileName"]);
    $this->contents = $_POST["contents"];
  }

  private function handleScheduleEnum($schedule) {
    // Try to interpolate, if not possible become null - which means disable
    return @constant("Schedule::".$schedule);
  }

  private function handleCustomCron($custom) {
    return $this->schedule === Schedule::CUSTOM ? trim($custom) : null;
  }

  private function handleFileName($fileName) {
    // If secrets
    if ($fileName === "secrets") {
      return "../secrets.yml";
    }

    // Extract the proper filename
    return pathinfo($fileName, PATHINFO_FILENAME).".yml";
  }

  public function route($action) {
    // Only accept XHR requests
    if (!isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
      throw new Error();
    }

    switch($action) {
      case 'update-cron' :
        return $this->updateCron();
      default :
        throw new Error();
    }
  }

  private function updateCron() {
    // Mandatory field
    if (empty($this->schedule)) {
      throw new Error();
    }

    // Validate custom cron
    if (!empty($this->custom) && !preg_match(Plugin::CRON_REGEX, $this->custom, $matches)) {
      // Not Acceptable
      throw new Error("Invalid cron", 406);
    }

    // Save with custom expression or enum
    Settings::saveSchedule(trim($matches[1]) ?: $this->schedule);
    return ["message" => "Saved"];
  }
}

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