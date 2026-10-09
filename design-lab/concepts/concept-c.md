# Concept C: Creative Technology, "Formation"

Route: `/design-lab/c` · Files: `app/design-lab/c/` · Renders: `design-lab/renders/c/v1/` · DA-C, 2026-10-02.
Copy here is exploratory (LAB COPY in `content.ts`). Production wording still goes through
brand-voice-strategist and then brand-guardian (BRAND.md).

## 1. Thesis

**The page draws itself from the work: every moving point is computed from a real build, so the brand can only get as big as what members actually make.**

The hero is an instrument, not a decoration. One particle buffer of 4,900 points takes three forms, and each form is generated
from real structure in `lib/data`: the 7 smartphone subsystems (`phoneV2.ts`) become 7 stacked layers, Smart Reading
(`projects.ts`, `glasses.ts`) becomes a frame with an HUD window and an FPGA module, and DG-003 (no project exists yet) becomes a
blank signature line that visitors can sign with their own name. Moving between forms is "project formation": the
same material re-forming into a different build. The rest of the page stays quiet and archival. It holds dark build records where
every unknown field says **No signal** instead of being invented. The risk is in one focal object. Everything else carries evidence.

## 2. Visual system (§31)

### Typography

| Role | Family | Size (min → max) | Weight | Line-height | Tracking |
|---|---|---|---|---|---|
| Display / H1 | Clash Display (Fontshare) | `clamp(44px, 4.3vw + 4px, 76px)` | 600 | 0.98 | −0.01em (type-lab: −0.02 collides) |
| H2 | Clash Display | `clamp(36px, 3.4vw + 8px, 64px)` | 600 | 1.02 | −0.01em |
| Record title | Clash Display | `clamp(34px, 3vw + 10px, 56px)` | 600 | 1.02 | −0.01em |
| H3 / step / stage | Clash Display | 22–30px | 500–600 | 1.05–1.15 | 0 |
| Footer close | Clash Display | `clamp(44px, 6vw, 104px)` | 600 | 0.98 | −0.01em |
| Body | General Sans (Fontshare) | 17px (lead 19–20px) | 400/500 | 1.55 (lead 1.45) | 0 |
| Mono metadata | Martian Mono (`next/font`, `font-stretch: 87.5%`) | 11.5px caps | 400 | 1.4 | 0.04em |

Rules: one display voice. Mono is used for metadata only: IDs, field keys, stage numbers. Body never goes below 14px. Display stays ≥ 44px at 390px.
`text-wrap: balance` on headings and `pretty` on subs. Line length ≤ 56ch.

### Color (dark only, AA-checked against `--bg`)

| Token | Value | Use | Contrast on bg |
|---|---|---|---|
| `--bg` | `#0c0c0b` warm graphite | page | — |
| `--bg-2` / `--bg-3` | `#141412` / `#1c1b18` | elevated surfaces (RSVP window, hover rows, input) | — |
| `--fg` | `#ece8de` bone | text, particles | ≈16:1 |
| `--fg-2` | `#a39e92` | secondary text | ≈7.4:1 |
| `--fg-3` | `#8a857b` | mono keys, captions | ≈5.3:1 |
| `--line` / `--line-2` | `#2a2925` / `#3e3c36` | 1px hairlines / emphasis rules | non-text |
| `--accent` | `#ff5a36` "solder" | eyebrows, status marks, selected markers, highlighted subsystem layer, primary CTA, focus ring | ≈6.3:1; CTA text `#0c0c0b` on accent ≈6.3:1 |

Why this accent: it is the production signal-red hue (`#d8412f`), lifted so it stays AA on graphite and reads as solder or a laser dot on a
dark bench. It is the only chromatic color. There is no purple/blue AI palette, no gradients, and no glow. States: hover is an `--fg-2` border or a
`--bg-2` fill. Pressed or selected uses an accent border or a 2px accent top rule. Disabled is 45% opacity. Focus is a 2px accent outline at 3px offset.

### Geometry

- Spacing: 4px base. Scale 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 112. Section rhythm `clamp(64px, 8vw, 112px)`.
- Margins `clamp(16px, 4vw, 48px)`. Max width 1360px. 12-column logic: hero 5/7, records 7/5, join 5/7.
- Radius **0 everywhere**. The only round things are particles. Borders are 1px hairlines (2px only for selection/aside). **No shadows.**
- One structural texture: a 24px dot grid inside the hero stage only, plus crop marks. It reads as an instrument viewport.

### Motion

| Token | Value | Use |
|---|---|---|
| `--d-fast` | 120ms | hover color/border |
| `--d-ui` | 240ms | poster highlight, toggles |
| morph | 1.25s | formation change, per-particle smoothstep, left→right sweep (x-rank stagger + 12% jitter) |
| highlight | ~150ms exp. ease (`k = 12/s`) | subsystem layer fade-in/out |
| probe | exp. follow (`k = 14/s`), push ramp `k = 7/s` | pointer repels particles within 0.4 world units |
| scroll spread | exp. ease `k = 8/s` | layers spread apart as the hero scrolls away (max +0.22/layer) |

Easing: `cubic-bezier(0.2, 0.7, 0.1, 1)` for UI. Particles use smoothstep plus critically damped exponential follow (no spring overshoot).
Entrance: none. First paint is the final state, and there is no content hidden behind reveals (§5 "avoid"). Hover changes color or border only.
Page transitions: none (single page). In-page anchors use smooth scroll only under `no-preference`.
Reduced motion: WebGL is off and the SVG poster is used. Formation swaps are instant. The RSVP strip doesn't autoplay. Orbs show a static frame. All CSS
transitions are 0ms. The "Live" toggle is disabled.

### Iconography

Lucide, `strokeWidth={1.5}` + `absoluteStrokeWidth`, 18px. 5 glyphs total: ArrowDown, ArrowUpRight, RotateCcw, Play, Pause.
Icons sit only inside controls, next to a text label. There are no icon chips or decorative icons. The particles are the imagery.

## 3. Layout and navigation

- **Nav**: sticky 56px solid bar (no glass). Wordmark + `@ Cal Poly Pomona` mono. Work · Studio · Join anchors. Outline CTA "Take a subsystem".
  Below 760px it switches to a `<details>` Menu, which works without JS.
- **Page order** (6 beats from `ia-proposal.md`, PROOF dropped as advised): Hero (thesis + artifact) → The work (DG-001, DG-002 records,
  Venture Studies program row, DG-003 unsigned row) → How a build runs (4 stages + 4 ownership rules) → Join (3 steps) → Footer close.

## 4. Hero: "Formation" (the required experiment)

- Left: eyebrow, thesis H1 (`homeLandingCopy.hero.lines`), sub, then a **radio group "Pick a build"** (DG-001 / DG-002 / DG-003),
  then one CTA "See the builds" and the build-night meta. There is no second CTA button.
- Right: a 6:5 stage holding the SVG poster and the lazy WebGL field. Below it is a caption with real fields per formation:
  - DG-001: 7 subsystem buttons. Hover, focus or tap one and its layer turns accent while the others dim, and the subsystem description appears in an `aria-live` readout.
  - DG-002: glasses. After the morph, the real RSVP sentence (`glasses.ts` `pov.words`) streams inside the HUD window at the real 450 wpm, then holds. A Replay button is provided.
  - DG-003: a blank line marked "Built by". **Sign the line** rasterizes the typed name (Clash 600) into the particles. It stays in this tab, nothing is sent,
    and it ends at "Pitch the next build" → `/contact?type=project-team`.
- A Render toggle (Live / Still) lets visitors turn the effect off.

## 5. Project section (§41): build records

Each record lists ID · kicker · status mark, then title, promise, and two columns. The left column is the visual: a striped `[ PROJECT PHOTO — … ] [placeholder]` plate,
plus a working element (DG-001: 7 `<details>` subsystems with scope, bullets and risk; DG-002: an RSVP reader with a pace slider from 150 to 600 wpm). The right column is a field list
covering Problem, Subsystems/Method, Workflow, Ownership, Technologies, Needs, Duration, Mentor, Outcome, Built by, Partner, and Repo/demo.
**Unknown = "No signal"** (dashed mono tag + reason), e.g. Toolchain: "two conflicting stacks in the data; confirm with the club".
This is the honesty device: the record shows what is missing instead of hiding it. Venture Studies is a program row (real line + 2 real learnings,
its unverified stats are dropped). DG-003 is an open row, "Unsigned ______".

## 6. Secondary section: how a build runs (thinking-orbs decision)

**Accepted, with a strict mapping.** Each orb state maps to one real stage in `phoneV2Copy.toolbox.workflowStages`:
plan → `shaping` (an outline settles on a form) · prototype → `working` (parts on their own orbits) · test → `solving` (scrambles, clicks back)
· integrate → `connecting` (nodes wire into one). Orbs are frozen until hovered, focused or pressed, so the section never moves on its own.
They are ink-colored (no AI palette), and they echo the hero's dot language at a small scale. **Rejected use:** showing a "current phase" orb per project.
The phase conflicts in the data (C5: Prototyping vs PCB fabrication), so the copy says the marks are stages, not a progress bar.
Below them, the 4 real ownership rules use a large "1" numeral (one owner per subsystem, …).

**COBE globe: skipped.** No real photo or build locations exist in `lib/data`, and a single campus dot would be ornament.

## 7. Join + footer

"Thursday is build night." Three numbered steps (build night with real time, room and description; Discord with the real expectation line from
`community.ts`; take a subsystem). One primary CTA plus a Discord text link. The aside reads "Products need more than programmers."
The footer closes with "Put your name on one." over a drawn signature line (the DG-003 motif), followed by the vision line (verbatim, home only), build night, email,
Discord, legal links, and a lab note.

## 8. Responsive

- ≥ 900px: hero is 5/7 columns, with the stage and caption on the right.
- < 900px: hero stacks as copy → stage → picker → caption → CTA (`display: contents` on the art wrapper so the picker sits right
  under the stage). Records and join become single-column. Stages use a 2×2 grid.
- < 760px: nav becomes the Menu disclosure. Field keys narrow to 96px. Subsystem scope labels are hidden.
- WebGL draws 100% of points at ≥ 900px and 55% below (representative subset), with a dot size of 3px.
- Verified 390 / 834 / 1440: horizontal overflow 0px at all three.

## 9. Interaction language

The radio picker chooses a form, which re-forms the particles. Pointing (mouse/pen only, never touch, so scroll stays free) probes the field and
particles part around the cursor. Selecting a subsystem lights its layer. Typing your name signs the line. Scrolling spreads the layers apart. Every interaction
reveals real structure; there is no idle animation.

## 10. Accessibility (§42) and progressive enhancement (§43)

- Native radios (visually hidden, focusable, with the focus ring drawn on the row). Formation, poster and caption swap through CSS `:has()`, so they **work without JS**.
- The poster SVG has `role="img"` + label. Canvas, HUD word and labels are `aria-hidden`. The RSVP sentence is given once as sr-only text.
- 44px minimum targets (except the 36px Live/Still segment, which is a known gap). Visible accent focus everywhere. External links say "opens in a new tab".
- Live WebGL only when **all** of these hold: WebGL present; no `prefers-reduced-motion`; no Save-Data; not (coarse pointer AND ≤4 GB memory or ≤4 cores);
  no `?fx=off`; the visitor hasn't chosen Still. `?fx=on` forces it on for testing.

## 11. Performance

- `FormationCanvas` is loaded with `next/dynamic({ ssr:false })` only when Live is chosen, so three + R3F stay out of the initial route JS. drei is **not used**.
- `frameloop="demand"`. Frames render only while a morph, probe, highlight fade or scroll spread is settling, so **a settled field costs 0 frames/s**.
  Offscreen (IntersectionObserver), the loop is set to `never`. The DPR cap is 1.75, and the context uses `antialias:false, powerPreference:'low-power'`.
- 4,900 points use one draw call and one ShaderMaterial. The 4 position attributes total 235 KB of Float32, uploaded once (a sign rewrites one 59 KB attribute).
- Poster: dot paths (`M x y h0`, round caps) rather than circles. Phone stride 2, others stride 3. The SSR HTML for the route is ~154 KB in dev. This is the
  main weight risk; production could swap it for a pre-rendered static SVG file.
- Fonts: 2 Fontshare stylesheets (variable cuts) + 1 next/font family.
- Not measured: production bundle sizes (`next build` would collide with the shared dev server's `.next`). Library-fit estimates
  three ≈185 KB + fiber ≈57 KB gzip, lazy-only.

## 12. Libraries

| Library | Why |
|---|---|
| `three` 0.169 + `@react-three/fiber` 8 | GLSL point field with custom morph/probe/highlight shader; demand frameloop. v8/v9 pins kept |
| `thinking-orbs` 0.3.2 | 4 stage marks, each mapped to a real workflow stage (§6) |
| `lucide-react` | 5 control glyphs, 1.5 absolute stroke |
| `next/font` (Martian Mono) + Fontshare CDN (Clash Display, General Sans) | type stack from `research/fonts.md` C |
| Not used | drei, motion, GSAP, Lenis, COBE, fancycomponents: a single focal object doesn't need them; the RSVP strip and morph are hand-built |

## 13. Copy (LAB COPY, directions not final)

Hero sub: "Two builds are on the bench. One slot is open. Pick one and watch it form." · Picker lines: "Seven subsystems. One phone." /
"One word at a time, where you look." / "The next build has no name yet." · Work: "Evidence, field by field." · Process: "You take a
subsystem. You own it through the test gate." · Join: "Thursday is build night." / "Products need more than programmers." · Close:
"Put your name on one." Banned-word check (BRAND pillar 4 + §40): 0 hits.

## 14. Risks and known weaknesses

1. **Global chrome hack**: `layout.tsx` hides the production Navbar/Footer with a route-scoped `<style>`. The clean fix is orchestrator-owned:
   add `/design-lab` to `IMMERSIVE_PREFIXES`. Because the root layout wraps everything in `<main>`, the concept footer sits inside main (no `contentinfo`).
2. **Phone stack is a diagram, not the device.** Layers are abstract subsystem plates in data order, not a physical teardown. This is honest, but
   less "product-photo" than Playdate-style heroes.
3. Glasses read clearly in 3/4 view, but the loose particles around them can drift toward a "galaxy" look. They were reduced once and need a human eye.
4. Clash Display is common on agency templates (fonts.md risk). Its TA pair needed extra wordmark tracking.
5. The page is long on mobile (9,030px at 390, 8,478px at 834, 6,313px at 1440). Two full build records with every §41 field make a dense
   archive. A later pass could collapse the field lists behind "Show the full record".
6. The ~154 KB SSR poster markup and the 36px render toggle (§10).

## 15. Render loop log (§33)

- v1 loop 1: full set + hero `--wait=4000`. Findings: subsystem layers too tight (gap 0.2 → 0.3), "DIGIT AL" wordmark gap, "1 one owner" duplication,
  mobile picker pushed under 7 legend buttons, blue forms-plugin focus border on the sign input.
- Loop 2: fixed all five. The mobile hero was reordered (picker right under the stage).
- Gemini motion critique (`critiques/c-v1-self-gemini.md`). Applied: directed left→right morph instead of a random scramble (x-rank ordering, smaller
  arc, 1.25s), soft anti-aliased dots (larger), denser name glyphs, a ~150ms layer highlight fade, a stronger probe radius and force. HUD words now wait for the
  glasses to form. Declined: scroll-reveal choreography (content must be visible at first paint, one focal motion object per page). Smooth anchor scroll was already
  on (the recording used the wheel). The "white flash" is the recorder's about:blank frame.
- Final: 0 console errors at 1440 / 834 / 390 (Live, no-JS, reduced motion). `npx tsc --noEmit` is clean.

## v2 changes (Wave 4 refinement, §36)

Inputs: `critiques/c-by-b.md`, `c-gemini-motion.md` (incl. orchestrator cross-check), `micro-c.md`, `a11y-c.md`.
Thesis is unchanged. Every fix makes the page draw itself from the work more consistently.
Renders: `design-lab/renders/c/v2/`. 0 console errors (live, Still `?fx=off`, reduced motion, no-JS, mobile). `tsc` reports no errors in `app/design-lab/c/`.

### Applied: fix now (8)

| # | Fix | Source | Where |
|---|---|---|---|
| 1 | **Still-mode parity.** The Still signature is drawn in dots from the same `signCloud(nameToPoints())` pipeline as Live, so a long name fits identically with no `<text>` clip. Unsigned is now literally a blank line: the name's points wait on the baseline instead of forming a blob. The name is offset +0.07 so long names clear the × | orchestrator 1, U1 | `HeroFormation.tsx` (`unsignedPoster`), `geometry.ts` (`signLineAndCross`), `textPoints.ts` |
| 2 | **Interruptible morphs.** A new target mid-morph bakes the on-screen blend into a 5th slot (`aPos4`) on the CPU, using the shader's exact per-point timing (`aSeed`, new `aJit` attribute replacing GPU `sin`-hash jitter), and morphs on from there. No snap-back | orchestrator 2, M1 | `FormationCanvas.tsx` (`bakeSnapshot`) |
| 3 | **Subsystem reading on the stage.** The selected layer's index, title and description sit in a band at the stage's bottom edge (visible at 1440×900 and 1280×800). Under 900px it is echoed under the legend. The H1 holds 3 lines at ≥1200px (11/13 columns), so the picker starts at y≈466 | orchestrator 3, H2, T2 | `.stageReadout`, `.legendReadoutNarrow` |
| 4 | **Labels land with the form.** The stage tag, "Built by" and the HUD word follow `onShown` (morph 60%) instead of the radio, with a 240ms fade. The HUD stream starts on `onSettled` instead of a 1.5s timeout | orchestrator 4, H3/M2, M4 | `FormationCanvas` callbacks, `.stage[data-shown]` |
| 5 | **Render toggle.** 44px tall, hover and pressed states. A disabled Live states its reason in text linked by `aria-describedby` ("Live is off: your system asks for reduced motion." / no WebGL) | orchestrator 5, micro 6/7/10 | `HeroFormation.tsx`, `.renderNote` |
| 6 | **Quiet live region.** Hover and focus highlight visually only. The sr-only live region speaks only when a layer is pinned (click/Enter) | orchestrator 6, a11y 1 | `HeroFormation.tsx` |
| 7 | **One signature, computed twice.** The footer remembers the hero signature in the same dots (`signatureDots`, shared in-tab via `signStore.ts`): "This line is still blank." → "Signed. Now build it." The shared "Put your name on one." close, the drawn X-line SVG, the `______` in the DG-003 row and the "BUILT BY ______" notes are removed. "No signal" is the only empty-state device | lab-wide, D2, T4 | `FooterSignature.tsx`, `signStore.ts`, `content.ts` |
| 8 | **Record plates are the builds' own drawings.** The striped photo plates became each build's dot drawing (phone stack, glasses) from `geometry.ts`, captioned "build photo [placeholder]" | lab-wide, D3 | `page.tsx` `DotPlate` |

### Applied: trivial / lab-wide

- Production crosshair hidden on this route (`html{cursor:auto!important}`, `[style*="ds-z-cursor"]{display:none!important}`). The probe is the only pointer effect.
- `:active` pressed states on primary, ghost, legend, segmented, stage, nav CTA, text links and picker rows (0ms).
- Toggle semantics: RSVP Play/Pause keeps its label swap and drops `aria-pressed`. Legend, stage and Live/Still keep fixed labels with `aria-pressed`.
- Text floor 12px: all mono 11/11.5px → 12px. The HUD word floor is 16px, set in Martian Mono (an instrument readout).
- 44px targets: footer links, nav CTA, segmented buttons. A sign-field counter ("21/22") means truncation is no longer silent.
- Type scale: H2 max 64 → 52px, record title 56 → 46px, footer close 104 → 72px (now ≤ H1).
- Accent `#ff5a36` → `#f0573a` ("solder, not neon"). It is 5.71:1 on `--bg`, 5.38:1 on `--bg-2`, and ink-on-accent is 5.71:1.
- Morph z-arc 0.3 → 0.12, and glasses loose dust cut 50% (600 → 300 points moved onto the rims), so mid-morph frames keep an edge.
- Nav "Studio" → "Process" (the section is "How a build runs"). Process sub cut to one fact: "Every subsystem passes the same four stages."
- Wordmark "DIGIT AL" fixed with a kerned T (nav + footer).
- Tablet (600–899px): stage capped at `48svh × 1.2` so the picker is above the fold at 834×1112. Mobile: CTA moved above the caption.
- No-JS: the phone caption links "All 7 subsystems in the DG-001 record". Each radio is `aria-describedby` its caption fields.
- `hasWebGL()` now releases its probe context.

### Rejected (with reason)

| Item | Reason |
|---|---|
| Scroll-reveal choreography (Gemini v1) | Content must be visible at first paint, and C keeps one focal motion object per page |
| Grouping all "No signal" fields into one strip (P2) | The per-field "No signal" is the honesty device. Grouping hides which fields are missing. Revisit only if the club fills ≥3 fields |
| Replacing the stage orbs with geometry posters (D3, second half) | §14 asked for orbs only if each maps to a real stage, and they do. Swapping them would remove the one tested §14 experiment. Their dot language already matches |

### Deferred

| Item | Why later |
|---|---|
| Probe as a lens (brighten + name the nearest layer, no displacement) (M3) | Needs a nearest-layer readout and a design pass. The push is kept for now and stays mouse/pen-only |
| Selected layer lifts out of the stack ("take one apart" literally) (P1) | Pairs with the probe-as-lens pass; the scroll spread stays until then |
| Workflow shown 3× / ownership 2× (H4) | Needs a decision on what the DG-001 record keeps as evidence vs the process section |
| Static `.svg` poster files instead of inline paths (F2) | A build-time script over `geometry.ts`. The SSR HTML is still heavy (dot posters, plus the 2 record plates added in v2) |
| Mobile page length (390: 9,507px) (R1) | Record field lists could collapse behind "Show the full record". Needs a design pass |
| Production bundle measurement (F4) | `next build` would collide with the shared dev server's `.next`. Run it in a throwaway worktree |
