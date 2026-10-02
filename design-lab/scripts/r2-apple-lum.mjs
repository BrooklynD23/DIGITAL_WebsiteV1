// mean luminance of the 8 captured screenshots per page/viewport -> light/dark rhythm
import sharp from 'sharp';
const pages = ['iphone-18-pro','iphone-air','macbook-pro','airpods-pro','apple-vision-pro','apple-watch-series-12','environment','privacy'];
for (const m of ['desktop','mobile']) for (const p of pages) {
  let s = '';
  for (let i = 0; i < 8; i++) { const st = await sharp(`design-lab/round2/references/apple/${p}/${m}-${i}.jpg`).greyscale().stats(); const v = st.channels[0].mean; s += (v < 90 ? 'D' : v < 170 ? 'M' : 'L') + Math.round(v) + ' '; }
  console.log(m.padEnd(8), p.padEnd(22), s);
}
