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
| v0.12.1 | #0046    | `d622fba` | docs: consolidate archive, refresh README, pre-merge audit (#0046) | Docs hub + archive; Bugbot/Security audit report |

---

## Backlog / Blocked (needs org input)

- **Custom domain** — awaiting DNS credentials / domain decision from club leadership.
- **Real Formspree endpoint** — contact form is using a placeholder; needs the club's
  verified Formspree form ID.
- **Org logo + favicon / OG image** — final asset files needed from the design lead.
- **Heads-up Display Glasses copy** — project description, team lead, and timeline TBD;
  placeholder reads "More info soon" until the team provides details.

### Site variant decisions (pending shareholder sign-off)

Open `/review` to compare candidates side-by-side. Record the decision here, then execute cleanup:

| Decision | Options | Winner (TBD) | Cleanup when decided |
|----------|---------|--------------|----------------------|
| Homepage | `/` (Newsreader landing v2) | `/` | Removed `/landing-preview` and `/landing-v2` |
| Smartphone | `/projects/modular-smartphone` (PhoneV2 experience) | `/projects/modular-smartphone` | Promoted from `/phone-v2`; old teardown page removed |
| Smart Reading | `/projects/smart-reading` (settled) | `/projects/smart-reading` | Remove `/experiments/glasses` redirect after 6 months |

After decisions: run `./run.sh check`, update this table with commit SHA, remove `/review` page.
