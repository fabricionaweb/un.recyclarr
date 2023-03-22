<?php

// This doesnt exist native
function mk_title($title, $ico) {
  return "<div id='title'><span class='left'>".(!$ico ?: "<i class='title fa $ico'></i>")."$title</span></div>";
}
