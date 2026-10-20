# Building your own packages

The browser preview needs no developer account. Open `web/index.html`.

For a monitor, install Samsung Tizen Studio and the TV extension, create your own Samsung TV certificate profile, enable developer mode on your own device, and register the device with your profile. Use Samsung's current developer documentation for that workflow:
https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk.html

## Web launcher only

Run `python3 tools/package.py`. It creates `build/unsigned/Home-unsigned.wgt`. Use Tizen Studio to sign this package with your personal TV certificate and install it. Hardware controls are disabled in this mode.

Installation is separate from assigning a launcher to the remote's Home button. This project does not supply an automatic firmware modification or universal Home replacement procedure.

## Experimental native controls

The companion requires .NET 6-compatible build tools and Tizen application assemblies compatible with your monitor. Supply the directory containing `Tizen.Applications.Common.dll`, `Tizen.Applications.UI.dll` and `Tizen.Applications.MessagePort.dll` from your own SDK/device; they are not included here.

```
dotnet build native/HomeControls.csproj -c Release -o build/native -p:TizenFrameworkDir=/path/to/your/tizen/assemblies
python3 tools/package.py --native-build build/native
```

Sign both output packages with the **same personal author certificate**. The trusted message-port check expects `QuietTV001.QuietTV` and `HomeCtl001.Control`; if you change IDs, update the web manifest, native manifest, native caller check and package utility together. Device-specific native API access is not guaranteed by successful compilation or signing.

The utility creates a random local token in `private/device-auth.json`. Do not commit that directory, your certificates, or your generated packages. The repository's `web/device-config.js` deliberately contains no personal token.

## Catalogue limitation

The custom Store can open installed apps. A normal installed companion could not obtain Samsung's catalogue authentication during testing. The developer's regional snapshot and account/session data are not included. If you have obtained your own compatible metadata snapshot, `--catalogue-snapshot /path/to/catalogue-snapshot.json` includes it in your personal companion package. Saved-catalogue mode clearly labels the date and disables installation. Live new-app installation is not a working feature of this release.

Do not interpret an enabled UI, a build, or an install-request return code as a successful hardware change. Test on your own model and firmware and preserve the original launcher configuration.
