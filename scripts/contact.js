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
    const nasLocalBtn = document.getElementById("nasLocalBtn");
    if (!nasLocalBtn) return;
    
    nasLocalBtn.addEventListener("click", function(e) {
      e.preventDefault();
      // 直接跳转到 NAS (内网)
      window.open('http://nas.dreamchaser.ink', '_blank');
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
      // 直接使用原始 Markdown 内容，不进行路径替换
      const processedMd = md;
      
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
        el.innerHTML = marked.parse(processedMd);
      } else {
        el.innerHTML = processedMd;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
