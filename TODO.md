# TODO — DIGITAL @ Cal Poly Pomona — Living Work Log

This file is the **authoritative work log** for the DIGITAL website project. It is organized
by Sprint. Each sprint contains a numbered task checklist and a Dev Build / Version Control
table that maps internal build numbers to git commit SHAs. Update this file whenever work is
committed — see the standing rule in `CLAUDE.md` and `AGENT.md`.

---

## Sprint 1 — Production Readiness

### Tasks

- [x] 1. Docs scaffolding (TODO.md, CLAUDE.md, AGENT.md)
- [x] 2. Project data trim — keep Modular Smartphone, remove Embedded / Robotics / Software
         Hatchery / Smart Mirror / Drone Swarm, add "Heads-up Display Glasses" placeholder
         (status: More info soon)
- [x] 3. Relocate scroll teardown to be the Smartphone project page; create a new
         landing/home page; rework teardown copy to funnel users into sub-teams
         (Executive / Hardware / Software / Outreach)
- [x] 4. Launch-config: Vercel Analytics + Speed Insights, `app/sitemap.ts`,
         `app/robots.ts`, `vercel.json` security headers (CSP report-only first),
         skip-to-content link, Twitter card + JSON-LD Organization schema
- [x] 5. Legal starter pages: `/privacy`, `/terms`, `/cookies` + footer links
- [x] 6. Teardown asset encoding (`npm run encode:teardown`) + inline empty-state UI on
         filtered list pages

### Dev Build / Version Control

| Build  | Commit #  | SHA       | Message                                                    | Notes                          |
|--------|-----------|-----------|------------------------------------------------------------|--------------------------------|
| v0.1.0 | #0001     | `a632480` | docs: add TODO work log + CLAUDE/AGENT conventions (#0001) | Docs scaffolding — Sprint 1 #1 |
| v0.2.0 | #0003     | `3e11de1` | feat(projects): trim to Modular Smartphone + add Heads-up Display Glasses placeholder (#0003) | Project data trim — Sprint 1 #2 |
| v0.3.0 | #0005     | `a1399a0` | feat(routing): teardown becomes Smartphone page; new landing home + sub-team funnel (#0005) | Teardown relocated + new home + sub-team funnel — Sprint 1 #3 |
| v0.4.0 | #0007     | `fc5093e` | feat(launch): analytics, sitemap/robots, security headers, a11y skip-link, twitter/JSON-LD (#0007) | Launch-config pack — Sprint 1 #4 |
| v0.5.0 | #0009     | `4a50a1e` | feat(legal): draft Privacy/Terms/Cookies pages + footer links (#0009) | Legal starter pages + footer links — Sprint 1 #5 |
| v0.6.0 | #0012     | `dd14637` | perf(teardown): encode AVIF/WebP assets; feat: empty-state UI on filtered lists (#0012) | Teardown asset encoding + empty-state UI — Sprint 1 #6 |
| v0.6.1 | #0014     | `713150a` | docs: add landing/HUD/cross-linking design spec (#0014) | Approved design spec — Modules landing, glasses-page realism, cross-linking IA |
| v0.6.2 | #0016     | `dc6a5e4` | docs: add implementation plan for landing/glasses/IA tracks (#0016) | 12-task Codex-delegable plan derived from the approved spec |
| v0.7.0 | #0018     | `52eb363` | feat(glasses): scroll-hero experience baseline from prior session (#0018) | Baseline for the landing/glasses/IA plan — Task 0 |
| v0.7.1 | #0019     | `4f26b7e` | feat(glasses): warm-paper palette regrade + hairline decor (#0019) | Task 1 (B1) |
| v0.7.2 | #0020     | `a93e670` | feat(glasses): sequential panel fades + direction-aware snap (#0020) | Task 2 (B2) |
| v0.7.3 | #0021     | `63d57ea` | fix(glasses): snap glide flag self-releases after interruption (#0021) | Task 2 review fix |
| v0.7.4 | #0022     | `9ee0325` | feat(glasses): waveguide HUD design system (#0022) | Task 3 (B3) |
| v0.7.5 | #0023     | `3e2318a` | fix(glasses): animate HUD exits via AnimatePresence (#0023) | Task 3 review fix |
| v0.7.6 | #0024     | `1cf75e5` | feat(glasses): PBR materials + local environment lighting (#0024) | Task 4 (B4) |
| v0.7.7 | #0026     | `901257e` | feat(landing): scaffold /landing-preview route + scroll orchestrator (#0026) | Task 5 (A1) |
| v0.7.8 | #0027     | `72169eb` | fix(landing): data-sourced metadata + __lenis cleanup (#0027) | Task 5 review fix |
| v0.7.9 | #0028     | `36e502f` | feat(landing): instanced module formations + logo assembly intro (#0028) | Task 6 (A2) |
| v0.7.10 | #0029    | `2bed1cd` | fix(landing): one-shot intro completion guard (#0029) | Task 6 review fix |
| v0.7.11 | #0030    | `c3b18e8` | feat(landing): product chamber portals, mission beats, club strip (#0030) | Task 7 (A3) |
| v0.7.12 | #0031    | `5e3abb4` | feat(landing): brand-voice copy pass (#0031) | Task 8 (A4) — brand-voice-strategist copy pass |
| v0.7.13 | #0032    | `5bff37c` | feat(ia): promote glasses experience to /projects/smart-reading (#0032) | Task 9 (C1) — route promotion; removed dead /projects/[slug] catch-all (both projects now have dedicated routes) |
| v0.7.14 | #0033    | `3d4175e` | feat(ia): immersive chrome guard, escape hatch, next-project loop (#0033) | Task 10 (C2) |
| v0.7.15 | #0036    | `a539e99` | docs(design): add route-scoped DESIGN.md for landing, smartphone, glasses (#0036) | Route-scoped style refs in docs/design/ (21 TSI format); DESIGN.md §0.1 + §15 migration; agent routing in CLAUDE.md/AGENT.md/AGENTS.md |
| v0.8.0  | #0038    | `07943a8` | feat(site): promote Newsreader home landing + PhoneV2 experience; retire legacy landing routes (#0038) | Prior-session feature work committed: new `/` landing, PhoneV2 at `/projects/modular-smartphone`, `/review` hub, legacy landing routes removed |
| v0.8.1  | #0040    | `9b87676` | docs: add brand-story + GSAP text choreography design spec (#0040) | Approved spec — BRAND.md + brand-guardian agent, GSAP text layer (smartphone), story-first copy + type revision for smartphone/glasses/landing |
| v0.9.0  | #0042    | `2cf0b99` | docs: add BRAND.md + brand-guardian review agent (#0042) | Phase 1 of brand-story-gsap plan — voice pillars, per-page spine, brand-voice-strategist/brand-guardian routing |
| v0.10.0 | #0043    | `91d478e` | feat(smartphone): GSAP text reveals + story-first copy + type collapse (#0043) | Phase 2 of brand-story-gsap plan |
| v0.11.0 | #0044    | `4834920` | feat(glasses): story-first copy + panel-title type collapse (#0044) | Phase 3 of brand-story-gsap plan |
| v0.12.0 | #0045    | `90d46de` | feat(landing): story-first copy + serif/sans role split (#0045) | Phase 4 of brand-story-gsap plan — completes `docs/archive/specs/2026-07-19-brand-story-gsap-design.md` |
| v0.12.1 | #0046    | `280ee82` | docs: consolidate archive, refresh README, pre-merge audit (#0046) | Docs hub + archive; Bugbot/Security audit report |
| v0.13.0 | #0047    | `3dc144d` | fix(audit): close pre-merge audit findings across landing, PhoneV2, Smart Reading (#0047) | Remediates all 8 live findings from `docs/AUDIT-brand-story-gsap.md` — Smart Reading static shell + route metadata, legacy `/phone-v2` and `/experiments/glasses` deleted, comingSoon card guard, landing footer legal links, `/review` landmark, reduced-motion decor, content-derived panel bands. Adds `docs/PRE-LAUNCH.md`; fixes stale `run.sh` `[slug]` route check. `./run.sh check` green; static export verified against exported HTML |
| v0.13.1 | #0049    | `70440a4` | chore(ci): add GitHub Actions pipeline and fix vercel.json schema (#0049) | Fixes Vercel `_comment` schema failure; CI + auto-promote to `deployment` branch; `docs/DEPLOYMENT.md` runbook |
| v0.13.2 | #0050    | `0a76ee7` | docs(ui-revision): repository audit, research, directions, transition diagnosis, plan, test matrix (#0050) | Planning-only for the site-wide UI revision — `docs/ui-revision/01`–`06`. No code changed. Migrates every non-immersive route onto the landing's design system, adds `/community`, rebuilds `/team`, fixes the smartphone entry handoff, adds a progressive-enhancement cursor. Blocked on Head Designer sign-off for one new `--ds-error` token (`landing.DESIGN.md:344`) and a call on `/review` removal |
| v0.14.0 | #0051    | `94a5e2b` | feat(copy): tighten story-first copy across landing + site config (#0051) | B1 of site-consolidation (branch `feature/site-consolidation`). Head Designer approved direction via staff-feedback session: full consolidation, interim nav slim, mission band between Results and Join, vision line verbatim, de-caps project pages. Landing gap bodies/pathways heading/learnings/taglines rewritten verb-first; thesis heading set to BRAND.md spine line; `siteConfig.description` + home metadata de-AI'd; glasses lede contraction. brand-guardian PASS; hard facts untouched |
| v0.14.1 | #0051    | `3b45da2` | feat(landing): mission/vision band + ribbon site links (#0051) | New light mission band between Results and Join: eyebrow/heading/org statement + four canonical beats (`MISSION_BEATS`) + approved vision line (`VISION_LINE`, "Real systems, built by students, handed to the next cohort."), all sourced from `lib/data/mission.ts`. Landing sticky nav gains Join route link + sub-640px mobile link row. `landing.DESIGN.md` (Sticky Nav, Mission Band, Layout) and `BRAND.md` amended |
| v0.14.2 | #0051    | `feff4c3` | feat(nav): interim ribbon slim to Home/Projects/Join/Contact (#0051) | Pillars/About/Team hidden from ribbon until rebuilt on the landing system |
| v0.14.3 | #0051    | `3b57dc2` | feat(tokens): promote landing design system to :root, unify font stacks (#0051) | ui-revision D1–D4: full `--dg-*` raw block + `--ds-*` semantic layer at `:root`; studio sweep/grain + `section{z-index:2}` deleted (D3); body → parchment; `lib/fonts.ts` single source for both stacks (studio `preload:false`, applied by immersive layouts); Tailwind `dg` color namespace + landing families + radii + `xs/nav` screens; HomeLanding zero hex literals; `--ds-error` token defined but PENDING Head Designer sign-off |
| v0.14.4 | #0051    | `92275f9` | feat(chrome): PageShell + Navbar/Footer rebuilt on landing tokens, one reveal impl (#0051) | New `PageShell` intro register (eyebrow→serif promise→mono meta); Navbar thin mono bar w/ `nav:` 820px switch, aria-current non-color active state, Escape+focus-trap+unmount sheet fix; Footer rebuilt as landing dark-band colophon; shared link source `lib/data/siteLinks.ts`; one reveal primitive (`useReveal` + `<Reveal>` + global `[data-reveal]` styles) |
| v0.14.5 | #0051    | `4864dda` | feat(contact): rebuild on landing tokens; full static prerender; validation states (#0051) | Formspree unconfigured refusal preserved; all 15 `?type=` deep links preserved (query now read in effect — page exports full HTML instead of Suspense shell); per-field `role="alert"` validation; success `role="status"` w/ focus move; duplicate page footer removed |
| v0.14.6 | #0051    | `95d0c7b` | feat(team): honest placeholder roster + landing-token rebuild; about exec cards de-faked (#0051) | `lib/data/team.ts` rewritten: no invented people — every record `isPlaceholder`, roleCategory model, project named on lead cards; filters + `aria-live` count; About's fake portraits/"Computer Engineering '25" claims removed |
| v0.14.7 | #0051    | `6eb3135` | feat(community): new /community route, empty-safe modules, ribbon + sitemap wiring (#0051) | Discord module (real invite, expectations), LinkedIn/YouTube empty states render complete with zero content; no third-party scripts/iframes; added to ribbon, footer links, sitemap, run.sh checks |
| v0.14.8 | #0051    | `5a75b51` | feat(immersive): sentence-case display type on smartphone + glasses pages (#0051) | De-caps revision (Head Designer approved): display headlines drop `uppercase`; DM Mono technical labels stay uppercase; both DESIGN docs' type rules amended. Smartphone handoff motion fixes (ui-revision Batch 6) remain open |
| v0.15.0 | #0051    | `72e86e6` | feat(tokens): sign off --ds-error brick #9C3A2A; governance note for migrated routes (#0051) | Head Designer approved the brick; PENDING comment removed; landing.DESIGN.md governance now names it authoritative for rebuilt secondary routes |
| v0.15.1 | #0051    | `9bf9b62` | feat(get-involved): landing-token rebuild + brand copy pass; ?type= contract intact (#0051) | All involvement option links preserved (verified in static export); meeting band becomes dark contrast section with gold CTA; AI-ish copy replaced verb-first |
| v0.15.2 | #0051    | `9591a3e` | feat(projects): landing-token rebuild; search/filter preserved; stale team refs removed (#0051) | Flagship band, catalogue grid, empty state, dark pitch band; `projects.ts` teamMembers referencing retired fake people deleted |
| v0.15.3 | #0051    | `bdc11f4` | feat(about): rebuild on landing tokens; pillars folded into About; /pillars redirects (#0051) | Pillar copy brand-passed into `lib/data/about.ts`; device requirement kept verbatim; `/pillars` → redirect stub to `/about#how-we-work`, dropped from sitemap |
| v0.15.4 | #0051    | `454241c` | feat(legal): editorial prose treatment on privacy/terms/cookies (#0051) | PageShell intro + token prose column; content unchanged |
| v0.15.5 | #0051    | `c438901` | refactor(consolidation): About ribbon tab, error pages on landing tokens, dead studio CSS retired (#0051) | Ribbon: Home/Projects/About/Community/Join/Contact; not-found/error/global-error rebuilt; `.eyebrow`/`.text-outline`/`.scrollcue`/`.reveal` blocks + OutlineHeading + dead keyframes removed |
| v0.15.6 | #0051    | `548ad6f` | fix(globals): close @layer components block after CSS retirement (#0051) | Build-breaking unclosed block caught post-commit and fixed forward |

---

## Backlog / Blocked (needs org input)

- **Custom domain** — awaiting DNS credentials / domain decision from club leadership.
  *Deferred to next session (2026-08): see README "Deferred work".*
- **Real Formspree endpoint** — contact form is using a placeholder; needs the club's
  verified Formspree form ID. As of #0047 the form refuses to submit and points visitors to
  email instead, rather than POSTing into a 404. See [`docs/PRE-LAUNCH.md`](./docs/PRE-LAUNCH.md).
  *Deferred to next session (2026-08): see README "Deferred work".*
- **Org logo + favicon / OG image** — final asset files needed from the design lead.
- **Heads-up Display Glasses copy** — project description, team lead, and timeline TBD;
  placeholder reads "More info soon" until the team provides details.
- **Real roster names/photos** — `/team` ships honest "To be announced" placeholders since
  #0051; publish confirmed 2026–27 officers, leads, and links as leadership verifies them.

### Site variant decisions (pending shareholder sign-off)

Open `/review` to compare candidates side-by-side. Record the decision here, then execute cleanup:

| Decision | Options | Winner (TBD) | Cleanup when decided |
|----------|---------|--------------|----------------------|
| Homepage | `/` (Newsreader landing v2) | `/` | Removed `/landing-preview` and `/landing-v2` |
| Smartphone | `/projects/modular-smartphone` (PhoneV2 experience) | `/projects/modular-smartphone` | Promoted from `/phone-v2`; old teardown page removed |
| Smart Reading | `/projects/smart-reading` (settled) | `/projects/smart-reading` | Remove `/experiments/glasses` redirect after 6 months |

After decisions: run `./run.sh check`, update this table with commit SHA, remove `/review` page.
