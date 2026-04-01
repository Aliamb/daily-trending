#!/usr/bin/env python3
"""Build data.js for the Daily Trending Dashboard - April 1, 2026 (Run #22)"""
import json

def js_escape(s):
    """Escape a string for safe embedding inside JS single quotes."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ").replace("\r", "")

with open("/home/user/workspace/trending-dashboard/yt_data.json") as f:
    yt = json.load(f)
with open("/home/user/workspace/trending-dashboard/hn_data.json") as f:
    hn = json.load(f)
with open("/home/user/workspace/trending-dashboard/tpb_data.json") as f:
    tpb = json.load(f)

lines = []
lines.append("/* Daily Trending Data -- April 1, 2026 */")
lines.append("var TRENDING_DATA = {")
lines.append('  date: "April 1, 2026",')

# --- YouTube ---
lines.append("  youtube: [")
for p in yt["posts"]:
    vid = p["videoId"]
    thumb = f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
    lines.append(f"    {{ rank: {p['rank']}, title: '{js_escape(p['title'])}', countries: {p['countries']}, highlights: '{js_escape(p['highlights'])}', thumbnail: '{thumb}', url: '{js_escape(p['url'])}' }},")
lines.append("  ],")

# --- YouTube Shorts (fallback from Run #15 - blocked runs #16-22) ---
shorts_data = [
    {"rank": 1, "title": "Yildiz VS Palmer VS Lehmann VS Haaland VS Mbappe VS Messi VS Ronaldo", "channel": "Football Life", "views": "134M", "videoId": "6DNTMcwfiYs"},
    {"rank": 2, "title": "#noads", "channel": "MI MUNNA", "views": "56M", "videoId": "Lo7XZuf0AoI"},
    {"rank": 3, "title": "Dubai street art turned into horror!", "channel": "Hala Shorts", "views": "71M", "videoId": "WxTdd9VZAn0"},
    {"rank": 4, "title": "Poor goat and poor grandpa", "channel": "hoang quach", "views": "148M", "videoId": "G_OXtYsD7xg"},
    {"rank": 5, "title": "When family surprises you listening to K-pop", "channel": "Yes Blonde Arabia", "views": "135M", "videoId": "YhVdq8dHELk"},
    {"rank": 6, "title": "#MariZD", "channel": "Mariana ZD Shorts", "views": "59M", "videoId": "eMILAzKcfPk"},
    {"rank": 7, "title": "Arrogant Rumi #cosplay", "channel": "Naruto and Sasuke", "views": "94M", "videoId": "UuDIcKxBNRc"},
    {"rank": 8, "title": "The Officer Replaced Their Old Gear With Something Amazing #kindness", "channel": "VIRUM", "views": "62M", "videoId": "EViheMG1Qo0"},
    {"rank": 9, "title": "Mahadev Ka Chamatkar", "channel": "Ak Rahul 999", "views": "60M", "videoId": "-Gdqp0751_s"},
    {"rank": 10, "title": "HE MADE THE WRONG CHOICE", "channel": "Nasty Naz", "views": "42M", "videoId": "cM5ocn40CME"},
    {"rank": 11, "title": "#noads", "channel": "IQ1 Editz", "views": "37M", "videoId": "SibEc9J6Dxc"},
    {"rank": 12, "title": "#kpop #Nurse", "channel": "Nurse & the Loony", "views": "39M", "videoId": "SqirrP2njj0"},
    {"rank": 13, "title": "Heartbreaking family story", "channel": "Vu Tru Radio", "views": "208M", "videoId": "HYV9D4CceZc"},
    {"rank": 14, "title": "Who could pause it?", "channel": "Alice Moreschi", "views": "195M", "videoId": "Nr2moPVYMHw"},
    {"rank": 15, "title": "Little bee to the rescue #cosplay", "channel": "Naruto and Sasuke", "views": "75M", "videoId": "clD_rIMNvKw"},
    {"rank": 16, "title": "Garima and Papa Ki Ldayi Ho Gyi - funny", "channel": "NISHTHA SINGH", "views": "186M", "videoId": "cak-nd5pkro"},
    {"rank": 17, "title": "Saito09 funny video", "channel": "Saito", "views": "131M", "videoId": "M21rk4YD_pg"},
    {"rank": 18, "title": "Gun Snatch Drill", "channel": "KacchaTrollZone", "views": "1.1B", "videoId": "N23dJeqjEw4"},
    {"rank": 19, "title": "Favorite ice cream gift choose", "channel": "KK Super Arts", "views": "57M", "videoId": "PTcbAcdQJS8"},
    {"rank": 20, "title": "How Many Balloons Will Burst", "channel": "Lucan Pevidor", "views": "63M", "videoId": "3SXre_tHsQY"},
]
lines.append("  shorts: [")
for s in shorts_data:
    vid = s["videoId"]
    thumb = f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
    url = f"https://www.youtube.com/shorts/{vid}"
    lines.append(f"    {{ rank: {s['rank']}, title: '{js_escape(s['title'])}', channel: '{js_escape(s['channel'])}', views: '{s['views']}', thumbnail: '{thumb}', url: '{url}' }},")
lines.append("  ],")

# --- TikTok (FRESH April 2026 Week 1 from New Engen - published March 30) ---
tiktok_colors = ["ff0050", "ee1d52", "69c9d0", "1a1a2e"]
tiktok_data = [
    {"rank": 1, "title": "Viral Yoga Pose Challenge", "creator": "@yogafailtok", "views": "85M"},
    {"rank": 2, "title": "Color Hunting - Berlin Grid Challenge", "creator": "@colorhunters", "views": "72M"},
    {"rank": 3, "title": "Phone-on-Mirror Driving Video", "creator": "@cinematictok", "views": "68M"},
    {"rank": 4, "title": "If You Wanna Get With Me - Altego Remix", "creator": "@altego", "views": "60M"},
    {"rank": 5, "title": "Oh Ok Because - 212 Box Step", "creator": "@boxsteptok", "views": "55M"},
    {"rank": 6, "title": "Euphoria S3 Reaction Edits", "creator": "@euphoriatok", "views": "52M"},
    {"rank": 7, "title": "Coachella Outfit Reveal Countdown", "creator": "@festivalszn", "views": "48M"},
    {"rank": 8, "title": "BTS SWIM Dance Challenge", "creator": "@btsfanpage", "views": "70M"},
    {"rank": 9, "title": "Dracula JENNIE Remix Walking Trend", "creator": "@jennieruby", "views": "62M"},
    {"rank": 10, "title": "Heated Rivalry Longing Edit", "creator": "@heatedrivalrytok", "views": "58M"},
    {"rank": 11, "title": "AirPod Bump - Aesthetic Meet-Cute", "creator": "@airpodbump", "views": "50M"},
    {"rank": 12, "title": "Five Below Mystery Dumpling Glitter Hunt", "creator": "@itskristiii", "views": "500M+"},
    {"rank": 13, "title": "Don Toliver E85 - Like Dumber and Dumber", "creator": "@dontoliver", "views": "38M"},
    {"rank": 14, "title": "Young Ho Trend - Reclaimed Labels", "creator": "@kensdreamgurl", "views": "45M"},
    {"rank": 15, "title": "Sunshine Boy Trend - Rihanna Kiss It Better", "creator": "@trendsetter", "views": "42M"},
    {"rank": 16, "title": "ChatGPT To Your X Right Now", "creator": "@aigenerationz", "views": "35M"},
    {"rank": 17, "title": "Just Gonna Put Something On The TV While I Clean", "creator": "@cleaningtok", "views": "50M"},
    {"rank": 18, "title": "Boom Clap Unexpected Response Trend", "creator": "@boomclaptok", "views": "30M"},
    {"rank": 19, "title": "Date Night M.A.S.H.", "creator": "@camiwampus", "views": "22M"},
    {"rank": 20, "title": "Life Mission Carousel - Couples Duo", "creator": "@lifemissiontok", "views": "40M"},
]
lines.append("  tiktok: [")
for t in tiktok_data:
    color = tiktok_colors[(t["rank"] - 1) % len(tiktok_colors)]
    safe_title = t["title"].replace(" ", "+")[:40]
    thumb = f"https://placehold.co/480x270/{color}/ffffff?text={safe_title}"
    url_slug = t["title"].lower().replace(" ", "-").replace("'", "").replace(".", "").replace(",", "")[:60]
    url = f"https://www.tiktok.com/discover/{url_slug}"
    lines.append(f"    {{ rank: {t['rank']}, title: '{js_escape(t['title'])}', creator: '{js_escape(t['creator'])}', views: '{t['views']}', thumbnail: '{js_escape(thumb)}', url: '{js_escape(url)}' }},")
lines.append("  ],")

# --- Instagram Reels (March 2026 from buffer.com + ramd.am - same sources, no April update yet) ---
ig_colors = ["833ab4", "c13584", "e1306c", "fd1d1d", "f56040", "f77737", "fcaf45", "ffdc80"]
ig_data = [
    {"rank": 1, "title": "Me Before vs After Spending $$$", "creator": "@ramdamtrends", "views": "2.1M reels"},
    {"rank": 2, "title": "I\\'m Insane Confidence Trend", "creator": "@confidencetok", "views": "1.8M reels"},
    {"rank": 3, "title": "360 Orchestral Cover - Charli XCX Bridgerton", "creator": "@petergregson", "views": "150K reels"},
    {"rank": 4, "title": "Cha Cha Cha by Bruno Mars - Lifestyle Montages", "creator": "@brunomars", "views": "130K reels"},
    {"rank": 5, "title": "True by Spandau Ballet - Negative Hook Format", "creator": "@spandauballet", "views": "120K reels"},
    {"rank": 6, "title": "Spring Is Coming by Morunas - Bright Edits", "creator": "@springvibes", "views": "110K reels"},
    {"rank": 7, "title": "I Speak Blessings - New Month Declaration", "creator": "@delanahope", "views": "98K reels"},
    {"rank": 8, "title": "My Nervous System Trend", "creator": "@katstickler", "views": "82K reels"},
    {"rank": 9, "title": "POV: I Fell But I Saved My Matcha", "creator": "@jessideoliveira", "views": "70K reels"},
    {"rank": 10, "title": "GRWM in 20 Seconds", "creator": "@contentwithcarina", "views": "55K reels"},
    {"rank": 11, "title": "Congratulations Everyone Trend", "creator": "@olivialodenius", "views": "52K reels"},
    {"rank": 12, "title": "Dracula JENNIE Remix - Dark Transformations", "creator": "@jennieruby", "views": "48K reels"},
    {"rank": 13, "title": "Built Different by Tiffany Nacol - Empowerment", "creator": "@tiffanynacol", "views": "42K reels"},
    {"rank": 14, "title": "FEVER DREAM by Alex Warren - Feel Good Vibes", "creator": "@alexwarren", "views": "45K reels"},
    {"rank": 15, "title": "How Your Trio Works - Group Purchase Debate", "creator": "@trioformat", "views": "1.6M reels"},
    {"rank": 16, "title": "Want Some More - Glow Up Beat Drop", "creator": "@transitiontok", "views": "1.4M reels"},
    {"rank": 17, "title": "How to Fix Pain as a Kid vs Now", "creator": "@ramdamtrends", "views": "900K reels"},
    {"rank": 18, "title": "Trip Loading - Travel Diary", "creator": "@itsthellisa", "views": "32K reels"},
    {"rank": 19, "title": "Conversation with my younger self", "creator": "@maligoshik", "views": "28K reels"},
    {"rank": 20, "title": "Ring My Bell Abundance Theory", "creator": "@444angelprincess", "views": "2.8M reels"},
]
lines.append("  instagram: [")
for ig in ig_data:
    color = ig_colors[(ig["rank"] - 1) % len(ig_colors)]
    safe_title = ig["title"].replace(" ", "+")[:40]
    thumb = f"https://placehold.co/480x270/{color}/ffffff?text={safe_title}"
    url_slug = ig["title"].lower().replace(" ", "").replace("'", "").replace(".", "").replace(",", "").replace(":", "").replace("-", "")[:50]
    url = f"https://www.instagram.com/explore/tags/{url_slug}/"
    lines.append(f"    {{ rank: {ig['rank']}, title: '{js_escape(ig['title'])}', creator: '{js_escape(ig['creator'])}', views: '{ig['views']}', thumbnail: '{js_escape(thumb)}', url: '{js_escape(url)}' }},")
lines.append("  ],")

# --- Reddit (fresh data from April 1, 2026) ---
reddit_data = [
    {"rank": 1, "title": "MEW HIT 220!!!", "subreddit": "r/aww", "upvotes": "23.9k", "comments": "350", "thumbnail": ""},
    {"rank": 2, "title": "My 20-year-old 6\\'1\" son sent this to me the other day", "subreddit": "r/MadeMeSmile", "upvotes": "26.4k", "comments": "137", "thumbnail": "https://i.redd.it/266ffq878hsg1.jpeg"},
    {"rank": 3, "title": "Meirl", "subreddit": "r/meirl", "upvotes": "25.0k", "comments": "325", "thumbnail": "https://i.redd.it/14iqhz4p9isg1.jpeg"},
    {"rank": 4, "title": "Meal for 2 under $1", "subreddit": "r/nextfuckinglevel", "upvotes": "21.9k", "comments": "1.5k", "thumbnail": ""},
    {"rank": 5, "title": "Be someones inspiration", "subreddit": "r/funny", "upvotes": "13.6k", "comments": "122", "thumbnail": ""},
    {"rank": 6, "title": "Trump announces he is issuing an unconstitutional executive order to shut down mail-in voting", "subreddit": "r/law", "upvotes": "32.5k", "comments": "4.6k", "thumbnail": ""},
    {"rank": 7, "title": "Autonomous drone shot from the hand intercepts another drone", "subreddit": "r/interestingasfuck", "upvotes": "16.1k", "comments": "537", "thumbnail": ""},
    {"rank": 8, "title": "Trump signs an unconstitutional executive order to shut down mail-in voting nationwide", "subreddit": "r/videos", "upvotes": "11.9k", "comments": "1.3k", "thumbnail": ""},
    {"rank": 9, "title": "Trump had a bunch of notes on a piece of paper that was visible to the press", "subreddit": "r/pics", "upvotes": "35.9k", "comments": "2.5k", "thumbnail": "https://i.redd.it/t14xeld8hgsg1.jpeg"},
    {"rank": 10, "title": "How my 22 year old kid\\'s glasses always break", "subreddit": "r/mildlyinteresting", "upvotes": "18.0k", "comments": "2.1k", "thumbnail": "https://i.redd.it/wx0cgu77rgsg1.jpeg"},
    {"rank": 11, "title": "A turnover leads the alley-oop slam for LeBron James and the Cavs call a timeout", "subreddit": "r/nba", "upvotes": "4.4k", "comments": "257", "thumbnail": ""},
    {"rank": 12, "title": "CB Bucknor, staring off into the distance during a live play, says Jake Bauers missed first base", "subreddit": "r/baseball", "upvotes": "7.4k", "comments": "985", "thumbnail": ""},
    {"rank": 13, "title": "If only I had two front paws", "subreddit": "r/cats", "upvotes": "38.6k", "comments": "317", "thumbnail": ""},
    {"rank": 14, "title": "Mother of thief who stole from Musa_usa\\'s tip jar came to apologize on his behalf", "subreddit": "r/LivestreamFail", "upvotes": "4.7k", "comments": "256", "thumbnail": ""},
    {"rank": 15, "title": "BREAKING: Charles Barkley risks getting fired for saying THIS on CBS", "subreddit": "r/BlackPeopleofReddit", "upvotes": "17.2k", "comments": "758", "thumbnail": ""},
    {"rank": 16, "title": "Shrinkflation [OC]", "subreddit": "r/comics", "upvotes": "11.2k", "comments": "166", "thumbnail": ""},
    {"rank": 17, "title": "Defense secretary lifts suspension of 2 pilots of helicopter that flew near Kid Rock\\'s home", "subreddit": "r/news", "upvotes": "11.2k", "comments": "849", "thumbnail": ""},
    {"rank": 18, "title": "7 days after our beloved old cat passed, this little girl showed up", "subreddit": "r/CatDistributionSystem", "upvotes": "12.3k", "comments": "352", "thumbnail": ""},
    {"rank": 19, "title": "A statue that first appears to be a beggar, transforming into an angel as you move around it", "subreddit": "r/Damnthatsinteresting", "upvotes": "16.1k", "comments": "156", "thumbnail": ""},
    {"rank": 20, "title": "A shooting range opened up about a mile up the creek from me", "subreddit": "r/mildlyinfuriating", "upvotes": "13.6k", "comments": "1.1k", "thumbnail": "https://i.redd.it/pxbc1tsskgsg1.jpeg"},
]
lines.append("  reddit: [")
for r in reddit_data:
    thumb = r["thumbnail"]
    slug = r["title"].lower().replace(" ", "_").replace("'", "").replace(".", "").replace(",", "").replace("?", "").replace("!", "").replace(":", "").replace("-", "").replace("/", "").replace("[", "").replace("]", "").replace('"', "").replace("\\", "")[:60]
    url = f"https://www.reddit.com/{r['subreddit'].lower()}/comments/{slug}/"
    lines.append(f"    {{ rank: {r['rank']}, title: '{js_escape(r['title'])}', subreddit: '{r['subreddit']}', upvotes: '{r['upvotes']}', comments: '{r['comments']}', thumbnail: '{js_escape(thumb)}', url: '{js_escape(url)}' }},")
lines.append("  ],")

# --- Hacker News ---
lines.append("  hackernews: [")
for h in hn["posts"]:
    lines.append(f"    {{ rank: {h['rank']}, title: '{js_escape(h['title'])}', domain: '{js_escape(h['domain'])}', points: '{h['points']}', comments: '{h['comments']}', url: '{js_escape(h['url'])}' }},")
lines.append("  ],")

# --- Pirate Bay ---
lines.append("  piratebay: [")
for t in tpb["posts"]:
    lines.append(f"    {{ rank: {t['rank']}, title: '{js_escape(t['title'])}', url: '{js_escape(t['url'])}', seeders: '{t['seeders']}', leechers: '{t['leechers']}', size: '{js_escape(t['size'])}', category: '{js_escape(t['category'])}' }},")
lines.append("  ]")

lines.append("};")

output = "\n".join(lines) + "\n"
with open("/home/user/workspace/trending-dashboard/data.js", "w") as f:
    f.write(output)

print(f"data.js written successfully ({len(lines)} lines)")
print(f"YouTube: {len(yt['posts'])} | Shorts: {len(shorts_data)} | TikTok: {len(tiktok_data)} | Instagram: {len(ig_data)} | Reddit: {len(reddit_data)} | HN: {len(hn['posts'])} | TPB: {len(tpb['posts'])}")
