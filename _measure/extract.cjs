// Usage: node extract.cjs <outdir> [url ...]   (no urls = the typesafe.ai pages this index was built from)
// Needs playwright-core: set PLAYWRIGHT_CORE to its path, or have it resolvable. Uses the installed Google Chrome.
const { chromium } = require(process.env.PLAYWRIGHT_CORE || '/Users/mymac/Developer/comp/comp/node_modules/playwright-core');
const fs = require('fs');
const OUT = process.argv[2];
const DEFAULT = { blog_post: 'https://typesafe.ai/blog/introducing-system-one-models-and-jev', home: 'https://typesafe.ai/', enterprise: 'https://typesafe.ai/enterprise', blog: 'https://typesafe.ai/blog', contact: 'https://typesafe.ai/contact', legal: 'https://typesafe.ai/legal/terms' };
const urls = process.argv.slice(3);
const pages = urls.length ? Object.fromEntries(urls.map((u) => [new URL(u).pathname.replace(/\W+/g, '_').replace(/^_|_$/g, '') || 'home', u])) : DEFAULT;
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  for (const [name, url] of Object.entries(pages)) {
    for (const vp of [{ w: 1440, h: 900, tag: 'd' }, { w: 390, h: 844, tag: 'm' }]) {
      const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1 });
      try { await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { console.log(name, 'goto', e.message); }
      await p.waitForTimeout(1500);
      // scroll through to trigger lazy content
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${OUT}/${name}-${vp.tag}.png`, fullPage: true });
      await p.screenshot({ path: `${OUT}/${name}-${vp.tag}-fold.png` });
      if (vp.tag === 'm') { await p.close(); continue; }
      const data = await p.evaluate(() => {
        const sheets = { vars: {}, fontFaces: [], keyframes: {}, mediaQueries: new Set(), transitions: new Set(), errors: [] , hoverRules: []};
        const walk = (rules) => { for (const r of rules) {
          if (r.type === 1) { // style
            for (let i = 0; i < r.style.length; i++) { const pr = r.style[i]; if (pr.startsWith('--')) { (sheets.vars[r.selectorText] ||= {})[pr] = r.style.getPropertyValue(pr).trim(); } }
            if (/:hover|:focus/.test(r.selectorText) && sheets.hoverRules.length < 200) sheets.hoverRules.push(r.cssText.slice(0, 300));
          } else if (r.type === 5) { sheets.fontFaces.push(r.cssText.slice(0, 400)); }
          else if (r.type === 7) { sheets.keyframes[r.name] = r.cssText.slice(0, 600); }
          else if (r.type === 4) { sheets.mediaQueries.add(r.conditionText || r.media.mediaText); walk(r.cssRules); }
          else if (r.cssRules) walk(r.cssRules);
        } };
        for (const s of document.styleSheets) { try { walk(s.cssRules); } catch (e) { sheets.errors.push(s.href); } }
        sheets.mediaQueries = [...sheets.mediaQueries];
        const sel = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.classList.length) s += '.' + [...el.classList].slice(0, 4).join('.'); return s; };
        const agg = {}; const add = (k, v, ex) => { const m = (agg[k] ||= {}); const e = (m[v] ||= { n: 0, ex: [] }); e.n++; if (e.ex.length < 4 && ex) e.ex.push(ex); };
        const text = {};
        const els = [...document.querySelectorAll('body *')];
        for (const el of els) {
          const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
          const s = sel(el);
          const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
          if (own) { add('color', cs.color, s + ' «' + own.slice(0, 40) + '»');
            const k = [cs.fontFamily.split(',')[0], cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing, cs.textTransform, cs.fontStyle].join(' | ');
            const e = (text[k] ||= { n: 0, ex: [], colors: new Set() }); e.n++; e.colors.add(cs.color); if (e.ex.length < 5) e.ex.push(s + ' «' + own.slice(0, 50) + '»'); }
          if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') add('bg', cs.backgroundColor, s + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
          if (cs.backgroundImage !== 'none') add('bgImage', cs.backgroundImage.slice(0, 200), s);
          for (const side of ['Top', 'Right', 'Bottom', 'Left']) { if (parseFloat(cs['border' + side + 'Width']) > 0 && cs['border' + side + 'Style'] !== 'none') add('border', cs['border' + side + 'Width'] + ' ' + cs['border' + side + 'Style'] + ' ' + cs['border' + side + 'Color'], s + ' ' + side); }
          if (cs.borderRadius !== '0px') add('radius', cs.borderRadius, s);
          if (cs.boxShadow !== 'none') add('shadow', cs.boxShadow, s);
          if (cs.transitionDuration !== '0s') add('transition', cs.transitionProperty + ' / ' + cs.transitionDuration + ' / ' + cs.transitionTimingFunction + ' / ' + cs.transitionDelay, s);
          if (cs.animationName !== 'none') add('animation', cs.animationName + ' / ' + cs.animationDuration + ' / ' + cs.animationTimingFunction + ' / ' + cs.animationIterationCount, s);
          if (cs.backdropFilter && cs.backdropFilter !== 'none') add('backdrop', cs.backdropFilter, s);
          if (cs.filter !== 'none') add('filter', cs.filter, s);
          if (cs.opacity !== '1') add('opacity', cs.opacity, s);
          if (['A', 'BUTTON'].includes(el.tagName)) add('interactive', [el.tagName, cs.color, cs.backgroundColor, cs.fontFamily.split(',')[0], cs.fontSize, cs.fontWeight, cs.textDecorationLine, cs.textUnderlineOffset, cs.padding, cs.borderRadius, cs.height].join(' | '), s + ' «' + el.textContent.trim().slice(0, 30) + '»');
          if (cs.display.includes('grid')) add('grid', cs.gridTemplateColumns + ' / gap ' + cs.gap, s + ` w${Math.round(r.width)}`);
          if (cs.maxWidth !== 'none') add('maxWidth', cs.maxWidth, s + ` w${Math.round(r.width)} x${Math.round(r.left)}`);
          if (cs.cursor === 'pointer' && !['A','BUTTON'].includes(el.tagName)) add('pointerOther', el.tagName, s);
          if (['IMG','SVG','VIDEO','CANVAS','svg','IFRAME'].includes(el.tagName)) add('media', el.tagName + ' ' + Math.round(r.width) + 'x' + Math.round(r.height), s + ' ' + (el.getAttribute('src') || el.getAttribute('alt') || '').slice(0, 80));
        }
        for (const k in text) text[k].colors = [...text[k].colors];
        const bodyCs = getComputedStyle(document.body), htmlCs = getComputedStyle(document.documentElement);
        return { title: document.title, h: document.documentElement.scrollHeight, body: { bg: bodyCs.backgroundColor, htmlBg: htmlCs.backgroundColor, color: bodyCs.color, font: bodyCs.fontFamily, size: bodyCs.fontSize, lh: bodyCs.lineHeight, smoothing: bodyCs.webkitFontSmoothing, selection: '' }, sheets, agg, text, fonts: [...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.style + ' ' + f.status) };
      });
      fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1));
      console.log(name, 'ok', data.h);
      await p.close();
    }
  }
  await b.close();
})();
