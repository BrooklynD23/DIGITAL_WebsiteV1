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

---

## Backlog / Blocked (needs org input)

- **Custom domain** — awaiting DNS credentials / domain decision from club leadership.
- **Real Formspree endpoint** — contact form is using a placeholder; needs the club's
  verified Formspree form ID.
- **Org logo + favicon / OG image** — final asset files needed from the design lead.
- **Heads-up Display Glasses copy** — project description, team lead, and timeline TBD;
  placeholder reads "More info soon" until the team provides details.
