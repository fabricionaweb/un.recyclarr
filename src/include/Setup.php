<?php

// Import dependencies
require "Constants.php";
require "Helpers.php";
require "Settings.php";

// If receive schedule changes
if ( isset($_POST["schedule"]) ) {
  Settings::save($_POST["schedule"]);
}

$settings = new Settings();
