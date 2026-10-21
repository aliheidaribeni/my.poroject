# Iran Smart Routing

A reusable set of rules and setup notes for routing Iranian destinations directly and sending other traffic through a proxy, with Xray-based clients such as v2rayN (Linux/Windows) and v2rayNG (Android).

## What this project does

- Uses the maintained [Chocolate4U/Iran-v2ray-rules](https://github.com/Chocolate4U/Iran-v2ray-rules) data files.
- Routes Iranian IP ranges and domains through `direct`.
- Leaves the proxy as the fallback for other traffic.
- Keeps client-specific setup notes separate so the same policy can be reused across devices.
- Includes an Android/Termux downloader that verifies upstream SHA-256 checksums before replacing downloaded files.
- Runs GitHub Actions checks to validate the routing JSON and Android support files.

**Important:** routing rules only work when the client/core supports the rule syntax and the matching geo files are installed where that core expects them. Client UI labels and import formats vary by version.

## Files

- `rules/xray-routing-snippet.json`: Xray routing rules to adapt to an existing config.
- `scripts/update-iran-geo-assets.sh`: downloads and validates Iran `geoip.dat` and `geosite.dat` files for supported Linux installations, backing up existing copies first.
- `docs/v2rayn-linux.md`: Linux v2rayN setup.
- `docs/v2rayng-android.md`: Android v2rayNG setup, update steps, testing, and troubleshooting.
- `android/download-geo-assets-termux.sh`: Android/Termux downloader; saves verified files to shared Downloads. It intentionally does not attempt to write to Android's restricted app directories.

## Routing policy

Place the following rules **before** a catch-all proxy rule:

1. `geoip:ir` → `direct`
2. `geosite:ir` → `direct`
3. Keep private/local destinations direct if that is already part of your setup.
4. Keep the existing proxy fallback for the remaining traffic.

Do not replace your whole client configuration with the snippet. Merge the rules into the existing routing section and preserve your actual outbound tags. This project assumes an outbound named `direct`; change the tag if your configuration uses another name.

## Android quick start

Read [the v2rayNG Android guide](docs/v2rayng-android.md). The Termux script downloads and verifies geo files into shared Downloads, but Android's storage restrictions mean copying them into v2rayNG's active assets directory may require a supported file manager, app import/update flow, or USB/ADB. Downloading is not the same as installing.

## Update geo assets on Linux

From this directory:

```bash
chmod +x scripts/update-iran-geo-assets.sh
./scripts/update-iran-geo-assets.sh
```

By default, the script detects common v2rayN/Xray locations. To specify the target directory explicitly:

```bash
./scripts/update-iran-geo-assets.sh "$HOME/.local/share/v2rayN/bin/xray"
```

## Safety and troubleshooting

- Back up your client configuration before changing routing.
- A domain may resolve to a non-Iranian IP, and an Iranian service may use a foreign CDN. Geo rules are best-effort, not a guarantee for every service.
- DNS behavior affects domain-based routing. Keep the client's DNS setup consistent with its routing mode.
- If direct traffic fails, test whether the service is reachable without a proxy before changing rules.
- Do not publish subscription links, server addresses, UUIDs, passwords, or other proxy credentials in this repository.
- The geo data is maintained upstream; consult the upstream repository for licensing, updates, and release notes.

## Upstream

- Rules and releases: https://github.com/Chocolate4U/Iran-v2ray-rules
- GeoIP: https://github.com/Chocolate4U/Iran-v2ray-rules/raw/refs/heads/release/geoip.dat
- GeoSite: https://github.com/Chocolate4U/Iran-v2ray-rules/raw/refs/heads/release/geosite.dat
