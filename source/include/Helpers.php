<?php

// Returns config files markup
function mk_config_file($name, $fileName, $class = null) {
  $img = autov("/plugins/un.recyclarr/assets/yml-ico.svg", true);
  return "<div class='Panel'>
    <a href='?name=$fileName' data-file-name='$fileName' class='localURL yml-edit $class'>
      <span><img src='$img' /></span>
      <div class='PanelText'>$name</div>
    </a>
  </div>";
}
