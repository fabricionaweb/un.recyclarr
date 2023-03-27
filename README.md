## Recyclarr Unraid plugin (non official)

[Recyclarr](https://recyclarr.dev) is command-line application that will automatically synchronize recommended settings
from the [TRaSH guides](https://trash-guides.info/) to your Sonarr/Radarr instances.

---

This is a plugin non official, to run the binary on Unraid with a friendly interface. It does not require Docker nor any other dependency.

Unraid already have git and crontab. Recyclarr binaries is [self-contained](https://learn.microsoft.com/en-us/dotnet/core/deploying/#publish-self-contained). We dont need anything else.

![settings](https://user-images.githubusercontent.com/15933/227889992-2856e7e2-91be-4bf6-a9b8-32a50c67bd35.png)
![running](https://user-images.githubusercontent.com/15933/227890166-864b7648-7e5e-4851-909c-8677ae02200b.png)

### Install

Use the plg url to install:

```
https://raw.githubusercontent.com/fabricionaweb/un.recyclarr/main/un.recyclarr.plg
```

### Configure

The yml files are located in the plugin folders, so it does persists after reboot. This is the normal practice for plugins.

You need to add your yml files to `/boot/config/plugins/un.recyclarr/configs` folder. _Future versions will have a interface to upload/edit this files_

You can have multiple files like:

- `sonarr-tv.yml`
- `sonarr-anime.yml`
- `radarr.yml`

It will make use of the [directory config](https://recyclarr.dev/wiki/file-structure#config-directory) and `recyclarr sync` will go through all the files.

### Secrets (optional)

The `secrets.yml` is located at `/boot/config/plugins/un.recyclarr/secrets.yml` - one level above the configs folder. [Use it to help you](https://recyclarr.dev/wiki/yaml/secrets-reference)

### Usage

After the installation there is no schedule set. Open the plugin Settings and define a cron or manual run it.

You can also run it manually `recyclarr sync` in the shell. See the [docs](https://recyclarr.dev/wiki/cli/) for more details.

### Logs

The cronjob will pipe the output to [syslog](https://wiki.unraid.net/Viewing_the_System_Log). You can see the logs using the Unraid interface or running `tail -n 100 /var/log/syslog | grep recyclarr`

Manual runs displays the output but does not add to syslog.
