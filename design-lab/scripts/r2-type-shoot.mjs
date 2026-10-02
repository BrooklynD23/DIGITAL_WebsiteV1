// Usage: node design-lab/scripts/r2-type-shoot.mjs [outDir]
// Shoots /design-lab/r2/type per panel (signal + apple for each stack, plus the reading block) at 1440 and 390.
// Reports console errors, horizontal overflow and every FontFace status so a silent fallback is caught.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'design-lab/round2/references/type';
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const route = '/design-lab/r2/type/';
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, dpr: 1 },
  { name: '390', width: 390, height: 844, dpr: 2, isMobile: true, hasTouch: true },
];

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: findHeadlessShell() });
let totalErrors = 0;
try {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
    // Scroll once so every face is requested, then wait for the font set to settle.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await document.fonts.ready;
    });
    // The root layout's sticky site nav would overlay element shots; hide it for capture only.
    await page.addStyleTag({ content: 'body > nav, nav.sticky { display: none !important; }' });
    await page.waitForTimeout(800);
    const report = await page.evaluate(() => {
      // Per family: loaded if any unicode-range slice loaded. Skip next/font metric fallbacks (local() faces)
      // and the root layout's site faces, which this route never renders.
      const trial = /geist|mona|hubot|krypton|googleSans|Roboto|Inter|JetBrains|Red_Hat|mozilla|atkinson|Lexend/i;
      const fam = new Map();
      for (const f of document.fonts) {
        const name = f.family.replace(/['"]/g, '');
        if (/_Fallback_/.test(name) || !trial.test(name)) continue;
        fam.set(name, fam.get(name) === 'loaded' ? 'loaded' : f.status);
      }
      const faces = [...fam].map(([k, v]) => `${k}:${v}`);
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      return { faces, overflow };
    });
    const notLoaded = report.faces.filter((f) => !f.endsWith(':loaded'));
    console.log(`[${vp.name}] overflow=${report.overflow}px  faces=${report.faces.length}  not-loaded=${notLoaded.length}${notLoaded.length ? ' ' + notLoaded.join(', ') : ''}`);

    const sections = await page.$$eval('section[id]', (els) => els.map((e) => e.id));
    for (const id of sections) {
      if (id === 'reading') {
        await page.locator('#reading').screenshot({ path: join(outDir, `reading-${vp.name}.png`) });
        continue;
      }
      for (const world of ['signal', 'apple']) {
        const loc = page.locator(`#${id} [data-world="${world}"]`);
        await loc.screenshot({ path: join(outDir, `${id}-${world}-${vp.name}.png`) });
      }
    }
    console.log(`[${vp.name}] shot ${sections.length} sections; console errors: ${errors.length}${errors.length ? ' ' + errors.slice(0, 3).join(' | ') : ''}`);
    totalErrors += errors.length;
    await page.close();
  }
} finally {
  await browser.close();
}
process.exitCode = totalErrors ? 1 : 0;
