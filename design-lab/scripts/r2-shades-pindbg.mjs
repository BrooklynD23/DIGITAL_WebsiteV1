// SHADES pin debug: boxes + caption opacity inside the Apple light-path pin at given scroll offsets.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3100/design-lab/r2/apple/shades/', { waitUntil: 'networkidle', timeout: 120000 });
await p.waitForTimeout(2500);
for (const y of [4000, 4300, 6000]) {
  await p.evaluate((t) => window.scrollTo(0, t), y);
  await p.waitForTimeout(600);
  console.log(y, JSON.stringify(await p.evaluate(() => {
    const st = document.querySelector('#light-path > div');
    const r = (el) => { const b = el?.getBoundingClientRect(); return b ? [Math.round(b.top), Math.round(b.height)] : null; };
    const cs = getComputedStyle(st);
    return {
      stage: r(st), k: cs.getPropertyValue('--k'), p: getComputedStyle(st.parentElement).getPropertyValue('--p'),
      head: r(st.children[0]), fig: r(st.children[1]), caps: r(st.children[2]),
      hit: (() => { const e = document.elementFromPoint(720, 130); return e ? e.tagName + "." + e.className.toString().slice(0,40) : null; })(), h2: (() => { const h = document.getElementById("ap-light"); const c = getComputedStyle(h); return [c.color, c.opacity, c.visibility, h.textContent]; })(), capOp: [...st.querySelectorAll('ol > li > span:last-child')].map((e) => getComputedStyle(e).opacity),
      mode: st.parentElement.dataset.pMode,
    };
  })));
}
await b.close();
