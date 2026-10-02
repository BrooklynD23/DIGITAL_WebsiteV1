// W2-CRIT-SYSTEM: cross-page montage videos, one per world (load → smooth full scroll, all 4 pages back to back).
// Usage: node design-lab/scripts/r2-crit-system-montage.mjs [--base=http://localhost:3199] [--seconds=16]
// Output: design-lab/renders/r2/crit/system/montage-{signal,apple}.webm (1440×900) + per-page parts in ./video/
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const flag = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? `=${d}`).split('=').slice(1).join('=');
const BASE = flag('base', 'http://localhost:3199');
const SECONDS = Number(flag('seconds', '16'));
const OUT = 'design-lab/renders/r2/crit/system';
const VID = join(OUT, 'video');
mkdirSync(VID, { recursive: true });
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });

for (const world of ['signal', 'apple']) {
  const parts = [];
  for (const p of ['', 'sidekick/', 'shades/', 'brain/']) {
    const name = `${world}-${p ? p.slice(0, -1) : 'home'}`;
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: VID, size: { width: 1440, height: 900 } } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/design-lab/r2/${world}/${p}`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(3500);
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const frames = SECONDS * 10;
    for (let i = 1; i <= frames; i += 1) {
      await page.mouse.wheel(0, H / frames);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1500);
    const v = page.video();
    await ctx.close();
    const file = join(VID, `${name}.webm`);
    renameSync(await v.path(), file);
    parts.push(resolve(file));
    console.log('recorded', name);
  }
  const list = join(VID, `${world}-list.txt`);
  writeFileSync(list, parts.map((f) => `file '${f}'`).join('\n'));
  const out = join(OUT, `montage-${world}.webm`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-vf', 'scale=960:-2,fps=12', '-c:v', 'libvpx-vp9', '-b:v', '900k', '-an', out]);
  console.log('wrote', out);
}
await browser.close();
