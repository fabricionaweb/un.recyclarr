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
    if (!empty($action) && isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
      switch($action) {
        case 'update-cron'   : return $this->updateCron();
        case 'view-config'   : return $this->viewConfig();
        case 'create-config' : return $this->createConfig();
        case 'update-config' : return $this->updateConfig();
        case 'delete-config' : return $this->deleteConfig();
      }
    }

    // Default is error
    throw new Error();
  }

  // Update the recyclarr.cron file within schedule or custom
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

  // Return contents for a config yaml file
  private function viewConfig() {
    // Check if exists in configs
    if (!in_array($this->fileName, $settings->files)) {
      // Not Found
      throw new Error("File does not exists", 404);
    }

    // Return the file and stop execution
    header("Content-Type: application/x-yaml", true);
    echo Settings::getConfigContents($fileName);
    exit();
  }

  // Create a new config yaml file
  private function createConfig() {

  }

  // Update contents for a config yaml file
  private function updateConfig() {

  }

  // Delete a config yaml file
  private function deleteConfig() {

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
