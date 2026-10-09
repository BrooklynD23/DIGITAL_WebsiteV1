// R2-APPLE: compare apple.com behaviour with prefers-reduced-motion: reduce vs no-preference (videos playing, sticky tall, card reveal transform)
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const url = process.argv[2];
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const b = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
for (const rm of ['no-preference', 'reduce']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  let playing = 0, seen = 0, docH = H, cardOp = [];
  for (let y = 0; y < H - 900; y += 360) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120);
    const r = await p.evaluate(() => { const vs = [...document.querySelectorAll('video')].filter((v) => { const r = v.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 100; }); const c = document.querySelector('.gallery-item'); const cs = c && c.getBoundingClientRect().top < innerHeight && c.getBoundingClientRect().bottom > 0 ? getComputedStyle(c.querySelector('.card-container') || c) : null; return { n: vs.length, pl: vs.filter((v) => !v.paused).length, op: cs && cs.opacity + '|' + cs.transform }; });
    seen += r.n; playing += r.pl; if (r.op) cardOp.push(r.op); }
  const H2 = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log(rm, 'docH', H2, 'video-in-view samples', seen, 'playing', playing, 'galleryCard', [...new Set(cardOp)].slice(0, 3));
  await ctx.close();
}
await b.close();
