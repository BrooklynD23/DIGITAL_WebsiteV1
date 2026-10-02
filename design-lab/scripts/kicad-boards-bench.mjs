// Usage: node design-lab/scripts/kicad-boards-bench.mjs [--swiftshader]
// Adapted from r2-crit-sidekick-stall.mjs: scrubs the explode band on both bench routes (old inline BoardSvg vs
// BoardLayers) in 48 px instant steps, 3 passes (down, up, down), and counts frames > 120 ms and > 50 ms.
// Also reports HTML + RSC bytes for the specimen and both benches.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const base = process.env.LAB_URL ?? 'http://localhost:3100';
const swift = process.argv.includes('--swiftshader');
const root = join(homedir(), '.cache', 'ms-playwright');
const shell = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell')).find(existsSync);

for (const route of ['/design-lab/r2/boards/', '/design-lab/r2/boards/bench-svg/', '/design-lab/r2/boards/bench-layers/']) {
  const html = Buffer.from(await (await fetch(base + route)).arrayBuffer());
  const rsc = Buffer.from(await (await fetch(base + route, { headers: { RSC: '1' } })).arrayBuffer());
  console.log(`${route}  HTML ${(html.length / 1024).toFixed(0)} KB (gzip ${(gzipSync(html).length / 1024).toFixed(0)} KB)  RSC ${(rsc.length / 1024).toFixed(0)} KB`);
}

const browser = await chromium.launch({
  executablePath: shell,
  args: swift ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : [],
});
try {
  for (const route of ['/design-lab/r2/boards/bench-svg/', '/design-lab/r2/boards/bench-layers/']) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const steps = [...Array(Math.ceil(H / 48) + 1).keys()].map((i) => i * 48);
    const all = [];
    for (const pass of [1, 2, 3]) {
      const ys = pass === 2 ? [...steps].reverse() : steps;
      const slow = [];
      let over50 = 0;
      for (const y of ys) {
        const ms = await p.evaluate(async (t) => {
          const s = performance.now();
          scrollTo({ top: t, behavior: 'instant' });
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          return performance.now() - s;
        }, y);
        all.push(ms);
        if (ms > 50) over50 += 1;
        if (ms > 120) slow.push([y, Math.round(ms)]);
      }
      console.log(`${route} pass ${pass}${pass === 2 ? ' (up)' : ''}: ${slow.length} frames >120ms, ${over50} >50ms ${slow.length ? JSON.stringify(slow.slice(0, 6)) : ''}`);
    }
    all.sort((a, b) => a - b);
    console.log(`${route} steps ${all.length}, median ${all[all.length >> 1].toFixed(1)} ms, p95 ${all[Math.floor(all.length * 0.95)].toFixed(1)} ms, max ${all[all.length - 1].toFixed(0)} ms, console errors ${errors.length}`);
    await p.close();
  }
} finally {
  await browser.close();
}
console.log(swift ? '(SwiftShader GL: pessimistic)' : '(default headless flags)');
