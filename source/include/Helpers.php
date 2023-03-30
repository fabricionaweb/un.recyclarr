<?php

// Returns config files markup
function mk_config_file($name, $url) {
  $img = autov("/plugins/un.recyclarr/assets/yml-ico.svg", true);
  return "<div class='flex user-list'><a href='$url'><img src='$img' />$name</a></div>";
}
