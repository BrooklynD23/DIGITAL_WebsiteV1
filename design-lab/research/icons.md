# Icons — W1-SYSTEMS

**Verdict:** use one family per direction, never mixed: A Phosphor Light · B Tabler 1.5 · C Lucide 1.5 · D Phosphor Regular · E Lucide 1.5 · F Pixelarticons. Aria Icons is the retrieval and migration tool, not a family.

- Sheet: `design-lab/renders/icons/icon-sheet.png` (+ `.html`, `icon-mapping.txt`). It shows 16 DIGITAL concepts (cpu, circuit-board, git-branch, users, calendar, map-pin, arrow-up-right, github, layers, wrench, box, glasses, battery-charging, ruler, file-text, message) × 5 families at 32px, at 20px, at 32px with stroke forced to 1.5, and at 20px on ink.
- SVGs were fetched on 2026-10-02 through the **Aria Icons** API (`icons.leularia.com/api/v1`: `/equivalent` for Lucide→set mapping, `/icon` for SVG).

## Aria Icons: verified
- What it is: a search, fetch and migrate layer over about 265 collections (Iconify sources plus brand sets). It has a website, a REST API, a CLI (`npx aria-icons search|get|add|migrate|doctor|suggest`) and MCP (`https://icons.leularia.com/api/mcp`). It is **not an icon style**.
- Useful for DIGITAL: `add` writes the chosen SVGs into the repo as source (no package), and `doctor`/`migrate` can enforce the one-family rule (§8).
- **Coverage gap found:** `/equivalent` returned 404 for 18 of 64 Lucide→other mappings (e.g. circuit-board → any set, message-square → any set, layers → ph/iconoir). It also mismapped `layers → tabler:layers-off` and `box → ph:bounding-box`. 20 ids were set by hand (logged in `icon-mapping.txt`). Treat its mappings as suggestions to review.
- Not installed as a CLI or MCP. Nothing in this repo depends on it.

## Comparison (from the sheet)

| Family | Pkg / license | Stroke model | Corners · terminals | Optical size | Weight on page | Friendly ↔ technical | Notes |
|---|---|---|---|---|---|---|---|
| **Lucide** | `lucide-react` 1.17, ISC, **installed** | 2px stroke on a 24 grid, adjustable; `absoluteStrokeWidth` | Round caps and joins, ~2px rect radius | Cleanest at 20px | Medium. At 1.5 it matches hairline UI | Neutral-middle | Has circuit-board, glasses, battery; the most generic look |
| **Tabler** | `@tabler/icons-react` 3.48, MIT, installed by W1-TOOLING | 2px stroke, adjustable | Round, slightly more geometric | Busier at 20px (calendar "1", message lines) | Medium-heavy | Technical | **Has an electrical-schematic set** (`circuit-resistor`, `-capacitor`, `-diode`, `-ground`, `-switch-open`, all verified). ~6k icons |
| **Phosphor** | `@phosphor-icons/react` 2.1.10, MIT, installed by W1-TOOLING | **Filled outlines, so stroke can't be changed.** Weight comes from 6 cuts: thin/light/regular/bold/fill/duotone | Round, soft, rounder people glyphs | Holds well at 20px | Chosen per cut | Friendliest | The only family that spans hairline-editorial to warm-bold within one geometry |
| Carbon (IBM) | `@carbon/icons-react` 11.89, Apache-2.0, **not installed** | Filled outlines on a 32 grid | Squarer, precise | Crisp at 16/20 | Light | Most technical | Pairs with the Plex stack. Gaps and odd matches (wrench → build-tool, box → archive); GitHub mark is filled, so it is inconsistent next to line icons |
| Iconoir | `iconoir-react` 7.12, MIT, not installed | 1.5px stroke by default | Round, airy | Fine at 20px | Light | Friendly-neutral | Smallest set (~1.7k). No circuit-board or layers, so gaps showed in the sheet |

## One recommendation per direction

| Direction | Family | Setting | Why |
|---|---|---|---|
| **A Editorial / Studio** | Phosphor **Light** | 20–24px, ink only, ≤1 icon per block (arrows, external-link) | The hairline weight sits beside a high-contrast serif. Icons stay punctuation, not decoration |
| **B Engineering / System** | **Tabler** outline | `stroke={1.5}`, 20px on the 4px grid | The most technical installed set, and its circuit-symbol glyphs can label subsystems on schematics. Alternative if the Plex stack wins: Carbon (needs `@carbon/icons-react`) |
| **C Creative Technology** | **Lucide** | `strokeWidth={1.5}` + `absoluteStrokeWidth` | Icons recede so the procedural or WebGL identity leads. `absoluteStrokeWidth` keeps lines even when icons scale in motion |
| **D Human / Community** | Phosphor **Regular** (+ Duotone for at most 3 spot illustrations) | 24px | Friendliest geometry, people glyphs read warm, and weight can step up to Bold for CTAs without changing family |
| **E Startup / Product Studio** | **Lucide** | `strokeWidth={1.5}`, 16/20px | Product-grade and neutral, already a dependency (zero cost), so it doesn't compete with Cabinet Grotesk |
| **F Radical** | **Pixelarticons** (MIT, `pixelarticons` 2.4.1, available in Aria) | Integer multiples of 24px only (pixel-snapped) | Matches the Departure Mono pixel grid from the type lab. Needs a dep or `aria-icons add` |

**Rules for any direction:** use one family and one stroke value per site. Brand marks (GitHub, LinkedIn) come from a brand set in mono, sized to the icon's optical box. No icon-in-circle "feature" chips (§39). Every icon-only control gets an `aria-label` and a 44px hit area.
