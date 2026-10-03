Missing/unread: `.impeccable/mocks/decision/assigned.webp` absent from the worktree (critique reference only; no approved comp, code-led); no QUALITY BAR card (packet: none). Unread by allowance: `design-lab/round2/PLAN.md`, `design-lab/round2/critiques/{home,system}.md`, `_system/` internals (DotStage, PlayOnce, cine, Highlights), `_chrome/join.module.css` Apple block. Full-page captures were judged through `steps/`, the `sheet-*` contact sheets and a crop of the top 1200px of `gate3/*-tablet.png`. A red-pixel scan of the step captures picks up subpixel text fringes, so red claims below rest on visual reads.

Check 0 (both worlds): pass. All 6 gate3 captures, all 6 v2 full-page captures and all 45 step captures exist. Dimensions fit their viewports (1440×900; 390 at 2× = 780×1688; tablet 834 wide). The document top is visible and content matches each filename. `steps/signal-390-10.png` and `steps/signal-390-11.png` are byte-identical (md5 a6df17…): the end of the page, a duplicate rather than an invalid capture.

---

# World A · Signal Capture (`/design-lab/r2/signal/`)

disposition: fix

## persistence
Pass. `PRODUCT.md` is present. The build is code-led (`.impeccable/config.json` buildPath "code"), so no state.json, spec or plates are owed. FORM carries seed key 0a795440, which matches the packet's confirmed answer and `.impeccable/decision-r2.json` "assigned". No comp-round comps exist, so no approval record is owed. DESIGN.md is a new world and is not due before this review.

## fidelity
No approved comp, so rows are judged against the contract and OWN-WORLD.

| Element | State | Evidence |
|---|---|---|
| TYPE | match | Hubot Sans wide caps (stretch 118–120%) on stage and channel names, Mona Sans text, Monaspace readouts (`steps/signal-1440-02.png`, `-07.png`). Thesis tracking is -0.025em, inside the floor. |
| MATERIAL | match | Bone dots, 1px traces and graticule hairlines are drawn as crisp geometry. There is no faked physicality. |
| GROUND | match | Sampled 11,12,10 = #0b0c0a on every step, which is OWN-WORLD exactly. |
| Thesis 72px + lead + CH strip (left) | match at 1440/390; **contradicted at 834** | `gate3/signal-tablet.png`: "your name on." runs across the scope column into the orb (≈x510–545, y600–640). The CH3 BRAIN chip sits under the red marker and the PLAN label (y760–810). |
| Scope frame: stage readout, orb, timebase ruler, red trigger | match at 1440/390; **contradicted at 834** | Same capture: the division labels collide into "PROTOTYPETEST" (y803). The cause is `signal/_home/home.module.css:112-117`, which keeps two columns and the 72px thesis at ≤1068px. |
| 5/7 column split | deviation, uncited | Built 6/6. The W3b log cites only the builder's line-count preference: no user answer, accessibility need or product truth. |
| Join as outlined trigger in nav | match | `steps/signal-1440-00.png` |
| Scrub interaction: scroll/drag/keys drive Plan→Integrate; marker and readout track | match | Steps 00–05 at both widths; ScopeHero.tsx:53-63 key handling. |
| Ownership rule per stage | adaptation (critique-cited) | The stage↔rule pairing is shown as fact, untagged. The contract log says it "needs Head Designer confirmation" (`_content/home.ts:36-39`). |
| CH1/CH2/CH3 marks through nav, rows, footer | match. Marks drop from the nav at ≤640px | Fit adaptation, documented at WorldNav.tsx:10-12. |
| Channel rows (Believe) | weak | `steps/signal-1440-07.png`: the SHADES "fixate" rest pose is a ~100px reticle inside a 360px frame and reads empty. Each row is 100svh (`home.module.css:94`) with ~45% dead band. Channel motion is hover-only (`signal/page.tsx:29` playOnHover). |
| One red per viewport (Join: seat anchor) | missing | `steps/signal-1440-09.png` shows no red seat anchor in the Join viewport, though W3b claims the seat carries the viewport's one red. |
| Capture continuity at Join | contradicted (THESIS "one capture") | The graticule stops on a hard seam at y≈150 in `steps/signal-1440-09.png`, and Join sits on flat ground. |

## ceiling
Native devices left unused:
1. Phosphor persistence. Stage cuts are instantaneous; a real capture leaves afterglow decay.
2. The full line-form vocabulary. Only solid and dashed are used; half-height (stale) and struck (paused) never appear.
3. The deep-dive raise. The timebase does not govern chapters after the hero; channel rows and Join sit at no tick.
4. Per-channel signal behaviour (explode / converge / wire) hides behind hover, so at rest the rows are dim stills.

## material_fixes
1. Tablet hero collision (contradicted, FIRST VIEWPORT). `gate3/signal-tablet.png` shows the thesis overrunning the orb, the BRAIN chip under the marker, and "PROTOTYPETEST". `signal/_home/home.module.css:112-117` must stack to one column at ≤1068px, or cap the thesis so its longest word fits the column. Add a two-row division grid. Recapture at 834.
2. Channel rows fail Believe. In `steps/signal-1440-07.png` the SHADES rest pose reads empty and each row carries a ~45% dead band. Give the fixate verb a rest pose that reads (the converged word, not a bare reticle), play each row's verb once on entry instead of hover-only (`signal/page.tsx:29`), and size rows to content or to timebase ticks (`home.module.css:94`).
3. Join drops the capture. `steps/signal-1440-09.png` shows a graticule seam at y≈150 and no red seat anchor. Let the page graticule continue under Join (no solid band) and make the seat's red anchor render at rest (`_chrome/JoinChapter.tsx:76-83`, PlayOnceStage `anchor`).
4. Floor, monospace as costume on actions. The "JOIN THE DISCORD" button is mono uppercase (`_chrome/join.module.css:148-164`), and so is the nav "Join" (`_chrome/chrome.module.css:23`). Set actions in Mona or Hubot; keep Monaspace for readouts and data.
5. The graticule's major vertical (x=720) runs through channel copy: it crosses "[confirm]" and the lead in `steps/signal-1440-07.png`. Either start the copy column clear of the major line or suppress the line behind copy.
6. FIRST VIEWPORT 6/6 vs contracted 5/7 is an uncited deviation. Get Head Designer sign-off, or restore 5/7 with a thesis size that holds 4 lines.
7. Truth: the stage↔rule pairing (`_content/home.ts:36-39`) is shown as fact while it awaits Head Designer confirmation. Confirm it or tag it [confirm].

## keep
The 1440/390 hero instrument: one orb, the red trigger on a real scrubbable timebase, and the wide-caps stage name swapping with its ownership rule. Do not add a second red or a second moving glyph while fixing.

---

# World B · Apple product page (`/design-lab/r2/apple/`)

disposition: fix

## persistence
Pass. `PRODUCT.md` is present. Code-led; FORM is canon by the user's confirmed answer ("Apple product page, played straight"), so no roll seed applies. No comp-round comps exist.

## fidelity
No approved comp, so rows are judged against the contract and OWN-WORLD.

| Element | State | Evidence |
|---|---|---|
| TYPE | match | Geist 600 display at 80px, -0.015em; grey 600 lead; Geist Mono spec lines (`steps/apple-1440-00.png`, `-05.png`). |
| MATERIAL | match | Dot orb geometry, line glyphs and the light cards are honest vector and CSS, with no imitation material. |
| GROUND | match | Sampled #000 on the hero and builds, #fff on Join, light grey footer. Dark→light arc, page ends light (`steps/apple-1440-08/09/10.png`). |
| 52px LocalNav + filled CTA | adaptation (W3b-cited: one DIGITAL, one Join) | Title "Venture studio" is pending brand-voice review. Links are Stages/Builds/Highlights. |
| Centred 80px thesis, 21px lead, 440px orb in Plan pose | match | `steps/apple-1440-00.png`, `gate3` tablet crop, `steps/apple-390-00.png` |
| Pinned stage chapter: morph, one-line captions, 4-dot tracker | match | Steps 01–04; StagePin.tsx:51-69 |
| Stat callouts with line glyphs | adaptation | Rules ("1 owner per subsystem") with line glyphs stand in. Product truth: no verified counts exist (PRODUCT.md "Open"). |
| Build chapters (Believe) | weak | `steps/apple-1440-05.png`: ~530px of empty black under SIDEKICK. The cube renders ~240px wide though DotStage is size 420 (BuildChapter.tsx:16). BRAIN's bud is the smallest mark on the page (`sheet-apple-390.png` frame 8). SHADES shows unresolved scatter in every capture (`steps/apple-1440-06.png`, `steps/apple-390-06.png`). |
| Highlights snap-x strip | match / **contradicted (stages card)** | `steps/apple-1440-08.png`, `steps/apple-390-08.png`: a hard-cornered black clip box inset in a rounded light card. Deferred in W3b, still shipped. |
| Red allotment (CTA hover + orb anchor only) | contradicted | A red active dot on the clip tracker, `steps/apple-1440-08.png` ≈(567,298) and `apple-390-08.png` y1259–1264. |
| LocalNav tone | contradicted (canon behaviour) | A dark bar (`_chrome/chrome.module.css:49`) rides over every light chapter (`steps/apple-1440-08/09/10.png`). |
| Join chapter | match | `steps/apple-1440-10.png` |

## ceiling
Native devices left unused:
1. Product-scale objects. Apple sizes the subject to own the chapter, but the build orbs sit small in near-empty chapters.
2. Full-bleed media inside highlight cards.
3. The local nav adopting chapter tone.

Motion, type scale and the dark→light arc are reached.

## material_fixes
1. The build chapters fail Believe. `steps/apple-1440-05.png` shows a ~530px void and a ~240px object; BRAIN's bud is undersized and SHADES reads as scatter. Scale the object (≥560px desktop, BuildChapter.tsx:16), fix the fixate and bud rest poses in `_system` dots so they read at rest and after play, and drop `min-height: 78svh` (`apple/_home/home.module.css:66`) to content plus Apple spacing.
2. The Highlights stages card shows a black box inside a light card (`steps/apple-1440-08.png`). Give that card a dark tone, or render the clip full-bleed with the card's top radius (`_system` Highlights, per-card tone).
3. A second red on the highlight clip tracker (`steps/apple-1440-08.png` ≈567,298) breaks the OWN-WORLD red allotment. Draw the active tracker dot in ink.
4. The LocalNav stays dark over the light chapters (`_chrome/chrome.module.css:49`; `steps/apple-1440-09.png`). Switch its tone with the chapter under it (light translucent bar on light chapters).
5. LocalNav title "Venture studio" ships unreviewed (W3b: "copy pending brand-voice review"). Route it through brand-voice-strategist → brand-guardian per CLAUDE.md.
6. Truth: the stage↔rule pairing in captions (`_content/home.ts:36-39`) awaits Head Designer confirmation. Confirm it or tag it [confirm].

## keep
The dark pinned hero: one orb morphing dot-by-dot through the four stages, out-then-in single captions, the 4-dot tracker, and the page's single filled CTA in the LocalNav.
