# Reference analysis: 17 sites on the §21 axes

W1-REFS · 2026-10-02. Synthesizes SCOUT-1…4 (`research/scout/*.md`), 10 screenshots read in
`design-lab/references/`, and 7 WebFetch gap-fills (Launchpad projects, RC apply, YC apply, ACM about, Hack Club clubs,
MIT member companies, Darkroom work). Captures were static headless Chromium; **motion and mobile are only as deep
as the scouts saw** (`n/v` = not verified). HealthCentral: **not scouted** (HTTP 403 bot block; not evaded).
Do not copy interfaces. The tables extract principles.

Directions referenced: **A** Editorial/Studio · **B** Engineering/System · **C** Creative Technology ·
**D** Human/Community · **E** Startup/Product Studio · **F** Radical.

---

## 1. Site set (17 + 1 blocked)

| # | Site | Category (§21) | Why it is in the set |
|---|---|---|---|
| 1 | Recurse Center | developer community | Clearest "how it works" mechanism copy; funding disclosed |
| 2 | Hack Club | developer community | Maker + source link on every project; join field in hero |
| 3 | MIT Media Lab | university research lab | One glyph per group; metadata on every tile |
| 4 | Stanford d.school | innovation lab / interdisciplinary program | Hero works as an interest filter; visible column grid |
| 5 | Y Combinator | accelerator | Serif + italic emphasis; testimonials as prose with avatar chips |
| 6 | Entrepreneurs First | accelerator | Recruiting-first; speaks to the visitor with no idea yet |
| 7 | darkroom.engineering | creative technology studio | One-accent system; dictionary-definition mission |
| 8 | ACM at UCLA | student org (engineering collective) | Sub-teams as named lockups; open-to-any-major line |
| 9 | Launchpad @ Berkeley | student engineering studio | Closest structural match: projects + seasonal recruiting + real counters |
| 10 | teenage engineering | product org run like a studio | Art direction carries the brand, almost no motion |
| 11 | Nothing | product org | Dot-grid texture as structure; mono + serif pairing |
| 12 | Framework | product org | Modularity shown as a flat-lay of parts |
| 13 | Linear | product org (dev tool) | Real artefact with real data as hero; type discipline |
| 14 | Vercel | product org (dev infra) | One focal animated object; numbers beside proof |
| 15 | Raycast | product org (dev tool) | Interaction demoed inside the card; separate "build" CTA |
| 16 | Rive | product org / experimental portfolio | Labelled sample rail of real work; CLI line as a CTA |
| 17 | Playdate | product org | Short sentences with full stops; "make your own" band |
| — | HealthCentral | content publisher (user-listed) | **NOT SCOUTED: 403 bot block** (`scout/healthcentral.md`) |

Coverage of §21 categories: startup studio (Darkroom, Launchpad), engineering collective (ACM, Hack Club),
innovation lab (d.school), university research lab (MIT), developer community (RC, Hack Club), creative tech studio
(Darkroom, TE), interdisciplinary program (d.school), accelerator (YC, EF), product orgs (Framework, Linear,
Vercel, Raycast, Rive, Playdate, Nothing, TE), experimental portfolio (Rive, TE).

---

## 2. Structure and visual axes

| Site | Homepage narrative | Typography | Navigation | Grid / whitespace | Motion | Mobile |
|---|---|---|---|---|---|---|
| Recurse Center | claim → 3 workspace photos → how it works → 1 big quote → recruiting → alums | Inter only; H1 54/700, H2 32/**200** | flat 6 links + green Apply button | photo strip edge-to-edge, then a ~560px reading column | none seen | single column, same scale |
| Hack Club | claim + email field → member projects → events → video proof → join again → donors | display serif 90/400 + humanist sans 20px body | 7 links + dark-mode toggle + filled join pill | centred ~1030px; photo collage bleeds out | tilted collage, wavy dividers (n/v) | email + button stay on one row; collage reduced |
| MIT Media Lab | full-bleed photo + tagline → square tile mosaic (news/research/people mixed) → membership → footer | Neue Haas Grotesk Display only, 45/700 | vertical left-hand text nav in a white panel | 4-col 360px tiles, hard edges, no radii | looping hero image (n/v) | n/v |
| d.school | "curious about [filter]" hero → tilted type-tagged cards → torn red strip about line → content grid | Signifier serif (bold + italic accent) + GT America light | centred logo, search pill, dot-menu | 8-col hairline grid visible; cards ±3° | scroll-triggered cards (blank in headless) | n/v |
| Y Combinator | serif claim with italic phrase + footnote → founder quotes as prose → partners → cases → apply | Source Serif 4 display/body + Outfit UI caps 11px | 6 links around a centred logo tile + black Apply pill | centred 520px column, very large vertical rhythm | minimal fades | n/v |
| Entrepreneurs First | violet hero with stacked serif caps → testimonial band → numbered claims → apply | PS Times orange 74 + Neue Haas 18/700 | bracketed corner labels | left stagger, ~650px column, dashed rules | none seen | n/v |
| Darkroom | 200px pixel-display H1 → dictionary definition + 1 paragraph → 3 work entries full-bleed → clients, OSS tools, services | custom display + all-caps mono 10px body | red-boxed text nav; fixed footer bar with one ask | vw-fluid grid, 1px rules, 4 cols mobile | full-bleed project video (no fallback seen) | H1 wraps to 2 lines, nav → menu icon, very legible |
| ACM at UCLA | tile-pattern hero + tagline → open-to-all paragraph → 9 committee lockups → sponsors → news | Poppins 36.8/700 + Open Sans 16 | 4 links + outlined member button | centred 760px intro, 3-col grid, short page | none seen | n/v |
| Launchpad | painted hero + identity line → counters (66/53/17) → dated recruitment → 3 projects → sponsors | Montserrat + Newsreader light serif H2 | navy bar + red Apply pill | 1100px, alternating cream/white bands, rounded cards | none seen | n/v |
| teenage engineering | pictographic nav → illustrated editorial poster → product cells → collage launch banners | proprietary te-20/40 + per-campaign display faces | 4 icon + label groups, no dropdowns | scales from a 980px design width; 1px hairline cells | almost none | full-width product tiles, one per screen |
| Nothing | dark hero object + mono label + serif headline → category tiles → campaign stories | dot-matrix display + serif headline + mono labels | floating pill nav | ~115px dot grid behind every section | Lenis + blur washes | geo + cookie modals cover the first screen |
| Framework | dark product hero with spec sentence → mono ticker → one panel per product → ethos → parts carousel | Graphik + DM Mono + pixel face | product families left, utility right | ~40px margins, stacked 16px-radius panels | 6 product loop videos | image → headline → specs → CTAs stacked |
| Linear | 2-line claim + changelog link → product frame with real data → feature index → label/body pairs | Inter Var 510, -1.4px at 64; Berkeley Mono | thin nav + Sign up pill | 1320 max, 80px margins, left label / right body, hairlines | fade-in + slight parallax; dim pre-reveal | product frame crops off the right edge (signals more) |
| Vercel | claim + 2 CTAs + one WebGL shape + audience list → logo row → sections each with a customer frame + stats | Geist 400-450, -3.84px at 64 | slim nav + 3 buttons | 24px margins, hairline cells | one focal WebGL object; logo marquee | object → H1 → stacked CTAs; scramble text caught mid-frame |
| Raycast | glow-ribbon hero + download → launcher demo → principle → store → AI → bento → dev CTA | Inter 600 + mono + Instrument Serif italic accent | floating glass nav | ~1200px cards, radius tokens 4-24 | WebGL ribbons; typing demos in cards | long empty gap after hero |
| Rive | labelled sample rail (left) + claim + install panel (right) → named users → runtimes → logo wall | Orbitron 900 caps + Inter + mono | 6 links + Get Started | ~1000px, 1px borders, 4px radius | 10 loop videos + canvas | samples → swipe row above H1 |
| Playdate | 3D device + one plain sentence → yellow field sections, one claim each → games → "make your own" → price → specs | Roobert 700-800, sentence headings with full stops | 6 links + purple Shop pill | ~800px reading column in colour fields | Three.js device; 2 videos | device → sentence → wordmark → CTA, yellow straight after |

---

## 3. Content axes

| Site | Copywriting register | Project presentation | Project detail pages | Proof | Joining / recruiting | Partner / sponsor language |
|---|---|---|---|---|---|---|
| Recurse Center | states mechanism (cadence, rituals); no hype | none on home (gap) | n/a | 1 large quote with face + batch label; alum count | always-open; 4 steps (written → 25-min chat → pairing → confirm); "do it in an evening" | companies as hiring destinations; funding model stated plainly |
| Hack Club | second-person stem repeated to chapter the page | maker name/age/place + play link + source link | n/v | event clips, repeated execution, club count | one email field in the hero, repeated 3×; 3 paths (start / convert / join chat) | donors named by role; support, not endorsement |
| MIT Media Lab | forward-looking optimism with a qualifier | tile = image + group glyph + headline + dek + source/date/group/tags | yes (research posts) | named fellows, recognitions | n/a (institutional) | members "co-create"; benefits listed (early access, IP, talent); the money is not stated |
| d.school | curiosity prompt; playful but institutional | cards tagged by type + category | n/v | alumni headshot + name | audience-split entry (degree / elective / workshop / self-paced / newsletter) | minimal ("affiliate") |
| Y Combinator | one bold claim; key word defined in a footnote | company before/after with numbers | n/v | founder quotes as running text with avatar chips | 6 steps (apply → decision date → video interview → same-day answer); late apps still read; feedback promised | partners framed as former founders (peers) |
| Entrepreneurs First | addresses the visitor who has no idea and no cofounder | founders + exit/backer line | n/v | valuations | 3 routes: apply / stay in loop / work here | backer names as authority |
| Darkroom | dictionary definition + competence claim | huge title + full-bleed media + 1 honest line ("a small sample") | yes: case studies, some with Markdown versions; index is name + 1-2 sentences, no structured metadata | clients, OSS tools they maintain | n/a (agency); recurring footer ask = sponsor OSS | open-source sponsorship as the ask |
| ACM at UCLA | inclusive, plain | committees are the product; each = icon + colour + one-line promise | committee pages (n/v) | award + competition headlines | no requirements or cost; portal + newsletter + chat | own sponsors section; little copy |
| Launchpad | identity line + earnest adjectives | featured: numbered 01-05, big images, demo/code links. Archive: logo + title + 1 sentence + repo/demo | **none** (all on one page); no team, dates or outcomes | real counters (projects / members / semesters) | dated recruitment week with named events and a deadline; Apply pill in nav | thank-you + logo wall; separate students / companies paths |
| teenage engineering | jokey, editorial, story-first | object on flat grey + name + text link | product pages (n/v) | the objects + art direction; no logos | n/a | none |
| Nothing | claim-as-story (a concrete test) | hero object + 1 line | n/v | ambassador stories, test narratives | community link in footer | none |
| Framework | plain, specific numbers in every sentence | flat-lay of real parts | yes (configurator, n/v) | specs, repair guides, Linux support | n/a | n/a |
| Linear | understated; changelog link instead of hype | real product UI with realistic data | n/v | data inside the mock + customers link | single Sign up repeated nav/footer | n/a |
| Vercel | compressed claims | customer site frames + stat row | case studies (n/v) | logo wall + numbers | 3 buttons (demo / log in / sign up) | named customer cases |
| Raycast | short imperative section titles | interaction demo inside the card | n/v | extension count, changelog freshness | platform-aware download + separate builder CTA | n/a |
| Rive | use-case labels on real samples | labelled looping samples | n/v | named users + a company-claimed reach stat | CLI one-liner beside Sign up | runtime/integration logos |
| Playdate | one sentence + full stop per section; warm, funny | device + screens of games | game pages (n/v) | catalogue, education use | Shop pill + quieter developer site link | n/a |

---

## 4. Cross-cutting patterns (counts from the 17)

1. **The real artefact is the hero.** 9 of 17 lead with the actual thing (Linear UI, Framework laptop, Playdate device,
   Rive samples, Nothing, TE, Vercel shape, Darkroom work, Hack Club projects). The weakest heroes (Launchpad painting,
   Raycast ribbons, EF violet field) show mood and no object.
2. **One accent, imagery supplies the rest.** 12 of 17 run near-monochrome chrome with one signal colour (RC green,
   YC orange, Darkroom red, Framework orange, MIT magenta, TE orange, Playdate yellow, Hack Club red, Rive green) or none
   (Linear, Vercel, Nothing). Multi-accent systems (ACM committees,
   d.school pastels) need a rule or they read as a template.
3. **Mono for metadata, one other family for voice.** Linear, Vercel, Nothing, Framework, Rive, Darkroom, motion.dev all
   use a mono for IDs, labels and status. The voice face is either a tight grotesk with negative tracking that grows
   with size (Linear, Vercel) or a serif with one italic phrase (YC, d.school, Hack Club, EF). **No site in the set pairs
   serif + mono for an engineering org.** That pairing is open for DIGITAL.
4. **Mechanism beats adjectives.** The most credible orgs explain *how it works*: RC (cadence), YC (steps + decision date),
   Launchpad (dated recruitment week), Framework (numbers in every sentence). Vague "imagine" taglines (MIT, ACM) are the
   weakest lines in the set.
5. **Projects: few sites show who / disciplines / status / outcome.** Hack Club shows maker + links. MIT shows metadata.
   Launchpad shows a sentence and no team. **No one shows a discipline roster, duration and status together** →
   this is DIGITAL's opening (§41, Build Record anatomy).
6. **Proof without testimonial cards.** Quotes as prose with avatar chips (YC), one quote with face + cohort label (RC),
   real counters (Launchpad), claim-as-test-story (Nothing). Logo walls appear only where the relationship is real.
7. **Joining is a mechanism with a date.** Best flows state steps + time cost + date (RC 4 steps, YC 6 steps, Launchpad
   recruitment week). Lowest friction: one field in the hero (Hack Club). Builders get a second, separate CTA (Rive CLI,
   Playdate dev site, Raycast build).
8. **Audience split at the foot.** Launchpad, EF, d.school, Hack Club route members / companies / supporters separately
   instead of mixing them in one CTA.
9. **Motion is rare and single.** 0 of 17 exposed GSAP globals (window-only detection); 1 had Lenis (Nothing). Where motion exists it is one focal
   object (Vercel, Playdate) or demo-inside-card (Raycast). Personality came from art direction (TE, Darkroom), not
   animation.
10. **Mobile:** 0 horizontal overflow in 7 of 7 product captures that loaded (Nothing blocked by modals); good patterns = cropped swipe row signals
    more (Rive, Linear), hero object first then claim (Vercel, Framework, Playdate). Bad = stacked modals (Nothing), long
    empty gap after hero (Raycast).

---

## 5. Steal as principle / avoid — for DIGITAL

### Steal as principle

| # | Principle | Source sites | Best directions |
|---|---|---|---|
| 1 | Hero shows a real DIGITAL artefact (phone subsystem schematic, Smart Reading RSVP beat) with real fields, not a slogan over a field | Linear, Framework, Playdate, Rive | all; B, E strongest |
| 2 | Project entry = title + problem + discipline roster + status + duration + links, with metadata in mono | MIT tiles, Hack Club, Launchpad (inverse) | B, E, A |
| 3 | Show "different majors, one product" as a flat-lay: the 7 smartphone subsystems as parts on one table | Framework, ACM lockups | B, C, E |
| 4 | Explain the mechanism (one owner per subsystem, one review path, one test gate) instead of adjectives | RC, YC, Framework | all |
| 5 | Join flow = numbered steps + time cost + a date ([placeholder] until the club sets one); builders get a second CTA | RC, YC, Launchpad, Rive | D, E |
| 6 | Proof only from real things: named mentor (Dr. Mohamed El Hadedy is the only real named person), real build photos when they exist, honest status lines | RC, YC, Darkroom ("a small sample") | all |
| 7 | One accent (production `#d8412f`) on CTA + markers only; imagery and project media supply the rest | Darkroom, YC, RC | A, B, E |
| 8 | Serif voice + mono metadata: the untested pairing in this set | gap in set | A, B |
| 9 | One focal motion object per page; everything else is a reveal or hover feedback | Vercel, Playdate | C, F (focal), others (restraint) |
| 10 | One signature texture used as structure (dot grid, hairline grid, glyph per project) | Nothing, d.school, MIT | B, F |
| 11 | Hero as a filter by discipline ("I study ___ → here's your subsystem") | d.school | D, F |
| 12 | Repeated second-person stem to chapter the homepage | Hack Club | A, D |

### Avoid

| # | Avoid | Seen at | Why for DIGITAL |
|---|---|---|---|
| 1 | Painted gradient / space / violet hero | Launchpad, EF, Raycast | §39 generic startup/AI look |
| 2 | Logo walls or stats we can't back | Vercel, Rive, Launchpad | No verified partners; siteConfig stats are unverified (`audit.md` §8) |
| 3 | Valuation / elite tone ("top 1%") | YC, EF | Wrong for an open student org |
| 4 | Thin project cards (thumb + 1 sentence, no team) | Launchpad archive, ACM | Contradicts §41 |
| 5 | All-caps 10px mono body | Darkroom | Fails AA and readability |
| 6 | Tilted pastel cards, sticker whimsy | d.school, Hack Club | Reads design-school or teen brand |
| 7 | Content hidden until scroll-reveal (blank first paint) | d.school, Linear dim state | Fails no-JS / reduced motion |
| 8 | Modals or cookie banners over the hero | Nothing, Framework, EF | Delays content |
| 9 | Autoplay video without poster / fallback | Darkroom, Rive (10 videos) | Performance (§43) |
| 10 | Many motion effects at once | Raycast, MotionSites | §9: one focal object |

---

## 6. Gaps

1. HealthCentral not scouted (403). Needs a manual browser view by the user (~5 min).
2. Project detail pages verified for 2 sites only (Launchpad: none; Darkroom: case studies). Others marked n/v.
3. Mobile and motion for SCOUT-4 orgs: static captures only. A live pass needs the chrome-devtools MCP (broken this session).
