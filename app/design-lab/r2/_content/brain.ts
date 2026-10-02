/**
 * Round-2 BRAIN content, shared by both worlds (Signal Capture + Apple page).
 *
 * BRAIN is a CONCEPT STORY: the chapters explain how agentic systems work. They never claim that DIGITAL
 * teaches, has built or runs MCP / harness infrastructure, and there is no curriculum (Notion has none).
 * Mechanism facts: design-lab/round2/research/agentic-storytelling.md §1 (sources S1–S9 below).
 * BRAIN facts: design-lab/round2/research/notion-directives.md (Notion, unverified) → every one is `confirm`.
 * Copy is draft: it still needs the brand-voice-strategist → brand-guardian pass before production.
 */
import type { GlyphName } from '../_system';


/** MCP spec revision the MCP chapter describes. Re-check before launch (research §8 risk 1). */
export const MCP_SPEC = '2026-07-28';

export const brain = {
  name: 'BRAIN',
  expansion: 'Building Remarkable AI Innovation and kNowledge',
  channel: 'CH3',
  kind: 'Agentic-AI initiative',
  /** Notion status property is "Planned"; the public label waits for the Head Designer. */
  status: 'Planned',
} as const;

export const hero = {
  headline: 'A model predicts. A system gets work done.',
  lead: 'BRAIN builds software with agentic tools. Here is how they work.',
  /** Real loop verbs the hero trace walks through (Agent SDK loop, S5). */
  trace: ['evaluate', 'tool_call', 'result', 'evaluate', 'done'] as const,
  /** Stage-corner key (visible, short). */
  key: '1 dot ≠ 1 token · illustrative',
  replay: 'Run again',
} as const;

export type ChapterId = 'loop' | 'tools' | 'mcp' | 'context' | 'harness' | 'evals';

export interface Chapter {
  readonly id: ChapterId;
  readonly n: number;
  /** Concept name (highlights strip, readouts, sub-nav). */
  readonly name: string;
  /** ≤ 5 words. */
  readonly headline: string;
  /** One line, ≤ 12 words. Enters with the control. */
  readonly caption: string;
  /** Highlights-strip card line (Apple world). */
  readonly card: string;
  /** Short stage tag where the picture is a metaphor ("illustrative · …"). Omit when the picture is the mechanism. */
  readonly illus?: string;
  readonly glyph: GlyphName;
  /** "How it works" disclosure: the full sequence plus the detail the chapter cut (open under reduced motion / no-JS). */
  readonly how: readonly string[];
  /** Source keys (see `sources`). */
  readonly src: readonly SourceId[];
}

export const chapters: readonly Chapter[] = [
  {
    id: 'loop',
    n: 1,
    name: 'Agent loop',
    headline: 'Think. Act. Check. Repeat.',
    caption: 'A reply with no tool call ends the loop.',
    card: 'Tool calls, turn after turn, until it can answer.',
    glyph: 'loop',
    how: [
      'The model reads the prompt, the tool definitions and the history.',
      'It requests a tool call and the result comes back. That round trip is one turn.',
      'A reply with no tool call ends the loop with the answer.',
      'A limit can stop it first: max turns counts tool-use turns only (error_max_turns); a budget cap works the same way.',
      'The example task, three tool calls then an answer, is illustrative.',
    ],
    src: ['S5'],
  },
  {
    id: 'tools',
    n: 2,
    name: 'Tool use',
    headline: 'The model only asks.',
    caption: 'The harness runs the tool and hands back the result.',
    card: 'The model asks. Something else runs it.',
    illus: 'shapes',
    glyph: 'tool',
    how: [
      'A tool call is a request: a tool name plus arguments that match its schema.',
      'The host application runs the tool, not the model.',
      'Read-only tools can run in parallel; tools that change state (Edit, Write, Bash) run one at a time.',
      'A denied call still returns: the refusal is the tool result.',
      'The result shapes (a row, a block, a pass/fail pair) are illustrative.',
    ],
    src: ['S1', 'S5'],
  },
  {
    id: 'mcp',
    n: 3,
    name: 'MCP',
    headline: 'One protocol. Any server.',
    caption: 'One client per server: stdio here, Streamable HTTP for remote.',
    card: 'One port per server. One protocol for all.',
    illus: 'belt',
    glyph: 'mcp-port',
    how: [
      'The host opens one client, one port, for each server.',
      'A local server talks over stdio on the same machine; a remote one over Streamable HTTP.',
      'server/discover reports what a server supports; tools/list, resources/list and prompts/list name its primitives.',
      'Servers offer tools (actions), resources (context data) and prompts (templates).',
      'notifications/tools/list_changed is opt-in through subscriptions/listen and best-effort. It fires when a connected server changes its own tools, not on connect, so the demo does not show it.',
      `Spec ${MCP_SPEC}: sampling and logging are deprecated. The belt and the three servers are illustrative.`,
    ],
    src: ['S1', 'S2'],
  },
  {
    id: 'context',
    n: 4,
    name: 'Context',
    headline: 'One window. Choose what stays.',
    caption: 'Every turn adds to it. When it fills, something gives.',
    card: 'One fixed window. Evict, compact or load on demand.',
    illus: 'slots',
    glyph: 'context',
    how: [
      'The window is what the model sees on this turn: system prompt, tool definitions, history and tool results.',
      'The top rows are pinned; a stable prefix can be prompt-cached. Nothing resets between turns.',
      'Recall degrades as the window fills (context rot). The dimming is a picture of that, not attention math.',
      'Evict oldest drops old turns and their detail. Compact summarises history and keeps the pinned rows.',
      'Load on demand keeps a pointer and fetches the file only when needed. Notes kept outside the window can be read back later.',
      'Slot counts and percentages are illustrative.',
    ],
    src: ['S3', 'S5'],
  },
  {
    id: 'harness',
    n: 5,
    name: 'Harness',
    headline: 'The harness decides what runs.',
    caption: 'Edits wait at the gate. A denial returns as the result.',
    card: 'Gates, limits and helpers around the model.',
    illus: 'arcs',
    glyph: 'harness-gate',
    how: [
      'Every tool call passes the harness before it runs. Hooks (PreToolUse, PostToolUse, Stop, PreCompact, SubagentStart/Stop) run outside the window and can block a call.',
      'Permission modes: default asks before an edit; acceptEdits runs edits without asking; plan proposes and does not edit; dontAsk, auto (a classifier) and bypassPermissions (isolated environments only).',
      'Turn and budget limits close the loop. The two arcs are illustrative.',
      'Notes kept outside the window carry a long task into the next session.',
      'Subagents start in a clean window (no parent history) and return a short summary, so the parent stays lean. Meter values are illustrative.',
    ],
    src: ['S5', 'S6', 'S7'],
  },
  {
    id: 'evals',
    n: 6,
    name: 'Evals',
    headline: 'Passed once. Pass every time.',
    caption: 'pass@k: at least one of k passes. pass^k: all k pass.',
    card: 'One trial passed. How often does it hold?',
    illus: 'scramble',
    glyph: 'eval',
    how: [
      'Each trial runs the task; a grader (code, a model or a human) checks the end state, not the reply text.',
      'pass@k = 1 − (1 − p)^k rises with more trials. pass^k = p^k falls: every trial must pass.',
      'The scramble that clicks back is an illustrative picture of one trial. p = 0.7 is illustrative, and the formulas assume independent trials.',
      'Capability suites start low; regression suites sit near 100%.',
    ],
    src: ['S8', 'S9'],
  },
];

/** Harness coda: plays once after the gate (the old subagents chapter, cut to one beat). */
export const coda = {
  label: 'Helpers start clean. Summaries come back.',
  illus: 'illustrative',
} as const;

export const chapterById = (id: ChapterId): Chapter => chapters.find((c) => c.id === id) as Chapter;

/* ---------- interaction vocab (labels shown on controls and readouts) ---------- */

/** Ch1: the example task needs 3 tool calls, then the answer (illustrative). Max turns counts tool-use turns only. */
export const LOOP = { toolCalls: 3, min: 1, max: 5, initial: 5 } as const;

export const TOOLS = [
  { id: 'search', label: 'search', shape: 'a wide row of hits' },
  { id: 'read', label: 'read file', shape: 'a tall block of lines' },
  { id: 'tests', label: 'run tests', shape: 'a pass / fail pair' },
] as const;
export type ToolId = (typeof TOOLS)[number]['id'];

export const SERVERS = [
  { id: 'files', label: 'Files', transport: 'local', wire: 'stdio', prims: { tools: 2, resources: 1, prompts: 0 } },
  { id: 'database', label: 'Database', transport: 'local', wire: 'stdio', prims: { tools: 1, resources: 2, prompts: 0 } },
  { id: 'tracker', label: 'Issue tracker', transport: 'remote', wire: 'Streamable HTTP', prims: { tools: 2, resources: 0, prompts: 1 } },
] as const;
export type ServerId = (typeof SERVERS)[number]['id'];

export const PRIMITIVES = [
  { id: 'tools', label: 'tools', shape: 'square' },
  { id: 'resources', label: 'resources', shape: 'stack' },
  { id: 'prompts', label: 'prompts', shape: 'triangle' },
] as const;

export const STRATEGIES = [
  { id: 'evict', label: 'Evict oldest', result: 'Turn 1 is gone, detail lost.' },
  { id: 'compact', label: 'Compact', result: 'History summarised, pinned rows kept.' },
  { id: 'demand', label: 'Load on demand', result: 'Only a pointer entered.' },
] as const;
export type StrategyId = (typeof STRATEGIES)[number]['id'];


export const EVALS = { p: 0.7, kMin: 1, kMax: 10, kInitial: 5 } as const;

/* ---------- close: BRAIN itself (Notion, all [confirm]) ---------- */

export const close = {
  thesis: 'AI should amplify human thinking, not replace developing it. Idea first, tool second.',
  method: ['Predict', 'Build', 'Measure', 'Revise', 'Record'] as const,
  methodLine: 'Failures get written down.',
  questions: ['Can it be built?', 'Does it work?', 'Should it exist?'] as const,
  does: [
    'Builds real software with agentic tools.',
    'Competes in hackathons.',
    'Open to every engineering major. Skeptics welcome.',
  ] as const,
  join: {
    headline: 'Come build on Thursday.',
  },
} as const;

/* ---------- sources (footnote) ---------- */

export type SourceId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8' | 'S9';

export const sources: ReadonlyArray<{ readonly id: SourceId; readonly title: string; readonly href: string }> = [
  { id: 'S1', title: `Model Context Protocol, architecture (spec ${MCP_SPEC})`, href: 'https://modelcontextprotocol.io/docs/learn/architecture' },
  { id: 'S2', title: 'Anthropic, Introducing the Model Context Protocol (2024-11-25)', href: 'https://www.anthropic.com/news/model-context-protocol' },
  { id: 'S3', title: 'Anthropic, Effective context engineering for AI agents', href: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
  { id: 'S4', title: 'Anthropic, Building effective agents', href: 'https://www.anthropic.com/engineering/building-effective-agents' },
  { id: 'S5', title: 'Claude Agent SDK, how the agent loop works', href: 'https://code.claude.com/docs/en/agent-sdk/agent-loop' },
  { id: 'S6', title: 'Claude Agent SDK, overview', href: 'https://code.claude.com/docs/en/agent-sdk/overview' },
  { id: 'S7', title: 'Anthropic, Effective harnesses for long-running agents', href: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents' },
  { id: 'S8', title: 'Building agents with the Claude Agent SDK', href: 'https://claude.com/blog/building-agents-with-the-claude-agent-sdk' },
  { id: 'S9', title: 'Anthropic, Demystifying evals for AI agents (2026-01-09)', href: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents' },
];

export const footnote = {
  summary: 'Sources and spec version',
  note: `Mechanisms follow the sources below; MCP as of spec ${MCP_SPEC}. Dot pictures are illustrative. BRAIN facts come from the club’s planning notes and await confirmation.`,
} as const;
