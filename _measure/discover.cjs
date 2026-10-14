const { chromium } = require('/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    title: document.title,
    h: document.documentElement.scrollHeight,
    links: [...new Set([...document.querySelectorAll('a')].map(a => a.href))],
    text: document.body.innerText.slice(0, 6000),
  }));
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
