# 02 — External Visual Research

**Method note / limitation.** Outbound `WebFetch` in this environment is refused (HTTP 403) by
most design-forward marketing sites and by `media.mit.edu`, `pentagram.com`,
`dec.studentorg.berkeley.edu`, `hackclub.com`, and `blueprint.berkeley.edu`. No screenshots
were captured. Findings below are drawn from search-result summaries and cited sources, and are
recorded as **patterns**, not as pixel observations. Where a claim could not be verified
first-hand it is marked *(reported)*.

**The repository's landing page remains the brand authority.** Nothing here replaces
`docs/design/landing.DESIGN.md`; these references only inform how a *system* extends across
many secondary pages.

---

## 1. Navigation and information architecture

**MIT Media Lab** — `media.mit.edu` *(reported)*
- **Pattern:** one underlying 7×7 grid generates both the parent identity and a distinct glyph
  for each of 23 research groups; content flows as "blocks" within that grid, and the negative
  space between blocks is treated as part of the composition.
- **Why useful:** it is the exact problem DIGITAL has — many sub-entities (projects,
  sub-teams, channels) that must read as one organisation without becoming identical cards.
- **Transform for DIGITAL:** the landing already owns a registration-mark vocabulary (`+`
  crosshairs in a 4×4 perimeter grid, ✳ star dividers, bracketed mono captions —
  `landing.DESIGN.md:119, 124, 209`). Extend *that* as the per-entity mark system: each project,
  team group, and community channel gets a mono glyph in a bordered chip, exactly as the thesis
  and pathway cards already do (`landing.DESIGN.md:129, 134`).
- **Do not copy:** the 7×7 monogram construction, Helvetica, or the block-grid layout itself.
- **Concerns:** a glyph-per-entity system fails silently for screen readers. Every glyph must be
  `aria-hidden` with the real label in text — the landing already does this for ✳ dividers
  (`landing.DESIGN.md:231`).

**Developer-tool / infrastructure sites — the "blueprint grid" convention** *(reported)*
- **Pattern:** a visible technical grid signals engineering seriousness; it has become the house
  style of dev-tools and infra products.
- **Why useful:** DIGITAL is a hardware/software student org; the register is right.
- **Transform:** DIGITAL's equivalent already exists and is warmer — hairline rgba-of-ink rules
  and the −45° stripe plate. Use *hairlines and stripe plates*, not a literal blueprint grid.
- **Do not copy:** dark-on-dark grid backdrops. The landing is a light parchment system; a
  glowing grid would import an alien atmosphere.

---

## 2. Editorial typography

**Pattern observed across research-lab and studio sites:** a hollowed-out type scale — one
display register, one body register, one dense micro/label register, with no mid-size subhead
tier — makes long informational pages (team rosters, guides, legal text) scan as documents
rather than as marketing.

- **Why useful:** the secondary pages carry exactly this kind of content (bios, channel
  descriptions, legal prose) and currently use a *seven-value* top-padding scale and three
  different card opacities.
- **Transform:** adopt the landing's declared three-register system verbatim — Newsreader for
  promise, IBM Plex Sans 600 for proof headings, IBM Plex Mono for the entire annotation layer
  (`landing.DESIGN.md:235`). §"Scale Philosophy" already forbids inventing intermediate sizes;
  that rule becomes site-wide.
- **Do not copy:** any reference's specific typeface pairing.
- **Concerns:** the landing's micro labels run 8.5–9.5px. On secondary pages carrying real
  reading content (privacy, terms, bios) that is too small for body text. Rule: micro sizes stay
  **labels only**; body copy uses the 12–13px row and legal prose gets a dedicated readable row.
  See `06-test-matrix.md` for the contrast checks this implies.

---

## 3. Technical visual motifs

**Pattern:** registration marks, bracketed captions, stroke-drawn diagrams, and monospace
key/value spec pairs read as "engineering document" without needing photography.

- **Why useful:** DIGITAL has almost no real photography — `landing.DESIGN.md:209` states none
  ships today, and team avatars are a single placeholder SVG
  (`/images/placeholders/team/avatar-placeholder.svg`). A drawn vocabulary lets every new page
  ship visually complete with zero assets.
- **Transform:** every new secondary page's distinctive motif should be *drawn with hairlines
  and mono glyphs*, not illustrated or photographed.
- **Do not copy:** faux-terminal chrome, scanlines, or CRT effects.
- **Concerns:** stroke-drawn SVG is cheap, but animating stroke-dash on long paths is not.
  Motifs must animate `transform`/`opacity` only, per `landing.DESIGN.md:188`.

---

## 4. Team presentation

**Research-lab convention** *(reported)*: pages group by hierarchical level — director →
leads/senior researchers → students — rather than presenting one undifferentiated grid, and
give the lead figure visual weight distinct from the roster.

**UC Berkeley DEC** *(reported)*: leadership is organised as **named functional groups** ("The
Glue," "The People People," "The Spiders," "The Wallet") rather than as job titles alone.

- **Why useful:** the brief requires President / Co-President / Vice-President / Secretary /
  Treasurer / Project Leads / Project Managers, with each Project Lead tied to a project, and
  Project Managers as a distinct group. That is a three-tier hierarchy, not a filter chip row —
  which is what `/team` has today (four flat departments, `app/team/page.tsx:15-23`).
- **Transform:** three visually distinct tiers with different card weights: executive officers
  get the largest treatment; project leads are grouped *under their project* with the project
  named on the card face (so the reader learns the mapping without opening a profile, per
  §10.1); project managers form a compact roster band.
- **Do not copy:** DEC's whimsical group names — they are off-voice for `BRAND.md`.
- **Concerns:** hierarchy conveyed by size alone fails at 375px and for low-vision users. Every
  tier needs a text heading and a mono role label, never colour or size alone (§15).

---

## 5. Community presentation

**Pattern (Hack Club and similar student orgs)** *(reported)*: the community channel is
presented as the *product* — a joinable place with a stated purpose — rather than as a row of
social icons.

- **Why useful:** §11.2 explicitly forbids "a generic three-card social-links page."
- **Transform:** give Discord, LinkedIn, and YouTube each a **module with its own internal
  layout and purpose statement**, sharing one grid, border, type, and motion system. Discord =
  invitation + expectations; LinkedIn = a ledger of selected posts; YouTube = a tutorial index
  organised by project.
- **Do not copy:** live member counts, activity tickers, or "N online" badges. §17 forbids
  inventing these, and the real numbers are not available in-repo.
- **Concerns:** third-party embeds are the single largest performance and CSP risk on the site —
  see §7 and `01-repository-audit.md`.

---

## 6. Product storytelling

Already solved in-repo and better than the external references: `docs/design/BRAND.md` defines a
promise → proof → invitation shape per story beat, and a one-idea-per-page spine. **No external
adaptation needed.** The only transfer is that secondary pages must each declare a spine too —
`BRAND.md:34-38` currently defines spines for three routes only.

---

## 7. Motion and transitions

**Pattern:** the strongest technical sites animate exactly two properties and treat motion as
metering rather than decoration.

- **Transform:** the landing's motion vocabulary is already this reduced — a single gesture
  (rise 18px, fade), one reveal easing `cubic-bezier(0.22,1,0.36,1)`, 0.8s duration, ~110ms
  stagger steps (`landing.DESIGN.md:160-164`). Adopt it unchanged site-wide; the work is
  *centralising* it, not designing it.
- **Concerns:** the repo currently has **three different scroll-reveal mechanisms** — a
  `dangerouslySetInnerHTML` IntersectionObserver script (`app/about/page.tsx:108`,
  `app/pillars/page.tsx:119`), a `useEffect` observer (`app/projects/page.tsx:47-68`), and a
  literal `className="reveal in"` that skips animation entirely (`app/team/page.tsx:39`). One
  shared implementation is required.

**Facade / click-to-load embeds.** The `lite-youtube-embed` facade pattern (thumbnail + play
button; the real iframe is created only on interaction, with preconnect on hover) is the
established solution for third-party video. Sources below.
- **Transform:** implement the facade behaviour in-house rather than adding the dependency —
  it is a thumbnail, a button, and a state flip, and §3 of the brief says confirm the existing
  stack cannot do it cleanly before adding a package. It can.

---

## 8. Custom pointer interactions

Consolidated guidance from the sources below:
- Gate on `@media (any-hover: hover) and (pointer: fine)` — there is no pointer-size query.
- Disable (revert to `cursor: auto`) under `prefers-reduced-motion`, or at minimum strip all
  trailing/inertial movement.
- `pointer-events: none` on the cursor element so it never intercepts clicks.
- `aria-hidden="true"` so it is invisible to assistive tech.
- Strong edge contrast and a clear silhouette; never override enlarged-cursor or high-contrast
  platform settings.

- **Transform for DIGITAL:** the landing's own vocabulary supplies the form — a `+` crosshair
  registration mark is already the page's marker glyph (`landing.DESIGN.md:119, 209`). A precise
  centre point plus a lagging hairline ring reads as the site's drafting language rather than as
  a novelty layer.
- **Do not copy:** blend-mode inversion cursors, large blurred blobs, or magnetic effects on
  more than a couple of major CTAs — the landing forbids blur surfaces and shadows outright
  (`landing.DESIGN.md:184`).

---

## 9. Responsive simplification

**Pattern:** on small viewports, strong systems drop decorative layers entirely rather than
scaling them down, and convert hover-only reveals into always-visible content.

- **Why useful and urgent:** the repo has three hover-only reveals with no keyboard or touch
  equivalent today — pillar names (`app/pillars/page.tsx:155`), member major/role
  (`app/about/page.tsx:357`), and the contact map de-grayscale
  (`app/contact/page.tsx:308`). On mobile, `/pillars` is currently seven unlabelled letters.
- **Transform:** the landing's responsiveness is *intrinsic* — `clamp()` type and padding,
  `auto-fit minmax()`, `min()` widths, one single `sm:` breakpoint switch
  (`landing.DESIGN.md:213`). Carry that model to secondary pages instead of adding breakpoint
  ladders, and make every hover reveal a default-visible or tap-toggled state.

---

## Sources

- [MIT Media Lab — Pentagram case study](https://www.pentagram.com/work/mit-media-lab)
- [MIT Media Lab — research groups](https://www.media.mit.edu/research/?filter=everything&tag=design)
- [MIT Media Lab identity — designboom](https://www.designboom.com/design/the-new-mit-media-lab-identity-by-pentagram/)
- [MIT Media Lab — Type/Code build notes](https://typecode.com/mit-media-lab/)
- [UC Berkeley Design Engineering Collaborative](https://dec.studentorg.berkeley.edu/about.html)
- [Berkeley Engineering — student organizations and teams](https://engineering.berkeley.edu/students/student-life/teams-and-organizations/)
- [Blueprint (UC Berkeley)](https://blueprint.berkeley.edu/)
- [Hack Club](https://hackclub.com/)
- [Blueprint-grid aesthetic in developer tools — Setproduct](https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design)
- [Dark-mode design systems: patterns, tokens, hierarchy — Muzli](https://muz.li/blog/dark-mode-design-systems-a-complete-guide-to-patterns-tokens-and-hierarchy/)
- [Harvard OpenScholar — lab and research group site structure](https://docs.openscholar.harvard.edu/lab-and-research-group-site)
- [Research lab websites for principal investigators — The Academic Designer](https://theacademicdesigner.com/2024/research-lab-websites/)
- [Custom cursor accessibility — dbushell](https://dbushell.com/2025/10/27/custom-cursor-accessibility/)
- [Next-level CSS styling for cursors — CSS-Tricks](https://css-tricks.com/next-level-css-styling-for-cursors/)
- [Motion — custom cursor and follow-cursor animations](https://motion.dev/docs/cursor)
- [lite-youtube-embed — paulirish](https://github.com/paulirish/lite-youtube-embed)
- [Optimising YouTube embeds with facades — StreamHacker](https://streamhacker.com/2024/10/23/optimize-youtube-embeds-with-facades/)
- [Embedding a LinkedIn post with an iframe](https://designertofullstack.com/embed-a-linkedin-post-on-your-website/)
