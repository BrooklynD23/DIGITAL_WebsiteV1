// Usage: node design-lab/scripts/gallery-assets.mjs
// Builds the web-sized previews for /design-lab (gallery) from the v2 renders (renders/ is not web-served).
//   desktop: first 900 CSS px of the 1440 full-page shot  -> 1440w webp
//   mobile:  first 1688 device px of the 780w @2x shot     -> 390w webp (= first 844 CSS px)
//   strip:   whole desktop page scaled to 320w             -> lazy "overview" image
// Plus the motion reel (copied as-is), its poster and the mascot with/without comparison.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const R = 'design-lab/renders';
const OUT = 'public/design-lab/gallery';
mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
const webp = (input, vf, out, q = 78) =>
  ff(['-i', input, '-vf', vf, '-c:v', 'libwebp', '-quality', String(q), '-compression_level', '6', out]);

for (const x of ['a', 'b', 'c', 'd', 'e', 'f']) {
  webp(`${R}/${x}/v2/${x}-desktop.png`, 'crop=1440:900:0:0', `${OUT}/${x}-desktop.webp`);
  webp(`${R}/${x}/v2/${x}-mobile.png`, 'crop=780:1688:0:0,scale=390:-2:flags=lanczos', `${OUT}/${x}-mobile.webp`, 82);
  webp(`${R}/${x}/v2/${x}-mobile.png`, 'crop=780:1688:0:0', `${OUT}/${x}-mobile@2x.webp`, 80);
  webp(`${R}/${x}/v2/${x}-desktop.png`, 'scale=320:-2:flags=lanczos', `${OUT}/${x}-strip.webp`, 70);
}

copyFileSync(`${R}/motion/reel.mp4`, `${OUT}/reel.mp4`);
webp(`${R}/motion/reel-poster.png`, 'scale=1280:-2:flags=lanczos', `${OUT}/reel-poster.webp`, 80);
for (const v of ['with', 'without']) webp(`${R}/mascot/v1/${v}.png`, 'scale=iw:ih', `${OUT}/mascot-${v}.webp`, 82);

const total = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? total(join(dir, e.name)) : statSync(join(dir, e.name)).size),
    0,
  );
console.log(`gallery assets: ${(total(OUT) / 1048576).toFixed(2)} MB in ${OUT}`);
