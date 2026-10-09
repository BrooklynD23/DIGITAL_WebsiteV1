// W3 finish-fix checks for shared chrome: LocalNav tone follows the chapter under it (apple pages),
// WorldNav targets ≥44×44 at 390 (both worlds), html background = world ground.
// Usage: node design-lab/scripts/r2-sys-chrome.mjs
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const b = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
let fail = 0;
const ok = (c, msg) => { if (!c) fail++; console.log(`${c ? 'PASS' : 'FAIL'} ${msg}`); };

const desk = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const r of ['apple/', 'apple/sidekick/', 'apple/shades/', 'apple/brain/']) {
  await desk.goto(`${base}/design-lab/r2/${r}`, { waitUntil: 'networkidle', timeout: 120000 });
  const seen = new Set();
  const h = await desk.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) {
    await desk.evaluate((yy) => window.scrollTo(0, yy), y);
    await desk.waitForTimeout(120);
    const st = await desk.evaluate(() => {
      const bar = document.querySelector('[data-chrome="local-nav"]');
      if (!bar) return null;
      const r = bar.getBoundingClientRect();
      const under = document.elementFromPoint(r.width / 2, r.bottom + 2);
      const want = under?.closest('[data-tone]')?.getAttribute('data-tone') === 'dark' ? 'dark' : 'light';
      return { tone: bar.getAttribute('data-tone') === 'dark' ? 'dark' : 'light', want };
    });
    if (st) seen.add(`${st.tone}${st.tone === st.want ? '' : '≠' + st.want}`);
  }
  const mism = [...seen].filter((x) => x.includes('≠'));
  ok(mism.length <= 1, `${r} LocalNav tone states seen: ${[...seen].join(', ')} (≤1 transient mismatch allowed)`);
}
const bg = await desk.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
ok(bg === 'rgb(245, 245, 247)', `apple html background ${bg}`);
await desk.goto(`${base}/design-lab/r2/signal/`, { waitUntil: 'networkidle' });
const bg2 = await desk.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
ok(bg2 === 'rgb(11, 12, 10)', `signal html background ${bg2}`);

const mob = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
for (const w of ['signal', 'apple']) {
  await mob.goto(`${base}/design-lab/r2/${w}/`, { waitUntil: 'networkidle', timeout: 120000 });
  const small = await mob.evaluate(() =>
    Array.from(document.querySelectorAll('[data-chrome="nav"] a, [data-chrome="local-nav"] a, [data-chrome="local-nav"] summary'))
      .filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.right > 0 && r.left < window.innerWidth; })
      .map((a) => ({ t: (a.textContent || '').trim().slice(0, 14) || a.getAttribute('aria-label'), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height) }))
      .filter((x) => x.w < 44 || x.h < 44),
  );
  const overflow = await mob.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  ok(small.length === 0 && !overflow, `${w} 390 nav targets ≥44×44 ${small.length ? JSON.stringify(small) : ''} · overflow ${overflow}`);
}
await b.close();
console.log(fail ? `${fail} checks failed` : 'ALL CHROME CHECKS PASS');
process.exit(fail ? 1 : 0);
