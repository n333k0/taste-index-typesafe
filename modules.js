/* modules.js — the module library for the Taste Index gallery.
   Each module is a self-contained HTML block that uses only brand.css classes (+ a little scoped CSS)
   and brand.js hooks. The gallery renders it twice, in a 1280px desktop frame and a 390px phone frame,
   so real breakpoints apply. Copy a module's html into a build as a starting point.

   Fields: id, group, name, trend, decision (why it fits this brand), gesture, fx, tag (M/X), html, css
   Content uses a fictional brand, "Halftone", so nothing impersonates a real company. */
(() => {
  const NAV = (cur = '') => `
<header class="ts-nav">
  <div class="ts-nav__group"><a class="ts-tile ts-tile--ink" href="#">∵ Halftone</a></div>
  <nav class="ts-nav__group ts-nav__center">${['Product', 'Pricing', 'Journal', 'Docs'].map((l) => `<a class="ts-tile" href="#"${l === cur ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
  <div class="ts-nav__group x-mm" data-mm-root data-mm-mode="tiles">
    <a class="ts-tile ts-hide-phone" href="#">Log In</a>
    <a class="ts-tile ts-tile--ink ts-hide-phone" href="#">Start Free</a>
    <button class="ts-tile ts-tile--ink ts-menu-btn" data-mm-toggle aria-expanded="false"><span data-mm-label>Menu</span></button>
    <nav class="x-mm__panel" aria-label="Menu" data-title="Menu.app 1.0"><a class="ts-tile" href="#">Product</a><a class="ts-tile" href="#">Pricing</a><a class="ts-tile" href="#">Journal</a><a class="ts-tile" href="#">Docs</a><a class="ts-tile" href="#">Start Free</a></nav>
  </div>
</header><div style="height:56px"></div>`;
  const WIN = (title, body, cls = '', panel = '') => `<div class="ts-window ${cls}"><div class="ts-window__bar">${title}</div><div class="ts-window__body"><div class="ts-window__panel" style="${panel}">${body}</div></div></div>`;
  const FIG = (name, h = '') => `<div class="x-fig" data-hairline="${name}" aria-label="${name} figure" style="${h}"></div>`;

  window.TI_MODULES = [
  /* ============================== NAVIGATION ============================== */
  { id: 'nav-tiles', group: 'Menus', name: 'Tile nav + dropdown', tag: 'M', trend: 'Flush-top tiles', gesture: 'hover · tap', fx: 'instant swap',
    decision: 'The site’s own nav: tiles sit on the top edge with no bar, so the page colour runs to the very top. Hover swaps to magenta in 0s.',
    html: `${NAV('Product')}
<section class="m ts-cloud" style="min-height:560px"><div class="ts-wrap" style="text-align:center;display:grid;gap:30px;justify-items:center;padding-top:60px">
<span class="ts-tag">Halftone OS 2.0</span><h1 class="ts-hero">tap the menu on the phone</h1><p class="ts-lead" style="max-width:40ch;margin:0">Desktop shows three groups of tiles. Phones collapse to a Menu tile that stacks the same tiles down the right edge.</p></div></section>` },

  { id: 'nav-index', group: 'Menus', name: 'Index menu (giant hover rows)', tag: 'X', trend: 'Index lists', gesture: 'hover · direction-aware', fx: 'fill from entry side + cursor readout',
    decision: 'After AOI’s “Be Memorable” list. Rows are the navigation; the fill enters from whichever edge the pointer crossed. Magenta (accent) only appears under the pointer, as the brand requires.',
    html: `<section class="m" data-scheme="signal" style="min-height:100%"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px"><span class="x-sec"><b>Section</b> Index</span><span class="ts-mono-s">04 items</span></div>
<ul class="x-index" data-readout>
<li><a class="x-index__row" href="/work" data-read="▣ 12 case studies"><span class="x-index__n">01</span><span class="x-index__t">be memorable</span><span class="x-index__meta">Make a dent in the psyche and leave an imprint.</span></a></li>
<li><a class="x-index__row" href="/method" data-read="▣ the method"><span class="x-index__n">02</span><span class="x-index__t">be meaningful</span><span class="x-index__meta">Give people something to chew on.</span></a></li>
<li><a class="x-index__row" href="/change" data-read="▣ outcomes"><span class="x-index__n">03</span><span class="x-index__t">be transformative</span><span class="x-index__meta">Create the change you want to champion.</span></a></li>
<li><a class="x-index__row" href="/contact" data-read="▣ say hi"><span class="x-index__n">04</span><span class="x-index__t">be in touch</span><span class="x-index__meta">hello@halftone.example</span></a></li></ul></section>` },

  { id: 'nav-mega', group: 'Menus', name: 'Mega menu', tag: 'X', trend: 'Mega menus with previews', gesture: 'hover · click', fx: 'instant open',
    decision: 'A dropdown that opens into three windows: links, a featured figure and a changelog. Still tiles and windows, so it reads as the same system at a bigger scale.',
    css: `.mega{position:absolute;left:50%;transform:translateX(-50%);top:41px;width:min(980px,96vw);display:none;grid-template-columns:1.2fr 1fr 1fr;gap:10px;z-index:40}.ts-dd.is-open .mega{display:grid}.mega a{display:block;padding:6px 0;color:inherit;text-decoration:none;font:400 16px/1.2 var(--font-text)}.mega a:hover{color:var(--link-hover)}@media(max-width:809px){.mega{grid-template-columns:1fr;top:41px;width:94vw}}`,
    html: `<header class="ts-nav"><div class="ts-nav__group"><a class="ts-tile ts-tile--ink" href="#">∵ Halftone</a></div>
<nav class="ts-nav__group" style="position:absolute;left:50%;transform:translateX(-50%)"><div class="ts-dd is-open"><button class="ts-tile" data-dd-toggle aria-expanded="true">Product <svg class="ts-dd__chev" viewBox="0 0 18 18"><path d="M3 6.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>
<div class="mega">${WIN('Product.idx', '<span class="ts-mono-s">platform</span><a href="#">Decisions API</a><a href="#">Batch jobs</a><a href="#">Guardrails</a><span class="ts-mono-s" style="display:block;margin-top:10px">tools</span><a href="#">Playground</a><a href="#">Evals</a>')}
${WIN('Router.fig 0.5', FIG('router'), '', 'padding:0')}
${WIN('Changelog', '<span class="ts-tag">v2.0</span><p class="ts-body" style="margin:8px 0">Parallel sampler, 3× cheaper batch.</p><a class="ts-link" href="#">Read the notes</a>', 'ts-window--grey')}</div></div><a class="ts-tile ts-hide-phone" href="#">Pricing</a><a class="ts-tile ts-hide-phone" href="#">Docs</a></nav></header>
<section class="m" style="min-height:620px"></section>` },

  { id: 'nav-sidebar', group: 'Menus', name: 'App sidebar → tab bar', tag: 'X', trend: 'App shells', gesture: 'tap', fx: 'instant',
    decision: 'Product UI: an ink sidebar with pixel section labels on desktop becomes a pixel-font tab bar on phones. Current item = accent fill.',
    css: `.shell{display:grid;grid-template-columns:220px 1fr;min-height:100vh}.shell main{padding:30px}.shell .ts-tabbar{display:none}@media(max-width:809px){.shell{grid-template-columns:1fr}.shell .ts-sidebar{display:none}.shell .ts-tabbar{display:grid;position:fixed;left:0;right:0;bottom:0}}`,
    html: `<div class="shell"><nav class="ts-sidebar"><span class="ts-pixel" style="padding:6px 8px">∵ Halftone</span><span class="ts-mono-s">workspace</span><a href="#" aria-current="page">Overview <span>⌘1</span></a><a href="#">Decisions <span>⌘2</span></a><a href="#">Datasets <span>⌘3</span></a><span class="ts-mono-s">settings</span><a href="#">API keys</a><a href="#">Billing</a></nav>
<main><span class="ts-crumbs"><a href="#">Workspace</a><span>Overview</span></span><h1 class="ts-h2" style="margin:14px 0 30px">overview</h1><div class="ts-bento">
<div style="--c:2">${WIN('Calls.today', '<span class="ts-readout" data-fx="count">48,210</span>')}</div><div style="--c:2">${WIN('p95.ms', '<span class="ts-readout" data-fx="count">112</span>')}</div><div style="--c:2">${WIN('Errors', '<span class="ts-readout ts-readout--green">0</span>')}</div></div></main>
<nav class="ts-tabbar" style="--n:4"><a href="#" aria-current="page">▣<span>Home</span></a><a href="#">◇<span>Calls</span></a><a href="#">▤<span>Data</span></a><a href="#">⚙<span>Set</span></a></nav></div>` },

  { id: 'nav-cmdk', group: 'Menus', name: 'Command palette ⌘K', tag: 'X', trend: 'Command palettes', gesture: 'keyboard · ⌘K', fx: 'instant dialog',
    decision: 'A window with an input on top. Arrow keys move the accent fill; Enter fires a toast. Keyboard-first suits a developer brand.',
    html: `<section class="m" style="min-height:100%;display:grid;place-items:center;text-align:center;gap:20px"><div><span class="ts-tag">Keyboard</span><h2 class="ts-h2" style="margin:16px 0">press <span class="ts-kbd">⌘</span> <span class="ts-kbd">K</span></h2><button class="ts-btn" data-cmdk-open style="box-shadow:inset 0 0 0 1px var(--fg)">Open palette</button></div></section>
<dialog class="ts-dialog ts-cmdk" data-cmdk><div class="ts-window" style="width:100%"><div class="ts-window__bar">Cmd 1.0 <span>esc</span></div><div class="ts-window__body"><div class="ts-window__panel"><input class="ts-cmdk__input" placeholder="Type a command…" aria-label="Command"><ul>
<li>New decision <span class="ts-kbd">N</span></li><li>Open playground <span class="ts-kbd">P</span></li><li>Switch workspace <span class="ts-kbd">W</span></li><li>Copy API key <span class="ts-kbd">C</span></li><li>Read the docs <span class="ts-kbd">D</span></li><li>Toggle theme <span class="ts-kbd">T</span></li></ul></div></div></div></dialog>` },

  { id: 'nav-filter', group: 'Menus', name: 'Breadcrumbs + filters + pager', tag: 'M', trend: 'Filter chips', gesture: 'tap', fx: 'colour ease .5s',
    decision: 'The blog’s pixel chips (active = accent text) with mono breadcrumbs and a tile pager. Everything a list page needs, nothing rounded.',
    html: `${NAV('Journal')}<section class="m" data-scheme="sage"><div class="ts-wrap" style="display:grid;gap:30px"><span class="ts-crumbs"><a href="#">Home</a><span>Journal</span><span>Thoughts</span></span>
<h1 class="ts-hero">journal</h1><div class="row" style="display:flex;gap:6px;flex-wrap:wrap"><button class="ts-chip" aria-pressed="true">All</button><button class="ts-chip">Thoughts</button><button class="ts-chip">Company News</button><button class="ts-chip">Media</button><button class="ts-chip">Research</button></div>
<div class="ts-pager"><a class="ts-tile" href="#">←</a><a class="ts-tile" aria-current="page" href="#">1</a><a class="ts-tile" href="#">2</a><a class="ts-tile" href="#">3</a><a class="ts-tile" href="#">→</a></div></div></section>` },

  /* ============================== HEROES ============================== */
  { id: 'hero-centered', group: 'Heroes', name: 'Centred mega hero', tag: 'M', trend: 'Oversized type', gesture: 'none', fx: 'waterfall',
    decision: 'The measured hero: cloud, announcement window, leader line, 150px title-case headline, base64 rails and two link-headings.',
    css: `.hh{display:grid;grid-template-columns:20px minmax(0,1fr) 20px;gap:10px}.hh .ts-b64{max-height:420px}`,
    html: `${NAV()}<section class="m ts-cloud"><div class="ts-wrap" style="display:grid;gap:34px;justify-items:center;text-align:center">
<a class="ts-window ts-window--grey ts-announce" href="#" style="text-decoration:none"><span class="ts-window__bar">Oct 14, 2026 • Halftone News</span><span class="ts-window__body"><span class="ts-window__panel"><span>We shipped a very fast model 🏎</span><span style="text-decoration:underline">View announcement</span></span></span></a>
<p class="ts-leader" style="margin:0;width:min(420px,100%)">Introducing OS 2 <i></i> Decisions in 80ms</p>
<div class="hh"><p class="ts-b64" data-b64="decisions your software can act on"></p><h1 class="ts-hero" data-fx="waterfall">decisions your software can act on</h1><p class="ts-b64" data-b64="halftone os"></p></div>
<div style="display:flex;gap:30px;flex-wrap:wrap;justify-content:center"><a class="ts-link-xl" href="#">Create Account</a><a class="ts-link-xl" href="#">Read The Docs</a></div></div></section>` },

  { id: 'hero-split', group: 'Heroes', name: 'Split hero + Hairline figure', tag: 'X', trend: 'Isometric line art', gesture: 'pointer', fx: 'mask + figure',
    decision: 'Mirrors the enterprise page (ink page, wireframe boxes) with a live Hairline figure that answers the pointer instead of a static drawing.',
    css: `.split{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}@media(max-width:809px){.split{grid-template-columns:1fr}}`,
    html: `${NAV()}<section class="m" data-scheme="night" style="min-height:100%"><div class="ts-wrap split"><div style="display:grid;gap:24px"><span class="ts-mono-xs">halftone for teams</span><h1 class="ts-hero" data-fx="mask">put it to work</h1>
<p class="ts-lead" style="margin:0;max-width:36ch">Typed decisions for your software. Classify, score and route at a fraction of the cost.</p><div><a class="ts-btn" href="#">Talk To Sales</a></div></div>
<div class="ts-crop" style="padding:20px">${FIG('exploded', '', '')}</div></div></section>` },

  { id: 'hero-spread', group: 'Heroes', name: 'Spread words + selection frame', tag: 'X', trend: 'Figma-UI-as-decoration', gesture: 'none', fx: 'decode',
    decision: 'After AOI: words justified across the full width, and an object wearing Figma selection handles, which rhymes with the site’s corner crop marks.',
    css: `.sp-media{width:min(460px,100%);aspect-ratio:4/3;margin:60px auto 0;display:grid;place-items:center}`,
    html: `${NAV()}<section class="m" data-scheme="night"><div class="ts-wrap"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:60px"><span class="x-sec"><b>Section</b> About</span><span class="x-sec">brand, product &amp; research</span></div>
<p class="x-spread" data-fx="decode">the sky is the limit</p>
<div class="sp-media x-select ts-dots"><i class="x-h x-h--tr"></i><i class="x-h x-h--bl"></i><span class="x-select__label">Frame 1 · 460 × 345</span><canvas data-dither="220" data-cell="2" style="width:220px;height:220px"></canvas></div></div></section>` },

  { id: 'hero-ticker', group: 'Heroes', name: 'Number hero + race window', tag: 'M', trend: 'Data-as-headline', gesture: 'none', fx: 'ticker + race loop',
    decision: 'The site leads with “193.6x Faster”. Digits roll like a slot machine (stepped under Computed), and the race bars loop linearly like the measured SVG.',
    css: `.race{display:grid;gap:12px}.race__row{display:grid;grid-template-columns:130px minmax(0,1fr) 60px;gap:10px;align-items:center}.race__lane{position:relative;height:1px;background:var(--fg);overflow-x:clip;overflow-y:visible}.race__lane i{position:absolute;left:0;top:-4px;width:8px;height:8px;background:var(--fg)}`,
    html: `${NAV()}<section class="m" data-scheme="pink"><div class="ts-wrap" style="display:grid;gap:40px">
<h1 class="ts-hero"><span style="white-space:nowrap"><span data-fx="ticker">193.6</span>x</span> faster, <span style="white-space:nowrap"><span data-fx="ticker">444.6</span>x</span> cheaper.</h1>
<div class="ts-dots" style="padding:30px">${WIN('Speed 1.1 <span class="ts-blink">●</span>', `<div class="race">${[['Halftone', 2.4, '193x'], ['Model B', 18.248, '6.2x'], ['Model C', 60, '2.1x']].map(([n, d, x]) => `<div class="race__row"><span class="ts-readout" style="font-size:calc(16px*var(--pixel-k))">${n}</span><span class="race__lane"><i class="ts-race" style="--to:min(46vw,520px);--d:${d}s"></i></span><span>${x}</span></div>`).join('')}</div>`, '', 'padding:14px')}</div></div></section>` },

  { id: 'hero-manifesto', group: 'Heroes', name: 'Grain manifesto', tag: 'X', trend: 'Textured type', gesture: 'scroll', fx: 'slam',
    decision: 'AOI’s distressed statement type, rebuilt as a noise fill inside the display face. Three lines slam on one beat, each with a different entrance (kinetic-beat-slam).',
    html: `<section class="m" data-scheme="mono" style="min-height:100%;display:grid;align-content:center;text-align:center"><div data-fx="slam" style="display:grid;gap:0">
<p class="ts-hero x-grain" style="margin:0">that’s what</p><p class="ts-hero x-grain" style="margin:0">fast feels</p><p class="ts-hero x-grain" style="margin:0">like.</p></div>
<p class="ts-mono-s" style="margin-top:40px">▣ manifesto for typed decisions</p></section>` },

  { id: 'hero-wordmark', group: 'Heroes', name: 'Cropped wordmark footer', tag: 'X', trend: 'Giant wordmarks', gesture: 'none', fx: 'mask',
    decision: 'The wordmark runs off the bottom edge, as on AOI and the site’s big “TypeSafe AI” lockup. Mono legal text sits in the gutter.',
    html: `<section class="m" data-scheme="night" style="padding-bottom:0"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:60px"><span class="x-sec"><b>Social</b> Instagram · LinkedIn</span><span class="x-sec"><b>Mail</b> hello@halftone.example</span><span class="x-sec"><b>Made</b> in Lisbon. With love.</span></div>
<p class="x-wordmark" data-fx="mask">halftone</p></section>` },

  /* ============================== CONTENT / BLOG ============================== */
  { id: 'blog-index', group: 'Blog & content', name: 'Journal index', tag: 'M', trend: 'Editorial lists', gesture: 'hover', fx: 'colour ease .5s',
    decision: 'The measured blog: sage page, ink featured card with a halftone image, then a dashed left rule down the list. Hover turns titles accent.',
    css: `.feat{display:grid;grid-template-columns:1fr 280px;gap:24px;background:var(--fg);color:var(--bg);padding:24px;max-width:820px;margin:0 auto 60px}.feat .ts-h-card{color:var(--bg)}@media(max-width:809px){.feat{grid-template-columns:1fr}}`,
    html: `${NAV('Journal')}<section class="m" data-scheme="sage"><div class="ts-wrap"><h1 class="ts-hero" style="text-align:center;margin-bottom:40px">thoughts</h1>
<a class="feat" href="#" style="text-decoration:none"><div style="display:grid;gap:10px;align-content:start"><span><span class="ts-tag" style="background:var(--bg);color:var(--fg)">Company News</span></span><span class="ts-h-card">halftone raises a series a</span><span class="ts-body" style="color:inherit">TL;DR we raised a lot, and it shows up as benefits to y’all.</span></div><div class="ts-dots" style="display:grid;place-items:center;background-color:var(--bg)"><canvas data-dither="160" data-cell="2" style="width:160px;height:160px"></canvas></div></a>
<div class="ts-rule-l ts-rule-l--dash" style="display:grid;gap:36px;max-width:520px;margin:0 auto">${[['Thoughts', 'the bitterest lesson', 'Compute drives progress, but only if you pick the right task.'], ['Research', 'lies, damned lies and benchmarks', 'A fourth kind of lie, and how we report ours.'], ['Media', 'founders you should know', 'A conversation about over-promising.']].map(([t, h, b]) => `<a class="ts-post" href="#"><span><span class="ts-tag">${t}</span></span><span class="ts-h-list">${h}</span><span class="ts-body">${b}</span></a>`).join('')}</div></div></section>` },

  { id: 'blog-article', group: 'Blog & content', name: 'Article page', tag: 'M', trend: 'Long-form', gesture: 'scroll', fx: 'none',
    decision: 'Centred 150px title, author in italics beside a 1px rule, 17px body, tables with 8px radius, an aside window and Fragment Mono code. The reading page stays calm.',
    css: `.art{display:grid;grid-template-columns:200px minmax(0,640px);gap:40px;justify-content:center}.toc{position:sticky;top:70px;align-self:start;display:grid;gap:8px}@media(max-width:809px){.art{grid-template-columns:1fr}.toc{display:none}}`,
    html: `${NAV('Journal')}<section class="m" data-scheme="sage"><div class="ts-crop" style="text-align:center;padding:40px 10px;margin-bottom:40px"><span class="ts-tag ts-tag--l">Company News</span><h1 class="ts-hero" style="margin-top:20px">introducing halftone os 2</h1></div>
<div class="art"><nav class="toc ts-mono-s"><a class="ts-link" href="#">01 why now</a><a class="ts-link" href="#">02 the receipts</a><a class="ts-link" href="#">03 what’s next</a></nav><article class="ts-rule-l" style="display:grid;gap:18px">
<em class="ts-body">Ada Moreno, founder</em><p class="ts-body" style="margin:0">Models have been superhuman at chat for years, so where is all the automation? <strong>OS 2</strong> answers typed questions in one parallel pass.</p>
<h2 class="ts-h2" style="font-size:clamp(30px,4vw,64px)">the receipts</h2><div class="ts-table-scroll"><table class="ts-table"><thead><tr><th></th><th>Before</th><th>OS 2</th></tr></thead><tbody><tr><td>Latency</td><td>3–30 s</td><td>80 ms</td></tr><tr><td>Output</td><td>Strings</td><td>Typed values</td></tr></tbody></table></div>
${WIN('Aside.txt', '<p class="ts-body" style="margin:0">Extraordinary claims need receipts, so every number links to its eval. 💅</p>', 'ts-window--grey')}<p class="ts-body" style="margin:0">Install with <code>npm i halftone</code> and call <code>ht.ask(state)</code>.</p></article></div></section>` },

  { id: 'blog-grid', group: 'Blog & content', name: 'Work grid with ▣ labels', tag: 'X', trend: 'Masonry portfolios', gesture: 'hover', fx: 'pop',
    decision: 'AOI’s work wall restyled: square media, ▣ pixel captions above each tile, uneven column heights. Media are dithered placeholders, never invented client work.',
    css: `.wg{columns:3 260px;column-gap:12px}.wg a{break-inside:avoid;display:grid;gap:6px;margin-bottom:16px;color:var(--fg);text-decoration:none}.wg .md{display:grid;place-items:center;background:var(--win-panel)}.wg a:hover .ts-mono-s{color:var(--link-hover)}`,
    html: `${NAV()}<section class="m" data-scheme="night"><div class="ts-wrap"><div style="display:flex;justify-content:space-between;margin-bottom:30px"><span class="x-sec"><b>Section</b> Work</span><a class="ts-link" href="#">View all work</a></div><div class="wg" data-fx="pop">
${[[260, 'sensory experiments'], [180, 'state of living'], [320, 'night market'], [220, 'capitol theatre'], [160, '25th anniversary'], [280, 'ideas worth spreading']].map(([h, t], i) => `<a href="#" class="fx-pop"><span class="ts-mono-s">▣ ${t}</span><span class="md ts-dots" style="height:${h}px"><canvas data-dither="${Math.min(h - 40, 140)}" data-cell="2" data-light-x="${(i % 3) * .3 + .1}"></canvas></span></a>`).join('')}</div></div></section>` },

  { id: 'changelog', group: 'Blog & content', name: 'Changelog', tag: 'X', trend: 'Public changelogs', gesture: 'scroll', fx: 'decode on versions',
    decision: 'Versions are the machine voice: pixel tags, decoding on reveal. Notes stay in the grotesk. A dashed rule ties the timeline together.',
    css: `.cl{display:grid;grid-template-columns:160px 1fr;gap:12px 30px;max-width:860px;margin:0 auto}.cl>div{padding-bottom:36px}@media(max-width:809px){.cl{grid-template-columns:1fr}}`,
    html: `${NAV('Docs')}<section class="m"><div class="ts-wrap"><h1 class="ts-h2" style="text-align:center;margin-bottom:50px">changelog</h1><div class="cl">${[['v2.0.0', 'Oct 14, 2026', 'Parallel sampler', 'Batch calls are 3× cheaper and p95 drops to 80ms.'], ['v1.4.2', 'Sep 30, 2026', 'Guardrails', 'Score and block jailbreaks inline.'], ['v1.4.0', 'Sep 02, 2026', 'Datasets', 'Upload labelled rows and run evals on them.']].map(([v, d, h, b]) => `<div><span class="ts-tag ts-tag--l" data-fx="decode">${v}</span><p class="ts-mono-s" style="margin:8px 0 0">${d}</p></div><div class="ts-rule-l ts-rule-l--dash"><h3 class="ts-h3" style="margin:0 0 8px">${h}</h3><p class="ts-body" style="margin:0">${b}</p></div>`).join('')}</div></div></section>` },

  { id: 'case-study', group: 'Blog & content', name: 'Case study + compare slider', tag: 'X', trend: 'Before/after', gesture: 'drag', fx: 'count',
    decision: 'Pink case-study cards from the enterprise page (readouts on ink, green savings) plus a drag-to-compare slider. Proof first, prose second.',
    css: `.cs{display:grid;grid-template-columns:1fr 1fr;gap:20px}.cs .side{height:300px;display:grid;place-items:center}@media(max-width:809px){.cs{grid-template-columns:1fr}}`,
    html: `${NAV()}<section class="m" data-scheme="night"><div class="ts-wrap" style="display:grid;gap:40px"><h1 class="ts-h2">candidate screening at 88% lower cost</h1><div class="cs">
<div class="ts-dots" data-scheme="pink" style="padding:20px;display:flex;gap:10px;flex-wrap:wrap;align-content:flex-start">${WIN('Savings', '<span class="ts-readout ts-readout--green" data-fx="count">88%</span><br>lower cost*', 'ts-window--grey')}${WIN('Speed', '<span class="ts-readout" data-fx="count">2x</span><br>faster*')}${WIN('Quality', '<span class="ts-readout" data-fx="count">94.6%</span><br>score')}</div>
<div class="ts-compare" style="height:300px"><div class="side" data-scheme="paper"><span class="ts-pixel-l">before · 8.5s</span></div><div class="ts-compare__after side" data-scheme="pink"><span class="ts-pixel-l">after · 0.11s</span></div><span class="ts-compare__line"></span><input type="range" min="0" max="100" value="50" aria-label="Compare"></div></div>
<a class="ts-link" href="#">Read the case study</a></div></section>` },

  { id: 'newsletter', group: 'Blog & content', name: 'Newsletter window', tag: 'X', trend: 'Owned audiences', gesture: 'type · submit', fx: 'toast',
    decision: 'Signup lives in a window like every other widget. Submitting raises a toast in the same window chrome, so feedback looks like the system talking.',
    html: `<section class="m ts-dots" data-scheme="pink" style="min-height:100%;display:grid;place-items:center">${WIN('Newsletter.app 1.0', `<form onsubmit="event.preventDefault();TasteIndex.toast('You’re in. First issue lands Friday.','Mail 1.0')" style="display:grid;gap:14px;width:min(420px,80vw);font-family:var(--font-text)"><h2 class="ts-h3" style="margin:0;font-family:var(--font-display)">one email a month. receipts included.</h2><label class="ts-field"><span>email</span><input class="ts-input" type="email" required placeholder="you@company.com"></label><label class="ts-switch"><input type="checkbox" checked> Research notes too</label><button class="ts-tile ts-tile--ink" style="justify-self:start">Subscribe</button></form>`, '', 'padding:18px')}</section>` },

  /* ============================== MARKETING SECTIONS ============================== */
  { id: 'logos', group: 'Sections', name: 'Logo strip (marquee)', tag: 'X', trend: 'Social proof strips', gesture: 'hover pauses', fx: 'linear marquee',
    decision: 'Placeholder wordmarks in pixel type inside hairline tiles. Never draw a real client logo from memory; swap in the client’s files.',
    html: `<section class="m"><p class="ts-mono-s" style="text-align:center;margin-bottom:24px">trusted by teams shipping typed software</p><div class="x-marquee" data-speed="60"><div class="x-marquee__track" style="gap:10px">${['NORTHWIND', 'ACME/CO', 'LUMEN', 'PARCEL', 'OKTAV', 'FIELDNOTE', 'MERIDIAN'].map((n) => `<span class="ts-logo">${n}</span>`).join('')}</div></div></section>` },

  { id: 'bento', group: 'Sections', name: 'Feature bento of windows', tag: 'X', trend: 'Bento grids', gesture: 'pointer on figures', fx: 'pop + figures',
    decision: 'Bento is the trend; windows make it ours. Each cell is a small program (figure, clock, glider, readout) with a version-numbered title bar.',
    html: `${NAV('Product')}<section class="m" data-scheme="pink"><div class="ts-wrap"><h2 class="ts-h2" style="margin-bottom:40px">built for automation</h2><div class="ts-bento" data-fx="pop">
<div class="fx-pop" style="--c:3">${WIN('Terminal.fig 0.5 <span data-hairline-read></span>', FIG('terminal'), '', 'padding:0')}</div>
<div class="fx-pop" style="--c:3">${WIN('Hub.fig 0.5', FIG('hub'), '', 'padding:0')}</div>
<div class="fx-pop" style="--c:2">${WIN('Glider 1.1', '<canvas data-life="8"></canvas><span>Game of Life</span>')}</div>
<div class="fx-pop" style="--c:2" data-clock>${WIN('Clock Tool 1.1', '<span data-clock-date></span><br><span data-clock-time></span>')}</div>
<div class="fx-pop" style="--c:2">${WIN('Savings', '<span class="ts-readout ts-readout--green">88%</span><br>lower cost*', 'ts-window--grey')}</div></div></div></section>` },

  { id: 'stats', group: 'Sections', name: 'Stats band', tag: 'M', trend: 'Proof numbers', gesture: 'scroll', fx: 'count + bars',
    decision: 'Big h2-size numbers with 13px captions (measured), plus bars that grow from the baseline. Numbers must come from the client; never invent them.',
    css: `.sb{display:grid;grid-template-columns:repeat(4,1fr);gap:30px}@media(max-width:809px){.sb{grid-template-columns:1fr 1fr}}`,
    html: `<section class="m" data-scheme="paper"><div class="ts-wrap ts-crop" style="padding:40px 20px"><div class="sb">${[['$42', 'Per billion input tokens.'], ['238x', 'Lower input price.'], ['80ms', 'p95 latency.'], ['0', 'Type errors, ever.']].map(([n, c]) => `<div class="ts-stat"><span class="ts-stat__n" data-fx="count">${n}</span><span class="ts-stat__c">${c}</span></div>`).join('')}</div>
<div class="fx-bars" data-fx="bars" style="margin-top:40px">${[22, 30, 26, 44, 38, 56, 62, 90].map((h) => `<i class="fx-bar" style="--h:${h}%"></i>`).join('')}</div></div></section>` },

  { id: 'pricing', group: 'Sections', name: 'Pricing tiers', tag: 'X', trend: 'Usage pricing', gesture: 'toggle', fx: 'ticker on price',
    decision: 'Three windows; the recommended tier is inverted to ink rather than coloured, because accent is reserved for pointer state.',
    css: `.pr{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.pr .ts-window{width:100%;height:100%}.pr .ts-window__panel{display:grid;gap:16px;font-family:var(--font-text);padding:18px;height:100%;align-content:start}.pr .inv .ts-window__panel{background:var(--fg);color:var(--bg)}@media(max-width:809px){.pr{grid-template-columns:1fr}}`,
    html: `${NAV('Pricing')}<section class="m"><div class="ts-wrap"><div style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:20px;margin-bottom:40px"><h1 class="ts-h2">pay per decision</h1><div class="ts-seg"><label><input type="radio" name="p" checked><span>Monthly</span></label><label><input type="radio" name="p"><span>Yearly −20%</span></label></div></div><div class="pr">
${[['Builder', '0', 'Free forever', ['10k calls / month', 'Playground', 'Community']], ['Team', '49', 'per seat / month', ['1M calls / month', 'Evals + datasets', 'Email support'], 'inv'], ['Enterprise', '—', 'talk to us', ['SOC2 Type II', 'Zero retention', 'VPC deploy']]].map(([n, p, s, f, inv]) => `<div class="${inv || ''}">${WIN(n + ' 1.0', `<span class="ts-price">$<span data-fx="ticker">${p}</span><small>${s}</small></span><ul class="ts-list">${f.map((x) => `<li>${x}</li>`).join('')}</ul><a class="ts-tile ${inv ? '' : 'ts-tile--ink'}" href="#" style="justify-self:start">${n === 'Enterprise' ? 'Talk To Sales' : 'Start Free'}</a>`)}</div>`).join('')}</div></div></section>` },

  { id: 'compare', group: 'Sections', name: 'Comparison table', tag: 'M', trend: 'Us vs them', gesture: 'scroll-x on phone', fx: 'none',
    decision: 'The site’s “Existing LLMs vs System One” table: 1px rules, 8px radius, th fill. On phones it scrolls inside its own box, never the page.',
    html: `<section class="m" data-scheme="sage"><div class="ts-wrap" style="display:grid;gap:30px"><h2 class="ts-h2">frontiers, old and new</h2><div class="ts-table-scroll"><table class="ts-table" style="background:var(--ts-paper);color:var(--ts-ink)"><thead><tr><th></th><th>Chat models</th><th>Halftone</th></tr></thead><tbody>
<tr><td>Optimised for</td><td>Human preference</td><td>Calibrated decisions</td></tr><tr><td>Outputs</td><td>Strings, parsed later</td><td>Typed values, never a type error</td></tr><tr><td>Sampling</td><td>Sequential</td><td>Parallel</td></tr><tr><td>Speed</td><td>3–329 s</td><td>70–500 ms</td></tr><tr><td>Cost</td><td>$0.20–$10 / MTok</td><td>$0.042 / MTok</td></tr></tbody></table></div></div></section>` },

  { id: 'testimonials', group: 'Sections', name: 'Quote windows (swipe)', tag: 'X', trend: 'Swipeable proof', gesture: 'swipe · drag', fx: 'scroll-snap',
    decision: 'Quotes in display type inside windows named like files. Swipe on phones, drag with a mouse; the page itself never scrolls sideways.',
    html: `<section class="m" data-scheme="night"><div class="ts-wrap" style="display:grid;gap:30px"><span class="x-sec"><b>Section</b> Words</span><div class="ts-swipe">${[['“I wouldn’t trust anyone else with our launch.”', 'Mara K. · Head of Ops'], ['“It answered in 80ms and never broke our parser.”', 'Dev L. · Staff Engineer'], ['“Our evals finally make sense to the board.”', 'Ines P. · CTO']].map(([q, a], i) => WIN(`Review_0${i + 1}.txt`, `<blockquote class="ts-quote" style="color:var(--win-fg)">${q}</blockquote><p class="ts-mono-s" style="margin:16px 0 0;color:var(--win-fg)">${a}</p>`, '', 'padding:18px;font-family:var(--font-text)')).join('')}</div></div></section>` },

  { id: 'faq', group: 'Sections', name: 'FAQ', tag: 'M', trend: 'Native accordions', gesture: 'tap', fx: 'instant',
    decision: 'The site’s FAQ: mono 13/300 questions, a boxed +/− glyph, dashed left rule. Native <details>, so it works with no JS.',
    html: `<section class="m" data-scheme="night"><div class="ts-wrap" style="max-width:760px"><h2 class="ts-h2" style="text-align:center;margin-bottom:40px">we give a FAQ</h2><div class="ts-faq">
<details open><summary>what is halftone os?</summary><div class="ts-body">A model for decisions inside software: typed questions in, typed answers out.</div></details><details><summary>is it just a smaller LLM?</summary><div class="ts-body">No. It gives up text generation to answer in one parallel pass.</div></details><details><summary>do you train on our data?</summary><div class="ts-body">No. Zero retention is available on every plan.</div></details><details><summary>how much does it cost?</summary><div class="ts-body">$0.042 per million input tokens.</div></details></div></div></section>` },

  { id: 'cta', group: 'Sections', name: 'CTA band', tag: 'M', trend: 'Closing statements', gesture: 'hover', fx: 'marker',
    decision: 'A pink panel, cropped frame, a centred h2 and two link-headings. The marker sweep is the one flourish, in accent, on the key phrase.',
    html: `<section class="ts-panel" data-scheme="pink"><div class="ts-panel__frame ts-crop ts-dots" style="padding:90px 20px;text-align:center;display:grid;gap:40px;justify-items:center"><h2 class="ts-h2" style="max-width:14ch">come build <span data-fx="marker">with us</span></h2><div style="display:flex;gap:30px;flex-wrap:wrap;justify-content:center"><a class="ts-link-xl" href="#">Open Roles</a><a class="ts-link-xl" href="#">Join Discord</a></div></div></section>` },

  { id: 'method', group: 'Sections', name: 'Method list (hover rows)', tag: 'X', trend: 'Index lists', gesture: 'hover', fx: 'direction-aware fill',
    decision: 'The index menu used as content: three principles, each a giant row with a short line on the right. Works as services, values or steps.',
    html: `<section class="m" data-scheme="signal"><div class="ts-wrap" style="margin-bottom:30px"><span class="x-sec"><b>Section</b> Our method</span><p class="ts-lead" style="max-width:44ch">Anyone can tell a story. Telling the right one at the right time is the job.</p></div><ul class="x-index x-index--sm">
<li><a class="x-index__row" href="#"><span class="x-index__n">01</span><span class="x-index__t">be memorable</span><span class="x-index__meta">Shatter expectations.</span></a></li><li><a class="x-index__row" href="#"><span class="x-index__n">02</span><span class="x-index__t">be meaningful</span><span class="x-index__meta">Provoke thought.</span></a></li><li><a class="x-index__row" href="#"><span class="x-index__n">03</span><span class="x-index__t">be transformative</span><span class="x-index__meta">Incite action.</span></a></li></ul></section>` },

  { id: 'contact', group: 'Sections', name: 'Contact (big type + form)', tag: 'X', trend: 'Conversational contact', gesture: 'type · pick', fx: 'waterfall',
    decision: 'AOI’s “We don’t bite” scale in our voice: a cheeky big line on the left, a windowed form on the right, intent picked with tile radios.',
    css: `.ct{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:start}@media(max-width:809px){.ct{grid-template-columns:1fr}}`,
    html: `${NAV()}<section class="m" data-scheme="night"><div class="ts-wrap ct"><div style="display:grid;gap:24px"><h1 class="ts-h2" data-fx="waterfall">we don’t bite, but our evals might.</h1><span class="x-sec"><b>Email</b> hello@halftone.example</span><span class="x-sec"><b>Where</b> Lisbon. Working everywhere.</span></div>
${WIN('Contact.app 1.0', `<form onsubmit="event.preventDefault();TasteIndex.toast('Sent. We reply within a day.','Mail 1.0')" style="display:grid;gap:14px;font-family:var(--font-text)"><div class="ts-seg"><label><input type="radio" name="i" checked><span>Enterprise</span></label><label><input type="radio" name="i"><span>Partnerships</span></label><label><input type="radio" name="i"><span>Press</span></label></div><label class="ts-field"><span>name</span><input class="ts-input" required></label><label class="ts-field"><span>email</span><input class="ts-input" type="email" required></label><label class="ts-field"><span>what are you building?</span><textarea class="ts-input"></textarea></label><button class="ts-tile ts-tile--ink" style="justify-self:start">Send</button></form>`, '', 'padding:18px')}</div></section>` },

  { id: 'footer', group: 'Sections', name: 'Mega footer', tag: 'M', trend: 'Sitemap footers', gesture: 'hover', fx: 'none',
    decision: 'Measured ink footer bar under a sitemap in mono labels and the base64 block. Legal sits at 15px, never smaller.',
    css: `.ft{display:grid;grid-template-columns:repeat(4,1fr);gap:30px}.ft a{display:block;padding:4px 0;color:inherit;text-decoration:none;font:400 15px/1.3 var(--font-text)}.ft a:hover{color:var(--link-hover)}@media(max-width:809px){.ft{grid-template-columns:1fr 1fr}}`,
    html: `<section class="m" data-scheme="night"><div class="ts-wrap ft">${[['product', ['Decisions API', 'Batch', 'Guardrails']], ['company', ['Manifesto', 'Team', 'Open roles']], ['resources', ['Docs', 'Changelog', 'Status']]].map(([h, ls]) => `<div><span class="ts-mono-s">${h}</span>${ls.map((l) => `<a href="#">${l}</a>`).join('')}</div>`).join('')}<div><span class="ts-mono-xs">[b.64]</span><p class="ts-b64-block" data-b64="made in lisbon with love" data-b64-repeat="3" style="margin:4px 0"></p></div></div></section><footer class="ts-footer"><span>Halftone © 2026</span><nav><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Accessibility</a></nav><a href="#">X</a></footer>` },

  /* ============================== GESTURES & INTERACTION ============================== */
  { id: 'hover-preview', group: 'Gestures', name: 'Hover list with cursor preview', tag: 'X', trend: 'Cursor previews', gesture: 'hover · pointer follow', fx: 'window follows cursor',
    decision: 'A preview window trails the pointer over a list, a common agency move. Here it’s a version-numbered window, so it stays in character. It’s off on touch screens.',
    html: `<section class="m" data-scheme="paper"><div class="ts-wrap" data-preview><span class="x-sec" style="margin-bottom:20px"><b>Section</b> Projects</span>${[['Decision engine', '#f386a1', 'routing 2.4M calls/day'], ['Guardrail kit', '#abbab9', 'blocks 99.2% of jailbreaks'], ['Eval harness', '#dedede', '40 suites · nightly'], ['Batch runner', '#44c086', 'petabytes → features']].map(([t, c, p], i) => `<a href="#" class="ts-post" data-preview-text="${p}" data-preview-color="${c}" data-preview-bar="Project_0${i + 1}" style="grid-template-columns:4ch 1fr auto;align-items:baseline;padding:14px 0;border-bottom:1px solid var(--rule)"><span class="ts-pixel">0${i + 1}</span><span class="ts-h-card">${t}</span><span class="ts-mono-s">2026</span></a>`).join('')}</div></section>` },

  { id: 'sticky-stack', group: 'Gestures', name: 'Sticky stacked windows', tag: 'X', trend: 'Stacking cards', gesture: 'scroll', fx: 'CSS sticky (no JS)',
    decision: 'Windows pile up like an OS desktop as you scroll. Pure CSS sticky, so it works without JS and never hides content.',
    html: `<section class="m" data-scheme="pink"><div class="ts-wrap" style="max-width:720px"><h2 class="ts-h2" style="margin-bottom:30px">how it works</h2><div class="ts-stack">${[['01_Describe.txt', 'Define the question and the allowed answers as types.'], ['02_Ask.txt', 'Send program state. Get every option scored in one pass.'], ['03_Act.txt', 'Branch on the confidence. Escalate when it’s low.'], ['04_Verify.txt', 'Every call is logged and replayable.']].map(([t, b], i) => `<div style="--i:${i}">${WIN(t, `<p class="ts-lead" style="margin:0;color:var(--win-fg)">${b}</p>`, '', 'padding:30px 18px;min-height:220px;font-family:var(--font-text)')}</div>`).join('')}</div><div style="height:300px"></div></div></section>` },

  { id: 'tabs', group: 'Gestures', name: 'Tabs with code', tag: 'X', trend: 'Code-first docs', gesture: 'tap · arrow keys', fx: 'instant',
    decision: 'Tabs are tiles; the selected one goes ink. Arrow keys move between them. Code panels use Fragment Mono on ink.',
    html: `<section class="m" data-scheme="paper"><div class="ts-wrap" data-tabs style="max-width:820px;display:grid;gap:10px"><div class="ts-tabs__list" role="tablist"><button class="ts-tile" role="tab" aria-selected="true" aria-controls="t1">Python</button><button class="ts-tile" role="tab" aria-selected="false" aria-controls="t2">TypeScript</button><button class="ts-tile" role="tab" aria-selected="false" aria-controls="t3">cURL</button></div>
<pre class="ts-tabs__panel" id="t1" role="tabpanel" style="margin:0;padding:18px;background:var(--ts-ink);color:var(--ts-paper);font:400 14px/1.5 var(--font-code);overflow:auto">from halftone import ask\n\nverdict = ask("is this refundable?", state, outputs=bool)\nif verdict.confidence > .9: refund()</pre>
<pre class="ts-tabs__panel" id="t2" role="tabpanel" hidden style="margin:0;padding:18px;background:var(--ts-ink);color:var(--ts-paper);font:400 14px/1.5 var(--font-code);overflow:auto">import { ask } from "halftone";\n\nconst v = await ask("is this refundable?", state, Boolean);</pre>
<pre class="ts-tabs__panel" id="t3" role="tabpanel" hidden style="margin:0;padding:18px;background:var(--ts-ink);color:var(--ts-paper);font:400 14px/1.5 var(--font-code);overflow:auto">curl https://api.halftone.example/v1/ask -d '{"q":"refundable?"}'</pre></div></section>` },

  { id: 'scroll-lit', group: 'Gestures', name: 'Scroll-lit paragraph', tag: 'X', trend: 'Scroll-scrubbed text', gesture: 'scroll', fx: 'words light up',
    decision: 'AOI’s dim-to-bright paragraph. Without JS (or with reduced motion) every word is simply visible; JS only dims what you haven’t reached.',
    html: `<section class="m" data-scheme="night" style="padding-block:160px"><div class="ts-wrap" style="max-width:980px"><span class="x-sec" style="margin-bottom:30px"><b>Section</b> About us</span><p class="ts-h2 x-lit" style="text-transform:none;font-size:clamp(30px,4.4vw,64px)">Halftone is a research lab building models for decisions inside software. We think, ship and measure, then show you the receipts.</p></div><div style="height:500px"></div></section>` },

  { id: 'toast-modal', group: 'Gestures', name: 'Toasts + dialog', tag: 'X', trend: 'System feedback', gesture: 'tap', fx: 'whip-in toast',
    decision: 'Feedback speaks in windows with blinking status dots. The dialog is native <dialog> over an ink scrim, square, with no shadow.',
    html: `<section class="m" style="min-height:100%;display:grid;place-items:center"><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="ts-tile ts-tile--ink" data-toast="Decision logged · conf 0.93" data-toast-title="Call 2.0">Fire a toast</button><button class="ts-tile" style="box-shadow:inset 0 0 0 1px var(--fg)" data-dialog-open="dlg">Open dialog</button></div></section>
<dialog class="ts-dialog" id="dlg">${WIN('Confirm.app 1.0 <button class="ts-tile" data-dialog-close style="height:18px;font-size:13px">×</button>', '<h3 class="ts-h3" style="margin:0 0 10px;font-family:var(--font-display)">rotate the api key?</h3><p class="ts-body" style="margin:0 0 18px">The old key stops working in 60 seconds.</p><div style="display:flex;gap:6px"><button class="ts-tile ts-tile--ink" data-dialog-close data-toast="Key rotated" data-toast-title="Keys 1.0">Rotate</button><button class="ts-tile" style="box-shadow:inset 0 0 0 1px var(--fg)" data-dialog-close>Cancel</button></div>', '', 'padding:18px;font-family:var(--font-text)')}</dialog>` },

  { id: 'swipe-gallery', group: 'Gestures', name: 'Swipe gallery', tag: 'X', trend: 'Horizontal galleries', gesture: 'swipe · drag', fx: 'scroll-snap',
    decision: 'Horizontal content without hijacking the page: a snap row that scrolls inside its own box, with dithered media and pixel captions.',
    html: `<section class="m" data-scheme="sage"><div class="ts-wrap" style="display:grid;gap:20px"><div style="display:flex;justify-content:space-between"><span class="x-sec"><b>Gallery</b> Field notes</span><span class="ts-mono-s">drag →</span></div><div class="ts-swipe">${[0, 1, 2, 3, 4].map((i) => `<figure style="margin:0;display:grid;gap:6px"><div class="ts-dots" style="height:280px;display:grid;place-items:center;background-color:var(--ts-paper)"><canvas data-dither="180" data-cell="2" data-light-x="${.15 + i * .17}"></canvas></div><figcaption class="ts-mono-s">▣ plate 0${i + 1}</figcaption></figure>`).join('')}</div></div></section>` },

  /* ============================== APP / PRODUCT UI ============================== */
  { id: 'dashboard', group: 'Product UI', name: 'Dashboard of windows', tag: 'X', trend: 'Ops dashboards', gesture: 'pointer', fx: 'count + bars + loops',
    decision: 'An OS desktop: metrics, a live clock, bars and a phosphor figure. Every widget is a window, so a dense screen still feels like one system.',
    css: `.db{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.db>*{min-width:0}.db .w2{grid-column:span 2}@media(max-width:809px){.db{grid-template-columns:1fr 1fr}.db .w2{grid-column:span 2}}.db .ts-window{width:100%}`,
    html: `<section class="m ts-dots" data-scheme="pink" style="min-height:100%"><div class="db">
<div>${WIN('Calls.24h', '<span class="ts-readout" data-fx="count">2,410,882</span>')}</div><div>${WIN('p95.ms', '<span class="ts-readout" data-fx="count">83</span>')}</div><div>${WIN('Spend.usd', '<span class="ts-readout ts-readout--green" data-fx="count">$41.20</span>', 'ts-window--grey')}</div><div data-clock>${WIN('Clock 1.1', '<span data-clock-time>16:41:13</span>')}</div>
<div class="w2">${WIN('Volume.wk', `<div class="fx-bars" data-fx="bars" style="height:150px">${[30, 42, 38, 55, 61, 48, 72, 80, 66, 90].map((h) => `<i class="fx-bar" style="--h:${h}%"></i>`).join('')}</div>`)}</div>
<div class="w2">${WIN('Phosphor.fig 0.5', FIG('phosphor'), '', 'padding:0')}</div>
<div class="w2">${WIN('Status', `<div style="display:grid;gap:8px;font-family:var(--font-text)"><span class="ts-status">api · operational</span><span class="ts-status ts-status--warn">batch · degraded</span><span class="ts-status ts-status--idle">evals · idle</span></div>`)}</div>
<div class="w2">${WIN('Budget', '<div class="fx-track" data-fx="bars"><i class="fx-fill" style="--p:.62;display:block"></i></div><p class="ts-mono-s" style="margin:8px 0 0">62% of monthly cap</p>')}</div></div></section>` },

  { id: 'settings', group: 'Product UI', name: 'Settings form', tag: 'X', trend: 'Dense settings', gesture: 'type · toggle', fx: 'instant switches',
    decision: 'Square inputs with a 1px ink outline, mono field labels, square switches. Focus uses a 2px accent outline, the only place accent outlines anything.',
    css: `.st{display:grid;grid-template-columns:240px 1fr;gap:30px;max-width:900px}.st h3{margin:0}@media(max-width:809px){.st{grid-template-columns:1fr}}`,
    html: `<section class="m"><div class="ts-wrap"><h1 class="ts-h2" style="margin-bottom:40px">settings</h1><div class="st"><div><h3 class="ts-h3">workspace</h3><p class="ts-small" style="opacity:.7">Name, region and defaults.</p></div><div style="display:grid;gap:16px"><label class="ts-field"><span>workspace name</span><input class="ts-input" value="Halftone Labs"></label><label class="ts-field"><span>region</span><div class="ts-seg"><label><input type="radio" name="r" checked><span>EU · Lisbon</span></label><label><input type="radio" name="r"><span>US · Oregon</span></label></div></label><label class="ts-switch"><input type="checkbox" checked> Zero data retention</label><label class="ts-switch"><input type="checkbox"> Send weekly digest</label><button class="ts-tile ts-tile--ink" style="justify-self:start" data-toast="Saved" data-toast-title="Settings 1.0">Save</button></div></div></div></section>` },

  { id: 'login', group: 'Product UI', name: 'Login window', tag: 'X', trend: 'Calm auth', gesture: 'type', fx: 'figure',
    decision: 'Auth is one centred window on a dot field with a padlock figure. Nothing else competes; the brand shows through the chrome alone.',
    html: `<section class="m ts-dots" data-scheme="sage" style="min-height:100%;display:grid;place-items:center">${WIN('Login.app 1.0', `<div style="display:grid;gap:14px;width:min(360px,78vw);font-family:var(--font-text)"><div style="width:120px;justify-self:center">${FIG('padlock')}</div><label class="ts-field"><span>email</span><input class="ts-input" type="email"></label><label class="ts-field"><span>password</span><input class="ts-input" type="password"></label><button class="ts-tile ts-tile--ink" style="justify-content:center">Log In</button><a class="ts-link ts-small" href="#" style="justify-self:center">Forgot it?</a></div>`, '', 'padding:18px')}</section>` },

  { id: 'empty', group: 'Product UI', name: 'Empty state', tag: 'X', trend: 'Friendly empties', gesture: 'pointer', fx: 'figure + typewriter',
    decision: 'An empty page is a chance for the machine voice: a typed line, a Hairline drawer figure with nothing in it, one ink action.',
    html: `<section class="m" style="min-height:100%;display:grid;place-items:center;text-align:center"><div style="display:grid;gap:18px;justify-items:center;width:min(420px,90vw)"><div style="width:100%">${FIG('drawer', '', '')}</div><p class="ts-pixel-l" data-fx="type" style="margin:0">no datasets yet</p><p class="ts-body" style="margin:0">Upload labelled rows to run your first eval.</p><button class="ts-tile ts-tile--ink">Upload CSV</button></div></section>` },

  { id: 'onboarding', group: 'Product UI', name: 'Onboarding steps', tag: 'X', trend: 'Guided setup', gesture: 'tap', fx: 'instant',
    decision: 'Numbered pixel steps: done = ink, current = accent, next = panel. Progress you can read at a glance, in the system’s own colours.',
    html: `<section class="m" data-scheme="paper"><div class="ts-wrap" style="max-width:860px;display:grid;gap:30px"><div class="ts-steps" style="--n:4"><div class="is-done">Create workspace</div><div class="is-done">Add API key</div><div aria-current="step">First call</div><div>Invite team</div></div>
${WIN('Step_03.app', `<div style="display:grid;gap:14px;font-family:var(--font-text)"><h2 class="ts-h3" style="margin:0;font-family:var(--font-display)">make your first call</h2><pre style="margin:0;padding:14px;background:var(--ts-ink);color:var(--ts-paper);font:400 13px/1.5 var(--font-code);overflow:auto">curl -X POST https://api.halftone.example/v1/ask</pre><div style="display:flex;gap:6px"><button class="ts-tile ts-tile--ink" data-toast="First call ✓ · 82ms" data-toast-title="Call 1.0">Run it</button><button class="ts-tile" style="box-shadow:inset 0 0 0 1px var(--fg)">Skip</button></div></div>`, '', 'padding:18px')}</div></section>` },

  { id: 'status', group: 'Product UI', name: 'Status page', tag: 'X', trend: 'Transparent ops', gesture: 'hover', fx: 'blink',
    decision: 'Uptime bars, square status dots and a blinking live marker. Ops data shown in the brand’s machine voice.',
    html: `<section class="m" data-scheme="night"><div class="ts-wrap" style="max-width:860px;display:grid;gap:24px"><div style="display:flex;justify-content:space-between;align-items:center"><h1 class="ts-h2">status</h1><span class="ts-tag">LIVE <span class="ts-blink">●</span></span></div>${[['API', ''], ['Batch', '7'], ['Playground', ''], ['Evals', '31']].map(([n, w]) => `<div style="display:grid;gap:8px"><div style="display:flex;justify-content:space-between"><span class="ts-body" style="color:var(--fg)">${n}</span><span class="ts-status${w ? ' ts-status--warn' : ''}">${w ? 'degraded' : 'operational'}</span></div><div class="ts-uptime">${Array.from({ length: 45 }, (_, i) => `<i class="${String(i) === w ? 'w' : i === 12 && n === 'Evals' ? 'd' : ''}"></i>`).join('')}</div></div>`).join('')}</div></section>` },

  { id: 'datatable', group: 'Product UI', name: 'Data table', tag: 'X', trend: 'Dense tables', gesture: 'scroll-x on phone', fx: 'none',
    decision: 'Rows of decisions with typed outputs and confidence. Numbers in Fragment Mono, status as square dots, pager in tiles.',
    html: `<section class="m"><div class="ts-wrap" style="display:grid;gap:16px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h1 class="ts-h2">decisions</h1><input class="ts-input" placeholder="Filter…" style="width:220px"></div><div class="ts-table-scroll"><table class="ts-table"><thead><tr><th>ID</th><th>Question</th><th>Answer</th><th>Conf.</th><th>Status</th></tr></thead><tbody>${[['dc_81f2', 'Refundable?', 'true', '0.97', ''], ['dc_81f3', 'Route to', 'billing', '0.88', ''], ['dc_81f4', 'Toxic?', 'false', '0.62', 'warn'], ['dc_81f5', 'Priority', 'P2', '0.91', '']].map(([a, b, c, d, s]) => `<tr><td><code>${a}</code></td><td>${b}</td><td><code>${c}</code></td><td><code>${d}</code></td><td><span class="ts-status${s ? ' ts-status--warn' : ''}">${s ? 'review' : 'auto'}</span></td></tr>`).join('')}</tbody></table></div><div class="ts-pager"><a class="ts-tile" href="#">←</a><a class="ts-tile" aria-current="page" href="#">1</a><a class="ts-tile" href="#">2</a><a class="ts-tile" href="#">→</a></div></div></section>` },

  /* ============================== MOTION MOMENTS ============================== */
  { id: 'kinetic', group: 'Motion moments', name: 'Kinetic intro', tag: 'X', trend: 'Kinetic type', gesture: 'none', fx: 'slam · waterfall · marker',
    decision: 'For launch pages: lines slam on one beat (kinetic-beat-slam), a sentence whips in word by word (waterfall), and a marker sweeps the key phrase.',
    html: `<section class="m" data-scheme="signal" style="min-height:100%;display:grid;align-content:center;gap:40px" data-fx-scope><div data-fx="slam"><p class="ts-hero" style="margin:0">notice more.</p><p class="ts-hero" style="margin:0">decide faster.</p><p class="ts-hero" style="margin:0">act now.</p></div><p class="ts-lead" data-fx="waterfall" style="max-width:40ch;margin:0">Typed decisions for software that can’t afford to guess.</p><p class="ts-h3" style="margin:0">built for <span data-fx="marker">automation</span></p><button class="ts-tile" data-fx-run style="justify-self:start">Replay ▶</button></section>` },

  { id: 'decode-glitch', group: 'Motion moments', name: 'Decode + glitch titles', tag: 'X', trend: 'Glitch / decode', gesture: 'hover', fx: 'decode · glitch · scramble',
    decision: 'Text effects that read as computation. Decode flips characters in like a flap board; glitch splits RGB and snaps sharp. Hover any line to replay it.',
    html: `<section class="m" data-scheme="night" style="min-height:100%;display:grid;align-content:center;gap:30px" data-fx-scope><p class="ts-hero" data-fx="decode" style="margin:0;font-size:clamp(40px,9vw,150px)">conf 0.93</p><p class="ts-hero" data-fx="glitch" style="margin:0;font-size:clamp(40px,9vw,150px)">no type errors</p><p class="ts-pixel-xl" data-scramble style="margin:0">RLCD 0.93</p><button class="ts-tile" data-fx-run style="justify-self:start">Replay ▶</button></section>` },

  { id: 'figures', group: 'Motion moments', name: 'Hairline figure wall', tag: 'X', trend: 'Interactive line art', gesture: 'pointer', fx: 'Hairline',
    decision: 'Six Hairline figures in windows, themed from the scheme (plate = panel, lines = text colour). Each one shows its own readout in the title bar.',
    css: `.fw{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.fw .ts-window{width:100%}@media(max-width:809px){.fw{grid-template-columns:1fr}}`,
    html: `<section class="m ts-dots" data-scheme="pink"><div class="fw">${['terminal', 'router', 'stack', 'branches', 'keyboard', 'cabinet'].map((f) => WIN(`${f[0].toUpperCase() + f.slice(1)}.fig 0.5 <span data-hairline-read></span>`, FIG(f), '', 'padding:0')).join('')}</div></section>` },
  ];
})();
