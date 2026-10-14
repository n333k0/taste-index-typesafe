const { chromium } = require('/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [vw, url] of [[390, 'https://typesafe.ai/'], [390, 'https://typesafe.ai/blog/introducing-system-one-models-and-jev'], [810, 'https://typesafe.ai/'], [1100, 'https://typesafe.ai/']]) {
    const p = await b.newPage({ viewport: { width: vw, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => { const m = {}; for (const e of document.querySelectorAll('h1,h2,h3,h4,h5,p.framer-text,a')) { const c = getComputedStyle(e); if (!e.textContent.trim() || e.getBoundingClientRect().width === 0) continue; const k = c.fontFamily.split(',')[0] + ' ' + c.fontSize + '/' + c.lineHeight + ' ' + c.fontWeight; if (!m[k]) m[k] = e.tagName + ' «' + e.textContent.trim().slice(0, 30) + '»'; } return m; });
    console.log('==', vw, url.slice(19)); for (const [k, v] of Object.entries(r).sort((a, b) => parseFloat(b[0].split(' ').at(-2)) - parseFloat(a[0].split(' ').at(-2)))) if (!/sans-serif|monospace/.test(k)) console.log('  ', k, v);
    await p.close();
  }
  await b.close();
})();
