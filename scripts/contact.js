(function () {
  const defaultConfig = {
    teamName: "北京理工大学追梦战队（DreamChaser）",
    logoPath: "assets/logo.png",
    contact: "content/contact.md"
  };

  async function fetchJson(path) {
    try { const r = await fetch(path, { cache: "no-cache" }); if (!r.ok) throw 0; return await r.json(); } catch (_) { return null; }
  }
  async function fetchText(path) {
    try { const r = await fetch(path, { cache: "no-cache" }); if (!r.ok) return ""; return await r.text(); } catch (_) { return ""; }
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

  async function init() {
    initNasButton();
    
    const cfgRaw = await fetchJson("config/site.json");
    const cfg = cfgRaw || defaultConfig;
    setText("team-name", cfg.teamName);
    setAttr("team-logo", "src", cfg.logoPath);
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const md = await fetchText(cfg.contact || "content/contact.md");
    const el = document.getElementById("md-contact");
    if (el) {
      if (window.marked) {
        // 配置 marked 允许 HTML 标签
        try {
          // 尝试使用新版本的配置方式
          if (marked.use) {
            marked.use({
              breaks: true,
              gfm: true
            });
          } else {
            // 旧版本的配置方式
            marked.setOptions({
              breaks: true,
              gfm: true
            });
          }
        } catch (e) {
          // 如果配置失败，记录警告
          console.warn('Marked configuration failed:', e);
        }
        el.innerHTML = marked.parse(md);
      } else {
        el.innerHTML = md;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
