(function () {
  const defaultConfig = {
    teamName: "北京理工大学追梦战队（DreamChaser）",
    logoPath: "assets/logo.png",
    markdown: {
      intro: "content/intro.md",
      news: "content/news.md",
      robots: "content/robots.md",
      competitions: "content/competitions.md",
      members: "content/members.md",
      honors: "content/honors.md"
    },
    newsList: null,
    membersList: null
  };

  async function fetchJson(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (_) { return null; }
  }

  async function fetchText(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) return "";
      return await res.text();
    } catch (_) { return ""; }
  }

  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function setAttr(id, attr, value) { const el = document.getElementById(id); if (el) el.setAttribute(attr, value); }

  function initNasButton() {
    const nasLocalBtn = document.getElementById("nas-local");
    if (!nasLocalBtn) return;
    
    nasLocalBtn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // 检测是否为局域网环境
      const isLocalNetwork = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.startsWith('192.168.') ||
                           window.location.hostname.startsWith('10.') ||
                           window.location.hostname.startsWith('172.');
      
      const nasUrl = isLocalNetwork ? 'http://nas.dreamchaser.ink' : 'http://nas2.dreamchaser.ink';
      window.open(nasUrl, '_blank');
    });
  }

  async function renderMarkdownInto(elId, mdPath) {
    const el = document.getElementById(elId);
    if (!el) return;
    const md = await fetchText(mdPath);
    el.innerHTML = window.marked ? marked.parse(md) : md;
  }

  function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "grid cards-3";
    items.forEach((it) => {
      const card = document.createElement("div");
      card.className = "card";
      const h3 = document.createElement("h3");
      h3.textContent = it.title || "未命名";
      card.appendChild(h3);
      if (it.date) {
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = it.date;
        card.appendChild(meta);
      }
      const content = document.createElement("div");
      content.innerHTML = "加载中...";
      card.appendChild(content);
      grid.appendChild(card);
      // 加载对应 Markdown
      fetchText(it.path).then((text) => {
        content.innerHTML = window.marked ? marked.parse(text) : text;
      });
    });
    container.appendChild(grid);
  }

  async function init() {
    initNasButton();
    
    const cfg = (await fetchJson("config/site.json")) || defaultConfig;
    setText("team-name", cfg.teamName);
    setAttr("team-logo", "src", cfg.logoPath);

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // 单文档渲染（若页面存在该挂载点）
    await Promise.all([
      renderMarkdownInto("md-intro", cfg.markdown.intro),
      renderMarkdownInto("md-news", cfg.markdown.news),
      renderMarkdownInto("md-robots", cfg.markdown.robots),
      renderMarkdownInto("md-competitions", cfg.markdown.competitions),
      renderMarkdownInto("md-members", cfg.markdown.members),
      renderMarkdownInto("md-honors", cfg.markdown.honors)
    ]);

    // 新闻清单
    const newsListContainer = document.getElementById("news-list");
    if (newsListContainer && cfg.newsList) {
      const list = await fetchJson(cfg.newsList);
      if (Array.isArray(list)) renderCards("news-list", list);
    }

    // 成员清单
    const membersListContainer = document.getElementById("members-list");
    if (membersListContainer && cfg.membersList) {
      const list = await fetchJson(cfg.membersList);
      if (Array.isArray(list)) renderCards("members-list", list);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
