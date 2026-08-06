# 03 — Design Directions

All three directions keep `/`, `/projects/modular-smartphone`, and `/projects/smart-reading`
untouched, and all three inherit the landing's palette, type stacks, radii, and hairline
language. They differ in **how a secondary page is composed** — background behaviour, surface
model, header treatment, and motion character.

## Direction A — Interface System

**Thesis.** Secondary pages are modules of one instrument. The page is a registered grid; every
block declares what it is with a mono label and a glyph chip.

| Aspect | Behaviour |
|---|---|
| Typography | Mono labels do structural work — every module carries an eyebrow + index (`01 / CHANNELS`). Newsreader reserved for the page's single promise line |
| Background | Flat parchment. No persistent layer. Depth only from full-bleed `#0A0C0A` inversion |
| Surfaces | Flat `#FCFBF8` panels, hairline `rgba(17,19,17,.15)` → `.35` on hover, square-ish radii (2/4/8) |
| Motion | Precise and short — rise 18px + fade, ~110ms stagger. No parallax |
| Page header | Compact: eyebrow → serif promise → mono metadata row (route index, term, status) |
| Navigation | Landing's thin mono bar, extended with `aria-current` and a mobile sheet |
| Content modules | Bordered panels on a shared column grid; ✳ dividers between bands |
| Mobile | Panels stack; index labels stay; nothing hidden |
| Cursor | `+` crosshair point, hairline ring, mono label on labelled targets |
| Complexity | **Low** — closest to what exists |
| Perf risk | **Low** |
| A11y risk | **Low** — labels are text, hierarchy is structural |
| Suitability | High. Reads as an engineering org, scales to rosters and legal pages |

## Direction B — Digital Field

**Thesis.** Secondary pages float inside one continuous atmospheric field inherited from the
landing; routes feel like regions of a single space.

| Aspect | Behaviour |
|---|---|
| Typography | Larger serif presence; mono recedes to captions |
| Background | Persistent fixed layer (soft stripe/gradient field) behind all routes, surviving navigation |
| Surfaces | Content on raised floating cards with subtle depth separation |
| Motion | Cinematic — selective parallax, soft cross-route transitions |
| Page header | Tall, atmospheric, with the field visible through it |
| Navigation | Translucent, floats over the field |
| Content modules | Fewer, larger, more spatial |
| Mobile | Field must be disabled or heavily simplified |
| Cursor | Soft field-reactive halo |
| Complexity | **High** — needs a persistent layout layer and route-transition orchestration |
| Perf risk | **High** — a persistent animated layer on every route, plus transitions competing with the smartphone entry work |
| A11y risk | **Medium–High** — parallax and cross-route motion need reduced-motion branches everywhere; a field behind text threatens contrast |
| Suitability | Low. Directly contradicts `landing.DESIGN.md:184` ("no box-shadows, gradients … or blur surfaces beyond the nav veil") and `:205` ("hierarchy … not shadows"). Would require inventing a new elevation language the landing explicitly rejects |

## Direction C — Editorial Technology

**Thesis.** Secondary pages are documents. Strong typographic hierarchy, asymmetric measured
columns, minimal card usage.

| Aspect | Behaviour |
|---|---|
| Typography | Carries the whole design. Serif promise, sans proof headings, generous measure |
| Background | Flat parchment; dark bands mark chapter breaks |
| Surfaces | Almost none — rules and whitespace instead of cards |
| Motion | Restrained; text reveals only |
| Page header | Editorial masthead — large serif line + rule + mono standfirst |
| Navigation | Minimal, text-only |
| Content modules | Prose columns, definition lists, rules |
| Mobile | Excellent — a single measured column |
| Cursor | Minimal point + ring |
| Complexity | **Low** |
| Perf risk | **Very low** |
| A11y risk | **Low** |
| Suitability | High for `/about`, `/pillars`, legal, and team bios. **Weak for `/community`**, which is inherently modular (three sources, embeds, thumbnails) and for `/contact`, which is a form |

## Comparison

| Criterion | A — Interface | B — Field | C — Editorial |
|---|---|---|---|
| Brand consistency with `/` | **High** — extends the landing's registration/hairline vocabulary | Low — needs shadows/blur the landing forbids | High — extends the type system |
| Content suitability (form, roster, embeds, legal) | **High across all four** | Medium | High for prose, low for community/contact |
| Development cost | **Low** | High | Low |
| Maintainability | **High** — one panel primitive, one grid | Low — persistent layer + transitions | High |
| Accessibility | **Low risk** | Medium–high risk | Low risk |
| Performance | **Low risk** | High risk | Lowest risk |
| Mobile | **Good** — panels stack, labels persist | Poor without a separate mobile design | Excellent |
| Compatibility with existing code | **Highest** — reuses `Section`, hairlines, the reveal observer | Needs new layout infrastructure | Needs the fewest components but leaves community unsolved |

## Recommendation — **A, with C's typographic discipline on prose-heavy routes**

A controlled hybrid, weighted to A.

- **A supplies the system**: the panel + hairline + glyph-chip + mono-label vocabulary, one
  shared grid, and the short precise motion. This is what makes `/contact`, `/team`, and
  `/community` cohere despite carrying very different content.
- **C supplies the register on `/about`, `/pillars`, `/privacy`, `/terms`, `/cookies`**: those
  routes drop to a single measured prose column with rules instead of panels. Same tokens, same
  type scale, same motion — fewer boxes.
- **B is rejected.** Its persistent field and floating surfaces require exactly the shadow, blur,
  and gradient vocabulary `landing.DESIGN.md:184` and `:203-205` forbid, and its cross-route
  motion would compete with the smartphone entry-sequence work in `04`.

Rationale: A is the only direction that is a *token-faithful extension* of an already-approved
system rather than a new design. It costs the least, carries the lowest accessibility and
performance risk, and — decisively — it is the only one that handles the community page's
inherent modularity without inventing a second layout language.

## Page-specific motifs

Each secondary page gets exactly one distinctive motif, subordinate to the global system: drawn
with hairlines and mono glyphs, `aria-hidden`, `transform`/`opacity` only, and simplified or
dropped below 768px.

| Route | Motif | Mechanism |
|---|---|---|
| `/contact` | **Signal path** — a hairline routing diagram from the form to the destination channel, with a single travelling tick | 1px rules + `+` nodes; the tick advances one node per completed field group. Static under reduced motion |
| `/team` | **Organisational topology** — connector rules from the executive band down to each project group, echoing the landing's existing pathways connector (`HomeLanding.tsx` "org chart" line) | Static hairline connectors; hover/focus raises the border alpha of a lead and its project group together |
| `/community` | **Broadcast rail** — each channel module is a station on a shared vertical spine with a mono frequency label | 1px spine + per-module tick; no animation beyond the standard reveal |
| `/about`, `/pillars` | Chapter rules + ✳ dividers (existing landing vocabulary) | — |
| `/projects` | Ledger rows in the landing's build-record idiom | — |
| Legal | Nothing decorative — measured column + rules only | — |
| 404 / error | Registration marks with a missing cell | — |

## Cursor concept

`+` crosshair centre point (the landing's own registration glyph) plus a lagging 28px hairline
ring. Ring scales and picks up a mono label on targets that declare one. Colour follows the
surface: ink on parchment, cream on void bands. No blend modes, no blur, no fill — consistent
with `landing.DESIGN.md:184`. Full specification in `05-implementation-plan.md`.

## Motion concept

One vocabulary site-wide, promoted from the landing:

| Token | Value | Source |
|---|---|---|
| `--ds-ease-reveal` | `cubic-bezier(0.22, 1, 0.36, 1)` | `home-landing.css:69-70` |
| `--ds-duration-reveal` | `0.8s` | `home-landing.css:68` |
| `--ds-reveal-rise` | `18px` | `home-landing.css:66` |
| `--ds-stagger-step` | `110ms` | `HomeLanding.tsx` `120 + index * 110` |
| `--ds-duration-micro` | `200ms` | landing footer hover |

Hover is colour/border only — no lift, no shadow, no scale (`landing.DESIGN.md:156`). Only
`opacity` and `transform` animate (`:188`). Reveals fire once and never reverse (`:164`). The
global `.reveal` system (28px rise, `.22,.61,.36,1`, threshold 0.2, class `.in`) is retired in
favour of the landing's, so the site has one reveal implementation instead of three.
