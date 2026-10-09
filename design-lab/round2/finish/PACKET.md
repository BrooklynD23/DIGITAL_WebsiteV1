# Finish-review input packet (round 2, code-led)

**Original request (Head Designer, 2026-10-02):**
- "Use the impeccable skill to develop a plan for a more engaging, less wordy page for the mockup, with interactive/smooth motion, custom icons, etc."
- "Look at Google's UI/frontend approaches, but our club mainly focuses on Apple's design aesthetic, so mirror and follow their playbook."
- "Currently the frontend for every project has its own spin, so do something similar but improve on it."
- For BRAIN: "We can base the design off these icons but larger, as if the audience is seeing a live system, then use smooth scroll transitions (GSAP?) to carry how we are building agentic tools/infrastructure. Also design similar concepts to showcase agentic tooling (MCP, context engineering, harness, etc.); find a creative way to visualize those as storytelling."
- The team liked only round 1's concept C 4-stage dot-orb strip and concept E's exploded isometric phone scroll story.

**Confirmed answers:**
- Surfaces: Home + project pages (SIDEKICK, SHADES, BRAIN).
- Audiences: prospective members and sponsors, weighted equally.
- Knowledgebase facts are allowed, tagged [confirm], with no personal names.
- Build: code-first.
- Two worlds, built side by side: "Signal Capture" (roll, seed 0a795440) and "Apple product page, played straight" (canon).
- BRAIN: 6 chapters; concept story only, claiming no curriculum.
- Fonts: chosen from a SaaS/FAANG study (OFL, self-hosted).
- Cinematics: made in code (Remotion), with no Higgsfield.

**Product truth:** `PRODUCT.md` (worktree root).

**Plan:** `design-lab/round2/PLAN.md`.

**Direction contracts** (one per page × world): `.impeccable/surfaces/app-design-lab-r2-<world>-<page>-page-tsx.md` (Home: `app-design-lab-r2-<world>-page-tsx.md`). Each ends with a "## W3b changes" log.

**Artifacts:**
- Pages: `app/design-lab/r2/<world>/<page>/`
- Shared code: `app/design-lab/r2/{_system,_chrome,_content,_home,_sidekick,_shades,_brain}/`

**Screenshots** (required; full-page plus per-viewport steps at 1440×900 and 390×844, both worlds):
- `design-lab/renders/r2/<page>/v2/*.png`
- `design-lab/renders/r2/<page>/v2/steps/*.png`
- Orchestrator gate shots: `design-lab/renders/r2/gate3/<world>-<page>-{desktop,tablet,mobile}.png` (Home has no page suffix).

**Measured gates (orchestrator, after W3b):**
- 0 console errors on all 8 routes.
- `tsc` and lint clean.
- 0 rAF at rest.
- Words per viewport are in each page's W3b log.

**Detector:** `impeccable detect` returned `[]` on every page directory in W3b.

**QUALITY BAR / comp:** none. The build is code-led, and the canon world has no catalog card. For Signal Capture, the assigned direction's raises are in the contract.

**Craft floor:** `/home/danny/.claude/skills/impeccable/reference/craft-floor.md`.

**Prior critiques** (context, not authority): `design-lab/round2/critiques/<page>.md`, `design-lab/round2/critiques/system.md`.
