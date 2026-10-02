---
version: 1
slug: "app-design-lab-r2-apple-page-tsx"
primary_target: "app/design-lab/r2/apple/page.tsx"
related_targets: []
---

# Home · Apple world

Scope: /design-lab/r2/apple/ (home). Visitor mode: Persuade. Audience: CPP students from any major + sponsors/recruiters/faculty, weighted equally. Job: in one viewport, know what DIGITAL builds and which part could be yours; then reach build night (#join) or a build page. Proof: 4-stage build cycle, four ownership rules, 3 initiatives (status [confirm]), Venture Studies program, build night Thursdays 6:00 PM, Building 17, Room 1635. Constraints: 0 rAF at rest, ≤1 moving glyph per viewport, reduced motion = stacked stills with full parity, content visible without JS, copy budget per apple-playbook §6, legal and original (no Apple assets, names, fonts).

## Direction contract

THESIS: A product page whose product is the club's build method. The dark hero holds one live orb that becomes the page's single scrubbed asset; every other motion plays once. Refuses the student-club default of photo collage, mission paragraph and event list.

OWN-WORLD: Dark #000 hero and pin chapters → light #f5f5f7/#fff chapters, page ends light. Geist 600 display on the 80/56/48/28/21/17 scale, grey 600 leads, Geist Mono spec lines. Ink-filled pill CTA that turns signal red #b3321f on hover; red otherwise only as the orb's anchor dot. Highlights strip with snap-x cards; stat callouts with line glyphs.

STORY: Understand: four stages, one owner per subsystem. Believe: three real builds and a program. Do: come Thursday (filled CTA in local nav and the join chapter).

FIRST VIEWPORT: 52px sticky local nav (DIGITAL, Stages, Builds, Join + filled "Visit build night"). Dark chapter: centred 80px thesis, 21px grey lead, then the 440px orb centred below at rest in its Plan pose; scrolling pins it.

FORM: canon: Apple product page played straight (craft bar: measured iPhone/AirPods/MacBook pages). Signature interaction: the stage strip as a pinned 3 vh chapter; the orb morphs Plan → Prototype → Test → Integrate with one-line captions and a 4-dot stage tracker.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## W3b changes

Applied:
- P0: reduced motion keeps the H1 and lead. The page uses `_system` `useScrollSteps`, and the phase rules only apply inside the pinned media query.
- P1: no hydration flip. The pin ships in the server HTML, gated by `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)`.
- P1: a true morph. One orb, and every dot travels from the previous stage's rest pose into the next verb (angle-sorted correspondence, eased); lines cross-fade (`_home/stageScene.ts`). The orb opens on the finished Plan triangle.
- P1: captions swap out-then-in (160 ms out, 240 ms in after 160 ms); there are never two lines on screen.
- P1: rules attached to stages. Each caption is "Stage. 1 … rule" with its line glyph. The separate rules chapter is cut; the stills carry line plus rule.
- P1: one DIGITAL, one Join. `WorldNav join={false}`; the LocalNav is titled "Venture studio" (copy pending brand-voice review) with the shared "Join build night" pill as the page's one filled CTA.
- Join: shared `<JoinChapter world="apple">` with a chevron link.
- Highlights: shared `<Highlights>`. `CineClip world="apple"` with no forced aspect. Verbs keep their meaning (form = scope, seat = open role). Captions are now 11–13 words.
- The pinned sticky subtracts the 44px global bar, so the tracker is in the first viewport.

Rejected:
- None.

Deferred:
- The LocalNav tone follows the chapter (chrome, owned by W3a).
- The home-stages clip is a black box inside a light card; that needs a per-card tone in `<Highlights>`.
- The BRAIN bud rest pose looks smaller than the others (`_system`).
