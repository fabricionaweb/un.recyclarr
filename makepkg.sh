#!/bin/bash -e

prepare() {
  # delete previous stuff
  rm -rf package
  # create fakefs
  mkdir -p package/fakefs/usr/local/emhttp/plugins/un.recyclarr package/fakefs/usr/local/bin
}

download() {
  # download latest always
  wget -qO- https://github.com/recyclarr/recyclarr/releases/latest/download/recyclarr-linux-x64.tar.xz | tar xvJ -C package/fakefs/usr/local/bin
}

copy() {
  # copy emhttp plugin
  cp -av source/* package/fakefs/usr/local/emhttp/plugins/un.recyclarr
}

compress() {
  # change workdir to fakefs
  cd package/fakefs
  # create the package (bsdtar)
  tar -cvJ --format gnutar --numeric-owner --uid 0 --gid 0 -f ../un.recyclarr.txz .
  # restore workdir
  cd ../../
}

checksum() {
  # change workdir to package
  cd package
  # create md5 file
  md5sum un.recyclarr.txz >un.recyclarr.txz.md5
  # restore workdir
  cd ../
}

clean() {
  # delete fakefs
  rm -rf package/fakefs
}

prepare
download
copy
compress
checksum
clean
