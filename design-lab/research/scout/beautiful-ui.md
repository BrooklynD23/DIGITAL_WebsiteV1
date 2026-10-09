# Beautiful UI — SCOUT-1

URL: https://beautifului.dev (verified; also beautiful-ui-five.vercel.app; repo github.com/slev12397/beautiful-ui, MIT, built by Turbo product design studio, "Crafted primitives for AI-native interfaces"). Shots: design-lab/references/beautiful-ui/. Category: copy-paste React component registry for AI product UI (thinking traces, streaming text, approval cards, tool chips, task rows, chat, prompt bar, diff/records/filter tables, flowchart, code block, agent screen). Next.js + Tailwind v4 + TS, shadcn-registry style, light/dark.

## Site (desktop.png)
- Dark neutral (oklch 0.226 cool grey), Inter + JetBrains Mono; left sticky nav with component index; main column = numbered sections `01 Loading State  one-line description` each in a bordered demo card with a segmented variant switcher at the bottom (Drive/Dots/Orbit/Surfer). Diagonal hatched page margins. 3 reduced-motion rules.
- Micro-details: pixel-grid loader with elapsed-time counter, shimmer text, expandable "Thinking" trace with check/spinner states, per-character streaming text.

## Relevance
Not a direct visual fit (AI-product UI is off-brief, "generic AI company" risk) but the presentation grammar is excellent: numbered specimens, one-line caption, variant switcher, hatched margins = lab-spec-sheet look. Also state-machine micro-UIs (queued -> running -> done) could visualise real project status/process honestly.

## Steal as principle
1. Specimen layout: index number + title + one-sentence caption + live demo + variant toggle.
2. Status as motion: small stateful indicators (spinner -> check) communicate process without text.
3. Mono for metadata, sans for content, hairline borders instead of shadows.

## Avoid
1. AI-chat/agent aesthetics (purple/blue AI palette risk, "generic AI company").
2. Dark-only cool-grey sameness: reads as SaaS dashboard.
3. Fake progress/telemetry; only show real data.
