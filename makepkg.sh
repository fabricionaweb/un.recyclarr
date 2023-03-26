#!/bin/bash -e

prepare() {
  # delete previous stuff
  rm -rf package
  # create rootfs
  mkdir -p package/rootfs/usr/local/emhttp/plugins/un.recyclarr package/rootfs/usr/local/bin
}

download() {
  # download latest always
  wget -qO- https://github.com/recyclarr/recyclarr/releases/latest/download/recyclarr-linux-x64.tar.xz | tar xvJ -C package/rootfs/usr/local/bin
}

copy() {
  # copy emhttp plugin
  cp -av source/* package/rootfs/usr/local/emhttp/plugins/un.recyclarr
}

compress() {
  # change workdir to rootfs
  cd package/rootfs
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
  # delete rootfs
  rm -rf package/rootfs
}

prepare
download
copy
compress
checksum
clean
