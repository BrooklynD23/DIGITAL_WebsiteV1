// W3a regression sweep: every r2 route loads at 1440 and 390 with 0 console errors (Vercel insights 404s are
// reported separately: they are a lab false positive), and the shared chrome is present.
// Usage: node design-lab/scripts/r2-sys-routes.mjs
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
const ROUTES = ['signal/', 'signal/sidekick/', 'signal/shades/', 'signal/brain/', 'apple/', 'apple/sidekick/', 'apple/shades/', 'apple/brain/', 'system/'].map(
  (r) => `/design-lab/r2/${r}`,
);
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
let fail = 0;
for (const vp of [
  { name: '1440', viewport: { width: 1440, height: 900 } },
  { name: '390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
]) {
  const ctx = await browser.newContext(vp);
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    const insights = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const t = m.text();
      (/_vercel|insights|speed-insights/i.test(t) ? insights : errors).push(t.slice(0, 220));
    });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 220)));
    page.on('requestfailed', (r) => {
      // media range requests are aborted by the browser by design (preload="metadata", page close): not errors
      const why = r.failure()?.errorText ?? '';
      if (/_vercel/.test(r.url()) || why === 'net::ERR_ABORTED') return;
      errors.push(`requestfailed ${why} ${r.url().slice(0, 120)}`);
    });
    page.on('response', (r) => {
      if (r.status() === 404 && /_vercel/.test(r.url())) insights.push(r.url());
    });
    let status = 0;
    try {
      const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
      status = res?.status() ?? 0;
      // scroll through so lazy / on-entry pieces mount
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += window.innerHeight * 0.8) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(800);
    } catch (e) {
      errors.push(String(e).slice(0, 200));
    }
    const chrome = await page.evaluate(() => ({
      nav: !!document.querySelector('[data-chrome="nav"]'),
      footer: !!document.querySelector('[data-chrome="footer"]'),
      localCtaH: (() => {
        const a = document.querySelector('[data-chrome="local-nav"] a[href*="join"]');
        return a ? Math.round(a.getBoundingClientRect().height) : null;
      })(),
    }));
    const ok = status === 200 && errors.length === 0;
    if (!ok) fail += 1;
    console.log(
      `${ok ? 'PASS' : 'FAIL'} ${vp.name} ${route.padEnd(30)} http ${status} · console errors ${errors.length} · insights 404 ${insights.length} · nav ${chrome.nav} footer ${chrome.footer}${chrome.localCtaH !== null ? ` · local CTA ${chrome.localCtaH}px` : ''}`,
    );
    for (const e of errors) console.log('      ', e);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(fail ? `${fail} route checks failed` : 'ALL ROUTES PASS');
process.exit(fail ? 1 : 0);
