// Usage: node design-lab/scripts/r2-type-probe.mjs <stackId> — prints computed family/weight + latin @font-face for the hero.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find((p) => existsSync(p));
const id = process.argv[2] ?? 'redhat';
const b = await chromium.launch({ executablePath: shell }); const p = await b.newPage();
await p.goto('http://localhost:3100/design-lab/r2/type/', { waitUntil: 'networkidle' });
const r = await p.evaluate((id) => {
  const el = document.querySelector(`#${id} [data-world="apple"] p:nth-of-type(2)`);
  const cs = getComputedStyle(el);
  const rules = [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } })
    .filter(r => r.cssText.startsWith('@font-face') && /U\+0000-00FF/.test(r.cssText)).map(r => r.cssText.slice(0, 300));
  return { ff: cs.fontFamily, fw: cs.fontWeight, rules: rules.filter((t) => t.includes(cs.fontFamily.split(',')[0].replace(/['"]/g, ''))) };
}, id);
console.log(JSON.stringify(r, null, 1)); await b.close();
