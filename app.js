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
    toggle.setAttribute("aria-label", "Switch to " + (d === "dark" ? "light" : "dark") + " mode");
    toggle.innerHTML = d === "dark"
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
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

/* ===== Date Label ===== */
document.getElementById("dateLabel").textContent = TRENDING_DATA.date;

/* ===== Helpers ===== */
function esc(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
  var pw = 324;
  var ph = 184;
  if (x + pw > window.innerWidth) x = e.clientX - pw - 8;
  if (y + ph > window.innerHeight) y = e.clientY - ph - 8;
  preview.style.left = x + "px";
  preview.style.top = y + "px";
});

/* ===== Render Helpers ===== */
function renderSection(title, items, renderItemFn) {
  var html = '<div class="section">';
  html += '<h2 class="section-title">' + title + '</h2>';
  for (var i = 0; i < items.length; i++) {
    html += renderItemFn(items[i], i);
  }
  html += '</div>';
  return html;
}

/* ===== YouTube item ===== */
function renderYouTubeItem(item, idx) {
  var thumbAttr = item.thumbnail ? ' data-thumb="' + escAttr(item.thumbnail) + '"' : '';
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener"' + thumbAttr + '>' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.countries) {
    html += '<span class="meta-badge countries">' + item.countries + ' countries</span>';
  }
  if (item.views) {
    html += '<span class="meta-badge views">' + esc(item.views) + '</span>';
  }
  if (item.highlights) {
    html += '<span class="meta-badge domain">' + esc(item.highlights) + '</span>';
  }
  if (item.channel) {
    html += '<span class="meta-badge channel">' + esc(item.channel) + '</span>';
  }
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== Shorts item ===== */
function renderShortsItem(item, idx) {
  var thumbAttr = item.thumbnail ? ' data-thumb="' + escAttr(item.thumbnail) + '"' : '';
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener"' + thumbAttr + '>' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.views) html += '<span class="meta-badge views">' + esc(item.views) + ' views</span>';
  if (item.channel) html += '<span class="meta-badge channel">' + esc(item.channel) + '</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== TikTok item ===== */
function renderTikTokItem(item, idx) {
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.views) html += '<span class="meta-badge views">' + esc(item.views) + ' views</span>';
  if (item.creator) html += '<span class="meta-badge creator">' + esc(item.creator) + '</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== Instagram item ===== */
function renderInstagramItem(item, idx) {
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.views) html += '<span class="meta-badge views">' + esc(item.views) + '</span>';
  if (item.creator) html += '<span class="meta-badge creator">' + esc(item.creator) + '</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== Reddit item ===== */
function renderRedditItem(item, idx) {
  var thumbAttr = '';
  if (item.thumbnail && item.thumbnail.length > 10 && (item.thumbnail.indexOf("redd.it") !== -1)) {
    thumbAttr = ' data-thumb="' + escAttr(item.thumbnail) + '"';
  }
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener"' + thumbAttr + '>' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.subreddit) html += '<span class="meta-badge subreddit">' + esc(item.subreddit) + '</span>';
  if (item.upvotes) html += '<span class="meta-badge upvotes">' + esc(item.upvotes) + '</span>';
  if (item.comments) html += '<span class="meta-badge domain">' + esc(item.comments) + ' comments</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== HackerNews item ===== */
function renderHNItem(item, idx) {
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.points) html += '<span class="meta-badge points">' + esc(item.points) + ' pts</span>';
  if (item.comments) html += '<span class="meta-badge domain">' + esc(item.comments) + ' comments</span>';
  if (item.domain) html += '<span class="meta-badge domain">' + esc(item.domain) + '</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== Pirate Bay item ===== */
function renderTPBItem(item, idx) {
  var html = '<div class="list-item">';
  html += '<span class="list-item-rank">' + item.rank + '</span>';
  html += '<div class="list-item-content">';
  html += '<a class="list-item-link" href="' + escAttr(item.url) + '" target="_blank" rel="noopener">' + esc(item.title) + '</a>';
  html += '<div class="list-item-meta">';
  if (item.seeders) html += '<span class="meta-badge seeders">SE: ' + esc(item.seeders) + '</span>';
  if (item.leechers) html += '<span class="meta-badge leechers">LE: ' + esc(item.leechers) + '</span>';
  if (item.size) html += '<span class="meta-badge size">' + esc(item.size) + '</span>';
  if (item.category) html += '<span class="meta-badge category">' + esc(item.category) + '</span>';
  html += '</div>';
  html += '</div></div>';
  return html;
}

/* ===== Build Full Page ===== */
function render() {
  var content = document.getElementById("content");
  var leftCol = '';
  var rightCol = '';

  // LEFT column
  leftCol += renderSection("/r/all - Top Today", TRENDING_DATA.reddit || [], renderRedditItem);
  leftCol += renderSection("YouTube - Most Popular Worldwide", TRENDING_DATA.youtube || [], renderYouTubeItem);
  leftCol += renderSection("YouTube Shorts", TRENDING_DATA.shorts || [], renderShortsItem);
  leftCol += renderSection("TikTok Trending", TRENDING_DATA.tiktok || [], renderTikTokItem);

  // RIGHT column
  rightCol += renderSection("HackerNews", TRENDING_DATA.hackernews || [], renderHNItem);
  rightCol += renderSection("Pirate Bay - Top 48h", TRENDING_DATA.piratebay || [], renderTPBItem);
  rightCol += renderSection("Instagram Reels", TRENDING_DATA.instagram || [], renderInstagramItem);

  content.innerHTML =
    '<div class="col col-left">' + leftCol + '</div>' +
    '<div class="col col-right">' + rightCol + '</div>';
}

render();
