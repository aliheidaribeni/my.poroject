# v2rayN on Linux

## 1. Back up first

Close v2rayN before editing its profile or generated configuration. Back up the v2rayN GUI database/configuration and the active Xray config. Do not edit a generated config while the client is running because it may be regenerated.

## 2. Update geo data

From the repository root:

```bash
chmod +x iran-smart-routing/scripts/update-iran-geo-assets.sh
./iran-smart-routing/scripts/update-iran-geo-assets.sh "$HOME/.local/share/v2rayN/bin/xray"
```

Use the actual directory containing the Xray core's `geoip.dat` and `geosite.dat` if your installation differs. Some builds keep another copy in a parent `bin` directory; use the location your active core reads.

## 3. Add the rules in v2rayN

In the active routing profile, add these rules near the top, before the catch-all proxy rule:

- IP rule: `geoip:ir` → `direct`
- Domain rule: `geosite:ir` → `direct`

Preserve the existing private-network rules and block rules. Keep the existing proxy fallback after the Iran rules. The exact labels and rule ordering UI can differ by v2rayN version.

The example snippet at `../rules/xray-routing-snippet.json` is for reference; it is not a complete replacement for your generated config.

## 4. Verify

1. Restart v2rayN/core.
2. Check the active configuration/log for missing geo-file or unknown-rule errors.
3. Test one Iranian destination and one foreign destination.
4. If the Iranian destination still uses the proxy, inspect the active routing profile and confirm that the Iran rules are above the catch-all rule.
