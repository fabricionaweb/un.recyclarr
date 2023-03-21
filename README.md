## Recyclarr Unraid plugin (non official)

[Recyclarr](https://recyclarr.dev) is command-line application that will automatically synchronize recommended settings
from the [TRaSH guides](https://trash-guides.info/) to your Sonarr/Radarr instances.

This is a plugin non official, yet under tests, to just run the binary on Unraid. It does not require Docker nor any other dependency.

Unraid already have git and crontab. Recyclarr binaries is [self-contained](https://learn.microsoft.com/en-us/dotnet/core/deploying/#publish-self-contained). We dont need anything else.

### Install

Use the plg url to install:

```
https://raw.githubusercontent.com/fabricionaweb/un.recyclarr/main/un.recyclarr.plg
```

### Configure

The yml files are located in the plugin folders, so it does persists after reboot.

Add your yml files to `/boot/config/plugins/un.recyclarr/configs`.

You can have multiple files like `sonarr.yml` and `sonarr-anime.yml` and `radarr.yml`.

This will make use of the [directory config](https://recyclarr.dev/wiki/file-structure#config-directory) and `recyclarr sync` will go through all the files.

### Secrets (optional)

The `secrets.yml` is located at `/boot/config/plugins/un.recyclarr/secrets.yml` - one level above the configs folder. [Use it to help you](https://recyclarr.dev/wiki/yaml/secrets-reference)

### Usage

The installation already adds the cronjob to run every day at 4:40am.

You can also run it manually `recyclarr sync`. See the [docs](https://recyclarr.dev/wiki/cli/) for more details.

### Logs

The cronjob will pipe the logs to [Unraid syslog](https://wiki.unraid.net/Viewing_the_System_Log). You can see the logs in Unraid interface or running

```
cat /var/log/syslog | grep recyclarr:
```
