/* brand.js v2 — Taste Index after typesafe.ai. No build step, no required dependencies.
   (Hairline figures lazy-load @lucasmarkes/hairline from jsDelivr only where data-hairline is used.)
   Every effect has a static default in brand.css; this file only refines it.
   Tags: [M] measured on typesafe.ai, [X] extension. FX names follow the HyperFrames rules they port.

   SETTINGS
     data-scheme-set="pink" | data-type-set="wide" | data-motion-set="snappy"   (saved per viewer)
     [data-cfg] <details> — the "V" key toggles it (Shipped variant-switcher convention)
   NAV
     data-mm-root [data-mm-mode=tiles|iris|window|index] + [data-mm-toggle] + .x-mm__panel
     data-mm-mode-set="index" · .ts-dd + [data-dd-toggle]
     .x-index (giant hover rows; direction-aware fill) · data-readout on .x-index = cursor label
   FX  (data-fx on any text/element; runs when scrolled into view, or data-fx-trigger="hover|manual")
     waterfall · mask · decode · scramble · ticker · count · glitch · marker · bars · pop · slam · type · draw
     data-fx-run on a button replays every [data-fx] inside the closest [data-fx-scope]
   WIDGETS
     data-clock · data-life · data-b64 · data-dither · data-hairline="terminal" · .x-marquee · .x-hscroll · .x-lit
     [data-tabs] · [data-toast="msg"] · [data-dialog-open="id"] / [data-dialog-close] · [data-cmdk] (⌘K)
     .ts-compare · .ts-swipe (mouse drag) · [data-preview] (cursor-follow window) · [data-contrast] · data-copy
*/
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();
  const ms = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000) || 0;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }; // deterministic, from chromatic-glitch
  const emit = () => dispatchEvent(new CustomEvent('ti:change', { detail: { scheme: root.dataset.scheme, type: root.dataset.type, motion: root.dataset.motion } }));

  /* ======================= settings ======================= */
  const syncPressed = (attr, value) =>
    document.querySelectorAll(`[${attr}]`).forEach((b) => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value)));
  const setScheme = (v) => { root.dataset.scheme = v; store.set('ti-scheme', v); syncPressed('data-scheme-set', v); redrawCanvases(); readContrast(); emit(); };
  const setType = (v) => { root.dataset.type = v; store.set('ti-type', v); syncPressed('data-type-set', v); emit(); };
  const setMotion = (v) => { root.dataset.motion = v; store.set('ti-motion', v); syncPressed('data-motion-set', v); emit(); };

  /* ======================= phone menu ======================= */
  const menus = [];
  function initMenu(mm) {
    const btn = mm.querySelector('[data-mm-toggle]');
    const panel = mm.querySelector('.x-mm__panel');
    if (!btn || !panel) return;
    panel.querySelectorAll('a').forEach((a, i) => {
      a.style.setProperty('--i', i); a.dataset.n = String(i + 1).padStart(2, '0');
      if (!a.querySelector(':scope > span')) a.innerHTML = `<span>${a.innerHTML}</span>`;   // index mode rises the inner span
    });
    const contained = mm.classList.contains('is-contained');
    const set = (open) => {
      const r = btn.getBoundingClientRect();
      const box = contained ? mm.getBoundingClientRect() : { left: 0, top: 0 };
      mm.style.setProperty('--mm-x', r.left - box.left + r.width / 2 + 'px');
      mm.style.setProperty('--mm-y', r.top - box.top + r.height / 2 + 'px');
      mm.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      (btn.querySelector('[data-mm-label]') || btn).textContent = open ? 'Close' : 'Menu';   // [M] Menu ↔ Close
      if (!contained && mm.dataset.mmMode !== 'tiles') document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => set(!mm.classList.contains('is-open')));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    menus.push(set);
  }

  /* ======================= dropdown [M] ======================= */
  function closeDropdowns(except) {
    document.querySelectorAll('.ts-dd.is-open').forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove('is-open');
      dd.querySelector('[data-dd-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  }

  /* ======================= global clicks ======================= */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-dd-toggle]');
    if (t) {
      const dd = t.closest('.ts-dd'); const open = !dd.classList.contains('is-open');
      closeDropdowns(dd); dd.classList.toggle('is-open', open); t.setAttribute('aria-expanded', String(open));
      return;
    }
    if (!e.target.closest('.ts-dd')) closeDropdowns();
    const s = e.target.closest('[data-scheme-set]'); if (s) setScheme(s.dataset.schemeSet);
    const ty = e.target.closest('[data-type-set]'); if (ty) setType(ty.dataset.typeSet);
    const mo = e.target.closest('[data-motion-set]'); if (mo) setMotion(mo.dataset.motionSet);
    const m = e.target.closest('[data-mm-mode-set]');
    if (m) {
      const v = m.dataset.mmModeSet;
      document.querySelectorAll('[data-mm-root]:not(.is-contained)').forEach((r) => { r.classList.remove('is-open'); r.dataset.mmMode = v; });
      document.body.style.overflow = '';
      store.set('ti-menu', v); syncPressed('data-mm-mode-set', v);
    }
    const c = e.target.closest('[data-copy]'); if (c) copy(c);
    const run = e.target.closest('[data-fx-run]');
    if (run) (run.closest('[data-fx-scope]') || document).querySelectorAll('[data-fx]').forEach((el) => fx(el, true));
    const toastBtn = e.target.closest('[data-toast]'); if (toastBtn) toast(toastBtn.dataset.toast, toastBtn.dataset.toastTitle);
    const dOpen = e.target.closest('[data-dialog-open]'); if (dOpen) document.getElementById(dOpen.dataset.dialogOpen)?.showModal?.();
    const dClose = e.target.closest('[data-dialog-close]'); if (dClose) dClose.closest('dialog')?.close();
    const k = e.target.closest('[data-cmdk-open]'); if (k) openCmdk();
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { menus.forEach((s) => s(false)); closeDropdowns(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && document.querySelector('[data-cmdk]')) { e.preventDefault(); openCmdk(); }
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (!typing && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === 'v') { const d = document.querySelector('[data-cfg]'); if (d) d.open = !d.open; }
  });

  async function copy(el) {
    try { await navigator.clipboard.writeText(el.dataset.copy); } catch { return; }
    const bar = el.querySelector('.ts-window__bar') || el;
    const was = bar.dataset.label || bar.textContent;
    bar.dataset.label = was; bar.textContent = 'Copied';
    setTimeout(() => { bar.textContent = was; }, 900);
  }

  /* ======================= FX engine [X] ======================= */
  const timing = (el) => {
    const cs = getComputedStyle(el);
    return {
      ease: cs.getPropertyValue('--fx-ease').trim() || 'steps(4, end)',
      dur: ms(cs.getPropertyValue('--fx-dur').trim() || '240ms'),
      stag: ms(cs.getPropertyValue('--fx-stagger').trim() || '40ms'),
      k: parseFloat(cs.getPropertyValue('--fx-k')) || 1,
      fs: parseFloat(cs.fontSize) || 16,
    };
  };
  function splitWords(el, mask) {
    if (el.dataset.split) return [...el.querySelectorAll('.fx-w')];
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map((w) => (mask
      ? `<span class="fx-mask" aria-hidden="true"><span class="fx-w">${esc(w)}</span></span>`
      : `<span class="fx-w" aria-hidden="true">${esc(w)}</span>`)).join(' ');
    el.dataset.split = 'w';
    return [...el.querySelectorAll('.fx-w')];
  }
  function splitChars(el) {
    if (el.dataset.split) return [...el.querySelectorAll('.fx-ch')];
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map((w) => `<span style="display:inline-block;white-space:nowrap" aria-hidden="true">${[...w].map((c) => `<span class="fx-ch">${esc(c)}</span>`).join('')}</span>`).join(' ');
    el.dataset.split = 'c';
    return [...el.querySelectorAll('.fx-ch')];
  }
  const prepare = {
    waterfall: (el) => splitWords(el, false), mask: (el) => splitWords(el, true), decode: splitChars, type: splitChars,
    ticker(el) {
      if (el.dataset.split) return;
      const text = el.textContent.trim(); el.setAttribute('aria-label', text);
      el.classList.add('fx-ticker');
      el.innerHTML = [...text].map((c) => (/\d/.test(c)
        ? `<span class="fx-digit" aria-hidden="true" data-d="${c}"><span>${Array.from({ length: 20 }, (_, i) => `<i>${i % 10}</i>`).join('')}</span></span>`
        : `<span aria-hidden="true">${esc(c)}</span>`)).join('');
      el.dataset.split = 't';
    },
    glitch(el) {
      if (el.dataset.split) return;
      const html = el.innerHTML; el.classList.add('fx-glitch');
      el.innerHTML = `<span class="fx-glitch__copy fx-glitch__copy--a" aria-hidden="true">${html}</span><span class="fx-glitch__copy fx-glitch__copy--b" aria-hidden="true">${html}</span><span class="fx-glitch__base">${html}</span>`;
      el.dataset.split = 'g';
    },
    marker(el) { el.classList.add('fx-marker'); },
  };
  const run = {
    // waterfall-entry: words whip in from below, binary opacity, overlapping starts; heavy words travel further
    waterfall(el, t) {
      const words = splitWords(el, false);
      let start = 0;
      const cap = Math.min(1, 520 * t.k / Math.max(1, words.length * t.dur * .8));
      words.forEach((w) => {
        const len = w.textContent.length, weight = len >= 7 ? 1.25 : len <= 3 ? .75 : 1;
        const y = t.fs * .5 * weight, d = t.dur * weight;
        w.animate([{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: `translateY(${y}px)`, offset: .01, easing: t.ease }, { opacity: 1, transform: 'none' }],
          { duration: d, delay: start, fill: 'backwards' });
        start += Math.max(16, (d - 16) * cap);
      });
    },
    // mask-reveal-up: words rise out of their own clip
    mask(el, t) {
      splitWords(el, true).forEach((w, i) => w.animate([{ transform: 'translateY(110%)', easing: t.ease }, { transform: 'none' }],
        { duration: t.dur * 1.8, delay: i * t.stag * .7, fill: 'backwards' }));
    },
    // hacker-flip-3d: chars hinge down from 90° while cycling glyphs, settle on the target
    decode(el, t) {
      const chars = splitChars(el);
      const G = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=#%';
      chars.forEach((c, i) => {
        const target = c.textContent, dur = Math.max(320, t.dur * 1.8), delay = i * Math.max(18, t.stag * .6);
        c.animate([{ transform: 'rotateX(90deg)', opacity: 0 }, { transform: 'rotateX(90deg)', opacity: 1, offset: .01, easing: t.ease.startsWith('steps') ? 'cubic-bezier(.23,1,.32,1)' : t.ease }, { transform: 'none', opacity: 1 }],
          { duration: dur, delay, fill: 'backwards' });
        const t0 = performance.now() + delay;
        const tick = (now) => {
          const p = (now - t0) / dur;
          if (p >= .6) { c.textContent = target; return; }
          if (p > 0) c.textContent = G[Math.floor(hash(i * 1000 + Math.floor(p * 30)) * G.length)];
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    // vertical-spring-ticker: each digit rolls a full turn then lands; stepped under "computed"
    ticker(el, t) {
      prepare.ticker(el);
      el.querySelectorAll('.fx-digit').forEach((d, i) => {
        const n = 10 + Number(d.dataset.d), col = d.firstElementChild;
        const ease = t.ease.startsWith('steps') ? `steps(${n}, end)` : 'cubic-bezier(.34,1.56,.64,1)';
        col.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-n}em)` }],
          { duration: (700 + i * 140) * Math.min(t.k, 1.6), easing: ease, fill: 'both' });
      });
    },
    // counting: value rolls up; stepped under "computed"
    count(el, t) {
      const src = el.dataset.text || (el.dataset.text = el.textContent.trim());
      const m = src.match(/^(.*?)(-?[\d,]*\.?\d+)(.*)$/); if (!m) return;
      const [, pre, num, post] = m, to = parseFloat(num.replace(/,/g, '')), dec = (num.split('.')[1] || '').length;
      const dur = 900 * Math.min(t.k, 1.6), stepped = t.ease.startsWith('steps'), t0 = performance.now();
      const fmt = (v) => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post;
      el.style.fontVariantNumeric = 'tabular-nums';
      const tick = (now) => {
        let p = Math.min(1, (now - t0) / dur);
        if (stepped) p = Math.floor(p * 12) / 12;
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    // chromatic-glitch: copies jitter on a quantized hash, amplitude decays, snaps sharp
    glitch(el) {
      prepare.glitch(el);
      const copies = el.querySelectorAll('.fx-glitch__copy'); const t0 = performance.now(), D = 460, STEP = 45;
      const tick = (now) => {
        const p = (now - t0) / D, amp = Math.max(0, 1 - p) ** 2, step = Math.floor((now - t0) / STEP);
        copies.forEach((c, k) => {
          const x = amp * (hash(step * 13 + k * 7) * 2 - 1) * 10, y = amp * (hash(step * 7 + k * 3) * 2 - 1) * 3;
          c.style.opacity = amp > 0 ? .85 : 0; c.style.transform = `translate(${x}px, ${y}px)`;
        });
        if (p < 1) requestAnimationFrame(tick); else copies.forEach((c) => { c.style.opacity = 0; c.style.transform = ''; });
      };
      requestAnimationFrame(tick);
    },
    // marker: accent bar sweeps behind the words (CSS transition)
    marker(el) { el.classList.remove('is-on'); void el.offsetWidth; el.classList.add('is-on'); },
    // stat-bars-and-fills
    bars(el, t) {
      el.querySelectorAll('.fx-bar').forEach((b, i) => b.animate([{ transform: 'scaleY(0)', easing: t.ease }, { transform: 'scaleY(1)' }], { duration: t.dur * 2.6, delay: i * 70, fill: 'backwards' }));
      el.querySelectorAll('.fx-fill').forEach((f) => f.animate([{ transform: 'scaleX(0)', easing: t.ease }, { transform: `scaleX(${getComputedStyle(f).getPropertyValue('--p') || 1})` }], { duration: t.dur * 3.2, fill: 'backwards' }));
    },
    // spring-pop-entrance: scale 0→1, smooth settle, no bounce
    pop(el, t) {
      const items = el.querySelectorAll('.fx-pop').length ? [...el.querySelectorAll('.fx-pop')] : [el];
      const stag = Math.min(t.stag * 1.5, 480 / items.length);
      items.forEach((it, i) => it.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(0)', opacity: 1, offset: .01, easing: t.ease.startsWith('steps') ? t.ease : 'cubic-bezier(.22,.61,.36,1)' }, { transform: 'none', opacity: 1 }],
        { duration: t.dur * 2.2, delay: i * stag, fill: 'backwards' }));
    },
    // kinetic-beat-slam: one beat grid, a different entrance per line
    slam(el, t) {
      const beat = 380 * Math.min(t.k, 1.4);
      const entr = [
        [{ transform: 'scale(1.6)' }, { transform: 'none' }],
        [{ transform: 'translateX(-35%)' }, { transform: 'none' }],
        [{ transform: 'translateY(60%) rotate(-6deg)' }, { transform: 'none' }],
      ];
      [...el.children].forEach((line, i) => {
        line.classList.add('fx-line');
        const k = entr[i % 3];
        line.animate([{ ...k[0], opacity: 0 }, { ...k[0], opacity: 1, offset: .01, easing: 'cubic-bezier(.23,1,.32,1)' }, { ...k[1], opacity: 1 }],
          { duration: 420, delay: i * beat, fill: 'backwards' });
      });
    },
    // typewriter: stepped char reveal + blinking caret
    type(el) {
      const chars = splitChars(el);
      if (!el.querySelector('.fx-caret')) el.insertAdjacentHTML('beforeend', '<span class="fx-caret" aria-hidden="true"></span>');
      chars.forEach((c, i) => c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: i * 46, fill: 'backwards', easing: 'steps(1, end)' }));
    },
    // svg-path-draw
    draw(el, t) {
      el.querySelectorAll('path, line, polyline, circle, rect').forEach((p, i) => {
        const len = p.getTotalLength?.() || 0; if (!len) return;
        p.style.strokeDasharray = len;
        p.animate([{ strokeDashoffset: len, easing: t.ease.startsWith('steps') ? 'steps(8, end)' : 'cubic-bezier(.22,.61,.36,1)' }, { strokeDashoffset: 0 }], { duration: 1100 * Math.min(t.k, 1.5), delay: i * 90, fill: 'both' });
      });
    },
    scramble(el) { scramble(el); },
  };
  function fx(el, force) {
    const name = el.dataset.fx; if (!run[name]) return;
    el.removeAttribute('data-armed');
    if (reduce.matches && !force) return;
    run[name](el, timing(el));
  }
  function initFx() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fx(e.target); io.unobserve(e.target); } }), { threshold: .2 });
    document.querySelectorAll('[data-fx]').forEach((el) => {
      const name = el.dataset.fx;
      prepare[name]?.(el);
      const trig = el.dataset.fxTrigger;
      if (trig === 'hover' || el.dataset.fxHover !== undefined || name === 'glitch' || name === 'scramble') el.addEventListener('pointerenter', () => fx(el, true));
      if (trig === 'manual' || trig === 'hover' || reduce.matches) return;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * .9 && name !== 'count' && name !== 'ticker') el.setAttribute('data-armed', '');
      io.observe(el);
    });
  }

  /* ======================= index menu [X] ======================= */
  let readout;
  function initIndex() {
    document.querySelectorAll('.x-index').forEach((list) => {
      list.querySelectorAll('.x-index__row').forEach((row, i) => {
        if (!row.querySelector('.x-index__fill')) row.insertAdjacentHTML('afterbegin', '<span class="x-index__fill" aria-hidden="true"></span>');
        const side = (e) => { const r = row.getBoundingClientRect(); return e.clientY - r.top < r.height / 2 ? '0%' : '100%'; };
        row.addEventListener('pointerenter', (e) => row.style.setProperty('--from', side(e)));
        row.addEventListener('pointerleave', (e) => row.style.setProperty('--from', side(e)));
        row.dataset.read ||= `${String(i + 1).padStart(2, '0')} → ${row.getAttribute('href') || ''}`;
      });
      if (list.dataset.readout === undefined || matchMedia('(pointer: coarse)').matches) return;
      readout ||= Object.assign(document.body.appendChild(document.createElement('div')), { className: 'x-readout' });
      list.addEventListener('pointermove', (e) => {
        const row = e.target.closest('.x-index__row');
        readout.classList.toggle('is-on', !!row);
        if (!row) return;
        readout.textContent = row.dataset.read;
        readout.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`;
      });
      list.addEventListener('pointerleave', () => readout.classList.remove('is-on'));
    });
  }

  /* ======================= Hairline figures [X] ======================= */
  const HAIRLINE = 'https://cdn.jsdelivr.net/npm/@lucasmarkes/hairline@0.5.0/dist/index.js';
  let hairlineMod;
  function initHairline() {
    const els = document.querySelectorAll('[data-hairline]');
    if (!els.length) return;
    const mount = async (el) => {
      try {
        hairlineMod ||= import(HAIRLINE);
        const mod = await hairlineMod, make = mod[el.dataset.hairline];
        if (!make) throw new Error('unknown figure ' + el.dataset.hairline);
        const dark = cssVar(el, '--is-dark') === '1';
        const read = el.closest('.ts-window, [data-hairline-scope]')?.querySelector('[data-hairline-read]');
        make(el, { play: el.dataset.play !== 'false', intensity: Number(el.dataset.intensity || .6), theme: dark ? 'dark' : 'light', label: el.getAttribute('aria-label') || undefined, onRead: read ? (txt) => { read.textContent = txt; } : undefined });
      } catch (err) { el.dataset.state = 'offline'; }
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { mount(e.target); io.unobserve(e.target); } }), { rootMargin: '200px' });
    els.forEach((el) => io.observe(el));
  }

  /* ======================= v1 widgets ======================= */
  function initClocks() {
    const els = document.querySelectorAll('[data-clock]'); if (!els.length) return;
    const tick = () => {
      const d = new Date();
      const date = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      const time = d.toLocaleTimeString('en-GB', { hour12: false });
      els.forEach((el) => { const a = el.querySelector('[data-clock-date]'), b = el.querySelector('[data-clock-time]'); if (a) a.textContent = date; if (b) b.textContent = time; });
    };
    tick(); setInterval(tick, 1000);
  }
  function initB64() {
    document.querySelectorAll('[data-b64]').forEach((el) => {
      let out = btoa(unescape(encodeURIComponent(el.dataset.b64 || el.textContent)));
      for (let i = 1; i < Number(el.dataset.b64Repeat || 1); i++) out = btoa(out).slice(0, 400);
      el.textContent = out;
    });
  }
  const lifeRuns = [];
  function initLife() {
    document.querySelectorAll('canvas[data-life]').forEach((cv) => {
      const n = Number(cv.dataset.life) || 12, px = 8; cv.width = cv.height = n * px;
      let g = Array.from({ length: n }, () => Array(n).fill(0));
      [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]].forEach(([y, x]) => (g[y + 1][x + 1] = 1));
      const ctx = cv.getContext('2d');
      const draw = () => {
        const fg = cssVar(cv, '--fg') || '#1e1e1e';
        ctx.clearRect(0, 0, cv.width, cv.height); ctx.strokeStyle = fg; ctx.fillStyle = fg; ctx.lineWidth = 1;
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          ctx.strokeRect(x * px + .5, y * px + .5, px - 1, px - 1);
          if (g[y][x]) { ctx.beginPath(); ctx.arc(x * px + px / 2, y * px + px / 2, px / 2 - 1.5, 0, 7); ctx.fill(); }
        }
      };
      const step = () => {
        g = g.map((row, y) => row.map((v, x) => {
          let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[(y + dy + n) % n][(x + dx + n) % n];
          return c === 3 || (v && c === 2) ? 1 : 0;
        }));
        draw();
      };
      draw(); lifeRuns.push(draw);
      if (!reduce.matches) setInterval(step, 400);
    });
  }
  const BAYER = [0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  function drawDither(cv) {
    const size = Number(cv.dataset.dither) || 220, cell = Number(cv.dataset.cell) || 2, n = Math.floor(size / cell);
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, size, size); ctx.fillStyle = cssVar(cv, '--fg') || '#1e1e1e';
    let L = [Number(cv.dataset.lightX ?? .3) * 2 - 1, Number(cv.dataset.lightY ?? .25) * 2 - 1, .9];
    const len = Math.hypot(...L); L = L.map((v) => v / len);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const nx = (x + .5) / n * 2 - 1, ny = (y + .5) / n * 2 - 1, r2 = nx * nx + ny * ny; if (r2 > 1) continue;
      const lit = Math.max(0, nx * L[0] + ny * L[1] + Math.sqrt(1 - r2) * L[2]);
      if (Math.min(1, (1 - lit) * 1.05) * 64 > BAYER[(y % 8) * 8 + (x % 8)]) ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  function redrawCanvases() {
    requestAnimationFrame(() => { document.querySelectorAll('canvas[data-dither]').forEach(drawDither); lifeRuns.forEach((d) => d()); });
  }
  function initMarquees() {
    document.querySelectorAll('.x-marquee').forEach((mq) => {
      const track = mq.querySelector('.x-marquee__track'); if (!track || reduce.matches) return;
      const items = [...track.children]; let guard = 0;
      while (track.scrollWidth < mq.clientWidth * 2 && guard++ < 8) items.forEach((it) => track.append(it.cloneNode(true)));
      [...track.children].forEach((it) => track.append(it.cloneNode(true)));
      [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true'));
      mq.style.setProperty('--x-dur', track.scrollWidth / 2 / Number(mq.dataset.speed || 120) + 's');
      if (mq.dataset.reverse !== undefined) mq.style.setProperty('--x-dir', 'reverse');
      new IntersectionObserver(([e]) => mq.classList.toggle('is-live', e.isIntersecting)).observe(mq);
    });
  }
  function initHScroll() {
    const wide = matchMedia('(min-width: 810px) and (pointer: fine)');
    document.querySelectorAll('.x-hscroll').forEach((sec) => {
      const track = sec.querySelector('.x-hscroll__track');
      const layout = () => {
        const on = wide.matches && !reduce.matches;
        sec.classList.toggle('is-pinned', on); track.style.transform = '';
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
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  function scramble(el) {
    if (reduce.matches || el.dataset.busy) return;
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    el.dataset.busy = '1';
    let frame = 0; const total = Math.max(12, final.length * 1.6);
    const id = setInterval(() => {
      const done = Math.floor((frame / total) * final.length);
      el.textContent = [...final].map((ch, i) => (i < done || ch === ' ' ? ch : GLYPHS[Math.floor(hash(frame * 31 + i) * 64)])).join('');
      if (++frame > total) { clearInterval(id); el.textContent = final; delete el.dataset.busy; }
    }, 30);
  }
  function initScramble() {
    const els = document.querySelectorAll('[data-scramble]');
    els.forEach((el) => el.addEventListener('pointerenter', () => scramble(el)));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { scramble(e.target); io.unobserve(e.target); } }), { threshold: .6 });
    els.forEach((el) => io.observe(el));
  }

  /* ======================= v2 widgets [X] ======================= */
  // scroll-lit paragraph (AOI): words light up as the block passes through the viewport
  function initLit() {
    const els = [...document.querySelectorAll('.x-lit')]; if (!els.length || reduce.matches) return;
    els.forEach((el) => { splitWords(el, false); el.classList.add('is-live'); });
    const onScroll = () => els.forEach((el) => {
      const r = el.getBoundingClientRect(), words = el.querySelectorAll('.fx-w');
      const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .3)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
    });
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((box) => {
      const tabs = [...box.querySelectorAll('[role="tab"]')];
      const pick = (tab) => tabs.forEach((t) => {
        const on = t === tab; t.setAttribute('aria-selected', String(on));
        const panel = document.getElementById(t.getAttribute('aria-controls')); if (panel) panel.hidden = !on;
      });
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => pick(t));
        t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); pick(n); } });
      });
    });
  }
  function toast(msg, title = 'Notice 1.0') {
    let box = document.querySelector('.ts-toasts');
    if (!box) box = Object.assign(document.body.appendChild(document.createElement('div')), { className: 'ts-toasts' });
    box.setAttribute('role', 'status');
    const t = document.createElement('div');
    t.className = 'ts-window ts-toast';
    t.innerHTML = `<div class="ts-window__bar">${esc(title)}<span class="ts-blink">●</span></div><div class="ts-window__body"><div class="ts-window__panel">${esc(msg)}</div></div>`;
    box.append(t);
    if (!reduce.matches) t.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'translateY(16px)', opacity: 1, offset: .01, easing: 'cubic-bezier(.23,1,.32,1)' }, { transform: 'none', opacity: 1 }], { duration: 220 });
    setTimeout(() => t.remove(), 3200);
  }
  function openCmdk() {
    const d = document.querySelector('[data-cmdk]'); if (!d) return;
    d.showModal?.(); const input = d.querySelector('input'); input.value = ''; filterCmdk(d); input.focus();
  }
  function filterCmdk(d) {
    const q = d.querySelector('input').value.toLowerCase();
    const items = [...d.querySelectorAll('li')];
    let first = null;
    items.forEach((li) => { const hit = li.textContent.toLowerCase().includes(q); li.hidden = !hit; li.setAttribute('aria-selected', 'false'); if (hit && !first) first = li; });
    first?.setAttribute('aria-selected', 'true');
  }
  function initCmdk() {
    document.querySelectorAll('[data-cmdk]').forEach((d) => {
      const input = d.querySelector('input');
      input.addEventListener('input', () => filterCmdk(d));
      input.addEventListener('keydown', (e) => {
        const vis = [...d.querySelectorAll('li:not([hidden])')]; const cur = vis.findIndex((li) => li.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault(); const n = vis[(cur + (e.key === 'ArrowDown' ? 1 : -1) + vis.length) % vis.length];
          vis.forEach((li) => li.setAttribute('aria-selected', String(li === n))); n?.scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'Enter' && vis[cur]) { toast(vis[cur].dataset.say || vis[cur].firstChild.textContent.trim(), 'Cmd 1.0'); d.close(); }
      });
      d.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) { toast(li.dataset.say || li.firstChild.textContent.trim(), 'Cmd 1.0'); d.close(); } if (e.target === d) d.close(); });
    });
  }
  function initCompare() {
    document.querySelectorAll('.ts-compare').forEach((c) => {
      const r = c.querySelector('input[type="range"]'); if (!r) return;
      const set = () => c.style.setProperty('--pos', r.value + '%'); r.addEventListener('input', set); set();
    });
  }
  function initSwipe() {
    document.querySelectorAll('.ts-swipe').forEach((s) => {
      let x0 = 0, l0 = 0, down = false;
      s.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; l0 = s.scrollLeft; s.classList.add('is-drag'); });
      addEventListener('pointermove', (e) => { if (down) s.scrollLeft = l0 - (e.clientX - x0); });
      addEventListener('pointerup', () => { if (!down) return; down = false; s.classList.remove('is-drag'); });
    });
  }
  // cursor-follow preview window over a list (rows carry data-preview="text")
  function initPreview() {
    document.querySelectorAll('[data-preview]').forEach((list) => {
      if (matchMedia('(pointer: coarse)').matches) return;
      const w = document.createElement('div');
      w.className = 'ts-window'; w.setAttribute('aria-hidden', 'true');
      w.style.cssText = 'position:fixed;left:0;top:0;z-index:85;pointer-events:none;width:240px;display:none';
      w.innerHTML = '<div class="ts-window__bar"></div><div class="ts-window__body"><div class="ts-window__panel" style="height:150px;display:grid;place-items:center;text-align:center"></div></div>';
      document.body.append(w);
      list.addEventListener('pointermove', (e) => {
        const row = e.target.closest('[data-preview-text]'); w.style.display = row ? 'flex' : 'none'; if (!row) return;
        w.querySelector('.ts-window__bar').textContent = row.dataset.previewBar || 'Preview 1.0';
        const panel = w.querySelector('.ts-window__panel');
        panel.textContent = row.dataset.previewText; panel.style.background = row.dataset.previewColor || '';
        w.style.transform = `translate(${e.clientX + 18}px, ${e.clientY - 80}px)`;
      });
      list.addEventListener('pointerleave', () => { w.style.display = 'none'; });
    });
  }
  // live contrast readout for any [data-contrast] element (reads its own scheme)
  const toRGB = (c) => {
    const m = c.match(/^#([\da-f]{3,8})$/i);
    if (m) { let h = m[1]; if (h.length <= 4) h = [...h].map((x) => x + x).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
    const r = c.match(/[\d.]+/g); return r ? r.slice(0, 3).map(Number) : [0, 0, 0];
  };
  const lum = (rgb) => { const [r, g, b] = rgb.map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(toRGB(a)), lum(toRGB(b))].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  function readContrast() {
    requestAnimationFrame(() => document.querySelectorAll('[data-contrast]').forEach((el) => {
      const v = (n) => cssVar(el, n);
      const a = ratio(v('--fg'), v('--bg')), b = ratio(v('--accent-fg'), v('--accent')), c = ratio(v('--link-hover'), v('--bg'));
      const tag = (x, min) => `${x.toFixed(1)}${x >= min ? '' : ' ✕'}`;
      el.textContent = `text ${tag(a, 4.5)} · hover fill ${tag(b, 4.5)} · hover link ${tag(c, 3)}`;
    }));
  }

  /* ======================= boot ======================= */
  const start = () => {
    const s = store.get('ti-scheme'), t = store.get('ti-type'), mo = store.get('ti-motion'), m = store.get('ti-menu');
    const known = (attr, v) => v && document.querySelector(`[${attr}="${v}"]`);
    if (known('data-scheme-set', s)) setScheme(s); else syncPressed('data-scheme-set', root.dataset.scheme || 'paper');
    if (known('data-type-set', t)) setType(t); else syncPressed('data-type-set', root.dataset.type || 'measured');
    if (known('data-motion-set', mo)) setMotion(mo); else syncPressed('data-motion-set', root.dataset.motion || 'computed');
    if (known('data-mm-mode-set', m)) document.querySelectorAll('[data-mm-root]:not(.is-contained)').forEach((r) => (r.dataset.mmMode = m));
    syncPressed('data-mm-mode-set', document.querySelector('[data-mm-root]:not(.is-contained)')?.dataset.mmMode || 'tiles');
    document.querySelectorAll('[data-mm-root]').forEach(initMenu);
    initClocks(); initB64(); initLife(); initMarquees(); initHScroll(); initScramble();
    initFx(); initIndex(); initHairline(); initLit(); initTabs(); initCmdk(); initCompare(); initSwipe(); initPreview();
    readContrast(); redrawCanvases();
    document.fonts?.ready.then(() => { redrawCanvases(); readContrast(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.TasteIndex = { setScheme, setType, setMotion, scramble, fx, toast };
})();
