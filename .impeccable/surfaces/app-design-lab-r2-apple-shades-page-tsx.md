---
version: 1
slug: "app-design-lab-r2-apple-shades-page-tsx"
primary_target: "app/design-lab/r2/apple/shades/page.tsx"
related_targets: []
---

Scope: /design-lab/r2/apple/shades (lab, round 2, Apple product page played straight). Mode: Experience. Audience: prospective members and sponsors/faculty equally. Job: present SHADES as the product it will be, let the visitor try the reading method, show the light path, tracks, roadmap [confirm] and roles, and route to "Join the build". Proof: Notion SHADES facts and lib/data glasses facts, all [confirm]; no medical or efficacy claims; only named person is mentor Dr. Mohamed El Hadedy. Constraints: legal and original (no Apple assets, names or SF fonts), one scrubbed asset, clips play once on entry with a control, reduced motion collapses the pin, Atkinson Hyperlegible Next for body and RSVP plus a "more spacing" setting in the local nav.

## Direction contract

THESIS: the reader's own eye is the product shot. Black hardware chapters hold one dotted line drawing of the glasses and one word at a time; the page refuses a stock 3D model, invented specs, and any promise about dyslexia.

OWN-WORLD: black chapters flipping once to white and #f5f5f7, Geist 600 headlines on six sizes, Atkinson Hyperlegible Next for every lead, caption and the RSVP word, dotted line art (round-cap dash dots) as the only imagery, one filled pill in the 52px local nav, red only on that pill's hover and the fixation anchor.

STORY: meet the glasses, see the eyes chase a line, watch one word land, try it at your own pace, follow the light from laptop to eye, skim the highlights, read the two tracks and the boundary, see the 7 phases, pick a role.

FIRST VIEWPORT: black chapter, centred: SHADES at 28px, the 4-word headline at 80px, one grey lead line, a text link "Try the reader". Below, the glasses drawn front-on in dots at about 760px wide, one word glowing inside the right lens. Local nav pinned with "Join the build" filled.

SIGNATURE: a pinned light-path chapter: one scrubbed asset (clip shades-lightpath, or the light-path diagram) carries the ray from text source through FPGA timing, control, display and optics to the eye's fixation point, with a one-line caption per stage swapping in place; shades-fixate plays once on entry above the live reader.

FORM: canon: Apple product page played straight (craft bar: measured iPhone/AirPods/MacBook pages)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied (15):
1. Honesty: "Medical claims" removed from the compare list; the boundary gains a permanent "Never: Medical claims, now or later." line; "Not a medical device" now renders at ink-1. Hero foot carries the full name + "A research platform. Not a medical device." + status "Planning [confirm]".
2. Light path: clip re-rendered by CINE (chip at WORD TIMING); captions switch with markerIndex('shades-lightpath', p) on the same p the clip gets via ref.setProgress (no per-frame React state); world="apple" on both clips; fallback diagram steps on the same index.
3. "Take a closer look." replaced by "Part by part." on the shared <Highlights> strip (page copy deleted).
4. Forked local nav deleted: shared <LocalNav> with the spacing toggle in its utility slot (mobile section menu included); WorldNav join={false}; the one filled CTA is the LocalNav pill "Join build night" → #join.
5. Join: shared <JoinChapter world="apple"> with SHADES seats as links; primary "Come to build night" as a chevron link, Discord secondary. The page now ends on an action.
6. Reader: Read is an outline pill (one filled pill per viewport); K / ← → hint on screen; sentence printed once paused or finished; speed hidden under reduced motion; spacing control lives only in the nav.
7. Scanpath two-row layout below 735 px; "Illustrative, not recorded data" as an HTML figcaption (14 px).
8. RSVP expanded in visible text (reader lead) instead of a hover-only abbr.
9. Leads: Atkinson 500 at line height 1.5 (was 600 / 1.45).
10. Light chapters lose the forced 100svh min-height (160 px padding, content height).
11. fontReadingText replaces the page-local --font-read; --reading-spaced-* tokens.
12. PlayOnce / PlayOnceStage from _system replace the page copies (FixateClip deleted).
13. Easing tokens replace raw cubic-beziers.
14. Mentor line moved beside the boundary.
15. Unused "Your eyes do not travel." field deleted.

Rejected (1): merging tracks and scope into one chapter (the compare list is its own idea; the copy budget passes without it).

Deferred (2): the shades-fixate clip paints the pivot letter red (CINE owns the render; request filed); clip stage labels are small at 390 in the 4:5 render (CINE).
