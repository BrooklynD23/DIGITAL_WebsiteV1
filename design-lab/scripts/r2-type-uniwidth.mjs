// Usage: SHELLP=<headless shell> OUT=<png> node design-lab/scripts/r2-type-uniwidth.mjs — Mozilla Headline at wght 200 vs 700.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.SHELLP });
const p = await b.newPage({ viewport: { width: 900, height: 300 } });
await p.goto('http://localhost:3100/design-lab/r2/type/', { waitUntil: 'networkidle' });
await p.evaluate(async () => {
  const fam = getComputedStyle(document.querySelector('#mozilla')).getPropertyValue('--t-moz-head');
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99999;padding:20px;font-size:48px;color:#000';
  d.innerHTML = [200, 700].map(w => `<div style="font-family:${fam};font-weight:${w}">Uniwidth test ${w}</div>`).join('');
  document.body.appendChild(d);
  await document.fonts.ready; await new Promise(r => setTimeout(r, 500));
});
await p.screenshot({ path: process.env.OUT }); await b.close();
