# W3b — page refine pass (one pass, impeccable "fix" batch)

Output style: follow ~/.claude/rules/common/subagent-output.md (i-have-adhd). No commits. Never print secrets. Same ownership as your W1 pass (your page routes, `_content/<page>.ts`, your page-scoped `_<page>/` folder, your scripts and renders). NOT yours now: `app/design-lab/r2/_system/**` and `app/design-lab/r2/_chrome/**`. Those changed in W3a; import them, and put requests in your report.

## Inputs (read in this order)
1. Your critique: `design-lab/round2/critiques/<page>.md`. Its "Fix now" lists per world are the work order.
2. `design-lab/round2/critiques/system.md`: items tagged with your page.
3. Migration notes (W3a shipped these; adopt them):
   - `design-lab/round2/system/SYSTEM.md` §5:
     - `LocalNav` has a `utility` slot and one CTA contract. Omit `cta` for "Join build night" → `#join`.
     - `WorldNav` takes `sticky` and `join`. Pass `join={false}` when a LocalNav exists.
     - `<JoinChapter world>` replaces your join section; your seat rows go in as children.
     - Shared parts: `PlayOnce` / `usePlayOnEntry`, `useScrollSteps` / `stepAt`, `<Highlights>`, `<Graticule pitch>`, `<Chevron>`.
     - Glyphs draw the red anchor only with `anchor`.
     - Delete your page's copies of these.
   - `design-lab/round2/system/CINE.md`:
     - Pass `world="apple"` on every Apple-world `<CineClip>`.
     - Don't force `aspect="16x9"`.
     - Scrubs call `ref.setProgress(p)`, not React state.
     - Captions sync with `markerIndex(name, p)`.
     - `brain-orb` is a loop clip with a pause control.
   - `design-lab/round2/system/BOARDS.md` (SIDEKICK): use `<BoardLayers>` for large or animated figures, per the recipe.

## Do
1. Triage every finding into fix now / reject-with-reason / defer. Keep the direction contract (re-read your surface briefs); don't drift toward the critic's style.
2. Implement in one batch for both worlds.
3. **Inspect** in one batched round: viewport captures at about 10 scroll steps at 1440×900 and 390×844, both worlds; fix; one confirm round; stop.
4. **Gates:**
   - `node design-lab/scripts/r2-words.mjs <route>` (and `--width=390 --height=844`): avg ≤30, p90 ≤70, max ≤100, quiet ≥45%.
   - 0 rAF at rest (your `r2-<page>-raf.mjs`, or `r2-sys-raf.mjs --rest-only`).
   - 0 console errors.
   - `npx tsc --noEmit` clean.
   - Reduced-motion and no-JS parity.
   - `/home/danny/.claude/skills/impeccable/scripts/impeccable detect --json <your dirs>` once.
5. Final full-page shots: `node design-lab/scripts/shoot.mjs /design-lab/r2/<world>/<route>/ design-lab/renders/r2/<page>/v2 <world>-<page>`. Also write per-viewport captures to `design-lab/renders/r2/<page>/v2/steps/` (the finish reviewer needs them).
6. Append "## W3b changes" (applied / rejected-with-reason / deferred) to each surface brief body (`impeccable surface-brief read`, then write back with the section added). Never touch the six contract blocks unless a decision changed them.

**Final report ≤20 lines:** applied / rejected / deferred counts plus the highlights, gate table (words both worlds × both widths, rAF, console, tsc), screenshot paths, requests for `_system`/`_chrome`.
