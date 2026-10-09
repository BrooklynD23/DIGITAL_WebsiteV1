// Usage: node design-lab/scripts/r2-stake-build.mjs
// Converts stakeholder captures to WebP and inlines them as data: URIs into compare.html.
// Template: design-lab/round2/stakeholder/compare.src.html, placeholders {{img:KEY}}.
// A missing capture becomes a labelled "pending" SVG so the page still renders.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'design-lab/round2/stakeholder';
const CAP = join(DIR, 'captures');
const IMG = join(DIR, 'img');
const R1 = 'design-lab/renders';
const SIG = 'design-lab/round2/references/signature';
mkdirSync(IMG, { recursive: true });

// Mockup frames: the page agents' final per-viewport captures (real scroll positions), picked per chapter.
const STEPS = 'design-lab/renders/r2';
const PICK = {
  sidekick: { dir: 'sidekick/v3/steps',
    signal: { d: ['signal-d-00-top', 'signal-d-04', 'signal-d-07', 'signal-d-08'], m: ['signal-m-00-top', 'signal-m-04', 'signal-m-07'] },
    apple: { d: ['apple-d-00-top', 'apple-d-03', 'apple-d-06', 'apple-d-09'], m: ['apple-m-00-top', 'apple-m-04', 'apple-m-06'] } },
  shades: { dir: 'shades/v3/steps',
    signal: { d: ['signal-1440-00', 'signal-1440-02', 'signal-1440-06', 'signal-1440-11'], m: ['signal-390-00', 'signal-390-06', 'signal-390-11'] },
    apple: { d: ['apple-1440-00', 'apple-1440-02', 'apple-1440-03', 'apple-1440-08'], m: ['apple-390-00', 'apple-390-03', 'apple-390-08'] } },
  brain: { dir: 'brain/v3/steps',
    signal: { d: ['signal-1440-step00', 'signal-1440-step06', 'signal-1440-step07', 'signal-1440-step11'], m: ['signal-390-step00', 'signal-390-step07', 'signal-390-step08'] },
    apple: { d: ['apple-1440-step00', 'apple-1440-step06', 'apple-1440-step07', 'apple-1440-step11'], m: ['apple-390-step00', 'apple-390-step07', 'apple-390-step08'] } },
};
// Home picks are set once the orchestrator says "home ready" (HOME_STEPS=dir, HOME_PICK=json).
if (process.env.HOME_PICK) PICK.home = { dir: process.env.HOME_STEPS, ...JSON.parse(process.env.HOME_PICK) };

// key -> { src, filter }
function sourceFor(key) {
  const mk = key.match(/^(signal|apple)-(home|sidekick|shades|brain)-([dm])-(\d)$/);
  if (mk && PICK[mk[2]]) {
    const [, world, page, vp, i] = mk;
    const name = PICK[page][world][vp][Number(i)];
    return { src: join(STEPS, PICK[page].dir, `${name}.png`), vf: vp === 'm' ? 'scale=390:-2' : 'scale=1200:-2' };
  }
  const r1 = key.match(/^r1-([a-f])$/);
  if (r1) return { src: join(R1, r1[1], 'v2', `${r1[1]}-desktop.png`), vf: 'crop=1440:900:0:0,scale=720:-2' };
  if (key === 'r1-c-strip') return { src: join(SIG, 'c-1440-06-section-full.png'), vf: 'scale=1200:-2' };
  if (key === 'r1-e-phone') return { src: join(SIG, 'e-1440-04-scrub.png'), vf: 'scale=1200:-2' };
  const mobile = /-m-\d$/.test(key);
  return { src: join(CAP, `${key}.png`), vf: mobile ? 'scale=390:-2' : 'scale=1200:-2' };
}

function pendingSvg(key) {
  const mobile = /-m-\d$/.test(key);
  const [w, h] = mobile ? [390, 844] : [1200, 750];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#d9d9de"/><text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="${mobile ? 18 : 30}" fill="#55555c">Capture pending</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const cache = new Map();
function dataUri(key) {
  if (cache.has(key)) return cache.get(key);
  const { src, vf } = sourceFor(key);
  let uri;
  if (!existsSync(src)) {
    console.warn(`pending: ${key} (${src} missing)`);
    uri = pendingSvg(key);
  } else {
    const out = join(IMG, `${key}.webp`);
    if (!existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs) {
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', vf, '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6', out]);
    }
    uri = `data:image/webp;base64,${readFileSync(out).toString('base64')}`;
  }
  cache.set(key, uri);
  return uri;
}

const tpl = readFileSync(join(DIR, 'compare.src.html'), 'utf8');
const html = tpl.replace(/\{\{img:([a-z0-9-]+)\}\}/g, (_, key) => dataUri(key));
const outFile = join(DIR, 'compare.html');
writeFileSync(outFile, html);
const mb = (statSync(outFile).size / 1024 / 1024).toFixed(2);
console.log(`wrote ${outFile} ${mb} MB, ${cache.size} images`);
