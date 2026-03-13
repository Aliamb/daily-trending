#!/usr/bin/env python3
"""
Build updated data.js by replacing the YouTube section with kworb.net data.
Reads current data.js, replaces youtube array, writes back.
"""
import json
import re

DATA_JS = "/home/user/workspace/trending-dashboard/data.js"
YT_JSON = "/home/user/workspace/trending-dashboard/yt_data.json"

def js_string(s):
    """Escape a string for use in single-quoted JS."""
    return s.replace("\\", "\\\\").replace("'", "\\'")

def build_yt_entry(p):
    parts = []
    parts.append(f"rank: {p['rank']}")
    parts.append(f"title: '{js_string(p['title'])}'")
    parts.append(f"countries: {p['countries']}")
    parts.append(f"highlights: '{js_string(p['highlights'])}'")
    parts.append(f"thumbnail: '{p['thumbnail']}'")
    parts.append(f"url: '{p['url']}'")
    return "    { " + ", ".join(parts) + " }"

def main():
    # Read kworb data
    with open(YT_JSON) as f:
        yt_data = json.load(f)

    # Build YouTube array lines
    yt_entries = []
    for p in yt_data["posts"][:20]:
        yt_entries.append(build_yt_entry(p))

    yt_block = "  youtube: [\n" + ",\n".join(yt_entries) + ",\n  ]"

    # Read current data.js
    with open(DATA_JS) as f:
        content = f.read()

    # Replace youtube array using regex
    # Match from "youtube: [" to the closing "]" before "shorts:" or next section
    pattern = r'  youtube: \[.*?\]'
    new_content = re.sub(pattern, yt_block, content, count=1, flags=re.DOTALL)

    # Verify replacement happened
    if "countries:" not in new_content:
        print("ERROR: Replacement failed!")
        return

    # Write back
    with open(DATA_JS, "w") as f:
        f.write(new_content)

    print(f"SUCCESS: Updated data.js with {len(yt_entries)} YouTube entries from kworb.net")
    # Show first 3 lines
    for line in yt_entries[:3]:
        print(line)

if __name__ == "__main__":
    main()
