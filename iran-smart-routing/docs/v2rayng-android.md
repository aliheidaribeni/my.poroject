# v2rayNG on Android: Iran Smart Routing

This guide configures the **existing v2rayNG app** to send Iranian destinations directly and use your existing proxy for other destinations. It does not install a new VPN app and does not include your server subscription.

## What is included

- Reusable Xray routing rules: [../rules/xray-routing-snippet.json](../rules/xray-routing-snippet.json)
- A Termux downloader that fetches the upstream Iran geo files, checks their published SHA-256 checksums, and saves them to shared Downloads: [../android/download-geo-assets-termux.sh](../android/download-geo-assets-termux.sh)
- A repeatable test checklist below.

## 1. Back up your current profile

In v2rayNG, export or otherwise back up the working configuration before changing routing. Never put a subscription URL, UUID, password, private server address, or QR code in this public repository.

## 2. Download fresh geo files

The routing rules refer to `geoip:ir` and `geosite:ir`. The Xray core needs compatible `geoip.dat` and `geosite.dat` files. These are maintained upstream by [Chocolate4U/Iran-v2ray-rules](https://github.com/Chocolate4U/Iran-v2ray-rules).

### Option A: Termux

1. Install Termux from a trusted source and open it.
2. Install dependencies: `pkg update && pkg install curl coreutils grep`
3. Allow Termux to access shared storage: `termux-setup-storage`
4. Download this repository (or just the script) to the phone, then run:
   `bash download-geo-assets-termux.sh`
5. Verified files will be saved in `Download/IranSmartRouting/`.

The script downloads both files into temporary files and only replaces the downloaded copies after both checksum checks pass. It does **not** attempt to write into v2rayNG's private app directory, which Android versions and device vendors restrict differently.

### Option B: Download manually

Use the direct upstream links in the [upstream project README](https://github.com/Chocolate4U/Iran-v2ray-rules) and verify checksums where provided.

## 3. Put the geo files where v2rayNG can read them

v2rayNG documents its geo asset location as:

`Android/data/com.v2ray.ang/files/assets`

The exact path and access method can vary by app version and Android version. Copy `geoip.dat` and `geosite.dat` into the active v2rayNG assets directory using a method your device permits (for example, a compatible file manager or USB/ADB from a computer). If Android blocks access, do not try random app-private paths: use the app's supported update/import flow or consult the current v2rayNG documentation.

Official client documentation: [2dust/v2rayNG](https://github.com/2dust/v2rayNG).

## 4. Add the routing rules

In v2rayNG, open the routing settings or custom configuration method supported by your installed version. Add these rules **before any catch-all proxy rule**:

1. `geoip:ir` → `direct`
2. `geosite:ir` → `direct`

Preserve existing block/private-network rules and the existing proxy fallback. The exact UI labels vary by version. The repository's JSON file is a **routing snippet**, not a complete v2rayNG profile; do not replace your whole configuration with it. If your profile uses a direct outbound tag other than `direct`, adapt the tag to match the actual outbound.

## 5. Apply and test

1. Restart or reconnect the active v2rayNG profile.
2. Check v2rayNG logs for invalid routing rules or missing geo files.
3. Test a known Iranian destination and a known foreign destination.
4. Confirm the Iranian destination is reachable without the proxy and the foreign destination still uses the proxy.
5. Test DNS-dependent domains separately. A site hosted on a foreign CDN may not be classified as Iranian solely from its IP.

### Troubleshooting

- **Unknown `geoip:ir` / `geosite:ir` or missing file:** confirm the two geo files are in the active core's assets directory and compatible with the Xray core.
- **Everything uses the proxy:** verify rule order and that the rules are in the active profile, not merely saved in a different profile.
- **Iranian sites fail on direct:** the site may be unreachable directly, or may rely on a foreign CDN; do not assume every Iranian service has only Iranian IPs.
- **Foreign traffic goes direct:** check that no broad direct rule appears before the Iran-specific rules and that the proxy fallback still exists.
- **No access to Android/data:** this is an Android storage restriction, not proof that the downloaded files are bad. Use a supported app import/update method or a computer-based transfer.

## Updating later

Re-run `download-geo-assets-termux.sh` to fetch and checksum-verify the latest upstream files. Back up the current v2rayNG assets before replacing them, then restart the core and repeat the tests. A successful download does not automatically install files into v2rayNG.

## Scope and limitations

This project provides reusable routing rules and an asset-download/verification workflow. It does not remotely modify v2rayNG, bypass Android storage restrictions, or guarantee that every destination is reachable directly. The actual routing result depends on the active client configuration, core version, DNS strategy, upstream geo data, and network reachability.
