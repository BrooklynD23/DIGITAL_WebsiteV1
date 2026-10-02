// W2-CRIT-SYSTEM: container alignment + chrome census across the 8 r2 routes at 1440 and 390.
// Left edge of: nav mark, local-nav title, h1, every h2 (distinct values), footer thesis. Plus h1/h2 sizes and fonts.
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = process.env.LAB_URL ?? 'http://localhost:3199';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse().map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const out = [];
for (const w of ['signal', 'apple']) for (const p of ['', 'sidekick/', 'shades/', 'brain/']) for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(`${BASE}/design-lab/r2/${w}/${p}`, { waitUntil: 'networkidle', timeout: 120000 });
  await page.evaluate(() => document.documentElement.setAttribute('data-r2-static', ''));
  const r = await page.evaluate(() => {
    const L = (el) => (el ? Math.round(el.getBoundingClientRect().left) : null);
    const f = (el) => (el ? `${getComputedStyle(el).fontFamily.split(',')[0].replace(/__|_[0-9a-f]{6}/g, '')} ${getComputedStyle(el).fontSize}/${getComputedStyle(el).fontWeight}` : null);
    const h2s = [...document.querySelectorAll('main h2')].filter((h) => h.checkVisibility());
    const local = document.querySelector('[data-chrome="local-nav"],[data-chrome="localnav"],[data-chrome="local"]');
    const sticky = [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).position === 'sticky').length;
    const tabStops = [...document.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])')].filter((e) => e.checkVisibility() && !e.closest('body > nav, body > footer')).length;
    const smallTargets = [...document.querySelectorAll('main a[href], main button, main input')].filter((e) => e.checkVisibility()).map((e) => e.getBoundingClientRect()).filter((b) => b.width > 0 && (b.height < 24 || b.width < 24)).length;
    return {
      navMark: L(document.querySelector('[data-chrome="nav"] a:not([class*=skip])')), localTitle: L(local?.querySelector('a')),
      h1: L(document.querySelector('main h1')), h1font: f(document.querySelector('main h1')),
      h2Lefts: [...new Set(h2s.map(L))].sort((a, b) => a - b), h2fonts: [...new Set(h2s.map(f))],
      footer: L(document.querySelector('[data-chrome="footer"] p')),
      stickyInMain: sticky, tabStops, smallTargets,
    };
  });
  out.push({ route: `${w}/${p || 'home'}`, vp: vp.width, ...r });
  console.log(`${w}/${p || 'home'} ${vp.width}`, JSON.stringify(r));
  await page.close();
}
await browser.close();
writeFileSync('design-lab/renders/r2/crit/system/align.json', JSON.stringify(out, null, 1));
