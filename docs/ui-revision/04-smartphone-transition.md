# 04 — Smartphone Entry Transition

Route: `/projects/modular-smartphone`. Governing spec: `docs/design/smartphone.DESIGN.md`.

Symptom as reported: *"after the initial animations the title appears extremely quickly, the
transition into the page feels abrupt, and the sequence lacks continuity."*

## 1. Current sequence

`next.config.js:4` sets `output: 'export'` in production, so this route ships as prerendered
static HTML. `showLoader` starts `false` (`PhoneV2Experience.tsx:24`), so **the prerendered
HTML contains the entire finished page and no loader**. Everything below follows from that.

| # | t | Owner | What happens |
|---|---|---|---|
| 1 | first paint | static HTML | The complete un-animated page paints: hero eyebrow, **H1 at 100% opacity**, subline, CTAs, hero schematic at `progress={0.96}` (`Hero.tsx:75`), toolbox, 7 subsystem articles, 8 schematics, Build Scope band, FinalCta |
| 2 | +JS download & hydrate | React | Same picture, now interactive. Uncapped duration |
| 3 | first commit | `TextReveal` ×12 | Hero's four bail out: `if (disabled) { return; }` (`TextReveal.tsx:40-42`) — text stays plain and visible |
| 4 | first commit | `PhoneV2Experience.tsx:29-35` | matchMedia reduced-motion resolves |
| 5 | first commit | `PhoneV2Experience.tsx:37-50` | `requestAnimationFrame` scheduled |
| 6 | +1 frame (+2 in dev StrictMode) | React | `setShowLoader(true)` → **loader hard-cuts in**, `fixed inset-0 z-[60] bg-[#0F172A]` (`Loader.tsx:211`), no enter transition |
| 7 | 0–520ms | anime.js timeline (`Loader.tsx:101`) | wordmark 380ms @0, tagline 320ms @120, scrubber 320ms @200 (`Loader.tsx:119-121`) |
| 8 | 260–2500ms | anime.js | 7 stage draws: `OPEN_MS 260`, `STAGE_MS 320`, `STAGE_COUNT 7` (`loaderSequence.ts:20-21,34`); explode `0.12→0.95` (`loaderSequence.ts:42-43`) |
| 9 | 2500–2800ms | anime.js | Hold, `CLOSE_MS 300` (`Loader.tsx:137`) |
| 10 | 2800–3020ms | anime.js | `dismiss()` → loader fades 1→0 over `OUTRO_FADE_MS 220` (`Loader.tsx:87-92`) — **uncovering the already-lit H1** |
| 11 | 3020ms | `completeLoader` (`PhoneV2Experience.tsx:52-63`) | Page fades `0.96→1` over 220ms; `setShowLoader(false)` |
| 12 | 3020ms, same commit | React | Loader unmounts **and** `revealReady` flips true |
| 13 | 3020ms, layout phase | `TextReveal` | `new SplitText` + `gsap.fromTo({yPercent:110, opacity:0}, …)` (`TextReveal.tsx:48-71`) — **the visible title is re-hidden and replayed** |
| 14 | 3020–4300ms | GSAP | Title rises a second time; line delays `index*0.12`, subline `delay={0.4}` |

Perceived: ~3s of loader on top of an already-painted page, with the title revealing twice.

## 2. Diagnosed causes (ranked)

**1 — The loader is mounted *after* the page instead of gating it.**
`useState(false)` (`PhoneV2Experience.tsx:24`) + `rAF → setShowLoader(true)` (`:44-46`). The
finished page is serialized, painted, and visible for the whole hydration window before the
loader covers it. With `output: 'export'` that window is *widest in production* — the classic
"feels fine locally, wrong in prod."

**2 — `TextReveal`'s `disabled` renders text *visible*, not hidden.**
`if (disabled) { return; }` (`TextReveal.tsx:40-42`) has no `opacity:0` pre-state. So the H1
(`Hero.tsx:21-34`) sits at full opacity behind the loader, is **uncovered by the loader's
220ms fade**, then re-hidden and replayed when `disabled` flips. 220ms is exactly "extremely
quickly," and the double reveal is exactly "lacks continuity."

**3 — The handoff is two sequential fades with an unmount in the seam — no crossfade.**
Loader 1→0 (`Loader.tsx:87-92`) *then* `finish()` (`:80`) *then* page 0.96→1
(`PhoneV2Experience.tsx:56-60`) *then* unmount. 440ms of animation that never overlaps.
`framer-motion` is installed but **not imported anywhere under `components/phone-v2/`** — there
is no `AnimatePresence`, no exit animation, no presence coordination on this route at all.

**4 — The page-level `0.96` opacity animation lets the site's *light* wash paint over the dark page.**
`animate(rootRef.current, {opacity:[0.96,1]})` (`PhoneV2Experience.tsx:56-60`) creates a
stacking context. `globals.css:38-47` puts the industrial-studio near-white radial
(`--studio-hi: #eceae9`) on `body::before` at `z-index:0`, and `globals.css:59-62` lifts
`section` to `z-index:2` to sit above it. Inside the new stacking context that escape no longer
applies, so for 220ms the light sweep and grain paint over the entire dark page — a flash timed
precisely to the handoff.

**5 — Reveal readiness is a render-phase ref read, not state.**
`revealReady={loaderDismissedRef.current || reduceMotion}` (`PhoneV2Experience.tsx:89`) only
works because `setShowLoader(false)` on the next line coincidentally forces a re-render. Hero
has no independent path to re-render, so loader unmount and title reveal are welded into one
commit and can never be sequenced or overlapped.

**6 — Duplicate latches and duplicate reduced-motion paths.** `didCompleteRef`
(`Loader.tsx:39`) and `loaderDismissedRef` (`PhoneV2Experience.tsx:27`) guard the same event.
`Loader.tsx:50-53` re-implements a reduced-motion dismissal the parent already handles
(`:37-42`) and, if reached, would still fire the parent's 220ms opacity animation —
`completeLoader` has no reduced-motion branch.

**7 — The loader waits on nothing real.** Pure wall clock (`loaderSequence.ts:20-35`,
`Loader.tsx:101`). No `document.fonts.ready`, no hydration signal, while `next/font` uses
`display:'swap'` (`app/layout.tsx:10-29`) and `SplitText` bakes word/line geometry at split
time. The loader can finish before Archivo swaps, splitting the `clamp(44px,7vw,100px)`
`tracking-[-0.05em]` H1 against fallback metrics → clipped or misaligned masked words.

**8 — Per-frame `setState` during the loader.** `onUpdate: setElapsed(self.currentTime)`
(`Loader.tsx:104-105`) re-renders a 14-group SVG at 60fps for 2.8s, while `WorkflowRail`'s
infinite loop (`WorkflowRail.tsx:62-78`), the `SubsystemStage` scroll timeline, and 7 offscreen
`SplitText` constructions run behind the overlay.

**Spec conformance:** `smartphone.DESIGN.md:118` mandates the loader plays on every visit;
`:269-285` specifies the 2800 + 220ms budget, which the code matches; `:263` says hero elements
"remain disabled until the loader is dismissed," which the code implements literally. The spec
never defines what *disabled* should look like, never specifies overlap between loader outro
and hero entrance, and never addresses what is on screen before the loader mounts. **The
implementation is spec-compliant; the spec has a hole exactly where the symptom is.** Closing
that hole is a spec amendment, not a redesign.

## 3. Options considered

### Option A — Overlapping handoff
Loader exits while the hero enters; shared background stays lit; title introduced during the
overlap.
- Fixes cause 3 and part of 2. **Does not fix cause 1** — the page is still painted before the
  loader mounts. Medium complexity. Needs the two fades merged into one owner.

### Option B — Persistent title transformation
The loader's wordmark becomes the hero H1 via a shared-element transition.
- Strongest continuity, highest complexity. Requires FLIP measurement across an unmount
  boundary, and the loader wordmark ("DIGITAL") is not the hero headline ("One device. / Owned
  in parts. / Take a subsystem.") — there is no shared string to morph. Also the most exposed to
  the font-swap measurement risk (cause 7). **Rejected: cost and risk out of proportion.**

### Option C — Persistent page shell (loader as overlay over an already-mounted page)
The page shell is present from the first byte; the loader is an overlay that *covers* it from
first paint, and its final state reveals content already in place.
- Directly addresses cause 1 (nothing is painted uncovered), cause 3 (one element fades, one
  owner), and cause 4 (no page-level opacity animation needed). Cheapest to implement because
  the page is *already* unconditionally mounted — the change is to the loader's presence model,
  not the page's.
- Requires a CSS-only pre-state so the overlay exists before JS (static export has no
  server-side "loading").

## 4. Recommendation — C as the base, plus A's overlap and 2's pre-state

Three coordinated changes; no new dependency, no arbitrary delay, and the 2800 + 220ms budget
in `smartphone.DESIGN.md:269-285` is preserved.

**C1. Loader present from first paint, not after hydration.**
Render the loader shell in the server output (`showLoader` initial `true`, or a CSS-only
`.phone-loader-veil` painted by the prerendered HTML) and let JS *dismiss* it rather than
summon it. Remove the `requestAnimationFrame` at `PhoneV2Experience.tsx:44`. Reduced motion
dismisses it on the first client effect, before the timeline initializes — preserving
`smartphone.DESIGN.md:318`.

**2a. Give `disabled` a real hidden pre-state.**
`TextReveal` must render `opacity:0` (a class, so it works pre-JS) when `disabled`, not plain
visible text. Add a paired `.text-reveal-armed { opacity: 0 }` plus a `<noscript>`/failure
fallback that forces `opacity:1`, so content is never withheld if JS fails. This alone removes
the 220ms "fast title" and the double reveal.

**A1. One owner, one overlapping transition.**
Move the handoff into a single state machine in `PhoneV2Experience`
(`'booting' | 'handoff' | 'ready'`) held in `useState`, not a ref. On entering `handoff`: start
the loader's 220ms fade *and* the hero's `TextReveal` timeline together, so the title rises
through the departing loader instead of after it. Delete `didCompleteRef`
(`Loader.tsx:39`), the redundant reduced-motion branch (`Loader.tsx:50-53`), and the page-level
`0.96→1` opacity animation (`PhoneV2Experience.tsx:56-60`) — the last of which also removes the
light-wash flash (cause 4) with no replacement needed.

Supporting fixes: gate the loader's completion on `document.fonts.ready` **with a timeout cap**
(cause 7 — cap it, never extend past the existing budget); replace the per-frame `setElapsed`
with a motion-value/ref so the scrubber updates without re-rendering the SVG (cause 8).

### State diagram

```
                  ┌─────────────────────────────────────────────┐
   first paint    │ booting                                     │
   (no JS)        │  overlay: opaque (CSS, in prerendered HTML)  │
                  │  hero:    .text-reveal-armed → opacity 0    │
                  └───────────────┬─────────────────────────────┘
                                  │ timeline complete (2800ms)
       reduced motion ────────────┤ AND document.fonts.ready (cap 1000ms)
       (skip to ready)            │
                                  ▼
                  ┌─────────────────────────────────────────────┐
                  │ handoff  (220ms, one owner, overlapping)    │
                  │  overlay: opacity 1 → 0                     │
                  │  hero:    TextReveal timeline STARTS NOW    │
                  └───────────────┬─────────────────────────────┘
                                  │ overlay opacity 0
                                  ▼
                  ┌─────────────────────────────────────────────┐
                  │ ready — overlay unmounted, scroll unlocked  │
                  └─────────────────────────────────────────────┘
```

The unmount now happens *after* the title is already moving, so there is no commit in which the
title's state resets.

### Timing variants to prototype

| Variant | Loader body | Handoff overlap | Note |
|---|---|---|---|
| Restrained | 1800ms (4 stages) | 180ms | Fastest to useful content |
| **Balanced (start here)** | **2800ms (current, 7 stages)** | **320ms** | Keeps the approved budget; only the overlap is new |
| Cinematic | 2800ms | 520ms | Risks re-introducing a "slow" read |

Select the shortest variant that still reads as continuous — start Balanced, since it changes
timing values not at all and only adds overlap.

### Reduced motion

`prefers-reduced-motion: reduce` → state machine jumps `booting → ready` on the first client
effect. Overlay never initializes its timeline. `TextReveal` drops `.text-reveal-armed`
immediately (its existing check at `TextReveal.tsx:44-46` already returns early). No opacity
animation on the page root, because that animation is being deleted outright. Content is fully
present and interactive; nothing is withheld.

### Failure behaviour

If JS never runs, the CSS overlay would trap the page — so the overlay markup carries a
`<noscript>` style block that hides it and un-arms `.text-reveal-armed`. Content access is
preserved when animation fails, per §12.3 of the brief.
