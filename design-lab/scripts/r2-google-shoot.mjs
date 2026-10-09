// Usage: node design-lab/scripts/r2-google-shoot.mjs <url> <slug>
// Captures 6 scroll positions at 1440x900 and 390x844 into design-lab/round2/references/google/<slug>/ and writes metrics.json.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [url, slug] = process.argv.slice(2);
const out = join('design-lab/round2/references/google', slug);
mkdirSync(out, { recursive: true });
function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  for (const d of readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
}
const VPS = [
  { name: 'desktop', width: 1440, height: 900, dpr: 1 },
  { name: 'mobile', width: 390, height: 844, dpr: 2, mobile: true },
];
const browser = await chromium.launch({ executablePath: shell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const metrics = { url, viewports: {} };
for (const vp of VPS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, locale: 'en-US', userAgent: vp.mobile ? undefined : undefined });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);
  await page.addStyleTag({ content: 'html,body{scroll-behavior:auto!important}' });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  // warm pass so lazy media/reveals load
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const y = Math.round(((H - vp.height) * i) / 5);
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: join(out, `${vp.name}-${i}.png`) });
    const m = await page.evaluate(() => {
      const vh = innerHeight, vw = innerWidth;
      const vis = (r) => r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && r.width > 0 && r.height > 0;
      let words = 0; const sizes = new Set(); let hs = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; 
      while ((n = w.nextNode())) {
        const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; if (!el || ['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) continue;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
        const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
        if (!vis(r)) continue;
        words += t.split(/\s+/).length; sizes.add(Math.round(parseFloat(cs.fontSize)));
        if (/^H[1-3]$/.test(el.tagName) || parseFloat(cs.fontSize) >= 28) hs.push(t.slice(0, 60) + ' @' + Math.round(parseFloat(cs.fontSize)) + 'px/' + cs.fontWeight);
      }
      const media = { video: 0, videoPlaying: 0, canvas: 0, img: 0, svg: 0 };
      document.querySelectorAll('video').forEach((v) => { if (vis(v.getBoundingClientRect())) { media.video++; if (!v.paused) media.videoPlaying++; } });
      document.querySelectorAll('canvas').forEach((v) => vis(v.getBoundingClientRect()) && media.canvas++);
      document.querySelectorAll('img,picture').forEach((v) => vis(v.getBoundingClientRect()) && media.img++);
      const ctas = [...document.querySelectorAll('a,button')].filter((e) => vis(e.getBoundingClientRect()) && /buy|order|shop|learn more|see |compare|get |pre-order|switch/i.test(e.textContent.trim()) && e.textContent.trim().length < 30).map((e) => { const r = e.getBoundingClientRect(); return e.textContent.trim().replace(/\s+/g,' ') + '@' + Math.round(r.left) + ',' + Math.round(r.top); }).slice(0, 6);
      return { words, sizes: [...sizes].sort((a, b) => b - a), headings: hs.slice(0, 6), media, ctas };
    });
    rows.push({ i, y, ...m });
  }
  // static analysis: sticky elements, scroll-timeline use, animation libs, sections
  const stat = await page.evaluate(() => {
    const css = [...document.styleSheets].map((s) => { try { return [...s.cssRules].map((r) => r.cssText).join('\n'); } catch { return ''; } }).join('\n');
    const html = document.documentElement.outerHTML;
    const sticky = [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).position === 'sticky').length;
    const sections = [...document.querySelectorAll('section, [role=region], main > div')].map((e) => Math.round(e.getBoundingClientRect().height)).filter((h) => h > 200).slice(0, 40);
    return {
      scrollDrivenCss: /animation-timeline|scroll-timeline|view-timeline/.test(css),
      viewTransition: /view-transition/.test(css),
      reducedMotionRules: (css.match(/prefers-reduced-motion/g) || []).length,
      springLinear: /linear\(/.test(css),
      sticky, sections, videos: document.querySelectorAll('video').length, canvases: document.querySelectorAll('canvas').length,
      lottie: /lottie/i.test(html), lenis: /lenis/i.test(html), gsap: /gsap|ScrollTrigger/i.test(html),
      customElements: [...new Set([...document.querySelectorAll('*')].map((e) => e.tagName.toLowerCase()).filter((t) => t.includes('-')))].slice(0, 25),
      scripts: [...document.scripts].map((s) => s.src).filter(Boolean).slice(0, 8),
      contentVisibility: /content-visibility/.test(css),
      fonts: [...new Set([...document.querySelectorAll('h1,h2,p,a')].map((e) => getComputedStyle(e).fontFamily.split(',')[0]))].slice(0, 5),
      title: document.title,
    };
  });
  metrics.viewports[vp.name] = { pageHeight: H, rows, stat };
  await ctx.close();
}
writeFileSync(join(out, 'metrics.json'), JSON.stringify(metrics, null, 2));
console.log('done', slug);
await browser.close();
