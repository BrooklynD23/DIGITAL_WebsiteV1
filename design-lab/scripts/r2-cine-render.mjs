#!/usr/bin/env node
/**
 * Render + encode the round-2 cinematics (W1-CINE).
 *
 *   node design-lab/scripts/r2-cine-render.mjs                 # all clips, both aspects
 *   node design-lab/scripts/r2-cine-render.mjs brain-orb       # one clip
 *   node design-lab/scripts/r2-cine-render.mjs --aspect=16x9   # one aspect
 *   node design-lab/scripts/r2-cine-render.mjs --encode-only   # reuse the Remotion intermediates
 *
 * Pipeline per clip × aspect:
 *   1. Remotion → design-lab/motion-reel/out/r2/<name>--<aspect>.mp4 (h264 crf 8 intermediate, deterministic)
 *   2. ffmpeg → public/design-lab/r2/cine/<name>-<aspect>.mp4  (libx264 yuv420p tv-range, faststart, CRF tuned to ≤ 1.5 MB)
 *   3. ffmpeg → <name>-<aspect>.webm (VP9, same GOP, CRF tuned to ≤ 1.5 MB)
 *   4. poster  → <name>-poster.webp (16x9) / <name>-poster-4x5.webp (rest frame)
 * GOP: scrub clips use -g 15 (smooth currentTime seeking); once/loop use -g 60.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const REEL = join(ROOT, 'design-lab/motion-reel');
const INTER = join(REEL, 'out/r2');
const OUT = join(ROOT, 'public/design-lab/r2/cine');
const BUDGET = 1.5 * 1024 * 1024;

// Must match app/design-lab/r2/_system/cine/manifest.ts
const CLIPS = {
  'home-stages': { frames: 180, mode: 'once' },
  'sidekick-explode': { frames: 180, mode: 'scrub' },
  'sidekick-swap': { frames: 120, mode: 'once' },
  'shades-lightpath': { frames: 180, mode: 'scrub' },
  'shades-fixate': { frames: 120, mode: 'once' },
  'brain-orb': { frames: 180, mode: 'loop' },
  'brain-context': { frames: 150, mode: 'scrub' },
};
const ASPECTS = ['16x9', '4x5'];

const args = process.argv.slice(2);
const names = args.filter((a) => !a.startsWith('--'));
const aspectArg = args.find((a) => a.startsWith('--aspect='))?.split('=')[1];
const encodeOnly = args.includes('--encode-only');
const targets = (names.length ? names : Object.keys(CLIPS)).map((n) => {
  if (!CLIPS[n]) throw new Error(`Unknown clip "${n}". Known: ${Object.keys(CLIPS).join(', ')}`);
  return n;
});
const aspects = aspectArg ? [aspectArg] : ASPECTS;

mkdirSync(INTER, { recursive: true });
mkdirSync(OUT, { recursive: true });

const run = (cmd, argv, cwd = ROOT) => execFileSync(cmd, argv, { cwd, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
const size = (p) => statSync(p).size;
const mb = (b) => (b / 1024 / 1024).toFixed(2);

function encodeUnderBudget(label, crfs, encode) {
  for (const crf of crfs) {
    const out = encode(crf);
    if (size(out) <= BUDGET) return { out, crf };
    console.log(`  ${label}: crf ${crf} → ${mb(size(out))} MB, over budget, retrying`);
  }
  throw new Error(`${label}: could not meet the ${mb(BUDGET)} MB budget`);
}

const report = [];
for (const name of targets) {
  const { frames, mode } = CLIPS[name];
  const gop = mode === 'scrub' ? 15 : 60;
  const posterFrame = mode === 'loop' ? 0 : frames - 1;
  for (const aspect of aspects) {
    const id = `${name}--${aspect}`;
    const inter = join(INTER, `${id}.mp4`);
    if (!encodeOnly || !existsSync(inter)) {
      console.log(`render ${id}`);
      run('npx', ['remotion', 'render', 'src/index.jsx', id, inter, '--codec=h264', '--crf=8', '--concurrency=4', '--log=error'], REEL);
    }
    const base = join(OUT, `${name}-${aspect}`);
    const vf = 'scale=in_range=pc:out_range=tv,format=yuv420p';
    const gopArgs = ['-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0'];

    const mp4 = encodeUnderBudget(`${id}.mp4`, [20, 22, 24, 26, 28, 30, 32, 34], (crf) => {
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation',
        '-crf', String(crf), ...gopArgs, '-movflags', '+faststart', '-an', `${base}.mp4`]);
      return `${base}.mp4`;
    });
    const webm = encodeUnderBudget(`${id}.webm`, [34, 37, 40, 43, 46, 49, 52], (crf) => {
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', vf, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf),
        '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', ...gopArgs, '-an', `${base}.webm`]);
      return `${base}.webm`;
    });
    const poster = join(OUT, aspect === '16x9' ? `${name}-poster.webp` : `${name}-poster-4x5.webp`);
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', `select=eq(n\\,${posterFrame})`, '-frames:v', '1',
      '-c:v', 'libwebp', '-quality', '82', poster]);
    const row = { id, mode, gop, mp4: mb(size(mp4.out)), mp4Crf: mp4.crf, webm: mb(size(webm.out)), webmCrf: webm.crf, posterKB: Math.round(size(poster) / 1024) };
    report.push(row);
    console.log(`  ok ${id}: mp4 ${row.mp4} MB (crf ${row.mp4Crf}) · webm ${row.webm} MB (crf ${row.webmCrf}) · poster ${row.posterKB} KB`);
  }
}
writeFileSync(join(INTER, `encode-report-${Date.now()}.json`), JSON.stringify(report, null, 2));
