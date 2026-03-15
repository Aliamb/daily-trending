#!/usr/bin/env python3
"""
Fetch top 48h torrents from The Pirate Bay.
Tries apibay.org API first, falls back to HTML scraping.
Output: tpb_data.json  (same dir as script)

Note: apibay.org often blocks automated requests via Cloudflare.
If this script fails, the cron job should use a browser_task as fallback
to browse https://thepiratebay.org/search.php?q=top100:48h
"""

import json
import os
import sys
import urllib.request
import urllib.error
import re

OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tpb_data.json")

CATEGORIES = {
    "100": "Audio", "101": "Music", "102": "Audio Book", "103": "Sound Clips",
    "104": "FLAC", "199": "Other Audio",
    "200": "Video", "201": "Movies", "202": "Movies DVDR", "203": "Music Videos",
    "204": "Movie Clips", "205": "TV Shows", "206": "Handheld", "207": "HD Movies",
    "208": "HD TV Shows", "209": "3D", "210": "CAM/TS", "211": "UHD/4K",
    "299": "Other Video",
    "300": "Applications", "301": "Windows", "302": "Mac", "303": "UNIX",
    "304": "Handheld", "305": "IOS", "306": "Android", "399": "Other Apps",
    "400": "Games", "401": "PC", "402": "Mac", "403": "PSx", "404": "XBOX360",
    "405": "Wii", "406": "Handheld", "407": "IOS", "408": "Android",
    "499": "Other Games",
    "500": "Porn", "501": "Movies", "502": "Movies DVDR", "503": "Pictures",
    "504": "Games", "505": "HD Movies", "506": "Movie Clips", "507": "UHD/4K",
    "599": "Other Porn",
    "600": "Other", "601": "E-books", "602": "Comics", "603": "Pictures",
    "604": "Covers", "605": "Physibles", "699": "Other"
}


def fmt_size(nbytes):
    """Format byte count to human-readable size."""
    try:
        nbytes = int(nbytes)
    except (ValueError, TypeError):
        return "?"
    if nbytes < 0:
        return "?"
    for unit in ("B", "KiB", "MiB", "GiB", "TiB"):
        if nbytes < 1024:
            return f"{nbytes:.2f} {unit}" if unit != "B" else f"{nbytes} B"
        nbytes /= 1024
    return f"{nbytes:.2f} PiB"


def cat_label(cat_id):
    return CATEGORIES.get(str(cat_id), "Other")


def fetch_api():
    """Try the apibay.org precompiled top 48h endpoint."""
    url = "https://apibay.org/precompiled/data_top100_48h.json"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"API fetch failed: {e}", file=sys.stderr)
        return None

    if not isinstance(data, list) or len(data) == 0:
        print("API returned empty or invalid data", file=sys.stderr)
        return None

    posts = []
    for i, item in enumerate(data[:50]):
        name = item.get("name", "Unknown")
        info_hash = item.get("info_hash", "")
        se = str(item.get("seeders", "0"))
        le = str(item.get("leechers", "0"))
        size = fmt_size(item.get("size", 0))
        cat = cat_label(item.get("category", "600"))
        tpb_url = f"https://thepiratebay.org/description.php?id={item.get('id', '')}"
        magnet = f"magnet:?xt=urn:btih:{info_hash}&dn={urllib.parse.quote(name)}" if info_hash else tpb_url
        posts.append({
            "rank": i + 1,
            "title": name,
            "url": tpb_url,
            "seeders": se,
            "leechers": le,
            "size": size,
            "category": cat,
        })

    return posts


def main():
    posts = fetch_api()
    if posts:
        print(f"Fetched {len(posts)} torrents from API")
    else:
        print("Could not fetch TPB data. Cron should use browser_task fallback.", file=sys.stderr)
        # Write empty structure so downstream doesn't break
        posts = []

    with open(OUTPUT, "w") as f:
        json.dump({"posts": posts}, f, indent=2)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    main()
