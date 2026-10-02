#!/usr/bin/env node
/**
 * Seek-latency check for scrub clips (W1-CINE / W3a).
 *   node design-lab/scripts/r2-cine-seek.mjs [file …] [--seeks=40] [--out=<json>]
 * Default files: every scrub clip in public/design-lab/r2/cine (mp4 + webm, both aspects, both worlds).
 * Serves public/ with HTTP Range, loads each file into a paused <video> (fully buffered), then does N
 * random currentTime jumps and records set → `seeked` latency (target frame decoded). Uses real Chrome (~/.local/bin/google-chrome)
 * because Playwright's bundled Chromium has no H.264.
 */
import { chromium } from 'playwright';
import { createReadStream, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const PUB = join(ROOT, 'public');
const CINE = join(PUB, 'design-lab/r2/cine');
const SCRUB = ['sidekick-explode', 'shades-lightpath', 'brain-context'];
const args = process.argv.slice(2);
const seeks = Number(args.find((a) => a.startsWith('--seeks='))?.split('=')[1] ?? 40);
const outArg = args.find((a) => a.startsWith('--out='))?.split('=')[1];
const files = args.filter((a) => !a.startsWith('--'));
const targets = files.length
  ? files
  : readdirSync(CINE).filter((f) => /\.(mp4|webm)$/.test(f) && SCRUB.some((n) => f.startsWith(`${n}-`))).sort();

const TYPES = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.html': 'text/html' };
const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<!doctype html><body style="margin:0;background:#000"></body>');
    return;
  }
  const p = join(PUB, url);
  if (!p.startsWith(PUB) || !existsSync(p)) {
    res.writeHead(404);
    res.end();
    return;
  }
  const size = statSync(p).size;
  const type = TYPES[extname(p)] ?? 'application/octet-stream';
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
  if (m) {
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Number(m[2]) : size - 1;
    res.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
    createReadStream(p, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': size });
    createReadStream(p).pipe(res);
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const chrome = join(homedir(), '.local/bin/google-chrome');
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://127.0.0.1:${port}/`);

const pct = (xs, q) => xs.slice().sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))];
const results = [];
for (const f of targets) {
  const src = `/design-lab/r2/cine/${f}`;
  const r = await page.evaluate(
    async ({ src, seeks }) => {
      const v = document.createElement('video');
      v.muted = true;
      v.preload = 'auto';
      v.playsInline = true;
      v.style.width = '960px';
      document.body.replaceChildren(v);
      v.src = src;
      await new Promise((ok, bad) => {
        setTimeout(() => bad(new Error(`timeout loading ${src} (readyState ${v.readyState})`)), 15000);
        v.addEventListener('canplaythrough', ok, { once: true });
        v.addEventListener('error', () => bad(new Error(`cannot play ${src}`)), { once: true });
      });
      // wait until fully buffered so the test measures decode, not network
      for (let i = 0; i < 100 && !(v.buffered.length && v.buffered.end(v.buffered.length - 1) >= v.duration - 0.05); i++) {
        await new Promise((ok) => setTimeout(ok, 50));
      }
      const d = v.duration;
      const lat = [];
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < seeks; i++) {
        const t = rnd() * (d - 0.05);
        const t0 = performance.now();
        await new Promise((ok) => {
          v.addEventListener('seeked', ok, { once: true });
          v.currentTime = t;
        });
        // `seeked` fires once the target frame is decoded (rVFC never fires in headless, so it is not used)
        lat.push(performance.now() - t0);
      }
      return { duration: d, w: v.videoWidth, h: v.videoHeight, lat };
    },
    { src, seeks },
  ).catch((e) => ({ error: String(e) }));
  if (r.error) {
    console.log(`${f}: ${r.error}`);
    results.push({ file: f, error: r.error });
    continue;
  }
  const row = {
    file: f,
    size: `${r.w}x${r.h}`,
    mb: +(statSync(join(CINE, f)).size / 1048576).toFixed(2),
    median: +pct(r.lat, 0.5).toFixed(1),
    p90: +pct(r.lat, 0.9).toFixed(1),
    max: +Math.max(...r.lat).toFixed(1),
  };
  results.push(row);
  console.log(`${f.padEnd(40)} ${row.size.padEnd(10)} ${String(row.mb).padStart(5)} MB  set→seeked median ${row.median} ms · p90 ${row.p90} · max ${row.max}`);
}
await browser.close();
server.close();
if (outArg) writeFileSync(resolve(ROOT, outArg), JSON.stringify(results, null, 2));
