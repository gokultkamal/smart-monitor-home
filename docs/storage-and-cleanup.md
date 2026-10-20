# Storage and optional component cleanup

Removing a shortcut does not free the installed app's storage. Deactivating a
package prevents its activation but retains its files for rollback. Do not
claim storage savings from package deactivation alone.

On the development monitor, the built-in package manager supported reversible
deactivation for the owner profile. For example, in an already authorized device
shell with the required permissions:

```
pkgcmd -D -t tpk -n com.samsung.tv.targeted-ad-service --uid 5001
```

The inverse operation uses `-A`. Package types, IDs, owner UID and supported
operations must be checked on your own model. This repository does not obtain
privileged access or make automatic OS changes.

The development monitor disabled six advertising/promotion packages and ten
unused voice assistant packages. AirPlay, SmartThings, streaming, accessibility
speech, Home and Home Controls stayed enabled. Shared OS services were retained
where their dependencies were uncertain. This does not remove every advertising
or telemetry component, nor advertising delivered inside streaming apps.

For an actual storage cleanup, inspect app sizes in the monitor's app manager,
choose apps you do not use, and uninstall through the package manager. Back up
or confirm recoverability first. Keep streaming account data unless you intend
to sign in again. Avoid deleting package directories or editing package registry
flags directly. Keep device certificates, configuration tokens and backups out
of public repositories.

Deleting the development monitor's obsolete probe files and staged installers
reclaimed approximately 3 MiB. It already had approximately 1.6 GiB free, so it
was not close to storage exhaustion. No sustained speed improvement was proved
by that cleanup; post-cleanup playback and settings regression tests were still
pending at the time of that measurement.
