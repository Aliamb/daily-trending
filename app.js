/* global TRENDING_DATA */
/* ===== Theme Toggle ===== */
(function () {
  var toggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;
  var d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", d);

  function updateIcon() {
    if (!toggle) return;
    toggle.setAttribute("aria-label", "Switch to " + (d === "dark" ? "light" : "dark") + " mode");
    toggle.innerHTML = d === "dark"
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  updateIcon();

  if (toggle) {
    toggle.addEventListener("click", function () {
      d = d === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", d);
      updateIcon();
    });
  }
})();

/* ===== Date Label ===== */
document.getElementById("dateLabel").textContent = TRENDING_DATA.date;

/* ===== Tab Switching ===== */
var tabs = document.querySelectorAll(".tab");
var content = document.getElementById("content");
var currentTab = "youtube";

function escapeHtml(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ===== Platform color fallbacks for broken thumbnails ===== */
var FALLBACK_COLORS = {
  youtube: { bg: "292524", fg: "ef4444", text: "YT" },
  shorts: { bg: "292524", fg: "ef4444", text: "Shorts" },
  tiktok: { bg: "1a1a2e", fg: "e7e5e4", text: "TikTok" },
  instagram: { bg: "833ab4", fg: "ffffff", text: "Reels" },
  reddit: { bg: "ff4500", fg: "ffffff", text: "Reddit" }
};

function getFallbackThumb(platform) {
  var c = FALLBACK_COLORS[platform] || FALLBACK_COLORS.youtube;
  return "https://placehold.co/480x270/" + c.bg + "/" + c.fg + "?text=" + c.text;
}

/* ===== Render: YouTube & Shorts (thumbnail cards) ===== */
function renderYouTube(items, label, platform) {
  var fallback = getFallbackThumb(platform);
  var html = '<div class="section-header">';
  html += '<h2 class="section-title">' + escapeHtml(label) + '</h2>';
  html += '<span class="section-count">Top 20</span>';
  html += '</div>';
  html += '<div class="card-grid">';

  items.forEach(function (item) {
    var thumbSrc = item.thumbnail || fallback;
    var itemUrl = item.url || "#";
    html += '<a href="' + escapeAttr(itemUrl) + '" target="_blank" rel="noopener noreferrer" class="card-link">';
    html += '<article class="card">';
    html += '  <div class="card-thumb">';
    html += '    <img src="' + escapeAttr(thumbSrc) + '" alt="' + escapeAttr(item.title) + '" loading="lazy" width="480" height="270" onerror="this.src=\'' + escapeAttr(fallback) + '\'">';
    html += '    <span class="card-rank">' + item.rank + '</span>';
    html += '    <span class="card-views-badge">' + escapeHtml(item.views) + ' views</span>';
    html += '  </div>';
    html += '  <div class="card-body">';
    html += '    <h3 class="card-title">' + escapeHtml(item.title) + '</h3>';
    html += '    <p class="card-meta"><span>' + escapeHtml(item.channel || item.creator || "") + '</span></p>';
    html += '  </div>';
    html += '</article>';
    html += '</a>';
  });

  html += '</div>';
  return html;
}

/* ===== Render: TikTok (thumbnail cards) ===== */
function renderTikTok(items) {
  var fallback = getFallbackThumb("tiktok");
  var html = '<div class="section-header">';
  html += '<h2 class="section-title">TikTok Trending</h2>';
  html += '<span class="section-count">Top 20</span>';
  html += '</div>';
  html += '<div class="card-grid">';

  items.forEach(function (item) {
    var thumbSrc = item.thumbnail || fallback;
    var itemUrl = item.url || "#";
    html += '<a href="' + escapeAttr(itemUrl) + '" target="_blank" rel="noopener noreferrer" class="card-link">';
    html += '<article class="card">';
    html += '  <div class="card-thumb">';
    html += '    <img src="' + escapeAttr(thumbSrc) + '" alt="' + escapeAttr(item.title) + '" loading="lazy" width="480" height="270" onerror="this.src=\'' + escapeAttr(fallback) + '\'">';
    html += '    <span class="card-rank">' + item.rank + '</span>';
    html += '    <span class="card-views-badge">' + escapeHtml(item.views) + ' views</span>';
    html += '  </div>';
    html += '  <div class="card-body">';
    html += '    <h3 class="card-title">' + escapeHtml(item.title) + '</h3>';
    html += '    <p class="card-meta"><span>' + escapeHtml(item.creator) + '</span></p>';
    html += '  </div>';
    html += '</article>';
    html += '</a>';
  });

  html += '</div>';
  return html;
}

/* ===== Render: Instagram (thumbnail cards) ===== */
function renderInstagram(items) {
  var fallback = getFallbackThumb("instagram");
  var html = '<div class="section-header">';
  html += '<h2 class="section-title">Instagram Reels</h2>';
  html += '<span class="section-count">Top 20</span>';
  html += '</div>';
  html += '<div class="card-grid">';

  items.forEach(function (item) {
    var thumbSrc = (item.thumbnail && item.thumbnail.length > 40) ? item.thumbnail : fallback;
    var itemUrl = item.url || "#";
    html += '<a href="' + escapeAttr(itemUrl) + '" target="_blank" rel="noopener noreferrer" class="card-link">';
    html += '<article class="card">';
    html += '  <div class="card-thumb">';
    html += '    <img src="' + escapeAttr(thumbSrc) + '" alt="' + escapeAttr(item.title) + '" loading="lazy" width="480" height="270" onerror="this.src=\'' + escapeAttr(fallback) + '\'">';
    html += '    <span class="card-rank">' + item.rank + '</span>';
    html += '    <span class="card-views-badge">' + escapeHtml(item.views) + ' views</span>';
    html += '  </div>';
    html += '  <div class="card-body">';
    html += '    <h3 class="card-title">' + escapeHtml(item.title) + '</h3>';
    html += '    <p class="card-meta"><span>' + escapeHtml(item.creator) + '</span></p>';
    html += '  </div>';
    html += '</article>';
    html += '</a>';
  });

  html += '</div>';
  return html;
}

/* ===== Render: Reddit (mixed: thumbnail + text cards) ===== */
function renderReddit(items) {
  var fallback = getFallbackThumb("reddit");
  var html = '<div class="section-header">';
  html += '<h2 class="section-title">Reddit Top Posts</h2>';
  html += '<span class="section-count">Top 20</span>';
  html += '</div>';
  html += '<div class="card-grid">';

  items.forEach(function (item) {
    var itemUrl = item.url || "#";
    var hasThumb = item.thumbnail && item.thumbnail.length > 10 && (item.thumbnail.indexOf("i.redd.it") !== -1 || item.thumbnail.indexOf("preview.redd.it") !== -1);

    html += '<a href="' + escapeAttr(itemUrl) + '" target="_blank" rel="noopener noreferrer" class="card-link">';

    if (hasThumb) {
      html += '<article class="card">';
      html += '  <div class="card-thumb">';
      html += '    <img src="' + escapeAttr(item.thumbnail) + '" alt="' + escapeAttr(item.title) + '" loading="lazy" width="480" height="270" onerror="this.onerror=null;this.src=\'' + escapeAttr(fallback) + '\'">';
      html += '    <span class="card-rank">' + item.rank + '</span>';
      html += '    <span class="card-upvotes-badge">\u2B06 ' + escapeHtml(item.upvotes) + '</span>';
      html += '  </div>';
      html += '  <div class="card-body">';
      html += '    <h3 class="card-title">' + escapeHtml(item.title) + '</h3>';
      html += '    <p class="card-meta">';
      html += '      <span>' + escapeHtml(item.subreddit) + '</span>';
      html += '      <span class="dot"></span>';
      html += '      <span>' + escapeHtml(item.comments) + ' comments</span>';
      html += '    </p>';
      html += '  </div>';
    } else {
      html += '<article class="card">';
      html += '  <div class="card-thumb reddit-no-thumb">';
      html += '    <span class="card-rank" style="position:static;width:auto;height:auto;background:none;color:var(--color-text-faint);font-size:var(--text-xs);">#' + item.rank + '</span>';
      html += '    <span class="reddit-sub">' + escapeHtml(item.subreddit) + '</span>';
      html += '    <span class="reddit-title-preview">' + escapeHtml(item.title) + '</span>';
      html += '    <div style="display:flex;align-items:center;gap:var(--space-3);margin-top:var(--space-1);">';
      html += '      <span style="font-size:var(--text-xs);color:var(--color-accent-rd);font-weight:600;">\u2B06 ' + escapeHtml(item.upvotes) + '</span>';
      html += '      <span class="dot" style="width:3px;height:3px;border-radius:50%;background:var(--color-text-faint);"></span>';
      html += '      <span style="font-size:var(--text-xs);color:var(--color-text-muted);">' + escapeHtml(item.comments) + ' comments</span>';
      html += '    </div>';
      html += '  </div>';
    }

    html += '</article>';
    html += '</a>';
  });

  html += '</div>';
  return html;
}

/* ===== Render: Hacker News (text cards) ===== */
function renderHackerNews(items) {
  var html = '<div class="section-header">';
  html += '<h2 class="section-title">Hacker News</h2>';
  html += '<span class="section-count">Top 20</span>';
  html += '</div>';
  html += '<div class="card-grid">';

  items.forEach(function (item) {
    var itemUrl = item.url || "#";
    html += '<a href="' + escapeAttr(itemUrl) + '" target="_blank" rel="noopener noreferrer" class="card-link">';
    html += '<article class="card">';
    html += '  <div class="card-thumb hn-thumb">';
    html += '    <span class="card-rank" style="position:static;width:auto;height:auto;background:none;color:var(--color-text-faint);font-size:var(--text-xs);">#' + item.rank + '</span>';
    html += '    <span class="hn-domain">' + escapeHtml(item.domain) + '</span>';
    html += '    <span class="hn-title-preview">' + escapeHtml(item.title) + '</span>';
    html += '    <div style="display:flex;align-items:center;gap:var(--space-3);margin-top:var(--space-1);">';
    html += '      <span class="hn-points">' + escapeHtml(item.points) + ' pts</span>';
    html += '      <span class="dot" style="width:3px;height:3px;border-radius:50%;background:var(--color-text-faint);"></span>';
    html += '      <span style="font-size:var(--text-xs);color:var(--color-text-muted);">' + escapeHtml(item.comments) + ' comments</span>';
    html += '    </div>';
    html += '  </div>';
    html += '</article>';
    html += '</a>';
  });

  html += '</div>';
  return html;
}

/* ===== Tab Router ===== */
function renderTab(tabName) {
  currentTab = tabName;
  var html = "";

  switch (tabName) {
    case "youtube":
      html = renderYouTube(TRENDING_DATA.youtube, "YouTube Trending", "youtube");
      break;
    case "shorts":
      html = renderYouTube(TRENDING_DATA.shorts, "YouTube Shorts", "shorts");
      break;
    case "tiktok":
      html = renderTikTok(TRENDING_DATA.tiktok);
      break;
    case "instagram":
      html = renderInstagram(TRENDING_DATA.instagram);
      break;
    case "reddit":
      html = renderReddit(TRENDING_DATA.reddit);
      break;
    case "hackernews":
      html = renderHackerNews(TRENDING_DATA.hackernews);
      break;
  }

  content.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (t) {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderTab(tab.getAttribute("data-tab"));
  });
});

/* Initial render */
renderTab("youtube");
