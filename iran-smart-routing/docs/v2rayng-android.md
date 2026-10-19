# v2rayNG on Android

v2rayNG versions and import methods differ, so use the client UI's supported routing/custom-config method rather than assuming a desktop v2rayN profile can be copied directly.

## Routing policy to reproduce

Add these rules before any catch-all proxy rule:

- `geoip:ir` → `direct`
- `geosite:ir` → `direct`

Keep the proxy fallback for destinations not matched by these rules. If your profile does not expose editable routing rules, use a configuration/import format supported by your installed v2rayNG version.

## Geo files

The Xray core must be able to read compatible `geoip.dat` and `geosite.dat` files. Do not assume the Linux paths in the updater script apply to Android: app-private storage and Android version restrictions make the path different. Use a trusted, version-compatible update mechanism supported by the app/core.

## Verify

1. Restart/reconnect the profile after applying changes.
2. Check logs for missing geo files or invalid rules.
3. Test an Iranian destination and a foreign destination.
4. Keep a backup of the working profile so it can be restored if routing breaks.

Never share a subscription URL or proxy credentials when asking for troubleshooting help.
