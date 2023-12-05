#!/bin/bash -ex

# Use this to remove unnecessary files from ace-builds
# 1) gets the version from github https://github.com/ajaxorg/ace-builds/tags
# 2) copy "src-min-noconflict" folder to "source/assets/ace"
# 3) removes unnecessary files

version="1.32.0"
dest="source/assets/ace-builds"

rm -rf "$dest"
mkdir -p "$dest"

wget -qO- --show-progress https://github.com/ajaxorg/ace-builds/archive/refs/tags/v$version.tar.gz |
  tar xvJ --strip-components=2 -C source/assets/ace-builds ace-builds-$version/src-min-noconflict

(
  cd "$dest"
  rm -rf "snippets"
  find . \( -name "mode-*" -a ! -name "mode-yaml.js" \) -delete
  find . \( -name "theme-*" -a ! -name "theme-tomorrow_night.js" -a ! -name "theme-tomorrow.js" \) -delete
  find . \( -name "keybinding-*" -a ! -name "keybinding-vscode.js" \) -delete
  find . \( -name "worker-*" -a ! -name "worker-base.js" -a ! -name "worker-yaml.js" \) -delete
  # disable some functions
  find . \( -name "ext-settings_menu.js" -o -name "ext-prompt.js" \) -delete
)
