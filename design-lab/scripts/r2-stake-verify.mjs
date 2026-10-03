// Usage: node design-lab/scripts/r2-stake-verify.mjs <outDir>
// Wraps compare.html in a document skeleton (as the Artifact publisher does), then checks it at 1440 and 390,
// light and dark: horizontal overflow, keyboard tabs, every image decoded, compare slider keys. Saves screenshots.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const out = process.argv[2] ?? 'design-lab/round2/stakeholder/verify';
mkdirSync(out, { recursive: true });
const body = readFileSync('design-lab/round2/stakeholder/compare.html', 'utf8');
const wrapped = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${body}</body></html>`;
const file = resolve(out, 'wrapped.html');
writeFileSync(file, wrapped);

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
  const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  return existsSync(p) ? p : undefined;
}
const browser = await chromium.launch({ executablePath: shell() });
const results = [];
for (const scheme of ['light', 'dark']) {
  for (const vp of [{ w: 1440, h: 900 }, { w: 390, h: 844 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('file://' + file + '#home');
    await page.waitForTimeout(800);
    const tag = `${scheme}-${vp.w}`;
    for (const id of ['home', 'sidekick', 'shades', 'brain', 'round1']) {
      await page.evaluate((i) => { location.hash = i; }, id);
      await page.waitForTimeout(300);
      // force-load lazy images in this panel
      const imgs = await page.evaluate(async (i) => {
        const p = document.getElementById(i);
        const list = [...p.querySelectorAll('img')];
        list.forEach((im) => { im.loading = 'eager'; });
        await Promise.all(list.map((im) => im.decode().catch(() => null)));
        return { total: list.length, broken: list.filter((im) => !im.complete || im.naturalWidth === 0).map((im) => `${im.className || im.alt.slice(0, 40)}:${im.src.slice(0, 30)}`).join(',') || 0, hidden: p.hidden };
      }, id);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      results.push(`${tag} #${id}: imgs ${imgs.total} broken ${imgs.broken} panelHidden ${imgs.hidden} overflowX ${overflow}`);
      await page.screenshot({ path: join(out, `${tag}-${id}.png`), fullPage: id !== 'round1' ? false : false });
    }
    // full page of home panel (first screens)
    await page.evaluate(() => { location.hash = 'sidekick'; });
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(out, `${tag}-sidekick-full.png`), fullPage: true });
    // keyboard tabs
    await page.evaluate(() => { location.hash = 'home'; });
    await page.focus('#tab-home');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const kb = await page.evaluate(() => ({ active: document.activeElement?.id, sel: document.querySelector('[aria-selected="true"]')?.id, hash: location.hash, shadesVisible: !document.getElementById('shades').hidden, tabindex: [...document.querySelectorAll('[role=tab]')].map((t) => t.tabIndex).join('') }));
    results.push(`${tag} keyboard: ${JSON.stringify(kb)}`);
    if (vp.w === 1440) {
      await page.evaluate(() => { location.hash = 'sidekick'; });
      await page.click('#sidekick .compare-toggle');
      await page.focus('#sidekick .handle');
      for (let i = 0; i < 5; i += 1) await page.keyboard.press('ArrowLeft');
      const v = await page.getAttribute('#sidekick .handle', 'aria-valuenow');
      await page.click('#sidekick [data-world="apple"]');
      await page.locator('#cmp-sidekick').scrollIntoViewIfNeeded();
      await page.screenshot({ path: join(out, `${tag}-compare.png`) });
      results.push(`${tag} slider after 5x ArrowLeft: ${v}`);
    }
    results.push(`${tag} page errors: ${errs.length ? errs.join(' | ') : 0}`);
    await page.close();
  }
}
await browser.close();
console.log(results.join('\n'));
