// W2-CRIT-SIDEKICK evidence: stepped viewport stills (1440x900 + 390x844), a 1440 webm of load -> scroll -> interactions,
// reduced-motion + no-JS stills, keyboard tab path, layout probes. Read-only against the lab server.
// Usage: node design-lab/scripts/r2-crit-sidekick-shoot.mjs [signal|apple|all] [--skip-video] [--only=steps|video|rm|nojs|kbd|probe]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync, writeFileSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const which = args.find((a) => !a.startsWith('--')) ?? 'all';
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const OUT = 'design-lab/renders/r2/crit/sidekick';
const worlds = which === 'all' ? ['signal', 'apple'] : [which];
const want = (k) => !only || only.split(',').includes(k);

function shell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  return readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
    .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
}
const LAUNCH = { executablePath: shell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(LAUNCH);
const report = {};

async function stepShots(world, vp, tag) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, isMobile: vp.w < 500, hasTouch: vp.w < 500 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
  await sleep(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const max = H - vp.h;
  const shots = [];
  for (let i = 0; i < 10; i++) {
    const y = Math.round((max * i) / 9);
    // Scroll in small increments so scroll-driven state follows a real scroll.
    const cur = await page.evaluate(() => window.scrollY);
    const n = Math.max(1, Math.ceil(Math.abs(y - cur) / 300));
    for (let k = 1; k <= n; k++) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), Math.round(cur + ((y - cur) * k) / n));
      await sleep(40);
    }
    await sleep(700);
    const f = `${OUT}/${world}-${tag}-step${String(i).padStart(2, '0')}.png`;
    await page.screenshot({ path: f });
    shots.push({ f, y });
  }
  const probe = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const r = (el) => (el ? (({ top, bottom, left, right, width, height }) => ({ top, bottom, left, right, width, height }))(el.getBoundingClientRect()) : null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    const hero = q('section[aria-labelledby="sk-title"] svg') ;
    const heroFig = q('section[aria-labelledby="sk-title"] figure');
    const overflowX = document.documentElement.scrollWidth > window.innerWidth;
    const small = [...document.querySelectorAll('a,button,[tabindex="0"]')].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && (b.width < 44 || b.height < 44);
    }).map((el) => `${el.tagName.toLowerCase()}:${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);
    return { heroFig: r(heroFig), heroSvg: r(hero), overflowX, smallTargets: small.slice(0, 20), vh: window.innerHeight, scrollH: document.documentElement.scrollHeight };
  });
  report[`${world}-${tag}`] = { H, errors, probe, shots: shots.map((s) => s.f) };
  await ctx.close();
}

async function video(world) {
  const dir = `${OUT}/vid-${world}`;
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir, size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
  await sleep(2500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  // Full scroll at a steady pace (wheel), pausing on the teardown for the interaction.
  // Instant scrollBy steps (the headless wheel stalled on the Signal band in the first take).
  await page.mouse.move(720, 450);
  for (let y = 0; y < H; y += 48) {
    await page.evaluate(() => window.scrollBy({ top: 48, behavior: 'instant' }));
    await sleep(30);
    if (world === 'signal') {
      const hit = await page.evaluate(() => {
        const b = document.querySelector('[data-step="swap"] button');
        if (!b) return false;
        const r = b.getBoundingClientRect();
        return r.top > 200 && r.top < 600 && !b.dataset.critDone;
      });
      if (hit) {
        await sleep(800);
        await page.evaluate(() => (document.querySelector('[data-step="swap"] button').dataset.critDone = '1'));
        await page.click('[data-step="swap"] button');
        await sleep(1600);
        await page.click('[data-step="swap"] button');
        await sleep(1200);
      }
    } else {
      const hit = await page.evaluate(() => {
        const b = document.querySelector('#boards');
        if (!b) return false;
        const r = b.getBoundingClientRect();
        return r.top < 120 && !b.dataset.critDone;
      });
      if (hit) {
        await page.evaluate(() => (document.querySelector('#boards').dataset.critDone = '1'));
        await sleep(600);
        for (const lbl of ['Exploded', 'Flat', 'Angled']) {
          await page.click(`#boards button:has-text("${lbl}")`);
          await sleep(1000);
        }
        await page.click('#boards button[aria-label="Next board"]');
        await sleep(1000);
        await page.click('#boards button[aria-label="Next board"]');
        await sleep(1000);
      }
    }
  }
  await sleep(1500);
  const v = page.video();
  await ctx.close();
  const p = await v.path();
  renameSync(p, `${OUT}/${world}-1440.webm`);
  report[`${world}-video`] = `${OUT}/${world}-1440.webm`;
}

async function reduced(world) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
  await sleep(1500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const words = await page.evaluate(() => document.body.innerText.split(/\s+/).filter(Boolean).length);
  await page.screenshot({ path: `${OUT}/${world}-rm-full.png`, fullPage: true });
  report[`${world}-rm`] = { H, words, videos: await page.evaluate(() => [...document.querySelectorAll('video')].map((v) => ({ paused: v.paused, t: v.currentTime }))) };
  await ctx.close();
}

async function nojs(world) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  const t0 = Date.now();
  try {
    await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'load', timeout: 60000 });
    await sleep(800);
    const H = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => null);
    await page.screenshot({ path: `${OUT}/${world}-nojs-hero.png` });
    await page.screenshot({ path: `${OUT}/${world}-nojs-full.png`, fullPage: true }).catch(() => undefined);
    const words = await page.evaluate(() => document.body.innerText.split(/\s+/).filter(Boolean).length).catch(() => null);
    report[`${world}-nojs`] = { H, words, ms: Date.now() - t0 };
  } catch (e) {
    report[`${world}-nojs`] = { error: String(e).slice(0, 200), ms: Date.now() - t0 };
  }
  await ctx.close();
}

async function kbd(world) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/design-lab/r2/${world}/sidekick/`, { waitUntil: 'networkidle', timeout: 90000 });
  await sleep(1200);
  const path = [];
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? `outline ${cs.outlineWidth} ${cs.outlineColor}` : cs.boxShadow !== 'none' ? 'box-shadow' : 'NONE';
      const r = el.getBoundingClientRect();
      return `${el.tagName.toLowerCase()}|${(el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 36)}|${ring}|y${Math.round(r.top)}`;
    });
    path.push(info);
    if (i === 20) await page.screenshot({ path: `${OUT}/${world}-kbd-tab20.png` });
  }
  report[`${world}-kbd`] = path;
  await ctx.close();
}

for (const w of worlds) {
  if (want('steps')) {
    await stepShots(w, { w: 1440, h: 900 }, '1440');
    await stepShots(w, { w: 390, h: 844 }, '390');
  }
  if (want('rm')) await reduced(w);
  if (want('nojs')) await nojs(w);
  if (want('kbd')) await kbd(w);
  if (want('video') && !args.includes('--skip-video')) await video(w);
}
await browser.close();
const file = `${OUT}/shoot-report-${which}${only ? '-' + only.replace(/,/g, '_') : ''}.json`;
writeFileSync(file, JSON.stringify(report, null, 2));
console.log(file);
