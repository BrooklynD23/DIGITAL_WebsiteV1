// CRIT-1: evidence shot — ledger row link jumps to #dg-002; record strip lands under the sticky nav.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root = join(homedir(), '.cache', 'ms-playwright');
const d = readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell-')).sort().reverse()[0];
const exe = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
const b = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3100/design-lab/b', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.click('table[class*="ledger"] a[href="#dg-002"]');
await p.waitForTimeout(1500);
await p.screenshot({ path: 'design-lab/renders/b/crit/d-anchor-dg-002.png', clip: { x: 0, y: 0, width: 1440, height: 260 } });
await b.close();
