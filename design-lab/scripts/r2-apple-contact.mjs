import sharp from 'sharp';
const pages = ['iphone-18-pro','iphone-air','macbook-pro','airpods-pro','apple-vision-pro','apple-watch-series-12','environment','privacy'];
for (const m of ['desktop','mobile']) for (const p of pages) {
  const w = m === 'desktop' ? 480 : 195, h = m === 'desktop' ? 300 : 422, cols = m === 'desktop' ? 4 : 8, rows = 8 / cols;
  const comps = [];
  for (let i = 0; i < 8; i++) comps.push({ input: await sharp(`design-lab/round2/references/apple/${p}/${m}-${i}.jpg`).resize(w, h).toBuffer(), left: (i % cols) * w, top: Math.floor(i / cols) * h });
  await sharp({ create: { width: w * cols, height: h * rows, channels: 3, background: '#888' } }).composite(comps).jpeg({ quality: 80 }).toFile(`design-lab/round2/references/apple/${p}/contact-${m}.jpg`);
}
