/* global TRENDING_DATA */

/* ===== Storage Helper (cookie-based, iframe-safe) ===== */
var _store = {
  get: function(k) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  },
  set: function(k, v) {
    document.cookie = k + '=' + encodeURIComponent(v) + ';path=/;max-age=31536000';
  }
};

/* ===== Theme Toggle ===== */
(function () {
  var toggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  var stored = _store.get("theme");
  var d = stored || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  root.setAttribute("data-theme", d);

  function updateIcon() {
    if (!toggle) return;
    toggle.textContent = d === "dark" ? "☀ Light" : "🌙 Dark";
  }
  updateIcon();
  if (toggle) {
    toggle.addEventListener("click", function () {
      d = d === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", d);
      _store.set("theme", d);
      updateIcon();
    });
  }
})();

/* ===== Section Definitions ===== */
var SECTIONS = [
  { key: "reddit",     label: "/r/all",              icon: "🔥", type: "cards" },
  { key: "youtube",    label: "YouTube Top",          icon: "▶",  type: "bigvideo" },
  { key: "shorts",     label: "YouTube Shorts",       icon: "📱", type: "bigvideo" },
  { key: "tiktok",     label: "TikTok",               icon: "🎵", type: "bigvideo" },
  { key: "instagram",  label: "Instagram Reels",      icon: "📷", type: "bigvideo" },
  { key: "hackernews", label: "Hacker News",          icon: "📰", type: "list"  },
  { key: "piratebay",  label: "Pirate Bay Top 48h",   icon: "🏴", type: "list"  }
];

var activeSection = _store.get("activeSection") || "reddit";

/* ===== Date Label ===== */
document.getElementById("dateLabel").textContent = TRENDING_DATA.date;

/* ===== Helpers ===== */
function esc(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escAttr(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ===== Navigation ===== */
function buildNav() {
  var ul = document.getElementById("navList");
  var html = "";
  for (var i = 0; i < SECTIONS.length; i++) {
    var s = SECTIONS[i];
    var count = (TRENDING_DATA[s.key] || []).length;
    var cls = s.key === activeSection ? " active" : "";
    html += '<li class="nav-item' + cls + '" data-section="' + s.key + '">';
    html += '<span class="nav-icon">' + s.icon + '</span>';
    html += '<span class="nav-label">' + esc(s.label) + '</span>';
    html += '<span class="nav-badge">' + count + '</span>';
    html += '</li>';
  }
  ul.innerHTML = html;
}

function switchSection(key) {
  activeSection = key;
  _store.set("activeSection", key);

  var items = document.querySelectorAll(".nav-item");
  for (var i = 0; i < items.length; i++) {
    items[i].classList.toggle("active", items[i].getAttribute("data-section") === key);
  }
  renderFeed();
}

document.getElementById("navList").addEventListener("click", function(e) {
  var item = e.target.closest(".nav-item");
  if (!item) return;
  switchSection(item.getAttribute("data-section"));
});

/* ===== Thumbnail Hover Preview ===== */
var preview = document.getElementById("thumbPreview");
var previewImg = document.getElementById("thumbPreviewImg");
var previewVisible = false;

document.addEventListener("mouseover", function (e) {
  var link = e.target.closest("[data-thumb]");
  if (!link) return;
  var thumb = link.getAttribute("data-thumb");
  if (!thumb) return;
  previewImg.src = thumb;
  preview.classList.add("visible");
  previewVisible = true;
});
document.addEventListener("mouseout", function (e) {
  var link = e.target.closest("[data-thumb]");
  if (!link) return;
  preview.classList.remove("visible");
  previewVisible = false;
  previewImg.src = "";
});
document.addEventListener("mousemove", function (e) {
  if (!previewVisible) return;
  var x = e.clientX + 16;
  var y = e.clientY + 16;
  if (x + 330 > window.innerWidth) x = e.clientX - 330;
  if (y + 190 > window.innerHeight) y = e.clientY - 190;
  preview.style.left = x + "px";
  preview.style.top = y + "px";
});

/* ===== Card Renderers (Video-style sections) ===== */

function renderRedditCard(item) {
  var thumbAttr = "";
  var thumbSrc = "";
  if (item.thumbnail && item.thumbnail.length > 10) {
    thumbAttr = ' data-thumb="' + escAttr(item.thumbnail) + '"';
    thumbSrc = item.thumbnail;
  }
  var html = '<div class="post-card">';
  html += '<div class="post-rank-col"><span class="post-rank-num">' + item.rank + '</span>';
  if (item.upvotes) html += '<span class="post-score">' + esc(item.upvotes) + '</span>';
  html += '</div>';
  if (thumbSrc) {
    html += '<div class="post-thumb-col"><a href="' + escAttr(item.url) + '" target="_blank" rel="noopener"' + thumbAttr + '>';
    html += '<img src="' + escAttr(thumbSrc) + '" alt="" loading="lazy" onerror="this.parentElement.parentElement.style.display=\'none\'">';
    html += '</a></div>';
  }
  html += '<div class="post-content-col">';
  html += '<a class="post-title" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="post-meta">';
  if (item.subreddit) html += '<span class="meta-tag subreddit">' + esc(item.subreddit) + '</span>';
  if (item.comments) html += '<span class="meta-tag">' + esc(item.comments) + ' comments</span>';
  html += '</div></div></div>';
  return html;
}

function renderYouTubeCard(item) {
  var thumbSrc = item.thumbnail || '';
  var html = '<div class="big-card">';
  html += '<a class="big-card-thumb" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">';
  if (thumbSrc) html += '<img src="' + escAttr(thumbSrc) + '" alt="" loading="lazy">';
  html += '<span class="play-overlay"></span>';
  html += '<span class="rank-badge">' + item.rank + '</span>';
  html += '</a>';
  html += '<div class="big-card-body">';
  html += '<a class="post-title" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="post-meta">';
  if (item.countries) html += '<span class="meta-tag countries">' + item.countries + ' countries</span>';
  if (item.highlights) html += '<span class="meta-tag">' + esc(item.highlights) + '</span>';
  html += '</div></div></div>';
  return html;
}

function renderShortsCard(item) {
  var thumbSrc = item.thumbnail || '';
  var html = '<div class="big-card">';
  html += '<a class="big-card-thumb" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">';
  if (thumbSrc) html += '<img src="' + escAttr(thumbSrc) + '" alt="" loading="lazy">';
  html += '<span class="play-overlay"></span>';
  html += '<span class="rank-badge">' + item.rank + '</span>';
  if (item.views) html += '<span class="views-badge">' + esc(item.views) + ' views</span>';
  html += '</a>';
  html += '<div class="big-card-body">';
  html += '<a class="post-title" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="post-meta">';
  if (item.channel) html += '<span class="meta-tag creator">' + esc(item.channel) + '</span>';
  if (item.views) html += '<span class="meta-tag views">' + esc(item.views) + ' views</span>';
  html += '</div></div></div>';
  return html;
}

function renderTikTokCard(item) {
  var thumbSrc = item.thumbnail || '';
  var html = '<div class="big-card">';
  html += '<a class="big-card-thumb" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">';
  if (thumbSrc) html += '<img src="' + escAttr(thumbSrc) + '" alt="" loading="lazy">';
  html += '<span class="play-overlay"></span>';
  html += '<span class="rank-badge">' + item.rank + '</span>';
  if (item.views) html += '<span class="views-badge">' + esc(item.views) + ' views</span>';
  html += '</a>';
  html += '<div class="big-card-body">';
  html += '<a class="post-title" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="post-meta">';
  if (item.creator) html += '<span class="meta-tag creator">' + esc(item.creator) + '</span>';
  if (item.views) html += '<span class="meta-tag views">' + esc(item.views) + ' views</span>';
  html += '</div></div></div>';
  return html;
}

function renderInstagramCard(item) {
  var thumbSrc = item.thumbnail || '';
  var html = '<div class="big-card">';
  html += '<a class="big-card-thumb" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">';
  if (thumbSrc) html += '<img src="' + escAttr(thumbSrc) + '" alt="" loading="lazy">';
  html += '<span class="play-overlay"></span>';
  html += '<span class="rank-badge">' + item.rank + '</span>';
  html += '</a>';
  html += '<div class="big-card-body">';
  html += '<a class="post-title" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="post-meta">';
  if (item.creator) html += '<span class="meta-tag creator">' + esc(item.creator) + '</span>';
  if (item.views) html += '<span class="meta-tag views">' + esc(item.views) + '</span>';
  html += '</div></div></div>';
  return html;
}

/* ===== Table Renderers (List-style sections) ===== */

function renderHNTable(items) {
  var html = '<table class="list-table">';
  html += '<thead><tr>';
  html += '<th class="col-num">#</th>';
  html += '<th>Title</th>';
  html += '<th class="col-pts">Points</th>';
  html += '<th class="col-cmt">Comments</th>';
  html += '<th class="col-domain">Domain</th>';
  html += '</tr></thead><tbody>';
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    html += '<tr>';
    html += '<td class="col-num">' + it.rank + '</td>';
    html += '<td><a href="' + escAttr(it.url) + '" target="_blank" rel="noopener">' + esc(it.title) + '</a></td>';
    html += '<td class="col-pts">' + esc(it.points) + '</td>';
    html += '<td class="col-cmt">' + esc(it.comments) + '</td>';
    html += '<td class="col-domain">' + esc(it.domain || '') + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function renderTPBTable(items) {
  var html = '<table class="list-table">';
  html += '<thead><tr>';
  html += '<th class="col-num">#</th>';
  html += '<th>Name</th>';
  html += '<th class="col-se">SE</th>';
  html += '<th class="col-le">LE</th>';
  html += '<th class="col-size">Size</th>';
  html += '<th class="col-cat">Category</th>';
  html += '</tr></thead><tbody>';
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    html += '<tr>';
    html += '<td class="col-num">' + it.rank + '</td>';
    html += '<td><a href="' + escAttr(it.url) + '" target="_blank" rel="noopener">' + esc(it.title) + '</a></td>';
    html += '<td class="col-se">' + esc(it.seeders) + '</td>';
    html += '<td class="col-le">' + esc(it.leechers) + '</td>';
    html += '<td class="col-size">' + esc(it.size) + '</td>';
    html += '<td class="col-cat">' + esc(it.category) + '</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

/* ===== Feed Renderer ===== */
function renderFeed() {
  var sec = null;
  for (var i = 0; i < SECTIONS.length; i++) {
    if (SECTIONS[i].key === activeSection) { sec = SECTIONS[i]; break; }
  }
  if (!sec) return;

  var data = TRENDING_DATA[sec.key] || [];
  document.getElementById("feedTitle").textContent = sec.icon + " " + sec.label;
  document.getElementById("feedCount").textContent = data.length + " items";

  var container = document.getElementById("feedContent");
  var html = "";

  if (sec.type === "list") {
    if (sec.key === "hackernews") {
      html = renderHNTable(data);
    } else if (sec.key === "piratebay") {
      html = renderTPBTable(data);
    }
  } else if (sec.type === "cards") {
    for (var j = 0; j < data.length; j++) {
      html += renderRedditCard(data[j]);
    }
  } else if (sec.type === "bigvideo") {
    for (var j = 0; j < data.length; j++) {
      switch (sec.key) {
        case "youtube":   html += renderYouTubeCard(data[j]); break;
        case "shorts":    html += renderShortsCard(data[j]); break;
        case "tiktok":    html += renderTikTokCard(data[j]); break;
        case "instagram": html += renderInstagramCard(data[j]); break;
      }
    }
  }

  container.innerHTML = html;
  container.scrollTop = 0;
}

/* ===== Init ===== */
buildNav();
renderFeed();
