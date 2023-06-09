## Recyclarr Unraid plugin (non official)

[Recyclarr](https://recyclarr.dev) is command-line application that will automatically synchronize recommended settings
from the [TRaSH guides](https://trash-guides.info/) to your Sonarr/Radarr instances.

---

This is a plugin non official, to run the binary on Unraid with a friendly interface. It does not require Docker nor any other dependency.

Unraid already have git and crontab. Recyclarr binaries is [self-contained](https://learn.microsoft.com/en-us/dotnet/core/deploying/#publish-self-contained). We dont need anything else.

<details>
<summary>Screenshots</summary>

![settings](https://user-images.githubusercontent.com/15933/230949542-e642a05f-081a-48cb-8201-656536d8e3e0.png)
![running](https://user-images.githubusercontent.com/15933/227890166-864b7648-7e5e-4851-909c-8677ae02200b.png)
![editing](https://user-images.githubusercontent.com/15933/230949703-d399f501-862a-4c4e-904d-f8b8e7e18109.png)
![create](https://user-images.githubusercontent.com/15933/230949836-55378497-fc83-45ed-93fb-4e178ac36235.png)
![delete](https://user-images.githubusercontent.com/15933/230949790-5db668d6-9680-4ca9-9572-b900379c66ee.png)

</details>

### Install

Use the plg url to install:

```
https://raw.githubusercontent.com/fabricionaweb/un.recyclarr/main/un.recyclarr.plg
```

### Configure

The yml files are located in the plugin folders, so it does persists after reboot. This is the normal practice for plugins.

You can create, delete and edit using the interface. The yml files is stored at `/boot/config/plugins/un.recyclarr/configs` folder. You can have multiple files like:

- `sonarr-tv.yml`
- `sonarr-anime.yml`
- `radarr.yml`

It will make use of the [directory config](https://recyclarr.dev/wiki/file-structure#config-directory) and `recyclarr sync` will go through all the files.
Or you can run just one by passing the [service](https://recyclarr.dev/wiki/cli/sync) to `recyclarr sync [service]`. Example:

- `recyclarr sync radarr`
- `recyclarr sync sonarr`

### Secrets (optional)

The `secrets.yml` is located at `/boot/config/plugins/un.recyclarr/secrets.yml` - one level above the configs folder. [Use it to help you](https://recyclarr.dev/wiki/yaml/secrets-reference)

### Usage

After the installation there is no schedule set. Open the plugin Settings and define a cron or manual run it.

You can also run it manually `recyclarr sync` in the shell. See the [docs](https://recyclarr.dev/wiki/cli/) for more details.

### Logs

Output is send to [syslog](https://wiki.unraid.net/Viewing_the_System_Log). You can see the logs using the Unraid interface or running:

```bash
tail -n 100 /var/log/syslog | grep recyclarr
```
