# SCOUT-4 summary: organization / studio / lab / community
Method note: shared chrome-devtools MCP was down (Target closed) for the whole run, so captures used a standalone headless Chromium script (design-lab/scripts/scout4-shoot.mjs). Desktop 1440 + mobile 390 + 2 scroll shots + tokens per site in design-lab/references/<slug>/. Motion and mobile were NOT analysed in depth (static captures).

## Pick list (9; blueprint.stanford.edu failed DNS and was dropped)
1. recurse-center: builder community; clearest "how it works" copy, funding disclosed, no hype.
2. hack-club: builder community; inline one-field join, projects with maker + play + source links.
3. mit-media-lab: university lab; per-group glyph system, tile grid mixing research/news/people.
4. stanford-dschool: university innovation lab; curiosity-filter hero, rotated micro-labels, visible column grid.
5. y-combinator: accelerator; serif + italic emphasis, testimonials as prose with avatar chips, single apply CTA.
6. entrepreneurs-first: accelerator; 3-colour saturated system, "you might have nothing" recruiting copy.
7. darkroom-engineering: creative-tech studio; one-accent red/black mono system, dictionary-definition mission, work-first.
8. ucla-acm: student org; sub-teams as named lockups, "open regardless of major".
9. berkeley-launchpad: student engineering studio; closest structural match (projects + seasonal recruiting + sponsors + real counters).

## Cross-site patterns
- Mission rhetoric: the best ones state mechanism or definition, not adjectives (RC weekly rituals, Darkroom noun-definition, YC "turns builders into X"). Hack Club chapters the page with a repeated second-person stem. Weak ones: bare "imagine/code the future" taglines (MIT, ACM).
- Inclusive entry line appears everywhere in one sentence (ACM: any major/skill; EF: "you might have nothing"; Hack Club: any teen). Say it once, early, plainly.
- Project showcase: strongest = maker + status + two links (use it, read the source) (Hack Club) or full-bleed media with one honest line (Darkroom). Weakest = thumbnail + one sentence (Launchpad). Few sites show discipline rosters, outcomes, or duration: opening for DIGITAL.
- Proof without testimonial cards: avatar chips inline in prose (YC), one big quote with real face + batch label (RC), real counters (Launchpad 66 / 53 / 17), award and competition headlines (ACM). Never invent numbers; use only real ones.
- Recruiting flow: join field in the hero (Hack Club), dated seasonal recruitment moment (Launchpad), persistent nav Apply pill (RC, YC, Launchpad). Split by audience at the foot: members / companies / sponsors.
- Partner/sponsor language: two registers. Transactional-honest (RC states how it is funded) or thank-you logo wall (Launchpad, Hack Club donors named by role). Collaborative "member company joins to advance X" at MIT. Avoid logo walls that imply endorsement we don't have.
- People: avoid bio-card grids; show faces in context (workspace photos, mid-build team photos, tiny avatar chips). MIT shows people as recognitions, d.school as headshot + name.
- Identity systems: one custom glyph/pattern per team (MIT groups, ACM tile pattern, sub-brand lockups) keeps many disciplines legible under one roof. Single accent colour + imagery-supplied colour (Darkroom, YC, RC) beats multi-hue.
- Typography trend: serif display with italic accent word (YC, d.school, Hack Club, EF) vs grotesque/mono (MIT, Darkroom). Serif + mono pairing is untested in this set: opportunity for an "engineering lab with editorial voice" register.
- Motion: little in the orgs (static, restrained); heavy only in Darkroom (video). Not deeply analysed.

## What to avoid (matches BRIEF section 39)
- Painted gradient/space hero (Launchpad), violet ground (EF), pastel tilted cards (d.school) read as generic AI/startup or design school.
- Valuation boasting and "top 1%" gatekeeping (YC, EF) wrong for a student builder org.
- All-caps 10px mono body (Darkroom) fails readability/AA.

## Gaps
- Not covered: Buildspace (defunct), Blueprint Stanford (DNS fail), 21st.dev (excluded). Mobile/motion behaviours need a live-browser pass if the MCP recovers.
