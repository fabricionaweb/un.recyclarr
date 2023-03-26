<?php

// Plugin variables
class Plugin {
  const NAME      = 'un.recyclarr';
  const CRON_FILE = 'recyclarr.sh';
}

// Form values
class Schedule {
  const DISABLED = null;
  const HOURLY   = 'hourly';
  const DAILY    = 'daily';
  const WEEKLY   = 'weekly';
  const MONTLY   = 'montly';
}
