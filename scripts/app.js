(function () {
  const defaultConfig = {
    teamName: "北京理工大学追梦战队（DreamChaser）",
    logoPath: "assets/logo.png",
    promoVideo: "assets/promo.mp4",
    gallery: [
      {
        image: "assets/gallery/DSC_8270.JPG",
        title: "机器人测试现场",
        description: "在复杂地形中进行自主导航测试，验证系统的稳定性和鲁棒性。"
      },
      {
        image: "assets/gallery/DSC_8295.JPG", 
        title: "团队协作研发",
        description: "多学科背景的队员协同工作，共同解决技术难题。"
      },
      {
        image: "assets/gallery/DSC_8334.JPG",
        title: "比赛获奖时刻",
        description: "在机器人竞赛中获得优异成绩，展现团队实力。"
      }
    ],
    markdown: {
      intro: "content/intro.md",
      news: "content/news.md",
      robots: "content/robots.md",
      competitions: "content/competitions.md",
      members: "content/members.md",
      honors: "content/honors.md"
    }
  };

  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function setAttr(id, attr, value) { const el = document.getElementById(id); if (el) el.setAttribute(attr, value); }

  function createGallery(items) {
    const container = document.getElementById("gallery");
    if (!container) return;
    container.innerHTML = "";
    
    items.forEach((item) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";
      
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;
      img.loading = "lazy";
      
      const textDiv = document.createElement("div");
      textDiv.className = "text";
      textDiv.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
      
      galleryItem.appendChild(img);
      galleryItem.appendChild(textDiv);
      container.appendChild(galleryItem);
    });
  }

  async function fetchJson(path) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (_) { return null; }
  }

  function initFooterYear() {
    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initSeeMore() {
    const btn = document.getElementById("btn-see-more");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      const href = btn.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function initNasButton() {
    const nasLocalBtn = document.getElementById("nas-local");
    if (!nasLocalBtn) return;
    
    nasLocalBtn.addEventListener("click", function(e) {
      e.preventDefault();
      // 直接跳转到 NAS (内网)
      window.open('http://nas.dreamchaser.ink', '_blank');
    });
  }

  async function init() {
    initFooterYear();
    initSeeMore();
    initNasButton();

    const cfg = (await fetchJson("config/site.json")) || defaultConfig;

    setText("team-name", cfg.teamName);
    setAttr("team-logo", "src", cfg.logoPath);

    const videoSource = document.getElementById("promo-video-source");
    if (videoSource) {
      videoSource.src = cfg.promoVideo;
      const video = document.getElementById("promo-video");
      if (video && typeof video.load === "function") video.load();
    }

    createGallery(Array.isArray(cfg.gallery) ? cfg.gallery : []);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
