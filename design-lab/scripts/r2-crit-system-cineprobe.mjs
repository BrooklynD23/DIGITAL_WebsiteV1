// W2-CRIT-SYSTEM: why does the Apple home highlights clip (home-stages, mode once) stay idle at 1440? Probe its intersection ratio.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = process.env.LAB_URL ?? 'http://localhost:3199';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(`${BASE}/design-lab/r2/apple/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const res = await page.evaluate(async () => {
    const el = document.querySelector('[data-cine="home-stages"]');
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 1500));
    const ratio = await new Promise((r) => { const io = new IntersectionObserver(([e]) => { r(e.intersectionRatio); io.disconnect(); }, { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }); io.observe(el); });
    await new Promise((r) => setTimeout(r, 5000));
    const v = el.querySelector('video'); const rect = el.getBoundingClientRect();
    const anc = []; let p = el.parentElement; while (p && anc.length < 8) { const cs = getComputedStyle(p); anc.push(`${p.tagName}.${String(p.className).slice(0, 24)} ov=${cs.overflow} op=${cs.opacity} tf=${cs.transform.slice(0, 30)}`); p = p.parentElement; }
    return { ratio, rect: [rect.x, rect.y, rect.width, rect.height].map(Math.round), status: el.dataset.status, t: v?.currentTime, paused: v?.paused, anc };
  });
  console.log(vp.width, JSON.stringify(res, null, 1));
  await page.close();
}
await browser.close();
