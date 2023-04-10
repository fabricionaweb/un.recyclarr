<?php

class Requests {
  const SECRETS = "../secrets.yml";

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
      return self::SECRETS;
    }

    // Extract the proper filename
    return pathinfo($fileName, PATHINFO_FILENAME).".yml";
  }

  private function checkFileExists($return = false) {
    // If not secrets, check if file exists in configs folder
    if ($this->fileName !== self::SECRETS && !in_array($this->fileName, Settings::getConfigFiles())) {
      if ($return) {
        return true;
      }

      // Not Found
      throw new Error("File does not exists", 404);
    }
  }

  public function route($action) {
    // Only accept XHR requests
    if (!empty($action) && isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
      switch($action) {
        case 'update-cron'   : return $this->updateCron();
        case 'create-config' : return $this->createConfig();
        case 'view-config'   : return $this->viewConfig();
        case 'update-config' : return $this->updateConfig();
        case 'delete-config' : return $this->deleteConfig();
      }
    }

    // Default is error
    throw new Error();
  }

  // Update the recyclarr.cron file within schedule or custom
  private function updateCron() {
    // Validate custom cron
    if (!empty($this->custom) && !preg_match(Plugin::CRON_REGEX, $this->custom, $matches)) {
      // Not Acceptable
      throw new Error("Invalid cron", 406);
    }

    // Save with custom expression or enum
    Settings::saveSchedule(trim($matches[1]) ?: $this->schedule);
    return ["message" => "Saved"];
  }

  // Create a new config yaml file
  private function createConfig() {
    // Check if file exists in configs folder
    if (!$this->checkFileExists(true)) {
      // Conflict
      throw new Error("This file name already exists", 409);
    }

    // Create the file
    Settings::createConfigFile($this->fileName);
    return ["message" => "Created", "fileName" => $this->fileName];
  }


  // Return contents for a config yaml file
  private function viewConfig() {
    $this->checkFileExists();

    // Return the file and stop execution
    header("Content-Type: application/x-yaml", true);
    echo Settings::getConfigContents($this->fileName);
    exit();
  }

  // Update contents for a config yaml file
  private function updateConfig() {
    $this->checkFileExists();

    // Save config file
    Settings::saveConfigContents($this->fileName, $this->contents);
    return ["message" => "Saved", "fileName" => $this->fileName];
  }

  // Delete a config yaml file
  private function deleteConfig() {
    $this->checkFileExists();

    // Delete config file
    Settings::deleteConfigFile($this->fileName);
    return ["message" => "Deleted", "fileName" => $this->fileName];
  }
}
