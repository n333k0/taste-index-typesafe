const { chromium } = require('/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const vw of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: vw, height: 900 } });
  await p.goto('https://typesafe.ai/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const desc = (e) => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return `${e.tagName}.${(e.className+'').slice(0,40)} [${Math.round(r.left)},${Math.round(r.top+scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}] bg=${c.backgroundColor} bd=${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor} pad=${c.padding} gap=${c.gap} disp=${c.display} ${c.flexDirection} bgi=${c.backgroundImage.slice(0,60)}`; };
    const find = (t) => [...document.querySelectorAll('p,span')].find(e => e.textContent.trim() === t);
    const out = {};
    for (const t of ['Glider 1.1', 'Oct 9, 2026 • TypeSafe News', 'Clock Tool 1.1']) { const e = find(t); if (!e) continue; const chain = []; let x = e; for (let i = 0; i < 7 && x; i++) { chain.push(desc(x)); x = x.parentElement; } out[t] = chain; }
    // window siblings of Glider title
    const g = find('Glider 1.1'); if (g) { let w = g; for (let i=0;i<4;i++) w = w.parentElement; out.gliderTree = [...w.querySelectorAll('*')].slice(0, 14).map(desc); }
    // corner marks: small elements ~ 6-12px
    out.corners = [...document.querySelectorAll('div,svg')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 4 && r.width <= 14 && r.height > 4 && r.height <= 14; }).slice(0, 6).map(e => desc(e) + ' ' + e.outerHTML.slice(0, 200));
    // section containers full width
    out.sections = [...document.querySelectorAll('section, [data-framer-name]')].filter(e => e.getBoundingClientRect().height > 300).slice(0, 25).map(e => (e.getAttribute('data-framer-name') || '') + ' ' + desc(e));
    out.dotSvg = [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).find(s => s.startsWith('url("data:image/svg')) ?.slice(0, 900);
    out.h1 = [...document.querySelectorAll('h1')].slice(0,1).map(e => desc(e.closest('[data-framer-component-type]') || e) + ' align=' + getComputedStyle(e).textAlign);
    out.underline = (() => { const e = [...document.querySelectorAll('a')].find(a => /Create Account/.test(a.textContent)); return e ? [...e.querySelectorAll('*')].map(desc).slice(0, 6) : null; })();
    return out;
  });
  console.log('=====', vw, JSON.stringify(r, null, 1));
  await p.close(); }
  await b.close();
})();
