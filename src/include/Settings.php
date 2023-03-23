<?php

class Settings {
  public $schedule;

  function __construct() {
    $this->schedule = self::currentCron();
  }

  public static function save($value) {
    $files = self::findCronFiles();

    // Validate form values
    switch($value) {
      case Schedule::HOURLY: $change = Schedule::HOURLY; break;
      case Schedule::DAILY:  $change = Schedule::DAILY;  break;
      case Schedule::WEEKLY: $change = Schedule::WEEKLY; break;
      case Schedule::MONTLY: $change = Schedule::MONTLY; break;
      default:               $change = Schedule::DISABLED;
    }

    // Delete the cron to create fresh ones
    foreach($files as $file) {
      unlink($file);
    }

    // Dont create cron file again if in manual (or invalid frequency)
    if ($change === Schedule::DISABLED) {
      return;
    }

    // Create the cron
    exec("install -m700 /usr/local/emhttp/plugins/".Plugin::NAME."/scripts/cron.sh /etc/cron.$change/".Plugin::CRON_FILE);
  }

  private static function currentCron() {
    $files = self::findCronFiles();

    // If found nothing it is in manual mode
    if (!$files) {
      return Schedule::DISABLED;
    }

    // If found more than one, keep the first and delete the others
    for($i = 1; $i < count($files); $i++) {
      unlink($files[$i]);
    }

    // Capture the frequency from the folder name
    // Expect: hourly daily weekly monthly
    preg_match("/cron\.(.*)\//", $files[0], $matches);
    return $matches[1];
  }

  private static function findCronFiles() {
    // Search for the files inside the system cron folders
    exec("find /etc/cron.* -type f -name ".Plugin::CRON_FILE, $output);
    return $output;
  }
}
