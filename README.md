# DIGITAL @ Cal Poly Pomona Website

Official website for **DIGITAL**, the student engineering club at Cal Poly Pomona.
Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS 3**, configured
for **static export** and deployed on **Vercel**.

The site features three immersive product experiences — a warm editorial home landing,
an exploded-smartphone scrollytelling page, and a 3D smart-glasses scroll experience —
alongside standard club pages (about, team, projects, get involved, contact).

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router, `output: 'export'`) |
| UI | React 18, Tailwind CSS 3 |
| Motion | GSAP, Anime.js, Framer Motion, Lenis |
| 3D | React Three Fiber + Drei (Smart Reading route) |
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
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage (immersive landing)
│   ├── projects/
│   │   ├── modular-smartphone/   # PhoneV2 scrollytelling
│   │   └── smart-reading/        # R3F glasses experience
│   ├── review/                   # Internal stakeholder variant hub
│   └── …                         # about, team, contact, legal, etc.
├── components/
│   ├── home/                     # HomeLanding
│   ├── phone-v2/                 # Smartphone experience
│   ├── experiments/glasses/      # Smart Reading experience
│   ├── motion/                   # TextReveal, GSAP setup
│   └── layout/                   # Navbar, Footer, BrandLogo
├── lib/
│   ├── data/                     # All site content (edit here, not in pages)
│   ├── immersiveRoutes.ts        # Routes that hide global chrome
│   └── types.ts
├── docs/                         # Documentation hub → docs/README.md
├── DESIGN.md                     # Industrial studio design system
├── run.sh                        # Preflight + dev/build launcher
└── Refractor/                    # Reference HTML/CSS for industrial theme
```

## Key routes

| Route | Experience |
|-------|------------|
| `/` | Editorial home landing (own nav/footer) |
| `/projects/modular-smartphone` | PhoneV2 exploded-smartphone scrollytelling |
| `/projects/smart-reading` | Immersive smart-glasses scroll (R3F) |
| `/projects` | Project grid |
| `/about`, `/team`, `/pillars` | Club info |
| `/get-involved`, `/contact` | Join paths + form |
| `/privacy`, `/terms`, `/cookies` | Legal pages |

Full route map: [`docs/ROUTES.md`](docs/ROUTES.md).

## Configuration

### Site metadata and contact

Edit [`lib/data/siteConfig.ts`](lib/data/siteConfig.ts) for club name, contact info,
social links, stats, sponsors, and the Formspree endpoint.

### Content

All copy lives in `lib/data/` — never hard-code strings in page components.
Voice and story rules: [`docs/design/BRAND.md`](docs/design/BRAND.md).

| File | Content |
|------|---------|
| `lib/data/homeLanding.ts` | Homepage copy |
| `lib/data/phoneV2.ts` | Smartphone experience copy |
| `lib/data/experiments/glasses.ts` | Smart Reading copy |
| `lib/data/projects.ts` | Project cards |
| `lib/data/team.ts` | Team members |
| `lib/data/involvement.ts` | Get Involved options |

## Design docs

Before UI/UX changes, read the governing style reference:

| Route | Doc |
|-------|-----|
| `/` | `docs/design/landing.DESIGN.md` |
| `/projects/modular-smartphone` | `docs/design/smartphone.DESIGN.md` |
| `/projects/smart-reading` | `docs/design/glasses.DESIGN.md` |
| All other routes | `DESIGN.md` |

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
