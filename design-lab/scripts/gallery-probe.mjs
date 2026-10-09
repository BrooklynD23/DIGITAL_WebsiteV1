// Usage: node design-lab/scripts/gallery-probe.mjs [a b c ...]
// Lists landmark-ish elements (header/nav/section/article/footer/[id]) with their document-y boxes at 1440,
// so the component-comparison crops can be cut at measured y-ranges instead of guesses.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}
const base = process.env.LAB_URL ?? 'http://localhost:3100';
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ['a', 'b', 'c', 'd', 'e', 'f'];
const browser = await chromium.launch({ executablePath: findHeadlessShell(), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const s of slugs) {
  await page.goto(`${base}/design-lab/${s}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const rows = await page.evaluate(() => {
    const out = [];
    const sel = 'header, nav, section, article, footer, h1, h2, [id]';
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (r.height < 8 || r.width < 200) continue;
      const depth = (() => { let d = 0; let n = el; while (n && n !== document.body) { d += 1; n = n.parentElement; } return d; })();
      if (depth > 9) continue;
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      out.push(`${String(Math.round(r.top + scrollY)).padStart(6)} h${String(Math.round(r.height)).padEnd(5)} ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0].slice(0, 28) : ''} d${depth} | ${txt}`);
    }
    return { rows: out, H: document.documentElement.scrollHeight };
  });
  console.log(`===== ${s} docHeight=${rows.H}`);
  console.log(rows.rows.join('\n'));
}
await browser.close();
