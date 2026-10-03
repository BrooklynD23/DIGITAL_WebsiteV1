disposition: fix

Missing or unread inputs: no approved comp and no QUALITY BAR card (code-led; canon world has none), as the packet says. The 4 contact sheets `design-lab/renders/r2/sidekick/v2/sheet-*.png` (15:29) predate the steps (15:35–15:37) and show stale states. Steps were used as evidence, sheets were not. Unread: `_sidekick/*.tsx`, `apple/sidekick/{ApplePinned,CloserLook,HeroSettle}.tsx`, `signal/sidekick/SignalTeardown.tsx` bodies (sampled through grep only), `PLAN.md`, and critiques beyond §5. Ground was checked against tokens in `_system/tokens/worlds.css`. No pixel-sampling tool is installed (no PIL, no ImageMagick).

Evidence (check 0): pass, both worlds. All 6 gate3 full-page captures exist (1440 / 834 / 780 px wide). All 12 Apple and 11 Signal step captures exist at 1440×900 and 390×844 @2x. The long empty bands in the full-page captures (Signal desktop about 4,700 px, Apple teardown pin) are sticky pin tracks. A full-page capture always paints these empty, and the per-viewport steps cover them (signal-d-01…08, apple-d-02…06). They are not black-region defects.

---

# World 1: Signal Capture, `/design-lab/r2/signal/sidekick/`

disposition: fix

## persistence

Pass.
- `PRODUCT.md` exists at the worktree root.
- Code-led (`.impeccable/config.json` → `"buildPath": "code"`), so no `state.json`, spec, plates or hero gate is owed.
- There is no `.impeccable/mocks/`, so no approval record is owed.
- FORM carries the seed key `0a795440`. It is corroborated by `design-lab/round2/WAVE1-HEADER.md:5` and `design-lab/round2/PLAN.md:57`.
- DESIGN.md for this new world is owed after this review, so its absence is not a finding.

## fidelity

There is no comp. The matrix below is judged against the direction contract and OWN-WORLD.

| Element | State | Evidence |
|---|---|---|
| TYPE: display | match | Hubot Sans wide for the headline and names ("A phone, part by part.", signal-m-00). Compressed, heavy, tight but legible. |
| TYPE: mono scope | contradicted | OWN-WORLD says Monaspace Krypton is for "every measured value". The build also sets non-measured strings in mono caps: "TAKE A SUBSYSTEM ↓", "LIFT MODULE 01", "JOIN THE DISCORD", "PER SUBSYSTEM / PER HANDOFF / BEFORE MERGE", "SCOPE, RISK", "EVERY SEAT OPEN.", "NEVER STARTED", "NEXT" (signal-m-00, m-07, d-09). That is about 20 `font-family: var(--font-mono)` declarations in `signal/sidekick/sidekick.module.css`. This is mono as a costume (floor). |
| MATERIAL | match | Line art is drawn from the real KiCad JSON (carrier 49.0 × 41.0, fingerprint 22.81 × 26.12; counts verified in critique §5.1). There is no faked bevel or emboss. By eye, the board pads read pale mint-green rather than bone `#ece8de` (signal-m-00, d-02), a small drift from "bone line art". Not sampled. |
| GROUND | match | `--r2-ground: #0b0c0a` is a neutral near-black, with no drift toward blue slate. The graticule is earned: an oscilloscope is a measuring instrument. |
| First viewport: readout, 5-word headline, lead, struck paused line, carrier iso with 2 cursors (A 49.0 mm / B 41.0 mm), text link | match | signal-d-00-top, signal-m-00-top |
| Signature: scroll timebase explodes 5 modules one gap per entry, with a layer/subsystem readout beside the object | match | signal-d-01…05 (L01 FR-4 CORE → L05 RESEARCH readout box) |
| Beat: fingerprint module swaps out on a keyboard-operable control | match | signal-m-07: module lifted, red seat dot, "L01 SEAT OPEN". CSS checkbox per W3b 5. |
| One red (trigger caret, swap seat, join seat) | match | signal-d-02, m-07 |
| Line-form grammar (struck = paused, dashed = pending, solid = exists) | contradicted | Struck is also used for "never started": the struck "Enclosure never started" label and the struck phone shell (signal-m-02, W3b 4). The hero uses struck for PAUSED. One stroke carries two states. |
| Per-panel state line above each heading ("▶ ROUTED, UNMERGED [CONFIRM]" over "An FPC2532AP sensor board.") | added without approval / floor | signal-d-02…05, m-02…06. This is a kicker over the heading. The contract puts state in line form, not in a label. |
| Stack legend "2 real boards · 3 outlines [confirm]" at 390 | contradicted (reflow) | Clipped at the right viewport edge: "2 REAL BOARDS · 3 OUTLI" (signal-m-02, m-07). |
| Status chapter (timeline, 3 boards, never-started list, next list) | match | signal-d-08, full-page mobile. Dates match KB F4/F18. |
| Ownership rules "Every part has one." (4 × "1" + label + sublabel) | added without approval / floor | signal-d-09. This is the hero-metric template, and all four numerals are identical, so they carry no information. |
| Join chapter + sponsor path | match | signal-d-09/10, gate3 desktop (Become a Sponsor / Recruit Talent / Host a Workshop / Donate Equipment). |
| Truth vs `kb-smartphone.md` | adaptation with 2 defects | §6 must-not-claim: none present. No personal names (grep of all 6 handles plus pinguz97 returned nothing in `_content`, `_sidekick`, `signal/sidekick`). Defects: "2 real boards · 3 outlines" labels the sensor board (a real KiCad project, KB headline 5 and F6–F11) as an outline, and contradicts `_content/sidekick.ts:42` "Three boards in KiCad". "Not built." (`_content/sidekick.ts:168`) under "One out. The rest stays." does not say what is not built. |

## ceiling

These native Signal Capture devices go unused:
1. The cursor pair (A/B with Δ readout) appears only on the hero board. The stack never measures the active module. Fingerprint 22.81 × 26.12 is a ready ΔA/ΔB.
2. There is no visible timebase ruler (divisions per step) for the red caret to ride. The caret rides a bare vertical line in each panel.
3. The join chapter drops the instrument: the dot ring is generic, with no channel or trigger grammar.

## material_fixes

1. **Floor, kicker.** Delete the state label set above each panel heading ("▶ ROUTED, UNMERGED [CONFIRM]", signal-d-02…05, m-02…06). Carry the state in the L0x readout box ("L01 FR-4 CORE · ROUTED, UNMERGED") or on the module's leader. Keep the red caret on the rail.
2. **Reflow, 390.** The legend "2 REAL BOARDS · 3 OUTLI…" is clipped at the viewport edge (signal-m-02, m-07). Wrap it to 2 lines or move it left under the figure so no glyph crosses the 16px gutter.
3. **OWN-WORLD, mono scope.** Move non-measured strings from Monaspace to Hubot Sans. That covers the CTAs "Take a subsystem", "Lift module 01" and "Join the Discord", the rule sublabels, "Scope, risk", "Every seat open." and the list headers. Keep mono only for mm, dates, layer codes, counts and the [confirm] tag (`signal/sidekick/sidekick.module.css`, about 20 mono declarations).
4. **Floor, hero-metric.** "Every part has one." renders 4 identical big "1" numerals with labels (signal-d-09). Set the four rules as one typographic row of sentences, or bind them to a seat in the stack as its four readout fields. Do not use numerals that measure nothing.
5. **Contract, line-form grammar.** Struck means both "paused" (hero STATE glyph) and "never started" (Enclosure label, phone shell, signal-m-02). Reserve struck for paused. Render never-started as dashed plus the words "never started", as the contract maps it.
6. **Truth, copy.** "2 real boards · 3 outlines" conflicts with KB headline 5 (three real KiCad boards) and with `_content/sidekick.ts:42`. Reword it so the sensor board counts as real but unrouted, e.g. "2 routed boards · 1 unrouted · 2 outlines [confirm]". Replace "Not built." with a line that names the unbuilt thing (the swap). Route both through brand-voice-strategist, then brand-guardian.
7. **MATERIAL, colour.** The board line art reads mint-green against bone ink (signal-m-00, d-02). Sample it, and pull the pad/silk fill to the bone ramp (`--r2-ink` / `--r2-ink-2`) if it is off-token.

## keep

Real-KiCad bone line art on the graticule, scroll-as-timebase explode with one gap per entry, and the keyboard lift-module beat with its single red seat.

---

# World 2: Apple product page, played straight, `/design-lab/r2/apple/sidekick/`

disposition: fix

## persistence

Pass.
- `PRODUCT.md` exists.
- The build is code-led and there are no mocks.
- FORM is "canon: Apple product page played straight", so no roll and no seed are owed.
- DESIGN.md is written after this review.

## fidelity

There is no comp. The matrix below is judged against the direction contract and OWN-WORLD.

| Element | State | Evidence |
|---|---|---|
| TYPE | match | Geist 600, about 6 sizes. Headline about 80px desktop (apple-d-00-top). Apple-canon tracking. |
| MATERIAL | match | Copper/tan line-art boards from the real files are the only imagery. No fake renders. Layer explode labels F.SILK…B.SILK are measured codes (apple-m-03). |
| GROUND | match | Tokens `#000000` (dark), `#ffffff` / `#f5f5f7` (light) match OWN-WORLD exactly. The tone flips once (W3b 6), visible in the gate3 desktop capture. |
| First viewport: SIDEKICK 28px above the 80px headline | contradicted (floor) | apple-d-00-top, m-00-top. The contract promises it, but the floor bans eyebrows and "no brief earns it back". It also sits directly under the local nav, which already says SIDEKICK (redundant). |
| First viewport: carrier iso ≤640px with source caption above the fold | match | apple-d-00-top |
| Local nav 52px with filled pill | adaptation, uncited | The contract specifies a "Take a subsystem" pill. The build ships "Join build night" (every apple step). W3b 1 cites the LocalNav swap but not the label. The page now has 3 different actions: "See it come apart ›", "Join build night", "Join the Discord ›". |
| Signature: one pinned scrubbed asset, caption swaps in place | match | apple-m-03 ("The carrier: fourteen track segments so far."), apple-d-04 (module beats with stack and locked names) |
| Module beats: phone shell and inactive tiers | contradicted (legibility) | apple-d-04. The shell and the sensor, compute and planned outlines render near-invisible on black. The phone reading that W3b 9 claims does not survive. |
| Swap clip plays once on entry with control | match | apple-d-06, m-06 (pause control). |
| Closer-look viewer, 5 modules, Flat/Angled/Exploded, pager | match | apple-m-07 |
| Highlights carousel "SIDEKICK at a glance." | match / adaptation | Peek card is Apple canon (gate3 desktop). The "[confirm]" tag is set inline at body size and colour ("designed outside the club. [confirm]"), unlike the 12px mono tag used everywhere else. |
| Status (timeline, 3 board cards, never-started, next) | match | gate3 desktop, apple-m sheet. Dates match KB. |
| Ownership rules "Every part has one." 4 × "1" | added without approval / floor | apple-d-10, gate3. Hero-metric template; the numerals carry no information. |
| Join + sponsor path | match | gate3 desktop |
| Quiet-viewport gate | open | Measured 36% at 390 against a 45% target (W3b deferred). The gate is not met. |
| Truth vs `kb-smartphone.md` | adaptation with 2 defects | §6 must-not-claim: none present. Compute is "designed outside the club". No names. Defects: pin caption 1 "Two real boards, from KiCad 9." (`_content/sidekick.ts:193`) contradicts KB headline 5 (three real KiCad boards) and `:42`. Pin caption 5 "The fingerprint module: fully routed." overstates KB F17/F25 (routed; no DRC has passed). "Not built." is shared with Signal and equally vague. |

## ceiling

1. The swap clip has no authored end frame or poster beat that explains which module left (apple-d-06 shows the board but no named module).
2. The status chapter's 3 same-size image + heading + label cards fall back to card scaffolding. An Apple-canon page would set the three boards as one product lineup row on the ground, without card chrome.
3. The closer-look viewer's "Exploded" view goes unused in every capture, so its quality is unproven.

## material_fixes

1. **Floor, kicker.** Delete the 28px "SIDEKICK" `.productName` above the h1 (`apple/sidekick/page.tsx:82`, `sidekick.module.css:78`; apple-d-00-top, m-00-top). The local nav already names the product.
2. **Open gate.** Quiet viewports are 36% at 390 against a 45% target. Fix the counter so it excludes off-screen clipped highlight cards (the cause W3b names), then re-measure. If still under 45%, trim the highlight card bodies to ≤12 words and collapse the "Never started / Next" lists at 390 until the share reaches 45%.
3. **Contract, primary action.** The pill reads "Join build night" where the contract specifies "Take a subsystem", and the page also uses "See it come apart ›" and "Join the Discord ›". Set the pill to the contract's action, or record the user answer that changed it.
4. **Floor, hero-metric.** "Every part has one." renders 4 identical big "1" numerals (apple-d-10). Set the four rules as one headline-weight sentence row, or as four short lines under the heading, without numerals.
5. **Truth, copy.** Change "Two real boards, from KiCad 9." to agree with KB's three boards, e.g. "Three boards in KiCad. Two are routed." Change "fully routed" to "routed". Replace "Not built." with the unbuilt thing named. Route all three through brand-voice-strategist, then brand-guardian.
6. **Legibility, module beats.** Raise the inactive tier and phone-shell stroke opacity in the pin's module beats (apple-d-04, d-05) so the five-module phone reads against `#000`. Inactive tiers stay dimmer than the active one but visible.
7. **Consistency.** Use the shared 12px confirm style for the highlight card's inline "[confirm]" (apple-d-08 / m-08 highlights) instead of body type.

## keep

Copper line-art boards from the real files on true black, the single scrubbed explode pin with captions swapping in place, and the one-time dark-to-light tone flip.
