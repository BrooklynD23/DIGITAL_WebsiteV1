# Design-system shortlist — W1-SYSTEMS

**Verdict:** shortlist = **IBM Carbon** (grid + geometry), **Wired** (type ladder + editorial composition), **PostHog** (warmth + marginalia + density). Default mix: "Build Record" (§4).

Source: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — the canonical Awesome DESIGN.md collection (73 specs, commit `f696123`, 2026-09-21; format = Google Stitch DESIGN.md alpha: YAML front matter tokens + prose sections). Some specs now live at getdesign.md; the repo copy was read.
Specs read in full sections (Overview, Typography, Layout, Shapes, Navigation, Do/Don't): **wired, ibm, spacex, posthog, vercel, linear.app, theverge, framer, cursor, resend** (10). All 73 one-line descriptions scanned.

---

## 1. Extraction — what the specs actually prescribe

| Spec | Layout / grid | Type system | Density · whitespace | Composition | Nav |
|---|---|---|---|---|---|
| Wired | ~1400 max; 1 feature + 2-up + hairline story rows | 3 faces, 3 roles: display serif 400 / text serif / sans for nav+labels | 4px base, 48px sections; tight rows | Masthead band, black footer, 0px radius everywhere | Hamburger-left, masthead-centre, Subscribe-right |
| IBM Carbon | 16/8/4-col grid, ~1584 max | One family (Plex Sans); display at **weight 300**; body +0.16px tracking | Dense by design; sections split by gray rows, not air | 0px radius, 1px hairline + surface step, no shadow; one blue | 48px sticky bar + 32px utility bar |
| SpaceX | No container; full-viewport photo bands | D-DIN caps, +1.6px tracking, 0.95 leading | Whitespace is photographic | One ghost CTA per band | Transparent overlay nav |
| PostHog | ~1280 max; 720 doc column + 240 sidebar | One family (Plex Sans Var) 400–800; uppercase eyebrows | 80px section rhythm; tight docs | Mascot marginalia = whole decorative system; cream canvas | Docs sidebar w/ outline icons |
| Vercel | ~1400; 4px token base; 192px hero | Geist 600 ceiling, −2.4px at 48px; mono for eyebrows only | Big gaps outside, tight inside cards | Mesh gradient is the only decoration | Pill CTA vs 6px nav buttons |
| Linear | ~1280; 3/2/1 cards | Display 600, −3px at 80px; eyebrow +0.4px | Dark canvas = whitespace; 96px sections | Product screenshots as protagonist | — |
| The Verge | 12-col, tiles span 2–3 at will | Manuka 900 display; mono ALWAYS uppercase | "Paced", not airy | Saturated colour tiles, 20–40px radii | StoryStream timeline rail |
| Framer | ~1199; 2-up gallery | GT Walsheim, −5.5px tracking | Long black stretches, one statement | Gradient spotlight cards (cards, never sections) | Pill only |
| Cursor | ~1200; 12-col editorial | Display weight **400** ("magazine voice") | 80px rhythm, print pacing | Cream canvas, hairline-only depth, 8px CTA | — |
| Resend | ~1200; code-story 2-up splits | Serif display 76–96px + sans + Inter UI + mono | 96–128px sections | Pure black, translucent hairlines, no shadow | — |

**Cross-spec invariants (what strong systems agree on):**
1. **One chromatic accent.** 7 of 10 specs (exceptions: The Verge's mint + ultraviolet pair, Vercel's 4-stop mesh, Framer's gradient-card family, and all three are the loudest systems in the set). This matches DIGITAL's single signal red.
2. **No drop shadows.** 8 of 10 use hairlines/surface steps instead (Vercel uses stacked 4–12% micro-shadows; Framer uses mode change).
3. **Radius is an identity decision, not a default.** Wired/IBM 0px, Cursor 8px, Verge 20–40px. Each spec forbids mixing scales.
4. **Mono is scoped.** Vercel, Linear, Verge, Resend all confine mono to technical labels/code. Never body.
5. **Display has one signature move.** Weight 300 (IBM), 400 (Cursor/Wired), −3px tracking (Linear), caps +1.6px (SpaceX). Pick one; don't stack.
6. **Section rhythm 80–96px**, 4px or 8px base unit.

**Token structure worth copying for DIGITAL's eventual DESIGN.md:** YAML front matter with `colors` (role names: canvas, surface-1…n, ink, ink-muted, hairline, primary, on-primary), `typography` (named tiers: display-xl…caption with family/size/weight/lineHeight/letterSpacing), `rounded`, `spacing`, `components` — then prose sections: Overview → Colors → Typography (+ Principles) → Layout (Spacing / Grid / Whitespace / Responsive) → Elevation → Shapes → Components → Do's and Don'ts. Not written yet — per §5, only after the direction is picked.

---

## 2. The three systems

### A. IBM Carbon — grid, geometry, discipline
- **Why it fits:** DIGITAL already ships IBM Plex Sans + Plex Mono (`lib/fonts.ts`). Carbon's 0px corners, hairline-plus-surface-step elevation and single accent match the current "sheet model" without new assets. A 16/8/4-column grid gives project records (stack, status, stage, stats) a place to sit.
- **Take:** 4px base unit, 16/8/4 grid, 0 radius, 1px hairlines, surface-step elevation, 48px nav bar, +0.16px body tracking.
- **Leave:** enterprise density on the home page, sentence-case 14px eyebrows (DIGITAL's uppercase mono annotation layer is the stronger signature), IBM Blue.
- **Directions:** B Engineering (primary), E Startup (grid), A (grid only).

### B. Wired — type ladder, editorial composition
- **Why it fits:** Wired gives the brand's three-register type idea ("promise serif / proof sans / record mono", DESIGN.md §8) a working magazine precedent. It also gives projects a story grid (one feature, a 2-up, then bylined rows split by hairlines), so a project reads as an article with a byline rather than as a card.
- **Take:** one face per role, never crossed. Display at weight 400. Square buttons. Story rows with hairline dividers. The masthead band. A black footer band.
- **Leave:** link blue and the proprietary faces. Substitutes were tested in the type lab (Zodiak, Instrument Serif, Newsreader).
- **Directions:** A Editorial (primary), D Human (story rows with real names), E (case-study rows).

### C. PostHog — warmth, marginalia, honest density
- **Why it fits:** PostHog is a serious engineering product presented as a friendly sketchbook. That is the gap DIGITAL has to close: a student org that should feel credible and still feel joinable. PostHog's warm canvas, single saturated CTA and margin annotations map onto DIGITAL's cream sheet, signal red and annotation layer. Its 80px section rhythm and docs-grade density also suit build logs.
- **Take:** one continuous warm canvas, marginalia as the decorative system, 80px rhythm, docs-mode density for build records, a single loud CTA.
- **Leave:** the hedgehog (it's theirs), the four-colour pastel callouts, and 4–8px radii.
- **DIGITAL's analog to the mascot:** real build photos plus hand annotations, the Sign-Off Block, and the stage rail. An optional page mascot is F-only (§16).
- **Directions:** D Human (primary), F Radical (marginalia / mascot), C (annotation overlays on interactive pieces).

### Considered, not shortlisted
| Spec | Why not |
|---|---|
| Vercel | Mesh-gradient hero + pill CTAs = the "template SaaS" look §39 bans |
| Linear | Needs product screenshots as protagonist; DIGITAL has none. Lavender accent sits in the banned purple/blue AI palette |
| SpaceX | Photography-only system; DIGITAL's project imagery is still placeholder (`/images/placeholders/…`) |
| Framer / The Verge | Gradient spotlight cards / saturated rounded tiles = §39 "bento + pill + glow" risk. Useful only as F references |
| Cursor / Resend | Closest runners-up (cream + weight-400 display; serif + mono). Both lean on product UI/code wells DIGITAL lacks |
| Dell-1996 / Nintendo-2001 | Good F provocation material (period web chrome), not a base system |

---

## 3. Compatible mixes — which axis from which system

| Axis | From | Rule |
|---|---|---|
| Grid, spacing, radii, elevation | **Carbon** | 4px base · 16/8/4 cols · 0px radius · hairline + surface step · no shadow |
| Type roles + composition | **Wired** | serif = promise, sans = structure, mono = record; story rows; masthead band |
| Canvas, decoration, rhythm, CTA | **PostHog** | warm sheet end-to-end · marginalia is the decoration · 80px rhythm · one loud CTA |

**Why it stays coherent:** all three already share the invariants in §1. Each is flat with hairline depth, has no gradients, uses one accent, and treats radius as a decision. The mix changes **who owns which axis**, not the underlying physics. Conflicts and how they resolve:

| Conflict | Resolution |
|---|---|
| Carbon sentence-case eyebrows vs DIGITAL uppercase mono labels | Keep DIGITAL's mono caps (it is the brand's annotation texture) |
| PostHog 4–8px radii vs Carbon/Wired 0px | 0px everywhere; circles only for avatars and status dots |
| Carbon weight-300 display vs Wired serif display | One display voice per page. The serif makes the promise. Carbon's light sans is not used for headlines |
| PostHog pastel callouts vs single accent | Dropped; status uses ink + one semantic green/amber/red at caption scale |
| Carbon density vs PostHog air | Home = PostHog 80px rhythm; project build records = Carbon density |

**Never mix:** Carbon squares with PostHog pills; Wired's black/white duet with PostHog's pastel family; two display families competing in one hero.

## 4. Per-direction mix guide

| Direction | Lead system | Borrowed axis |
|---|---|---|
| A Editorial / Studio | Wired | Carbon grid |
| B Engineering / System | Carbon | Wired story rows for the project index |
| C Creative Technology | Carbon grid (to hold the experiments steady) | PostHog annotations on interactive pieces |
| D Human / Community | PostHog | Wired type ladder (names as bylines) |
| E Startup / Product Studio | Carbon | Wired restraint (weight-400 display, square CTAs) |
| F Radical | Takes only the §1 invariants | Breaks grid and composition on purpose |

"Build Record" (default): Wired type ladder + Carbon geometry + PostHog canvas and marginalia. It is closest to the current DESIGN.md, so it costs the least to adopt.
