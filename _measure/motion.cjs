const { chromium } = require('/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
const OUT = process.argv[2];
const st = (p, loc) => loc.evaluate(e => { const c = getComputedStyle(e); return { bg: c.backgroundColor, color: c.color, op: c.opacity, tf: c.transform, td: c.textDecorationLine, tr: c.transition.slice(0, 160), pad: c.padding, h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }; });
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  // record appear: sample h1 + nav at intervals right after load start
  await p.goto('https://typesafe.ai/', { waitUntil: 'commit' });
  const samples = [];
  for (const t of [300, 600, 900, 1300, 1800, 2600, 3500]) { await p.waitForTimeout(t - (samples.at(-1)?.t || 0)); try { samples.push({ t, v: await p.evaluate(() => [...document.querySelectorAll('h1, nav a, [data-framer-appear-id]')].slice(0, 6).map(e => { const c = getComputedStyle(e); return (e.tagName + ' op' + c.opacity + ' ' + c.transform + ' ' + (e.style.transform || '')).slice(0, 90); })) }); } catch (e) { samples.push({ t, v: e.message }); } }
  console.log('APPEAR', JSON.stringify(samples, null, 0).slice(0, 2500));
  await p.waitForLoadState('networkidle');
  try { await p.getByRole('button', { name: 'Reject' }).click({ timeout: 3000 }); } catch {}
  console.log('appear-attrs', await p.evaluate(() => document.querySelectorAll('[data-framer-appear-id]').length), 'will-change', await p.evaluate(() => [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).willChange !== 'auto').length));
  // hover nav tiles
  for (const name of ['Enterprise', 'Thoughts', 'Docs', 'API Console', 'Contact Us']) {
    const loc = p.getByRole('link', { name, exact: true }).first();
    try { const before = await st(p, loc); await loc.hover(); await p.waitForTimeout(700); const after = await st(p, loc);
      const inner = await loc.evaluate(e => [...e.querySelectorAll('*')].map(x => { const c = getComputedStyle(x); return x.tagName + ':' + c.color + '/' + c.backgroundColor; }).join(' ').slice(0, 200));
      console.log('HOVER', name, JSON.stringify(before), '=>', JSON.stringify(after), inner);
      await p.mouse.move(5, 600); await p.waitForTimeout(600);
    } catch (e) { console.log('HOVER fail', name, e.message.slice(0, 80)); }
  }
  await p.getByRole('button', { name: /Company/ }).first().click().catch(() => {}); await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/slices/dropdown.png`, clip: { x: 400, y: 0, width: 700, height: 400 } });
  // underline links (Create Account)
  for (const name of ['Create Account', 'Join Discord']) { const loc = p.getByRole('link', { name }).first(); try { await loc.scrollIntoViewIfNeeded(); const a = await loc.evaluate(e => { const x = e.querySelector('h2,p') || e; const c = getComputedStyle(x); return c.textDecoration + ' off ' + c.textUnderlineOffset + ' th ' + c.textDecorationThickness + ' col ' + c.color; }); await loc.hover(); await p.waitForTimeout(700); const bb = await loc.evaluate(e => { const x = e.querySelector('h2,p') || e; const c = getComputedStyle(x); return c.textDecoration + ' off ' + c.textUnderlineOffset + ' col ' + c.color; }); console.log('LINK', name, a, '=>', bb); } catch (e) { console.log('LINK fail', name); } }
  // hover rules from stylesheet for link presets
  console.log('LINKPRESETS', await p.evaluate(() => { const out = []; for (const s of document.styleSheets) { try { for (const r of s.cssRules) { if (r.cssText && /framer-link-(hover-)?text-(color|background|decoration)/.test(r.cssText) && out.length < 25) out.push(r.cssText.replace(/\s+/g, ' ').slice(0, 420)); } } catch {} } return out.join('\n'); }));
  // blog list hover
  await p.goto('https://typesafe.ai/blog', { waitUntil: 'networkidle' });
  const card = p.getByText('The Bitterest Lesson').first();
  const cb = await card.evaluate(e => getComputedStyle(e).color); await card.hover(); await p.waitForTimeout(700); console.log('BLOGHOVER', cb, '=>', await card.evaluate(e => getComputedStyle(e).color));
  // mobile menu
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto('https://typesafe.ai/', { waitUntil: 'networkidle' }); await m.waitForTimeout(1000);
  try { await m.getByRole('button', { name: 'Reject' }).click({ timeout: 3000 }); } catch {}
  const menu = m.getByText('Menu', { exact: true }).first();
  await menu.tap().catch(async () => menu.click());
  for (const t of [80, 200, 400, 900]) { await m.waitForTimeout(t === 80 ? 80 : t - 80); await m.screenshot({ path: `${OUT}/slices/m-menu-${t}.png` }); }
  await b.close();
})();
