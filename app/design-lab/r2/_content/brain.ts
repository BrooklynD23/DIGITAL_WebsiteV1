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
  lead: 'BRAIN builds software with agentic tools. Here is how those systems work.',
  /** Real loop verbs the hero trace walks through (Agent SDK loop, S5). */
  trace: ['evaluate', 'tool_call', 'result', 'evaluate', 'done'] as const,
  key: 'A dot is not a token. Every count is illustrative.',
  replay: 'Run again',
} as const;

export type ChapterId = 'loop' | 'tools' | 'mcp' | 'context' | 'engineering' | 'harness' | 'subagents' | 'evals';

/** faithful = the picture mirrors the documented mechanism; the `illustrative` note names any metaphor inside it. */
export type Fidelity = 'faithful' | 'metaphor';

export interface Chapter {
  readonly id: ChapterId;
  readonly n: number;
  /** Concept name (highlights strip, readouts, sub-nav). */
  readonly name: string;
  /** ≤ 8 words. */
  readonly headline: string;
  /** One line, 9–19 words. */
  readonly caption: string;
  /** Highlights-strip card line (Apple world), 9–14 words. */
  readonly card: string;
  readonly fidelity: Fidelity;
  /** Which part is a picture, not the mechanism. Rendered as the "Illustrative" note. */
  readonly illustrative?: string;
  readonly glyph: GlyphName;
  /** Static sequence for reduced motion and no-JS (same story the motion tells). */
  readonly steps: readonly string[];
  /** Source keys (see `sources`). */
  readonly src: readonly SourceId[];
}

export const chapters: readonly Chapter[] = [
  {
    id: 'loop',
    n: 1,
    name: 'Agent loop',
    headline: 'Think. Act. Check. Repeat.',
    caption: 'Each turn calls a tool or answers. No tool call ends the loop.',
    card: 'Tool calls, turn after turn, until it can answer.',
    fidelity: 'faithful',
    illustrative: 'the example task.',
    glyph: 'loop',
    steps: [
      'The model reads the prompt, the tools and the history.',
      'It requests a tool call; the result comes back. That is one turn.',
      'When a reply has no tool call, the loop halts with the answer.',
      'A turn limit can stop it first: error_max_turns.',
    ],
    src: ['S5'],
  },
  {
    id: 'tools',
    n: 2,
    name: 'Tool use',
    headline: 'The model asks. The harness acts.',
    caption: 'A tool call is only a request. The application runs it.',
    card: 'The model asks. Something else runs it.',
    fidelity: 'faithful',
    glyph: 'tool',
    steps: [
      'The model emits a call: a tool name plus arguments.',
      'The host application runs the tool, not the model.',
      'The result returns in a new shape and joins the context.',
    ],
    src: ['S1', 'S5'],
  },
  {
    id: 'mcp',
    n: 3,
    name: 'MCP',
    headline: 'One protocol. Any server plugs in.',
    caption: 'One client per server: local over stdio, remote over HTTP.',
    card: 'One port per server. One protocol for all.',
    fidelity: 'faithful',
    illustrative: 'the tool belt and the example servers.',
    glyph: 'mcp-port',
    steps: [
      'The host opens one client, one port, for each server.',
      'A local server connects over stdio on the same machine.',
      'A remote server connects over Streamable HTTP.',
      'Discovery lists each server’s tools, resources and prompts.',
    ],
    src: ['S1', 'S2'],
  },
  {
    id: 'context',
    n: 4,
    name: 'Context window',
    headline: 'Everything it knows fits in here.',
    caption: 'Prompt, tools, history and results share one fixed window.',
    card: 'One fixed window. Every turn adds to it.',
    fidelity: 'faithful',
    illustrative: 'slot counts, and dimming as context rot.',
    glyph: 'context',
    steps: [
      'The top rows are pinned: system prompt and tool definitions.',
      'Each turn adds a message, a reply and tool results.',
      'Six turns later the window is 95% full.',
      'Recall gets worse as it fills (context rot).',
    ],
    src: ['S3', 'S5'],
  },
  {
    id: 'engineering',
    n: 5,
    name: 'Context engineering',
    headline: 'Choose what enters. Compress what stays.',
    caption: 'The window is full. A document waits. Choose what gives.',
    card: 'Evict, compact, or load on demand.',
    fidelity: 'faithful',
    illustrative: 'slot counts and percentages.',
    glyph: 'compact',
    steps: [
      'Evict oldest: old turns leave and their detail is lost.',
      'Compact: history becomes one summary; the pinned rows stay.',
      'Load on demand: only a pointer enters until it is needed.',
      'Notes kept outside the window can be read back later.',
    ],
    src: ['S3', 'S5'],
  },
  {
    id: 'harness',
    n: 6,
    name: 'Harness',
    headline: 'The harness decides what runs.',
    caption: 'Hooks and modes sit outside the model. Denials return as results.',
    card: 'Gates and limits around the model.',
    fidelity: 'faithful',
    glyph: 'harness-gate',
    steps: [
      'Every tool call passes a gate before it runs.',
      'Default mode asks: an Edit waits for approval.',
      'Approved, it runs. Denied, the refusal returns as the result.',
      'Turn and budget limits close the loop. Notes carry a long task into the next session.',
    ],
    src: ['S5', 'S6', 'S7'],
  },
  {
    id: 'subagents',
    n: 7,
    name: 'Subagents',
    headline: 'Split the work. Start clean.',
    caption: 'Each helper works in a fresh window and returns a summary.',
    card: 'Clean windows. Summaries back, not transcripts.',
    fidelity: 'faithful',
    illustrative: 'meter values.',
    glyph: 'subagent',
    steps: [
      'The parent buds three subagents, each with an empty window.',
      'Each works its part, then compresses it to a summary.',
      'Only the three summaries return to the parent.',
    ],
    src: ['S3', 'S4'],
  },
  {
    id: 'evals',
    n: 8,
    name: 'Evals',
    headline: 'Passed once. Now pass every time.',
    caption: 'pass@k: one success in k trials. pass^k: all k succeed.',
    card: 'One trial passed. How often does it hold?',
    fidelity: 'faithful',
    illustrative: 'p = 0.7, independent trials.',
    glyph: 'eval',
    steps: [
      'Each trial scrambles the task and checks the end state.',
      'pass@k = 1 − (1 − p)^k rises with more trials.',
      'pass^k = p^k falls: every trial must pass.',
    ],
    src: ['S8', 'S9'],
  },
];

export const chapterById = (id: ChapterId): Chapter => chapters.find((c) => c.id === id) as Chapter;

/* ---------- interaction vocab (labels shown on controls and readouts) ---------- */

/** Ch1: the example task needs 3 tool calls + 1 final answer = 4 turns (illustrative). */
export const LOOP = { needed: 4, min: 1, max: 6, initial: 6 } as const;

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

export const MODES = [
  { id: 'default', label: 'default', means: 'Asks before an edit' },
  { id: 'acceptEdits', label: 'acceptEdits', means: 'Edits run without asking' },
  { id: 'plan', label: 'plan', means: 'Read-only: edits are blocked' },
] as const;
export type ModeId = (typeof MODES)[number]['id'];

export const EVALS = { p: 0.7, kMin: 1, kMax: 10, kInitial: 5 } as const;

/* ---------- close: BRAIN itself (Notion, all [confirm]) ---------- */

export const close = {
  headline: 'BRAIN builds with these tools.',
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
    when: 'Thursdays 6:00 PM',
    where: 'Building 17, Room 1635',
    cta: 'Join build night',
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
