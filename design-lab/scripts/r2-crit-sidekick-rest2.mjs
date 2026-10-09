import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os'; import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { const w = window; w.__raf = { on: false, n: 0, src:{} }; const o = w.requestAnimationFrame.bind(w);
  w.requestAnimationFrame = (cb) => { const st = new Error().stack || ''; const c = /CursorProvider/.test(st); const k = st.split('\n').slice(2,3).join('').trim().slice(0,90); return o((t) => { if (w.__raf.on && !c) { w.__raf.n++; w.__raf.src[k]=(w.__raf.src[k]||0)+1;} cb(t); }); }; });
const p = await ctx.newPage();
await p.goto('http://localhost:3100/design-lab/r2/apple/sidekick/', { waitUntil: 'networkidle', timeout: 90000 });
const g = await p.evaluate(() => { const r = document.querySelector('#teardown > div').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
for (const f of [0.25, 0.75, 0.4]) {
  for (let k=0;k<10;k++){ await p.mouse.wheel(0, 0); }
  await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.round(g.top + (g.h - 900) * f));
  for (const settle of [1500, 3000, 6000]) {
    await sleep(settle === 1500 ? 1500 : settle - (settle === 3000 ? 1500 : 3000));
    await p.evaluate(() => { __raf.n = 0; __raf.src = {}; __raf.on = true; });
    await sleep(1000);
    const r = await p.evaluate(() => { __raf.on = false; const v = document.querySelector('[data-cine="sidekick-explode"] video'); return { n: __raf.n, seeking: v?.seeking, rs: v?.readyState, src: __raf.src }; });
    console.log(f, 'after', settle, 'ms:', JSON.stringify(r));
  }
}
await b.close();
