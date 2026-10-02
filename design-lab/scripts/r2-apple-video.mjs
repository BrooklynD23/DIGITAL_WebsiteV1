// R2-APPLE: classify <video> behaviour (scrubbed vs autoplay-on-view), carousels (scroll-snap), "closer look"/highlights structure.
// Usage: node design-lab/scripts/r2-apple-video.mjs <slug> <url>
import { chromium } from 'playwright';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const [slug, url] = process.argv.slice(2);
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const b = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
const vids = new Map();
for (let y = 0; y < H - 900; y += 150) {
  await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(140);
  const rows = await p.evaluate((y) => [...document.querySelectorAll('video')].map((v, i) => { const r = v.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.width < 50) return null; return { i, src: (v.currentSrc || '').split('/').slice(-3).join('/').slice(0, 60), paused: v.paused, t: +v.currentTime.toFixed(2), dur: +(v.duration || 0).toFixed(1), loop: v.loop, rate: v.playbackRate, ready: v.readyState, w: Math.round(r.width), h: Math.round(r.height), y }; }).filter(Boolean), y);
  for (const r of rows) { const k = r.i + r.src; (vids.get(k) || vids.set(k, []).get(k)).push(r); }
}
const out = [];
for (const [k, s] of vids) {
  const times = s.map((x) => x.t), ys = s.map((x) => x.y);
  const pausedChanging = s.filter((x, j) => j && x.paused && s[j - 1].paused && x.t !== s[j - 1].t).length;
  out.push({ k: k.slice(0, 80), samples: s.length, dur: s[0].dur, loop: s[0].loop, size: `${s[0].w}x${s[0].h}`, tRange: [Math.min(...times), Math.max(...times)], pausedFrac: +(s.filter((x) => x.paused).length / s.length).toFixed(2), pausedTimeChanges: pausedChanging, yRange: [Math.min(...ys), Math.max(...ys)] });
}
const dom = await p.evaluate(() => {
  const snap = [...document.querySelectorAll('*')].filter((e) => { const s = getComputedStyle(e); return s.scrollSnapType !== 'none' || ((s.overflowX === 'auto' || s.overflowX === 'scroll') && e.scrollWidth > e.clientWidth + 20); }).slice(0, 10).map((e) => { const s = getComputedStyle(e); const kids = [...e.children]; const kw = kids.slice(0, 3).map((k) => Math.round(k.getBoundingClientRect().width)); return { d: e.tagName.toLowerCase() + '.' + (e.className || '').toString().split(/\s+/)[0], snap: s.scrollSnapType, kids: kids.length, kidW: kw, sw: e.scrollWidth, cw: e.clientWidth, gap: s.columnGap }; });
  const closer = [...document.querySelectorAll('h2,h3,[class*=headline],[class*=eyebrow]')].map((e) => e.innerText.trim()).filter((t) => /closer look|highlights|take a|explore|see how|get the/i.test(t)).slice(0, 8);
  const dots = document.querySelectorAll('[class*="dotnav"],[class*="paddlenav"],[class*="gallery-dotnav"],[role="tablist"]').length;
  const tiles = [...document.querySelectorAll('[class*="tile"],[class*="card-container"]')].length;
  const mediaUI = document.querySelectorAll('[class*="media-ui"],[class*="play-pause"],button[aria-label*="Pause"],button[aria-label*="Play"]').length;
  return { snap, closer, dots, tiles, mediaUI };
});
writeFileSync(`design-lab/round2/references/apple/${slug}/video-probe.json`, JSON.stringify({ videos: out, ...dom }, null, 1));
console.log(slug, 'videos', out.length, 'scrubbed-ish', out.filter((o) => o.pausedTimeChanges > 2).length, 'closer', dom.closer.length, 'snap', dom.snap.length);
await b.close();
