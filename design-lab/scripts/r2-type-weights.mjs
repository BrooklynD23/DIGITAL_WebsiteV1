// Usage: node design-lab/scripts/r2-type-weights.mjs — measures a test string at wght 300/600/900 per trial family
// to prove the variable weight axis actually renders (catches static-instance files).
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find((p) => existsSync(p));
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage();
await p.goto('http://localhost:3100/design-lab/r2/type/', { waitUntil: 'networkidle' });
const vars = ['--t-geist', '--t-mona', '--t-hubot', '--t-gsflex', '--t-inter', '--t-roboto-flex', '--t-rh-display', '--t-rh-text', '--t-moz-head', '--t-moz-text', '--t-atkinson', '--t-lexend'];
const out = await p.evaluate(async (vars) => {
  const host = document.querySelector('#vercel') ?? document.body;
  const res = {};
  for (const v of vars) {
    const fam = getComputedStyle(host).getPropertyValue(v);
    const w = [];
    for (const wt of [300, 600, 900]) {
      const s = document.createElement('span');
      s.style.cssText = `font-family:${fam};font-weight:${wt};font-size:40px;position:absolute;white-space:nowrap`;
      s.textContent = 'Make something worth putting';
      host.appendChild(s);
      if (fam) await document.fonts.load(`${wt} 40px ${fam.split(',')[0]}`);
      w.push(Math.round(s.getBoundingClientRect().width));
      s.remove();
    }
    res[v] = w.join(' / ');
  }
  return res;
}, vars);
console.log(out); await b.close();
