#!/usr/bin/env node
/**
 * Contact sheets for frame review (W1-CINE): every clip sampled at fps=2 and tiled.
 *   node design-lab/scripts/r2-cine-sheet.mjs [names...] [--aspect=16x9|4x5] [--out=<dir>]
 * Default out: design-lab/round2/system/renders/cine/<name>-<aspect>-sheet.png
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'public/design-lab/r2/cine');
const args = process.argv.slice(2);
const outDir = resolve(ROOT, args.find((a) => a.startsWith('--out='))?.split('=')[1] ?? 'design-lab/round2/system/renders/cine');
const aspect = args.find((a) => a.startsWith('--aspect='))?.split('=')[1] ?? '16x9';
const names = args.filter((a) => !a.startsWith('--'));
mkdirSync(outDir, { recursive: true });

const files = readdirSync(SRC).filter((f) => f.endsWith(`-${aspect}.mp4`));
for (const f of files) {
  const name = f.replace(`-${aspect}.mp4`, '');
  if (names.length && !names.includes(name)) continue;
  const out = join(outDir, `${name}-${aspect}-sheet.png`);
  const w = aspect === '16x9' ? 480 : 300;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(SRC, f), '-vf', `fps=2,scale=${w}:-1,tile=4x3:padding=6:color=0x333333`, '-frames:v', '1', out]);
  console.log(existsSync(out) ? out : `failed ${name}`);
}
