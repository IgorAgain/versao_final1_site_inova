/* ==================================================================
   INOVA — main.consolidado.js
   Versão: 2025-09-15
   Escopo: Unifica menu off-canvas, dropdowns mobile/desktop,
           smooth scroll, carrossel do hero, contadores de stats,
           expandir cards de serviços e navegação de carrossel
           "Quem confia".
   OBS: Pode substituir o seu main.js original 1-por-1.
   ================================================================== */
(() => {
  if (document.documentElement.dataset.inovaMainInit === "1") return;
  document.documentElement.dataset.inovaMainInit = "1";

  /* Helpers */
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  /* ---------------- NAVBAR / MENU ---------------- */
  const nav  = $(".navbar");
  const btn  = $(".menu-toggle");
  const list = nav ? $(".nav-links", nav) : null;
  if (btn) {
    // Captura para impedir listeners antigos
    btn.addEventListener("click", (ev)=>{ ev.stopImmediatePropagation(); ev.stopPropagation(); }, true);
  }

  const openMenu = () => {
    if (!nav || !btn || !list) return;
    nav.classList.add("active");
    btn.setAttribute("aria-expanded","true");
    document.body.classList.add("no-scroll");
  };
  const closeMenu = () => {
    if (!nav || !btn || !list) return;
    nav.classList.remove("active");
    btn.setAttribute("aria-expanded","false");
    document.body.classList.remove("no-scroll");
    // Fecha dropdowns abertos no mobile
    $$(".dropdown.mobile-open").forEach(d => d.classList.remove("mobile-open"));
    $$(".dropdown-toggle[aria-expanded='true']").forEach(t => t.setAttribute("aria-expanded","false"));
  };

  if (nav && btn && list) {
    btn.addEventListener("click", () => nav.classList.contains("active") ? closeMenu() : openMenu());
    document.addEventListener("click", (e) => { if (!nav.contains(e.target) && nav.classList.contains("active")) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("active")) closeMenu(); });
    matchMedia("(min-width: 1025px)").addEventListener("change", (ev) => { if (ev.matches) closeMenu(); });
  }

  // Dropdowns: desktop = hover via CSS | mobile = clique
  const DROPDOWN_BP = 1024;
  $$(".dropdown").forEach((dd) => {
    const toggle = $(".dropdown-toggle", dd) || $("> a", dd);
    const menu = $(".dropdown-menu", dd);
    if (!toggle || !menu) return;

    toggle.setAttribute("aria-expanded","false");
    toggle.setAttribute("role","button");

    toggle.addEventListener("click", (ev) => {
      if (innerWidth <= DROPDOWN_BP) {
        ev.preventDefault();
        const isOpen = dd.classList.toggle("mobile-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        // Fecha os irmãos
        $$(".dropdown").forEach((sib) => {
          if (sib !== dd) {
            sib.classList.remove("mobile-open");
            const sibT = $(".dropdown-toggle", sib) || $("> a", sib);
            sibT?.setAttribute("aria-expanded","false");
          }
        });
      }
    });
  });

  /* ---------------- Smooth scroll para âncoras ---------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (ev) => {
      const id = a.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      }
    });
  });

  /* ---------------- HERO: carrossel simples ---------------- */
  (function initHeroCarousel(){
    const imgs = $$(".hero-image");
    if (imgs.length <= 1) return;
    let i = imgs.findIndex(im => im.classList.contains("active"));
    if (i < 0) i = 0, imgs[0].classList.add("active");
    setInterval(() => {
      imgs[i].classList.remove("active");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("active");
    }, 4000);
  })();

  /* ---------------- STATS: contadores on-visible ---------------- */
  (function initStats(){
    const nums = $$(".stat-number[data-target]");
    if (!nums.length) return;

    const duration = 1200;
    const ease = t => 1 - Math.pow(1 - t, 3);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10) || 0;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const val = Math.floor(ease(p) * target);
          el.textContent = format(val);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: .3 });

    nums.forEach(n => obs.observe(n));

    function format(n){
      if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace('.0','') + " MM";
      if (n === 100_000) return "100 M";
      return String(n);
    }
  })();

  /* ---------------- SERVIÇOS: expand/colapse ---------------- */
  (function initCards(){
    $$(".servico-card .servico-cta").forEach((b) => {
      b.addEventListener("click", function(){
        const card = this.closest(".servico-card");
        const opened = card.classList.toggle("expandido");
        const span = this.querySelector("span");
        if (span) span.textContent = opened ? "Mostrar menos" : "Mostrar mais";
      });
    });
  })();

  /* ---------------- QUEM CONFIA: setas do carrossel ---------------- */
  (function initKits(){
    const wrap = document.querySelector("[data-kits]");
    if (!wrap) return;
    const track = $(".kits-track", wrap);
    const prev  = $(".kits-nav.prev", wrap);
    const next  = $(".kits-nav.next", wrap);
    if (!track || !prev || !next) return;

    const step = () => track.clientWidth * 0.9;
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left:  step(), behavior: "smooth" }));
  })();

})();