#!/usr/bin/env node
/**
 * Render + encode the round-2 cinematics (W1-CINE).
 *
 *   node design-lab/scripts/r2-cine-render.mjs                 # all clips, both aspects
 *   node design-lab/scripts/r2-cine-render.mjs brain-orb       # one clip
 *   node design-lab/scripts/r2-cine-render.mjs --aspect=16x9   # one aspect
 *   node design-lab/scripts/r2-cine-render.mjs --world=apple    # one world (signal | apple)
 *   node design-lab/scripts/r2-cine-render.mjs --encode-only   # reuse the Remotion intermediates
 *
 * Worlds: signal keeps the original file names (<name>-16x9.mp4, <name>-poster.webp …);
 * apple writes <name>-apple-16x9.mp4, <name>-apple-poster.webp … (#000 ground, Apple greys, copper boards).
 *
 * Pipeline per clip × aspect:
 *   1. Remotion → design-lab/motion-reel/out/r2/<name>--<aspect>.mp4 (h264 crf 8 intermediate, deterministic)
 *   2. ffmpeg → public/design-lab/r2/cine/<name>-<aspect>.mp4  (libx264 yuv420p tv-range, faststart, CRF tuned to ≤ 1.5 MB)
 *   3. ffmpeg → <name>-<aspect>.webm (VP9, same GOP, CRF tuned to ≤ 1.5 MB)
 *   4. poster  → <name>-poster.webp (16x9) / <name>-poster-4x5.webp (rest frame)
 * once/loop: GOP 60, full resolution.
 * scrub: ALL-INTRA (-g 1, every frame a keyframe) at 15 fps, so a currentTime seek decodes one frame. mp4 tries
 *   full resolution (crf ≤ 28) first, then 1280×720 / 864×1080 if it cannot meet 1.5 MB; webm (VP9 intra is
 *   weak) is the H.264-less fallback, all-intra at the reduced size with a 2.5 MB cap. Scrub sources list
 *   mp4 first (see manifest `order`).
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
const worldArg = args.find((a) => a.startsWith('--world='))?.split('=')[1];
const encodeOnly = args.includes('--encode-only');
const targets = (names.length ? names : Object.keys(CLIPS)).map((n) => {
  if (!CLIPS[n]) throw new Error(`Unknown clip "${n}". Known: ${Object.keys(CLIPS).join(', ')}`);
  return n;
});
const aspects = aspectArg ? [aspectArg] : ASPECTS;
const worlds = worldArg ? [worldArg] : ['signal', 'apple'];
const WEBM_SCRUB_BUDGET = 2.5 * 1024 * 1024;
const REDUCED = { '16x9': '1280:720', '4x5': '864:1080' };
// Scrub clips: 15 fps all-intra. Half the frames lets each keyframe keep detail (crf ≤ 28 on line art);
// the scrub drive eases currentTime, so 15 fps reads smooth under scroll.
const SCRUB_FPS = 15;

mkdirSync(INTER, { recursive: true });
mkdirSync(OUT, { recursive: true });

const run = (cmd, argv, cwd = ROOT) => execFileSync(cmd, argv, { cwd, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
const size = (p) => statSync(p).size;
const mb = (b) => (b / 1024 / 1024).toFixed(2);

/** Try each [scale, crf] step until the file fits the budget. */
function encodeUnderBudget(label, steps, encode, budget = BUDGET) {
  for (const [scale, crf] of steps) {
    const out = encode(scale, crf);
    if (size(out) <= budget) return { out, crf, scale: scale ?? 'full' };
    console.log(`  ${label}: ${scale ?? 'full'} crf ${crf} → ${mb(size(out))} MB, over budget, retrying`);
  }
  throw new Error(`${label}: could not meet the ${mb(budget)} MB budget`);
}
const ladder = (scales, crfs) => scales.flatMap((sc) => crfs.map((c) => [sc, c]));

const report = [];
for (const name of targets) {
  const { frames, mode } = CLIPS[name];
  const scrub = mode === 'scrub';
  const gop = scrub ? 1 : 60;
  const posterFrame = mode === 'loop' ? 0 : frames - 1;
  for (const world of worlds) {
    for (const aspect of aspects) {
      const id = world === 'signal' ? `${name}--${aspect}` : `${name}--${world}--${aspect}`;
      const stem = world === 'signal' ? name : `${name}-${world}`;
      const inter = join(INTER, `${id}.mp4`);
      if (!encodeOnly || !existsSync(inter)) {
        console.log(`render ${id}`);
        run('npx', ['remotion', 'render', 'src/index.jsx', id, inter, '--codec=h264', '--crf=8', '--concurrency=4', '--log=error'], REEL);
      }
      const base = join(OUT, `${stem}-${aspect}`);
      const vf = (scale) =>
        `${scrub ? `fps=${SCRUB_FPS},` : ''}${scale ? `scale=${scale}:flags=lanczos,` : ''}scale=in_range=pc:out_range=tv,format=yuv420p`;
      const gopArgs = scrub ? ['-g', '1', '-keyint_min', '1', '-bf', '0', '-sc_threshold', '0'] : ['-g', String(gop), '-keyint_min', String(gop), '-sc_threshold', '0'];

      const mp4Steps = scrub
        ? [...ladder([null], [22, 24, 26, 28]), ...ladder([REDUCED[aspect]], [26, 28, 30, 32])]
        : ladder([null], [20, 22, 24, 26, 28, 30, 32, 34]);
      const mp4 = encodeUnderBudget(`${id}.mp4`, mp4Steps, (scale, crf) => {
        run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', vf(scale), '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation',
          '-crf', String(crf), ...gopArgs, '-movflags', '+faststart', '-an', `${base}.mp4`]);
        return `${base}.mp4`;
      });
      const webmSteps = scrub ? ladder([REDUCED[aspect]], [36, 40, 44, 48, 52, 56]) : ladder([null], [34, 37, 40, 43, 46, 49, 52]);
      const webm = encodeUnderBudget(`${id}.webm`, webmSteps, (scale, crf) => {
        run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', vf(scale), '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf),
          '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', ...gopArgs.filter((a, i, all) => all[i - 1] !== '-bf' && a !== '-bf'), '-an', `${base}.webm`]);
        return `${base}.webm`;
      }, scrub ? WEBM_SCRUB_BUDGET : BUDGET);
      const poster = join(OUT, aspect === '16x9' ? `${stem}-poster.webp` : `${stem}-poster-4x5.webp`);
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inter, '-vf', `select=eq(n\\,${posterFrame})`, '-frames:v', '1',
        '-c:v', 'libwebp', '-quality', '82', poster]);
      const row = { id, world, mode, gop, mp4: mb(size(mp4.out)), mp4Crf: mp4.crf, mp4Scale: mp4.scale, webm: mb(size(webm.out)), webmCrf: webm.crf, webmScale: webm.scale, posterKB: Math.round(size(poster) / 1024) };
      report.push(row);
      console.log(`  ok ${id}: mp4 ${row.mp4} MB (${row.mp4Scale}, crf ${row.mp4Crf}) · webm ${row.webm} MB (${row.webmScale}, crf ${row.webmCrf}) · poster ${row.posterKB} KB`);
    }
  }
}
writeFileSync(join(INTER, `encode-report-${Date.now()}.json`), JSON.stringify(report, null, 2));
