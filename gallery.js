/* gallery.js — renders the module gallery into [data-gallery]: a menu of every module in modules.js,
   and the selected module live in a 1280px desktop frame and a 390px phone frame side by side.
   Frames load m.html?id=…, so real breakpoints apply. Scheme / type / motion follow the page. */
(() => {
  const host = document.querySelector('[data-gallery]');
  const mods = window.TI_MODULES || [];
  if (!host || !mods.length) return;
  const root = document.documentElement;
  const groups = [...new Set(mods.map((m) => m.group))];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const D = { w: 1280, h: 800 }, P = { w: 390, h: 800 };

  host.innerHTML = `
  <div class="gal">
    <nav class="gal__menu" aria-label="Modules">
      <div class="gal__groups">${['All', ...groups].map((g, i) => `<button class="ts-chip" data-g="${esc(g)}" aria-pressed="${i === 0}">${esc(g)}</button>`).join('')}</div>
      <ol class="gal__list">${mods.map((m, i) => `<li data-group="${esc(m.group)}"><button class="gal__item" data-id="${m.id}"><span class="gal__n">${String(i + 1).padStart(2, '0')}</span><span>${esc(m.name)}</span><b class="b b-${m.tag}">${m.tag}</b></button></li>`).join('')}</ol>
    </nav>
    <div class="gal__stage">
      <div class="gal__meta">
        <div class="gal__title"><span class="ts-tag" data-f="group"></span><h3 class="ts-h-card" data-f="name"></h3></div>
        <p class="ts-body" data-f="decision"></p>
        <dl class="gal__facts"><div><dt class="ts-mono-s">trend</dt><dd data-f="trend"></dd></div><div><dt class="ts-mono-s">gesture</dt><dd data-f="gesture"></dd></div><div><dt class="ts-mono-s">motion</dt><dd data-f="fx"></dd></div></dl>
        <div class="gal__actions"><button class="ts-tile" data-step="-1" aria-label="Previous module">←</button><button class="ts-tile" data-step="1" aria-label="Next module">→</button><a class="ts-tile ts-tile--ink" data-f="open" target="_blank" rel="noopener">Open full ↗</a><button class="ts-tile" data-f="copy">Copy HTML</button></div>
      </div>
      <div class="gal__frames">
        <figure class="gal__desk"><div class="ts-window"><div class="ts-window__bar"><span>Browser 1.0</span><span class="gal__url ts-nocap" data-f="url"></span></div><div class="ts-window__body"><div class="gal__vp gal__vp--d"><iframe title="Desktop preview" loading="lazy"></iframe></div></div></div><figcaption class="ts-mono-xs">desktop · 1280</figcaption></figure>
        <figure class="gal__phone"><div class="gal__vp gal__vp--p"><iframe title="Phone preview" loading="lazy"></iframe></div><figcaption class="ts-mono-xs">phone · 390</figcaption></figure>
      </div>
    </div>
  </div>`;

  const $ = (s) => host.querySelector(s);
  const frames = { d: $('.gal__vp--d'), p: $('.gal__vp--p') };
  const ifr = { d: frames.d.querySelector('iframe'), p: frames.p.querySelector('iframe') };
  ifr.d.width = D.w; ifr.d.height = D.h; ifr.p.width = P.w; ifr.p.height = P.h;
  let cur = 0;

  const fit = () => {
    const sd = frames.d.clientWidth / D.w;
    ifr.d.style.transform = `scale(${sd})`; frames.d.style.height = D.h * sd + 'px';
    const sp = Math.min(1, frames.p.parentElement.clientWidth / P.w);
    ifr.p.style.transform = `scale(${sp})`; frames.p.style.width = P.w * sp + 'px'; frames.p.style.height = P.h * sp + 'px';
  };
  new ResizeObserver(fit).observe(host);

  const url = (m) => `m.html?id=${m.id}&scheme=${root.dataset.scheme || 'paper'}&type=${root.dataset.type || 'measured'}&motion=${root.dataset.motion || 'computed'}`;
  const show = (i, push) => {
    cur = (i + mods.length) % mods.length;
    const m = mods[cur];
    host.querySelectorAll('.gal__item').forEach((b) => b.setAttribute('aria-current', String(b.dataset.id === m.id)));
    for (const k of ['group', 'name', 'decision', 'trend', 'gesture', 'fx']) $(`[data-f="${k}"]`).textContent = m[k] || '—';
    $('[data-f="url"]').textContent = `halftone.example/${m.id}`;
    $('[data-f="open"]').href = url(m);
    ifr.d.src = url(m); ifr.p.src = url(m);
    if (push) history.replaceState(null, '', '#m-' + m.id);
    fit();
  };

  host.addEventListener('click', (e) => {
    const it = e.target.closest('.gal__item'); if (it) show(mods.findIndex((m) => m.id === it.dataset.id), true);
    const st = e.target.closest('[data-step]'); if (st) show(cur + Number(st.dataset.step), true);
    const g = e.target.closest('[data-g]');
    if (g) {
      host.querySelectorAll('[data-g]').forEach((b) => b.setAttribute('aria-pressed', String(b === g)));
      host.querySelectorAll('.gal__list li').forEach((li) => { li.hidden = g.dataset.g !== 'All' && li.dataset.group !== g.dataset.g; });
    }
    if (e.target.closest('[data-f="copy"]')) {
      const m = mods[cur];
      navigator.clipboard?.writeText((m.css ? `<style>${m.css}</style>\n` : '') + m.html.trim()).then(() => window.TasteIndex?.toast(`${m.name} copied`, 'Clipboard 1.0'));
    }
  });
  host.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); host.querySelector('[aria-current="true"]')?.focus(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); host.querySelector('[aria-current="true"]')?.focus(); }
  });
  let t; addEventListener('ti:change', () => { clearTimeout(t); t = setTimeout(() => show(cur), 120); });

  const fromHash = location.hash.startsWith('#m-') ? mods.findIndex((m) => m.id === location.hash.slice(3)) : -1;
  // load frames only once the gallery is near the viewport
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(Math.max(0, fromHash)); io.disconnect(); } }, { rootMargin: '400px' });
  io.observe(host);
  if (fromHash >= 0) requestAnimationFrame(() => host.scrollIntoView());
})();
