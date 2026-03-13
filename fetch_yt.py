#!/usr/bin/env python3
"""
Fetch top 20 most popular YouTube videos worldwide from kworb.net.
This tracks videos by how many countries they are trending in,
covering ALL video types (music, gaming, trailers, etc).
Output: yt_data.json
"""
import json
import re
import urllib.request

URL = "https://kworb.net/youtube/trending_overall.html"

def fetch_trending():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8")

    # HTML structure:
    # <tr><td>RANK</td><td>CHANGE</td><td class="text"><div><a href="/youtube/trending/video/VIDEO_ID.html">TITLE</a></div></td>
    # <td>COUNTRIES</td><td class="mp text"><div>HIGHLIGHTS</div></td></tr>
    rows = re.findall(
        r'<tr><td>(\d+)</td><td>([^<]*)</td><td class="text"><div><a href="/youtube/trending/video/([^"]+)\.html">(.+?)</a></div></td>\s*<td>(\d+)</td><td class="mp text"><div>([^<]*)</div></td></tr>',
        html
    )

    posts = []
    for i, row in enumerate(rows[:20]):
        rank_str, change, video_id, title, countries, highlights = row
        posts.append({
            "rank": i + 1,
            "title": title.strip(),
            "videoId": video_id.strip(),
            "countries": int(countries),
            "highlights": highlights.strip(),
            "thumbnail": f"https://i.ytimg.com/vi/{video_id.strip()}/hqdefault.jpg",
            "url": f"https://www.youtube.com/watch?v={video_id.strip()}"
        })

    output = {"posts": posts, "source": "kworb.net/youtube/trending_overall.html"}
    out_path = "/home/user/workspace/trending-dashboard/yt_data.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(json.dumps(posts[:3], indent=2, ensure_ascii=False))
    print(f"\n--- Fetched {len(posts)} videos, saved to yt_data.json ---")
    return posts

if __name__ == "__main__":
    fetch_trending()
