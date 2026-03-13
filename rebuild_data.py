#!/usr/bin/env python3
"""
Rebuild data.js by replacing only the youtube section with kworb.net data.
Uses line-based approach to avoid regex issues with complex strings.
"""
import json

DATA_JS = "/home/user/workspace/trending-dashboard/data.js"
YT_JSON = "/home/user/workspace/trending-dashboard/yt_data.json"

def js_str(s):
    """Escape a string for JS single quotes."""
    return s.replace("\\", "\\\\").replace("'", "\\'")

def main():
    with open(YT_JSON) as f:
        yt = json.load(f)

    # Read original data.js lines
    with open(DATA_JS) as f:
        lines = f.readlines()

    # Find the youtube array boundaries
    yt_start = None
    yt_end = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("youtube: ["):
            yt_start = i
        if yt_start is not None and yt_end is None:
            if stripped == "]," and i > yt_start:
                yt_end = i
                break

    if yt_start is None or yt_end is None:
        print(f"ERROR: Could not find youtube array bounds (start={yt_start}, end={yt_end})")
        return

    print(f"Found youtube array: lines {yt_start+1} to {yt_end+1}")

    # Build new YouTube lines
    new_yt_lines = ["  youtube: [\n"]
    for p in yt["posts"][:20]:
        entry = (
            f"    {{ rank: {p['rank']}, "
            f"title: '{js_str(p['title'])}', "
            f"countries: {p['countries']}, "
            f"highlights: '{js_str(p['highlights'])}', "
            f"thumbnail: '{p['thumbnail']}', "
            f"url: '{p['url']}' }},\n"
        )
        new_yt_lines.append(entry)
    new_yt_lines.append("  ],\n")

    # Rebuild: header + new youtube + rest
    new_lines = lines[:yt_start] + new_yt_lines + lines[yt_end+1:]

    with open(DATA_JS, "w") as f:
        f.writelines(new_lines)

    print(f"SUCCESS: Replaced youtube section with {len(yt['posts'][:20])} entries from kworb.net")

if __name__ == "__main__":
    main()
