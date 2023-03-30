<?php

// Plugin variables
class Plugin {
  const BOOT_PATH    = "/boot/config/plugins/un.recyclarr";
  const CONFIGS_DIR  = self::BOOT_PATH."/configs";
  const CRON_FILE    = self::BOOT_PATH."/recyclarr.cron";
  const CRON_REGEX   = "/^((((\d+,)+(\d+|\*)|((\d+|\*)(\/|-)\d+)|\d+|\*)[ \t]?){5,7})/m";
  const CRON_COMMAND = "/usr/local/emhttp/plugins/un.recyclarr/scripts/recyclarr";
}

// Form values
class Schedule {
  const DISABLED = null;
  const CUSTOM   = "CUSTOM";
  // Following Unraid crontab -l rules
  const HOURLY   = "47 * * * *";
  const DAILY    = "40 4 * * *";
  const WEEKLY   = "30 4 * * 0";
  const MONTLY   = "20 4 1 * *";

  // Use reflection to return the key for the expression
  public static function reflection($expression) {
    switch($expression) {
      case self::HOURLY: return "HOURLY";
      case self::DAILY:  return "DAILY";
      case self::WEEKLY: return "WEEKLY";
      case self::MONTLY: return "MONTLY";
    }

    // If is a valid cron we accept as CUSTOM
    if (preg_match(Plugin::CRON_REGEX, $expression)) {
      return "CUSTOM";
    }

    // Default is disabled
    return "DISABLED";
  }
}
