/* brand.js — Taste Index after typesafe.ai. No dependencies.
   Every effect has a static default in brand.css; this file only refines it.
   Tags: [M] measured on typesafe.ai, [X] extension (not on the site).

   Hooks (all opt-in by attribute):
     data-scheme-set="pink"         click → sets <html data-scheme>      (saved per viewer)
     data-type-set="wide"           click → sets <html data-type>         (saved per viewer)
     data-mm-root [data-mm-mode]    phone menu root; needs [data-mm-toggle] + .x-mm__panel
     data-mm-mode-set="iris"        click → switches the page menu mode
     .ts-dd                         dropdown: a [data-dd-toggle] + .ts-dd__menu
     data-clock                     live "Wednesday, Oct 14, 2026 / 16:41:13"      [M]
     data-life                      Game of Life canvas (glider)                   [M]
     data-b64="text"                fills element with base64 of text              [M]
     data-dither                    1-bit Bayer-dithered sphere canvas             [X]
     .x-marquee                     seamless giant-type loop                       [X]
     .x-hscroll                     vertical scroll drives a horizontal line       [X]
     data-scramble                  text resolves through base64 glyphs            [X]
     data-copy="value"              click → copy to clipboard, title bar flashes   [X]
*/
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

  /* ---------- scheme + type switching ---------- */
  const syncPressed = (attr, value) =>
    document.querySelectorAll(`[${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));
  const setScheme = (v) => { root.dataset.scheme = v; store.set('ti-scheme', v); syncPressed('data-scheme-set', v); redrawCanvases(); };
  const setType = (v) => { root.dataset.type = v; store.set('ti-type', v); syncPressed('data-type-set', v); };

  /* ---------- phone menu ---------- */
  const menus = [];
  function initMenu(mm) {
    const btn = mm.querySelector('[data-mm-toggle]');
    const panel = mm.querySelector('.x-mm__panel');
    if (!btn || !panel) return;
    panel.querySelectorAll('a').forEach((a, i) => { a.style.setProperty('--i', i); a.dataset.n = String(i + 1).padStart(2, '0'); });
    const contained = mm.classList.contains('is-contained');
    const set = (open) => {
      const r = btn.getBoundingClientRect();
      const box = contained ? mm.getBoundingClientRect() : { left: 0, top: 0 };
      mm.style.setProperty('--mm-x', r.left - box.left + r.width / 2 + 'px');
      mm.style.setProperty('--mm-y', r.top - box.top + r.height / 2 + 'px');
      mm.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      const label = btn.querySelector('[data-mm-label]') || btn;
      label.textContent = open ? 'Close' : 'Menu';                       // [M] Menu ↔ Close
      if (!contained && mm.dataset.mmMode !== 'tiles') document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => set(!mm.classList.contains('is-open')));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    menus.push(set);
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { menus.forEach((s) => s(false)); closeDropdowns(); } });

  /* ---------- dropdown [M]: instant, chevron flips ---------- */
  function closeDropdowns(except) {
    document.querySelectorAll('.ts-dd.is-open').forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove('is-open');
      dd.querySelector('[data-dd-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-dd-toggle]');
    if (t) {
      const dd = t.closest('.ts-dd');
      const open = !dd.classList.contains('is-open');
      closeDropdowns(dd);
      dd.classList.toggle('is-open', open);
      t.setAttribute('aria-expanded', String(open));
      return;
    }
    if (!e.target.closest('.ts-dd')) closeDropdowns();
    const s = e.target.closest('[data-scheme-set]'); if (s) setScheme(s.dataset.schemeSet);
    const ty = e.target.closest('[data-type-set]'); if (ty) setType(ty.dataset.typeSet);
    const m = e.target.closest('[data-mm-mode-set]');
    if (m) {
      const v = m.dataset.mmModeSet;
      document.querySelectorAll('[data-mm-root]:not(.is-contained)').forEach((r) => { r.classList.remove('is-open'); r.dataset.mmMode = v; });
      document.body.style.overflow = '';
      store.set('ti-menu', v); syncPressed('data-mm-mode-set', v);
    }
    const c = e.target.closest('[data-copy]');
    if (c) copy(c);
  });

  async function copy(el) {
    try { await navigator.clipboard.writeText(el.dataset.copy); } catch { return; }
    const bar = el.querySelector('.ts-window__bar') || el;
    const was = bar.dataset.label || bar.textContent;
    bar.dataset.label = was;
    bar.textContent = 'Copied';
    setTimeout(() => { bar.textContent = was; }, 900);
  }

  /* ---------- clock [M]: ticks every second, pixel font ---------- */
  function initClocks() {
    const els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    const tick = () => {
      const d = new Date();
      const date = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      const time = d.toLocaleTimeString('en-GB', { hour12: false });
      els.forEach((el) => {
        const a = el.querySelector('[data-clock-date]'); const b = el.querySelector('[data-clock-time]');
        if (a) a.textContent = date; if (b) b.textContent = time;
      });
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- base64 rail [M] ---------- */
  function initB64() {
    document.querySelectorAll('[data-b64]').forEach((el) => {
      const src = el.dataset.b64 || el.textContent;
      let out = btoa(unescape(encodeURIComponent(src)));
      const times = Number(el.dataset.b64Repeat || 1);
      for (let i = 1; i < times; i++) out = btoa(out).slice(0, 400);
      el.textContent = out;
    });
  }

  /* ---------- Game of Life [M]: "Glider 1.1" ---------- */
  const lifeRuns = [];
  function initLife() {
    document.querySelectorAll('canvas[data-life]').forEach((cv) => {
      const n = Number(cv.dataset.life) || 12, px = 8;
      cv.width = cv.height = n * px;
      let g = Array.from({ length: n }, () => Array(n).fill(0));
      [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]].forEach(([y, x]) => (g[y + 1][x + 1] = 1));
      const ctx = cv.getContext('2d');
      const draw = () => {
        const fg = cssVar(cv, '--fg') || '#1e1e1e';
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.strokeStyle = fg; ctx.fillStyle = fg; ctx.lineWidth = 1;
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          ctx.strokeRect(x * px + .5, y * px + .5, px - 1, px - 1);
          if (g[y][x]) { ctx.beginPath(); ctx.arc(x * px + px / 2, y * px + px / 2, px / 2 - 1.5, 0, 7); ctx.fill(); }
        }
      };
      const step = () => {
        g = g.map((row, y) => row.map((v, x) => {
          let c = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[(y + dy + n) % n][(x + dx + n) % n];
          return c === 3 || (v && c === 2) ? 1 : 0;
        }));
        draw();
      };
      draw();
      lifeRuns.push(draw);
      if (!reduce.matches) setInterval(step, 400);   // stepped, not eased — the brand's motion is computational
    });
  }

  /* ---------- [X] dithered spheres: 8x8 Bayer threshold, 1-bit ---------- */
  const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  function drawDither(cv) {
    const size = Number(cv.dataset.dither) || 220, cell = Number(cv.dataset.cell) || 2;
    const n = Math.floor(size / cell);
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = cssVar(cv, '--fg') || '#1e1e1e';
    // light position in 0..1 of the box (default: upper left), as a unit vector toward the viewer
    let L = [Number(cv.dataset.lightX ?? .3) * 2 - 1, Number(cv.dataset.lightY ?? .25) * 2 - 1, .9];
    const len = Math.hypot(...L); L = L.map((v) => v / len);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const nx = (x + .5) / n * 2 - 1, ny = (y + .5) / n * 2 - 1, r2 = nx * nx + ny * ny;
      if (r2 > 1) continue;
      const nz = Math.sqrt(1 - r2);
      const lit = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      const dark = Math.min(1, (1 - lit) * 1.05);                          // ink density, 0..1
      if (dark * 64 > BAYER[(y % 8) * 8 + (x % 8)]) ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  function redrawCanvases() {
    requestAnimationFrame(() => {
      document.querySelectorAll('canvas[data-dither]').forEach(drawDither);
      lifeRuns.forEach((d) => d());
    });
  }

  /* ---------- [X] marquee: clone to fill, speed set by width, pauses off-screen ---------- */
  function initMarquees() {
    document.querySelectorAll('.x-marquee').forEach((mq) => {
      const track = mq.querySelector('.x-marquee__track');
      if (!track || reduce.matches) return;
      const items = [...track.children];
      let guard = 0;
      while (track.scrollWidth < mq.clientWidth * 2 && guard++ < 8) items.forEach((it) => track.append(it.cloneNode(true)));
      [...track.children].forEach((it) => track.append(it.cloneNode(true)));      // 2 identical halves → -50% loops seamlessly
      [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true'));
      const pxPerSec = Number(mq.dataset.speed || 120);
      mq.style.setProperty('--x-dur', track.scrollWidth / 2 / pxPerSec + 's');
      if (mq.dataset.reverse !== undefined) mq.style.setProperty('--x-dir', 'reverse');
      new IntersectionObserver(([e]) => mq.classList.toggle('is-live', e.isIntersecting)).observe(mq);
    });
  }

  /* ---------- [X] horizontal scroll: pins on wide screens with a fine pointer ---------- */
  function initHScroll() {
    const wide = matchMedia('(min-width: 810px) and (pointer: fine)');
    document.querySelectorAll('.x-hscroll').forEach((sec) => {
      const sticky = sec.querySelector('.x-hscroll__sticky'), track = sec.querySelector('.x-hscroll__track');
      const layout = () => {
        const on = wide.matches && !reduce.matches;
        sec.classList.toggle('is-pinned', on);
        track.style.transform = '';
        sec.style.height = on ? `${track.scrollWidth - innerWidth + innerHeight}px` : '';
      };
      const onScroll = () => {
        if (!sec.classList.contains('is-pinned')) return;
        const r = sec.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (sec.offsetHeight - innerHeight)));
        track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth)}px,0,0)`;
      };
      layout(); onScroll();
      addEventListener('resize', () => { layout(); onScroll(); });
      addEventListener('scroll', onScroll, { passive: true });
      wide.addEventListener('change', layout);
      document.fonts?.ready.then(() => { layout(); onScroll(); });
    });
  }

  /* ---------- [X] scramble: resolves left to right through base64 glyphs ---------- */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  function scramble(el) {
    if (reduce.matches || el.dataset.busy) return;
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    el.dataset.busy = '1';
    let frame = 0; const total = Math.max(12, final.length * 1.6);
    const id = setInterval(() => {                                    // 30ms steps: a terminal tick, not a tween
      const done = Math.floor((frame / total) * final.length);
      el.textContent = [...final].map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[(Math.random() * 64) | 0])).join('');
      if (++frame > total) { clearInterval(id); el.textContent = final; delete el.dataset.busy; }
    }, 30);
  }
  function initScramble() {
    const els = document.querySelectorAll('[data-scramble]');
    els.forEach((el) => el.addEventListener('pointerenter', () => scramble(el)));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- boot ---------- */
  const start = () => {
    const s = store.get('ti-scheme'), t = store.get('ti-type'), m = store.get('ti-menu');
    if (s) setScheme(s); else syncPressed('data-scheme-set', root.dataset.scheme || 'paper');
    if (t) setType(t); else syncPressed('data-type-set', root.dataset.type || 'measured');
    if (m) document.querySelectorAll('[data-mm-root]:not(.is-contained)').forEach((r) => (r.dataset.mmMode = m));
    syncPressed('data-mm-mode-set', m || document.querySelector('[data-mm-root]:not(.is-contained)')?.dataset.mmMode || 'tiles');
    document.querySelectorAll('[data-mm-root]').forEach(initMenu);
    initClocks(); initB64(); initLife(); initMarquees(); initHScroll(); initScramble();
    redrawCanvases();
    document.fonts?.ready.then(redrawCanvases);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.TasteIndex = { setScheme, setType, scramble };
})();
