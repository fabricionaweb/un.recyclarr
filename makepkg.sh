#!/bin/bash -ex

version="4.3.0"

rootfs=package/rootfs
emhttp=$rootfs/usr/local/emhttp/plugins/un.recyclarr
bin=$rootfs/usr/local/bin

prepare() {
  # delete previous stuff
  rm -rf package
  # create rootfs
  mkdir -p $emhttp $bin
}

download() {
  # download and extract
  wget -qO- --show-progress https://github.com/recyclarr/recyclarr/releases/download/v$version/recyclarr-linux-x64.tar.xz | tar xvJ -C $bin
}

frontend_build() {
  # assuming you have node, install deps
  npm ci
  # build
  npm run build -- --minify
}

copy() {
  # copy emhttp plugin
  cp -av source/* $emhttp
  # remove frontend sources
  rm -rf $emhttp/assets/{entry.js,modules}
}

compress() {
  # change workdir to rootfs
  cd $rootfs
  # create the package (bsdtar/mac)
  tar -cvJ --format gnutar --numeric-owner --uid 0 --gid 0 -f ../un.recyclarr.txz .
  # restore workdir
  cd ../../
}

checksum() {
  # change workdir to package
  cd package
  # create md5 file
  md5sum un.recyclarr.txz | tee un.recyclarr.txz.md5
  # restore workdir
  cd ../
}

clean() {
  # delete rootfs
  rm -rf $rootfs
}

prepare
download
frontend_build
copy
compress
checksum
clean
