const { chromium } = require('/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
const OUT = process.argv[2];
const pages = { home: 'https://typesafe.ai/', blog_post: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev', enterprise: 'https://typesafe.ai/enterprise', blog: 'https://typesafe.ai/blog', contact: 'https://typesafe.ai/contact', legal: 'https://typesafe.ai/legal/terms' };
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [name, url] of Object.entries(pages)) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(1200);
    try { await p.getByRole('button', { name: 'Reject' }).click({ timeout: 3000 }); } catch {}
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let i = 0; for (let y = 0; y < H; y += 900) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/slices/${name}-${String(i++).padStart(2,'0')}.png` }); }
    await p.close();
  }
  // mobile menu
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(pages.home, { waitUntil: 'networkidle' }); await m.waitForTimeout(1200);
  try { await m.getByRole('button', { name: 'Reject' }).click({ timeout: 3000 }); } catch {}
  await m.screenshot({ path: `${OUT}/slices/m-home-closed.png` });
  const info = await m.evaluate(() => [...document.querySelectorAll('header *, nav *, [class*=nav] *')].filter(e => { const r = e.getBoundingClientRect(); return r.top < 80 && r.width > 0 && r.width < 80 && r.height > 10; }).slice(0, 10).map(e => e.tagName + '.' + e.className + ' ' + JSON.stringify(e.getBoundingClientRect())));
  console.log(info.join('\n'));
  await b.close();
})();
