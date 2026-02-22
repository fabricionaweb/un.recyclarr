<?php

class Requests {
  const SECRETS = "../secrets.yml";
  const SETTINGS = "../settings.yml";

  private $schedule;
  private $schedule_user;
  private $fileName;

  function __construct() {
    $this->schedule      = $this->handleScheduleEnum($_POST["schedule"]);
    $this->schedule_user = $this->handleCustomCron($_POST["schedule_user"]);
    $this->fileName = $this->handleFileName($_GET["fileName"] ?? $_POST["fileName"]);
    $this->contents = $_POST["contents"];
  }

  private function handleScheduleEnum($schedule) {
    // Try to interpolate, if not possible become disable
    try {
      return constant("Schedule::$schedule");
    } catch(Throwable $e) {
      return Schedule::DISABLED;
    }
  }

  private function handleCustomCron($custom) {
    return $this->schedule === Schedule::CUSTOM ? trim($custom) : null;
  }

  private function handleFileName($fileName) {
    switch ($fileName) {
      case "secrets":
        return self::SECRETS;
      case "settings":
        return self::SETTINGS;
      default:
        // Extract the proper filename
        return pathinfo($fileName, PATHINFO_FILENAME).".yml";
    }
  }

  private function checkFileExists($return = false) {
    // Combine custom configs with internal configs
    $files = array_merge(Settings::getConfigFiles(), [self::SECRETS, self::SETTINGS]);
    if (!in_array($this->fileName, $files)) {
      return $return ? false : throw new Error("File does not exists", 404);
    }

    return true;
  }

  public function route($action) {
    // Only accept XHR requests
    if (!empty($action) && isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
      switch($action) {
        case "update-cron"   : return $this->updateCron();
        case "create-config" : return $this->createConfig();
        case "view-config"   : return $this->viewConfig();
        case "update-config" : return $this->updateConfig();
        case "delete-config" : return $this->deleteConfig();
      }
    }

    // Default is error
    throw new Error();
  }

  // Update the recyclarr.cron file within schedule or custom
  private function updateCron() {
    // Validate custom cron
    if (!empty($this->schedule_user) && !preg_match(Plugin::CRON_REGEX, $this->schedule_user, $matches)) {
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
