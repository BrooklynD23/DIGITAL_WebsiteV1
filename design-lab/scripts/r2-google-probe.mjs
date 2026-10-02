// Usage: node design-lab/scripts/r2-google-probe.mjs <url> -> prints CSS/network facts about scroll effects.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const url = process.argv[2];
const root = join(homedir(), '.cache', 'ms-playwright');
let exe; for (const d of readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()) { const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell'); if (existsSync(p)) { exe = p; break; } }
const b = await chromium.launch({ executablePath: exe });
const page = await b.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
const reqs = [];
page.on('response', async (r) => { const ct = r.headers()['content-type'] || ''; const cl = +(r.headers()['content-length'] || 0); reqs.push({ u: r.url().slice(0, 110), ct, cl }); });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(4000);
await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 450) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); } });
await page.waitForTimeout(1500);
const info = await page.evaluate(() => {
  const out = { rules: [], viewTrans: [], cv: [], springs: [], mq: [], easings: new Set(), durations: new Set() };
  const walk = (rules) => { for (const r of rules) {
    if (r.cssRules) { if (r.media && /reduced-motion|prefers/.test(r.media.mediaText)) out.mq.push(r.media.mediaText); walk(r.cssRules); }
    const t = r.cssText || '';
    if (/animation-timeline|scroll-timeline|view-timeline|animation-range/.test(t)) out.rules.push(t.slice(0, 260));
    if (/view-transition/.test(t)) out.viewTrans.push(t.slice(0, 200));
    if (/content-visibility/.test(t)) out.cv.push(t.slice(0, 160));
    const m = t.match(/(?:transition|animation)[^;{]*?(cubic-bezier\([^)]*\)|linear\([^)]*\))/g); if (m) m.forEach((x) => out.easings.add(x.slice(-90)));
  } };
  for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }
  out.easings = [...out.easings].slice(0, 12);
  out.mq = [...new Set(out.mq)];
  const vids = [...document.querySelectorAll('video')];
  out.videoSample = vids.slice(0, 6).map((v) => ({ src: (v.currentSrc || v.src || (v.querySelector('source') || {}).src || '').slice(0, 100), autoplay: v.autoplay, loop: v.loop, muted: v.muted, preload: v.preload, poster: !!v.poster, w: v.videoWidth, h: v.videoHeight }));
  out.videoCount = vids.length; out.videoWithSource = vids.filter((v) => v.currentSrc).length;
  out.svgFilters = document.querySelectorAll('filter').length;
  out.docAnimations = document.getAnimations().length;
  out.scrollDrivenAnims = document.getAnimations().filter((a) => a.timeline && a.timeline.constructor.name !== 'DocumentTimeline').length;
  out.timelineTypes = [...new Set(document.getAnimations().map((a) => a.timeline && a.timeline.constructor.name))];
  out.hasCSSspringLinear = false;
  return out;
});
const sum = (f) => reqs.filter(f).reduce((a, r) => a + r.cl, 0);
const vidReqs = reqs.filter((r) => /video|mp4|webm|m3u8/.test(r.ct + r.u));
console.log(JSON.stringify({ info, requests: reqs.length, jsKB: Math.round(sum((r) => /javascript/.test(r.ct)) / 1024), imgKB: Math.round(sum((r) => /image/.test(r.ct)) / 1024), videoReqs: vidReqs.length, videoKB: Math.round(sum((r) => /video/.test(r.ct)) / 1024), videoTypes: [...new Set(vidReqs.map((r) => r.ct))], imgTypes: [...new Set(reqs.filter((r) => /image/.test(r.ct)).map((r) => r.ct))], vidUrls: vidReqs.slice(0, 4).map((r) => r.u) }, null, 1));
await b.close();
