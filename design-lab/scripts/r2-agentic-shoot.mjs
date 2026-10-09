// Usage: node design-lab/scripts/r2-agentic-shoot.mjs [onlyName]
// Captures external reference pages for the BRAIN agentic-storytelling research.
// Each target: viewport shot at top, then one shot per `find` text (scrolled into view, centered).
// Output: design-lab/round2/references/agentic/<name>-<n>.png
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const OUT = 'design-lab/round2/references/agentic';
const TARGETS = [
  { name: 'mcp-architecture', url: 'https://modelcontextprotocol.io/docs/learn/architecture', find: ['Dedicated', 'Data layer', 'acts as an MCP host@330'] },
  { name: 'anthropic-effective-agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', find: ['The augmented LLM', 'The orchestrator-workers workflow@-520', 'The evaluator-optimizer workflow@-520', 'Autonomous agent@-560'] },
  { name: 'anthropic-context-eng', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', find: ['Context engineering vs. prompt engineering', 'Goldilocks', 'Compaction', 'Why context engineering is important@-560'] },
  { name: 'claude-agent-loop', url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop', find: ['The loop at a glance'] },
  { name: 'ciechanowski-watch', url: 'https://ciechanow.ski/mechanical-watch/', find: ['mainspring'] },
  { name: 'ciechanowski-gps', url: 'https://ciechanow.ski/gps/', find: ['trilateration'] },
  { name: 'distill-attention', url: 'https://distill.pub/2016/augmented-rnns/', find: ['Attentional Interfaces', 'Neural Turing Machines', 'Memory is an array of vectors@-60'] },
  { name: 'transformer-explainer', url: 'https://poloclub.github.io/transformer-explainer/', find: [] },
  { name: 'vercel-ai-sdk', url: 'https://ai-sdk.dev/', find: [] },
  { name: 'langgraph', url: 'https://www.langchain.com/langgraph', find: [] },
  { name: 'linear-agents', url: 'https://linear.app/agents', find: [] },
  { name: 'cursor', url: 'https://cursor.com/', find: [] },
  { name: 'stripe-home', url: 'https://stripe.com/', find: [] },
];

function findHeadlessShell() {
  const root = join(homedir(), '.cache', 'ms-playwright');
  const dirs = readdirSync(root).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    const p = join(root, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(p)) return p;
  }
  return undefined;
}

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: findHeadlessShell(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  for (const t of TARGETS.filter((x) => !only || x.name === only)) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: join(OUT, `${t.name}-0.png`) });
      let n = 1;
      for (const text of t.find) {
        // "text@N" scrolls N px further after aligning the text to the top (to frame a figure below it).
        const [needle, off = '0'] = text.split('@');
        const loc = page.getByText(needle, { exact: false }).first();
        if ((await loc.count()) === 0) { console.log(`  miss "${text}" on ${t.name}`); continue; }
        await loc.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
        if (Number(off)) await page.evaluate((dy) => window.scrollBy({ top: dy, behavior: 'instant' }), Number(off));
        await page.waitForTimeout(1800);
        await page.screenshot({ path: join(OUT, `${t.name}-${n}.png`) });
        n += 1;
      }
      console.log(`ok ${t.name} (${n} shots)`);
    } catch (e) {
      console.log(`FAIL ${t.name}: ${e.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
