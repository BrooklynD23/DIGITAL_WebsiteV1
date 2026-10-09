// W2-CRIT-BRAIN evidence: hero frames, 10 scroll steps (1440 + 390), webm of load → scroll → interactions,
// keyboard path, reduced motion, no-JS. Usage: node design-lab/scripts/r2-crit-brain-capture.mjs [signal|apple|both]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const which = process.argv[2] ?? 'both';
const worlds = which === 'both' ? ['signal', 'apple'] : [which];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const OUT = 'design-lab/renders/r2/crit/brain';
mkdirSync(OUT, { recursive: true });
const shell = (() => {
  const root = join(homedir(), '.cache', 'ms-playwright');
  return readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
    .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
})();
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const wait = (p, ms) => p.waitForTimeout(ms);
const report = {};

async function steps(page, world, tag) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  const max = H - vh;
  for (let i = 0; i < 10; i += 1) {
    const y = Math.round((max * i) / 9);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await wait(page, 900);
    await page.screenshot({ path: `${OUT}/${world}-${tag}-step${String(i).padStart(2, '0')}.png` });
  }
  return { scrollHeight: H, vh, vhUnits: +(H / vh).toFixed(2) };
}

async function glide(page, from, to, ms = 9000) {
  const n = Math.max(1, Math.round(ms / 40));
  for (let i = 1; i <= n; i += 1) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), from + ((to - from) * i) / n);
    await wait(page, 40);
  }
}

async function goTo(page, sel, offset = 0) {
  await page.evaluate(([s, o]) => { const el = document.querySelector(s); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + o, behavior: 'instant' }); }, [sel, offset]);
  await wait(page, 1600);
}

for (const world of worlds) {
  const route = `${base}/design-lab/r2/${world}/brain/`;
  const r = (report[world] = { errors: [] });

  // 1) desktop + video
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: `${OUT}/vid-tmp-${world}`, size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') r.errors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => r.errors.push(String(e).slice(0, 200)));
  await page.goto(route, { waitUntil: 'networkidle', timeout: 90000 });
  for (let i = 0; i <= 8; i += 1) { await page.screenshot({ path: `${OUT}/${world}-hero-t${i}.png` }); await wait(page, 1000); }
  r.heroTrace = await page.evaluate(() => [...document.querySelectorAll('ol[aria-label="Agent loop steps"] li')].map((li) => `${li.textContent}${li.dataset.on ? '*' : ''}`).join(' '));
  r.heroVideo = await page.evaluate(() => [...document.querySelectorAll('video')].slice(0, 2).map((v) => ({ src: v.currentSrc.split('/').pop(), paused: v.paused, loop: v.loop, t: +v.currentTime.toFixed(2), dur: +(v.duration || 0).toFixed(2) })));
  const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await glide(page, 0, H, 22000);
  await wait(page, 800);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await wait(page, 600);
  // interactions
  const act = async (label, fn) => { try { await fn(); r[`act_${label}`] = 'ok'; } catch (e) { r[`act_${label}`] = String(e).slice(0, 160); } };
  await act('loop', async () => {
    await goTo(page, '#ch-loop', -60); await wait(page, 5000);
    for (let i = 0; i < 3; i += 1) { await page.getByRole('button', { name: 'Fewer turns' }).click(); await wait(page, 700); }
    await wait(page, 4000); await page.screenshot({ path: `${OUT}/${world}-i-loop-max3.png` });
    r.loopReadout = await page.locator('#ch-loop [aria-live="polite"]').first().textContent();
  });
  await act('mcp', async () => {
    await goTo(page, '#ch-mcp', -60); await wait(page, 4000);
    await page.locator('#ch-mcp [role="switch"]').nth(2).click(); await wait(page, 2500);
    await page.screenshot({ path: `${OUT}/${world}-i-mcp-off.png` });
    r.mcpReadout = await page.locator('#ch-mcp [aria-live="polite"]').first().textContent();
  });
  await act('engineering', async () => {
    await goTo(page, '#ch-engineering', -60);
    const card = page.locator('#ch-engineering button[aria-label^="Add document"]');
    const b = await card.boundingBox(); const sb = await page.locator('#ch-engineering canvas, #ch-engineering svg[role="img"]').first().boundingBox();
    if (b && sb) { await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(sb.x + sb.width * 0.3, sb.y + sb.height / 2, { steps: 12 }); await page.mouse.up(); } else { await card.click(); }
    await wait(page, 800); await page.screenshot({ path: `${OUT}/${world}-i-eng-waiting.png` });
    await page.getByRole('button', { name: 'Compact' }).click(); await wait(page, 3500);
    await page.screenshot({ path: `${OUT}/${world}-i-eng-compact.png` });
    r.engReadout = await page.locator('#ch-engineering [aria-live="polite"]').first().textContent();
  });
  await act('harness', async () => {
    await goTo(page, '#ch-harness', -60); await wait(page, 6000);
    await page.screenshot({ path: `${OUT}/${world}-i-harness-pending.png` });
    await page.locator('#ch-harness [aria-label^="Pending Edit call"]').focus(); await page.keyboard.press('Escape'); await wait(page, 3000);
    await page.screenshot({ path: `${OUT}/${world}-i-harness-denied.png` });
    r.harnessReadout = await page.locator('#ch-harness [aria-live="polite"]').first().textContent();
  });
  await act('evals', async () => {
    await goTo(page, '#ch-evals', -60); await wait(page, 4000);
    await page.locator('#ch-evals input[type="range"]').focus(); await page.keyboard.press('End'); await wait(page, 5000);
    await page.screenshot({ path: `${OUT}/${world}-i-evals-k10.png` });
    r.evalsReadout = await page.locator('#ch-evals [aria-live="polite"]').first().textContent();
  });
  await ctx.close();
  const vd = `${OUT}/vid-tmp-${world}`; const vf = readdirSync(vd).find((f) => f.endsWith('.webm'));
  if (vf) renameSync(join(vd, vf), `${OUT}/${world}-1440.webm`);

  // 2) steps 1440 + 390 (static reveals so stills read)
  for (const [tag, vp] of [['1440', { width: 1440, height: 900 }], ['390', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const c = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
    const p = await c.newPage();
    await p.goto(route, { waitUntil: 'networkidle', timeout: 90000 }); await wait(p, 2500);
    r[`steps${tag}`] = await steps(p, world, tag);
    r[`hscroll${tag}`] = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (tag === '390') r.smallTargets390 = await p.evaluate(() => [...document.querySelectorAll('main button, main a, main input, main [role="switch"], main summary')]
      .map((el) => { const b = el.getBoundingClientRect(); return { t: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 30), w: Math.round(b.width), h: Math.round(b.height) }; })
      .filter((x) => x.w > 0 && (x.w < 44 || x.h < 44)));
    await c.close();
  }

  // 3) keyboard path
  {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage();
    await p.goto(route, { waitUntil: 'networkidle', timeout: 90000 }); await wait(p, 1500);
    const seq = [];
    for (let i = 0; i < 70; i += 1) {
      await p.keyboard.press('Tab');
      seq.push(await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); const b = a.getBoundingClientRect();
        return { tag: a.tagName.toLowerCase(), name: (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), ring: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' ? `${cs.outlineWidth} ${cs.outlineColor}` : (cs.boxShadow !== 'none' ? 'shadow' : 'NONE'), inView: b.top >= 0 && b.bottom <= innerHeight }; }));
    }
    r.tabPath = seq; await c.close();
  }

  // 4) reduced motion
  {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const p = await c.newPage();
    await p.goto(route, { waitUntil: 'networkidle', timeout: 90000 }); await wait(p, 2000);
    await p.screenshot({ path: `${OUT}/${world}-rm-hero.png` });
    r.reduced = await p.evaluate(() => ({ H: document.documentElement.scrollHeight, vh: +(document.documentElement.scrollHeight / innerHeight).toFixed(2), playingVideos: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
      visibleStepLists: [...document.querySelectorAll('figure ol')].filter((o) => !o.className.includes('sr-only') && o.getBoundingClientRect().height > 0).length }));
    await goTo(p, '#ch-context', 0); await p.screenshot({ path: `${OUT}/${world}-rm-context.png` });
    await c.close();
  }

  // 5) no-JS (time-boxed)
  {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); const p = await c.newPage();
    try {
      await p.goto(route, { waitUntil: 'load', timeout: 60000 }); await wait(p, 1000);
      await p.screenshot({ path: `${OUT}/${world}-nojs-hero.png` });
      r.noJs = await p.evaluate(() => ({ H: +(document.documentElement.scrollHeight / innerHeight).toFixed(2), h2: document.querySelectorAll('h2').length, stepLists: [...document.querySelectorAll('figure ol')].filter((o) => o.getBoundingClientRect().height > 0).length, svgImgs: document.querySelectorAll('[role="img"] svg, svg[role="img"]').length }));
      await goTo(p, '#ch-harness', -60); await p.screenshot({ path: `${OUT}/${world}-nojs-harness.png` });
    } catch (e) { r.noJs = `timeout/fail: ${String(e).slice(0, 120)}`; }
    await c.close();
  }
  console.log(world, 'done');
}
writeFileSync(`${OUT}/capture.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log('ok');
