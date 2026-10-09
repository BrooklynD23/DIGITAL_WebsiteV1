# DIGITAL @ Cal Poly Pomona Website

Official website for **DIGITAL**, a student-run venture studio at Cal Poly Pomona.
Built with **Next.js 14 (App Router)** and **TypeScript**, configured for **static export**
and deployed on **Vercel**.

The live site is the "Apple" design system (default since 2026-10-07): a phone-hero home page
and three build pages (SIDEKICK, SHADES, BRAIN) in `app/(apple)/`. The remaining pages
(about, team, community, get involved, contact, legal) are in `app/(apple)/` on the same system. Earlier designs are in `archive/`.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, `output: 'export'`) |
| UI | React 18; CSS modules on design tokens (`app/(apple)/_system/tokens/worlds.css`); Tailwind CSS 3 configured, no live route uses it |
| Motion | Anime.js (stage playback), CSS scroll timelines, canvas dot engine |
| Forms | Formspree |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel |

## Quick start

### Prerequisites

- Node.js 24.x (matches Vercel and `package.json` engines)
- npm

### Install and run

```bash
git clone https://github.com/YOUR_USERNAME/DIGITAL_WebsiteV1.git
cd DIGITAL_WebsiteV1
npm install
./run.sh          # preflight checks + dev server (recommended)
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verify health

```bash
./run.sh check    # TypeScript, lint, critical files, routes
./run.sh build    # Production static export to out/
```

## Project structure

```
DIGITAL_WebsiteV1/
├── app/
│   ├── (apple)/                  # Live pages on the Apple system (route group, not in the URL)
│   │   ├── page.tsx              # / — phone-hero home
│   │   ├── projects/
│   │   │   ├── _hero/            # Home hero artwork + useStagePlayback
│   │   │   ├── sidekick/         # /projects/sidekick/ (LOCKED)
│   │   │   ├── shades/           # /projects/shades/
│   │   │   └── brain/            # /projects/brain/ (LOCKED)
│   │   ├── _system/              # Tokens, fonts, scroll hooks, dot engine
│   │   ├── _chrome/              # LocalNav, WorldFooter, JoinChapter, SitePage, club.ts
│   │   └── _content/             # Copy for the Apple pages
├── lib/data/                     # Club facts, team, involvement, community content
├── public/boards/                # SIDEKICK board SVG layers
├── archive/                      # Earlier designs; not built → archive/README.md
├── design-lab/                   # Design-lab research, renders, scripts
├── docs/                         # Documentation hub → docs/README.md
├── DESIGN.md                     # Design system (Apple system, as implemented)
└── run.sh                        # Preflight + dev/build launcher
```

## Key routes

| Route | Page |
|-------|------|
| `/` | Home: phone hero (four played stages), the three builds, join |
| `/projects/sidekick/` | SIDEKICK: the FPGA main board in nine played stages (**locked**) |
| `/projects/shades/` | SHADES: reading glasses, live reader, light-path stages |
| `/projects/brain/` | BRAIN: six agentic-AI lessons on one dot figure (**locked**) |
| `/about`, `/team`, `/community` | Studio info |
| `/get-involved`, `/contact` | Join paths + form |
| `/privacy`, `/terms`, `/cookies` | Legal pages |
| `/pillars`, `/projects`, `/projects/modular-smartphone`, `/projects/smart-reading` | Redirect stubs to the pages above |

Full route map: [`docs/ROUTES.md`](docs/ROUTES.md).

## Deferred work — next session (2026-08 consolidation follow-up)

The site-consolidation branch (`feature/site-consolidation`) completed the design-system
migration of all public routes. The following items are **deferred pending org/leadership
input** — see also the Backlog section in [`TODO.md`](TODO.md):

1. **Real Formspree endpoint** — club leadership provisions a Formspree form and supplies
   the form ID hash; set `siteConfig.formspreeEndpoint`, verify submission end-to-end, and
   add `connect-src https://formspree.io` to the CSP report-only policy first.
2. **No custom domain** — the site is served at `https://digitalcpp.vercel.app/`. Set
   `NEXT_PUBLIC_SITE_URL` only if a domain is added later (canonicals default to `siteConfig.url`).
3. **Real roster content** — team placeholders ("To be announced") await confirmed names,
   photos, and links for 2026–27; also OG image + favicon assets from the design lead.
4. **Heads-up Display Glasses copy** — project description/team/timeline from that team.

Open engineering polish (no org input needed): a browser session for the manual test-matrix
rows — responsive widths, cross-browser, keyboard walk, 60fps handoff recording
(`docs/ui-revision/07-sweep-results.md` lists exactly what remains). The smartphone handoff
fixes, accessibility sweep gates, and the progressive-enhancement cursor all shipped in #0051.

## Configuration

### Site metadata and contact

Edit [`lib/data/siteConfig.ts`](lib/data/siteConfig.ts) for club name, contact info,
social links, stats, sponsors, and the Formspree endpoint.

### Content

Copy is never hard-coded in page components. Apple pages read `app/(apple)/_content/`
and `lib/data/` (club facts, team, involvement). Voice and story rules: [`docs/design/BRAND.md`](docs/design/BRAND.md).

| File | Content |
|------|---------|
| `app/(apple)/_content/home.ts` | Home copy |
| `app/(apple)/_content/sidekick.ts` | SIDEKICK copy and board facts |
| `app/(apple)/_content/shades.ts` | SHADES copy |
| `app/(apple)/_content/brain.ts` | BRAIN copy |
| `app/(apple)/_chrome/club.ts` | Meeting times, Discord, GitHub and LinkedIn links |
| `lib/data/team.ts` | Team members |
| `lib/data/involvement.ts` | Get Involved options |

## Design docs

Before UI/UX changes, read the governing style reference:

| Route | Doc |
|-------|-----|
| `/`, `/projects/shades/`, all other routes | `DESIGN.md` |
| `/projects/sidekick/` | `docs/design/sidekick.DESIGN.md` (locked) |
| `/projects/brain/` | `docs/design/brain.DESIGN.md` (locked) |

`docs/design/landing.DESIGN.md`, `smartphone.DESIGN.md` and `glasses.DESIGN.md` describe
archived designs.

## Scripts

| Command | Description |
|---------|-------------|
| `./run.sh` | Preflight checks + dev server |
| `./run.sh check` | Checks only (tsc, lint, routes) |
| `./run.sh build` | Checks + production static export |
| `npm run dev` | Dev server (no preflight) |
| `npm run lint` | ESLint |
| `npm run encode:teardown` | Encode teardown AVIF/WebP assets |

## Deployment

Vercel production deploys from the `deployment` branch only, after CI passes on `main`. See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full CI/CD pipeline, branch protection, and
Vercel dashboard checklist. The build outputs static files to `out/`.

Security headers and CSP (report-only) are configured in `vercel.json`.

## Documentation

See [`docs/README.md`](docs/README.md) for the full documentation index:

- [Routes & Pages](docs/ROUTES.md)
- [Deployment & CI/CD](docs/DEPLOYMENT.md)
- [Maintainer Guide](docs/MAINTAINER_GUIDE.md)
- [Known Issues](docs/troubleshooting/KNOWN_ISSUES.md)
- [Agent Conventions](AGENT.md)

## License

Maintained by DIGITAL @ Cal Poly Pomona.
