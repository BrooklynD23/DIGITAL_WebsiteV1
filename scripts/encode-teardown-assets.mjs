/**
 * Encode teardown assets for S1 payload budget + Option B registered layers.
 *
 * - Frames: AVIF + WebP at 760 / 1100 / 1700 from PNG sources
 * - Poster: frame-12 exploded view for mobile + reduced-motion
 * - Layers: transparent registered slices from frame-01 (replace with real exports later)
 *
 * Target: ~100–130 KB per encoded image; total hero payload <= ~1.5 MB
 *
 * Usage: node scripts/encode-teardown-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FRAMES_SRC = path.join(ROOT, 'public/assets/frames');
const FRAMES_OUT = FRAMES_SRC;
const LAYERS_OUT = path.join(ROOT, 'public/assets/layers');
const WIDTHS = [760, 1100, 1700];
const CANVAS_W = 1700;
const CANVAS_H = 1120;

/** Mask regions on the normalized 1700×1120 canvas (assembled frame-01). */
const LAYER_REGIONS = [
  { asset: 'layer-01-chassis', left: 560, top: 420, width: 540, height: 480 },
  { asset: 'layer-02-frame', left: 580, top: 360, width: 500, height: 520 },
  { asset: 'layer-03-battery', left: 700, top: 560, width: 220, height: 160 },
  { asset: 'layer-04-board', left: 640, top: 480, width: 300, height: 220 },
  { asset: 'layer-05-display', left: 600, top: 300, width: 380, height: 300 },
  { asset: 'layer-06-glass', left: 590, top: 260, width: 400, height: 120 },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function encodeResponsive(inputPath, outBase, { alpha = false } = {}) {
  let totalBytes = 0;
  for (const w of WIDTHS) {
    const pipeline = sharp(inputPath).resize(w, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    const webpBuf = await pipeline
      .clone()
      .webp({ quality: alpha ? 82 : 78, alphaQuality: 80, effort: 4 })
      .toBuffer();
    const webpPath = `${outBase}-${w}.webp`;
    await fs.writeFile(webpPath, webpBuf);
    totalBytes += webpBuf.length;

    const avifBuf = await pipeline
      .clone()
      .avif({ quality: alpha ? 55 : 50, effort: 4 })
      .toBuffer();
    const avifPath = `${outBase}-${w}.avif`;
    await fs.writeFile(avifPath, avifBuf);
    totalBytes += avifBuf.length;

    console.log(
      `  ${path.basename(webpPath)} ${(webpBuf.length / 1024).toFixed(1)} KB | ` +
        `${path.basename(avifPath)} ${(avifBuf.length / 1024).toFixed(1)} KB`
    );
  }
  return totalBytes;
}

async function generateLayerPngs(sourceFrame) {
  await ensureDir(LAYERS_OUT);
  const src = sharp(sourceFrame).ensureAlpha();
  const meta = await src.metadata();

  for (const region of LAYER_REGIONS) {
    const outPng = path.join(LAYERS_OUT, `${region.asset}.png`);
    const extracted = await sharp(sourceFrame)
      .ensureAlpha()
      .extract({
        left: region.left,
        top: region.top,
        width: region.width,
        height: region.height,
      })
      .toBuffer();

    await sharp({
      create: {
        width: meta.width ?? CANVAS_W,
        height: meta.height ?? CANVAS_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: extracted, left: region.left, top: region.top }])
      .png()
      .toFile(outPng);

    console.log(`layer png ${region.asset}.png`);
  }
}

async function main() {
  await ensureDir(LAYERS_OUT);
  let totalBytes = 0;

  const frame01 = path.join(FRAMES_SRC, 'frame-01.png');
  const frame12 = path.join(FRAMES_SRC, 'frame-12.png');

  console.log('Generating registered layer PNGs from frame-01…');
  await generateLayerPngs(frame01);

  console.log('\nEncoding frame sequence…');
  for (let i = 1; i <= 12; i++) {
    const src = path.join(FRAMES_SRC, `frame-${String(i).padStart(2, '0')}.png`);
    try {
      await fs.access(src);
    } catch {
      console.warn(`skip missing ${src}`);
      continue;
    }
    console.log(`frame-${String(i).padStart(2, '0')}:`);
    totalBytes += await encodeResponsive(src, path.join(FRAMES_OUT, `frame-${String(i).padStart(2, '0')}`));
  }

  console.log('\nEncoding poster (frame-12)…');
  totalBytes += await encodeResponsive(
    frame12,
    path.join(FRAMES_OUT, 'poster')
  );

  console.log('\nEncoding registered layers…');
  for (const region of LAYER_REGIONS) {
    const src = path.join(LAYERS_OUT, `${region.asset}.png`);
    console.log(region.asset);
    totalBytes += await encodeResponsive(src, path.join(LAYERS_OUT, region.asset), {
      alpha: true,
    });
  }

  console.log(
    `\nDone. Encoded payload ≈ ${(totalBytes / 1024 / 1024).toFixed(2)} MB ` +
      `(target ≤ 1.5 MB; AVIF+WebP × 3 widths × 19 assets)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
