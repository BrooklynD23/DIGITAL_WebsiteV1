// One-off check: review page loads, has links, and a prototype link navigates.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const b = await chromium.launch({ executablePath: shell });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:3100/design-lab/r2/review.html', { waitUntil: 'networkidle' });
console.log('title:', await p.title(), '| links to lab:', await p.locator('a[href^="/design-lab/"]').count(), '| errors:', errs.length);
await p.locator('a[href="/design-lab/r2/signal/sidekick/"]').first().click();
await p.waitForLoadState('domcontentloaded');
console.log('navigated to:', p.url());
await b.close();
