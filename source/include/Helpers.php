<?php

// Returns config files markup
function mk_config_file($name, $url, $class = null) {
  $img = autov("/plugins/un.recyclarr/assets/yml-ico.svg", true);
  return "<div class='flex user-list'><a href='$url' class='yml-edit $class'><img src='$img' />$name</a></div>";
}
