<?php

// Plugin variables
class Plugin {
  const CRON_FILE    = "/boot/config/plugins/un.recyclarr/recyclarr.cron";
  const CRON_REGEX   = "/^((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/m";
  const CRON_COMMAND = "/usr/local/bin/recyclarr sync |& logger -t recyclarr";
}

// Form values
class Schedule {
  // Following Unraid crontab -l rules
  const HOURLY = "47 * * * *";
  const DAILY  = "40 4 * * *";
  const WEEKLY = "30 4 * * 0";
  const MONTLY = "20 4 1 * *";

  public static function reflection($rule) {
    switch(trim($rule)) {
      case self::HOURLY: return "HOURLY";
      case self::DAILY:  return "DAILY";
      case self::WEEKLY: return "WEEKLY";
      case self::MONTLY: return "MONTLY";
    }
  }
}
