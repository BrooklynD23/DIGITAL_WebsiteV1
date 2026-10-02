// CRIT-2: measure hero fold positions + HUD size on /design-lab/c (Still mode).
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/home/danny/.cache/ms-playwright/chromium_headless_shell-1246/chrome-headless-shell-linux64/chrome-headless-shell' });
for (const vp of [{width:1440,height:900},{width:1280,height:800},{width:390,height:844}]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto('http://localhost:3100/design-lab/c?fx=off', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const rect = (el) => el ? Math.round(el.getBoundingClientRect().top) + '-' + Math.round(el.getBoundingClientRect().bottom) : 'none';
    const readout = [...document.querySelectorAll('[aria-live]')].find(e => /layer/i.test(e.textContent));
    const legend = q('[aria-label="Subsystem layers"]');
    const h1 = q('h1'); const cta = [...document.querySelectorAll('a')].find(a => /See the builds/.test(a.textContent));
    const hud = [...document.querySelectorAll('span')].find(s => s.className.includes('hudWord'));
    return { pageH: document.documentElement.scrollHeight, h1: rect(h1), h1size: getComputedStyle(h1).fontSize, legend: rect(legend), readout: rect(readout), cta: rect(cta), hudFont: hud && getComputedStyle(hud).fontSize };
  });
  console.log(vp.width + 'x' + vp.height, JSON.stringify(r));
  await p.close();
}
await b.close();
