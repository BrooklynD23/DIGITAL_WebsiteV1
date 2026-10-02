import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const b = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
for (const w of [1440, 834, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:3100/design-lab/b', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const out = [];
  for (const id of ['work', 'process', 'join', 'dg-001', 'sub-operating-system']) {
    await p.evaluate((i) => { location.hash = ''; location.hash = i; }, id);
    await p.waitForTimeout(1500);
    out.push(await p.evaluate((i) => {
      const el = document.getElementById(i);
      const h = el.querySelector('h2,h3,th') || el;
      return `${i}: heading top ${Math.round(h.getBoundingClientRect().top)} (nav 56)`;
    }, id));
  }
  console.log(w, out.join(' | '));
  await p.close();
}
await b.close();
