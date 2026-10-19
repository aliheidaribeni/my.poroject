#!/usr/bin/env bash
set -Eeuo pipefail

# Update Iran geo data for Xray-based clients. Optional argument: target directory.
GEOIP_URL="https://raw.githubusercontent.com/Chocolate4U/Iran-v2ray-rules/release/geoip.dat"
GEOSITE_URL="https://raw.githubusercontent.com/Chocolate4U/Iran-v2ray-rules/release/geosite.dat"

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 [xray-asset-directory]" >&2
  exit 2
fi

if [[ $# -eq 1 ]]; then
  TARGET_DIR="$1"
else
  candidates=(
    "$HOME/.local/share/v2rayN/bin/xray"
    "$HOME/.local/share/v2rayN/bin"
    "$HOME/.config/v2rayN"
    "$HOME/.local/share/v2rayNG"
  )
  TARGET_DIR=""
  for candidate in "${candidates[@]}"; do
    if [[ -d "$candidate" ]]; then
      TARGET_DIR="$candidate"
      break
    fi
  done
  if [[ -z "$TARGET_DIR" ]]; then
    echo "Could not detect the geo asset directory." >&2
    echo "Pass the directory containing geoip.dat/geosite.dat as an argument." >&2
    exit 1
  fi
fi

mkdir -p "$TARGET_DIR"
command -v curl >/dev/null || { echo "curl is required." >&2; exit 1; }
command -v date >/dev/null || { echo "date is required." >&2; exit 1; }

tmpdir="$(mktemp -d)"
stamp="$(date +%Y%m%d-%H%M%S)"
backup_dir="$TARGET_DIR/iran-geo-backup-$stamp"
cleanup() { rm -rf "$tmpdir"; }
trap cleanup EXIT

echo "Downloading Iran geo assets into temporary files..."
curl --fail --location --silent --show-error "$GEOIP_URL" -o "$tmpdir/geoip.dat"
curl --fail --location --silent --show-error "$GEOSITE_URL" -o "$tmpdir/geosite.dat"

for f in "$tmpdir/geoip.dat" "$tmpdir/geosite.dat"; do
  if [[ ! -s "$f" ]]; then
    echo "Download failed or produced an empty file: $f" >&2
    exit 1
  fi
done

# Keep existing files recoverable before replacement.
if [[ -e "$TARGET_DIR/geoip.dat" || -e "$TARGET_DIR/geosite.dat" ]]; then
  mkdir -p "$backup_dir"
  [[ ! -e "$TARGET_DIR/geoip.dat" ]] || cp -a "$TARGET_DIR/geoip.dat" "$backup_dir/"
  [[ ! -e "$TARGET_DIR/geosite.dat" ]] || cp -a "$TARGET_DIR/geosite.dat" "$backup_dir/"
  echo "Existing assets backed up to: $backup_dir"
fi

install -m 0644 "$tmpdir/geoip.dat" "$TARGET_DIR/geoip.dat"
install -m 0644 "$tmpdir/geosite.dat" "$TARGET_DIR/geosite.dat"

echo "Updated assets in: $TARGET_DIR"
sha256sum "$TARGET_DIR/geoip.dat" "$TARGET_DIR/geosite.dat" 2>/dev/null || true
echo "Restart the relevant Xray-based client/core before testing."
