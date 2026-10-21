#!/usr/bin/env bash
set -Eeuo pipefail

# Download and verify Iran geo assets into Termux shared Downloads.
# Run termux-setup-storage once before using this script.
# This script deliberately does not write to Android/data or app-private paths.

BASE_URL="https://github.com/Chocolate4U/Iran-v2ray-rules/releases/latest/download"
OUT_DIR="${HOME}/storage/downloads/IranSmartRouting"

command -v curl >/dev/null 2>&1 || { echo "Missing dependency: curl (pkg install curl)" >&2; exit 1; }
command -v sha256sum >/dev/null 2>&1 || { echo "Missing dependency: sha256sum (pkg install coreutils)" >&2; exit 1; }
command -v grep >/dev/null 2>&1 || { echo "Missing dependency: grep (pkg install grep)" >&2; exit 1; }
[[ -d "${HOME}/storage" ]] || {
  echo "Shared storage is not configured. Run: termux-setup-storage" >&2
  exit 1
}

mkdir -p "$OUT_DIR"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

for name in geoip.dat geosite.dat; do
  echo "Downloading $name..."
  curl --fail --location --retry 2 --silent --show-error \
    "$BASE_URL/$name" -o "$TMP_DIR/$name"
  curl --fail --location --retry 2 --silent --show-error \
    "$BASE_URL/$name.sha256sum" -o "$TMP_DIR/$name.sha256sum"

  [[ -s "$TMP_DIR/$name" ]] || { echo "Empty download: $name" >&2; exit 1; }
  expected="$(grep -Eo '[[:xdigit:]]{64}' "$TMP_DIR/$name.sha256sum" | head -n 1 || true)"
  [[ "$expected" =~ ^[[:xdigit:]]{64}$ ]] || {
    echo "Could not parse published SHA-256 checksum for $name" >&2
    exit 1
  }
  actual="$(sha256sum "$TMP_DIR/$name" | awk '{print $1}')"
  [[ "${actual,,}" == "${expected,,}" ]] || {
    echo "Checksum mismatch for $name; keeping previous downloaded files." >&2
    exit 1
  }
done

# Both downloads have passed validation. Back up previous copies before replacing.
STAMP="$(date +%Y%m%d-%H%M%S)"
if [[ -e "$OUT_DIR/geoip.dat" || -e "$OUT_DIR/geosite.dat" ]]; then
  BACKUP="$OUT_DIR/backup-$STAMP"
  mkdir -p "$BACKUP"
  [[ ! -e "$OUT_DIR/geoip.dat" ]] || cp -p "$OUT_DIR/geoip.dat" "$BACKUP/"
  [[ ! -e "$OUT_DIR/geosite.dat" ]] || cp -p "$OUT_DIR/geosite.dat" "$BACKUP/"
  echo "Previous downloaded files backed up to: $BACKUP"
fi

install -m 0644 "$TMP_DIR/geoip.dat" "$OUT_DIR/geoip.dat"
install -m 0644 "$TMP_DIR/geosite.dat" "$OUT_DIR/geosite.dat"
echo "Verified files saved to: $OUT_DIR"
echo "Next: copy them to the active v2rayNG assets directory using a method supported by your Android version."
