// Close-up element shots of the specimen (DPR 2) for glyph/verb review. Usage: node design-lab/scripts/r2-sys-zoom.mjs <outDir>
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs'; import { homedir } from 'node:os'; import { join } from 'node:path';
const out = process.argv[2] ?? 'design-lab/round2/system/renders';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const b = await chromium.launch({ executablePath: join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell') });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3100/design-lab/r2/system/', { waitUntil: 'networkidle', timeout: 120000 });
await p.evaluate(() => document.documentElement.setAttribute('data-r2-static', ''));
await p.waitForTimeout(1200);
const grids = p.locator('ul[class*=verbGrid]');
await grids.nth(1).screenshot({ path: `${out}/zoom-verbs-agentic.png` });
const mats = p.locator('div[class*=matrix][role=list]');
await mats.nth(0).screenshot({ path: `${out}/zoom-glyphs-build.png` });
await mats.nth(1).screenshot({ path: `${out}/zoom-glyphs-agentic.png` });
// mid-animation frame: hover a row and capture after 700 ms
await mats.nth(0).locator('[data-glyph-host]').nth(7).hover();
await p.waitForTimeout(700);
await mats.nth(0).locator('[data-glyph-host]').nth(7).screenshot({ path: `${out}/zoom-glyph-orbit-hover.png` });
await p.locator('[class*=revealRow]').scrollIntoViewIfNeeded();
await p.waitForTimeout(300);
await p.locator('[class*=revealRow]').screenshot({ path: `${out}/zoom-reveal.png` });
await b.close();
console.log('ok');
