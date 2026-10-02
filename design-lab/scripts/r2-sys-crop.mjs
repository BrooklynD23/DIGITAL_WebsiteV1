// Usage: node design-lab/scripts/r2-sys-crop.mjs <png> <pieceHeightPx> [maxWidth]
// Splits a tall stitched screenshot into readable pieces next to it (<name>-pNN.png).
import sharp from 'sharp';
const [file, h = '1600', maxW] = process.argv.slice(2);
const img = sharp(file);
const { width, height } = await img.metadata();
const step = Number(h);
let i = 0;
for (let y = 0; y < height; y += step, i++) {
  let p = sharp(file).extract({ left: 0, top: y, width, height: Math.min(step, height - y) });
  if (maxW && width > Number(maxW)) p = p.resize({ width: Number(maxW) });
  await p.toFile(file.replace(/\.png$/, `-p${String(i).padStart(2, '0')}.png`));
}
console.log(file, width, height, i, 'pieces');
