# Smart Monitor Home

An experimental remote-friendly Home screen for Samsung Tizen smart monitors, with a frosted-glass dock, calendar, weather and custom control centre.

**Status:** developed on a Samsung M7 2024 monitor with firmware 1340. Compatibility with other monitors and firmware is unverified. A native Home-key route was verified with Netflix and YouTube returning in 1–2 seconds, including after a full unplug/reconnect cold boot. This is model- and firmware-specific; see [Home routing](docs/home-routing.md).

## Preview

Open `web/index.html` in a browser. This shows example apps and cannot change hardware settings or install applications. Weather is configured for Bangalore.

## Device support

The web launcher can be signed and installed using your own Samsung/Tizen developer certificate. Installing it does not automatically replace Samsung Home. The original monitor uses a separate device-specific Home assignment and native key-routing registration. This repository is not a universal installer for replacing the firmware launcher.

The optional native companion uses monitor-specific native APIs for brightness, Wi-Fi, Bluetooth and Sleep Timer. The new AirPlay panel is currently UI-only: its on-device adapter is not yet verified or included. It shows unavailable when the companion supplies no AirPlay state; it does not open Samsung settings or claim a change succeeded. These APIs and permissions can differ across firmware. Bluetooth PIN/passkey pairing is not implemented. The companion uses trusted same-author message ports and a locally generated token; each user must sign both applications with their own author certificate and generate their own configuration.

The custom App Store UI supports browsing categories and pages, filtering the current page and opening installed apps. Samsung catalogue authentication was unavailable from the normal installed companion. Live refresh and new-app installation are not working in that configuration. The development monitor uses a clearly dated metadata snapshot; the captured regional catalogue is not distributed here. The UI must not claim installation succeeded without confirmation.

Optional [cleanup guidance](docs/storage-and-cleanup.md) explains reversible package deactivation and storage limits. It does not run automatically.

## Source layout

- `web/`: launcher, glass material, widgets and remote navigation.
- `native/`: experimental C# companion and native API bindings.
- `tools/`: local setup utilities.

Native builds require a compatible .NET SDK and Tizen application assemblies from your own SDK/device. Vendor binaries, certificates, credentials, ready-signed device packages and root-access tooling are intentionally excluded. Use your own certificate profile when packaging with Tizen Studio. Hardware controls are disabled until personal companion configuration is generated.

## Tests

Run `npm test` with Node.js installed. Tests use synthetic app/device data and do not connect to a monitor. The native companion was also compiled against matching Tizen assemblies, but that does not prove compatibility with other firmware.

## Artwork and attribution

See `web/assets/icons/SOURCES.txt` for icon sources. Brand names and artwork belong to their respective owners; no affiliation is implied. The alpine wallpaper was generated for this interface. Bangalore weather uses Open-Meteo; attribution is retained in Customize.

The original code is shared under the MIT license. Third-party brand artwork and upstream icon assets retain their own terms.
