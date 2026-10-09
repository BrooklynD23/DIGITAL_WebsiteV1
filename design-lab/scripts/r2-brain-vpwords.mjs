import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [route, w, h, ...idx] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('http://localhost:3100' + route, { waitUntil: 'networkidle' });
await p.evaluate(() => document.documentElement.setAttribute('data-r2-static', ''));
await p.waitForTimeout(1500);
for (const i of idx) {
  await p.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), +i * +h);
  await p.waitForTimeout(300);
  const t = await p.evaluate(() => {
    const vh = innerHeight; const out = [];
    const wk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = wk.nextNode(); n; n = wk.nextNode()) {
      const tx = n.textContent.trim(); if (!tx) continue;
      const el = n.parentElement; const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      if (el.closest('[aria-hidden="true"], script, style, noscript, .sr-only, [data-chrome]')) continue;
      const r = document.createRange(); r.selectNodeContents(n); const rc = r.getBoundingClientRect();
      if (rc.bottom < 0 || rc.top > vh || rc.width === 0) continue;
      out.push(tx);
    }
    return out.join(' | ');
  });
  console.log(`--- vp ${i}: ${t}`);
}
await b.close();
