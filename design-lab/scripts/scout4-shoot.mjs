// SCOUT-4 fallback: standalone headless capture of an external URL (used when shared chrome-devtools MCP is down).
// Usage: node design-lab/scripts/scout4-shoot.mjs <url> <outDir>
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [url, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const browser = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const extract = () => {
  const cs = (el) => el && getComputedStyle(el);
  const pick = (sel) => { const s = cs(document.querySelector(sel)); return s && { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, color: s.color }; };
  const vars = [...document.styleSheets].flatMap((ss) => { try { return [...ss.cssRules]; } catch { return []; } })
    .filter((r) => r.selectorText === ':root').flatMap((r) => [...r.style].filter((p) => p.startsWith('--')).slice(0, 40).map((p) => `${p}: ${r.style.getPropertyValue(p).trim()}`));
  const heads = [...document.querySelectorAll('h1,h2,h3')].slice(0, 14).map((h) => h.tagName + ': ' + h.innerText.trim().replace(/\s+/g, ' ').slice(0, 90));
  const nav = [...document.querySelectorAll('nav a, header a')].slice(0, 14).map((a) => a.innerText.trim()).filter(Boolean);
  const g = { gsap: !!window.gsap, THREE: !!window.THREE, Lenis: !!window.Lenis, ScrollTrigger: !!window.ScrollTrigger, framer: !!document.querySelector('[data-framer-appear-id]'), nextjs: !!window.__NEXT_DATA__, webflow: !!window.Webflow };
  return { title: document.title, h1: pick('h1'), h2: pick('h2'), body: pick('p'), bodyBg: cs(document.body).backgroundColor, rootVars: vars.slice(0, 40), fonts: [...document.fonts].map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i).slice(0, 12), heads, nav, globals: g, height: document.body.scrollHeight };
};
const result = {};
for (const vp of [{ n: 'desktop', w: 1440, h: 900 }, { n: 'mobile', w: 390, h: 844, m: true }]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m, deviceScaleFactor: vp.m ? 2 : 1 });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: join(outDir, `${vp.n}.png`) });
    if (!vp.m) {
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (const [i, f] of [0.3, 0.6].entries()) {
        await page.evaluate((y) => window.scrollTo(0, y), H * f);
        await page.waitForTimeout(1200);
        await page.screenshot({ path: join(outDir, `scroll-${i + 1}.png`) });
      }
      result.tokens = await page.evaluate(extract);
    }
    result[vp.n] = 'ok';
  } catch (e) { result[vp.n] = 'ERR ' + e.message.slice(0, 120); }
  await page.close();
}
writeFileSync(join(outDir, 'tokens.json'), JSON.stringify(result, null, 1));
console.log(JSON.stringify(result, null, 1));
await browser.close();
