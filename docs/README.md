# Documentation Index

Central map for the DIGITAL @ Cal Poly Pomona website repository.

## Start here

| Doc | Audience | Purpose |
|-----|----------|---------|
| [`README.md`](../README.md) | Everyone | Quick start, stack, scripts, deployment |
| [`CLAUDE.md`](../CLAUDE.md) | Humans + agents | Full project conventions |
| [`AGENT.md`](../AGENT.md) | Automated agents | Condensed agent rules |
| [`TODO.md`](../TODO.md) | Maintainers | Sprint tasks + build/version log |

## Design system

| Doc | Governs |
|-----|---------|
| [`DESIGN.md`](../DESIGN.md) | Industrial studio theme — all routes **except** the three immersive experiences below |
| [`design/landing.DESIGN.md`](design/landing.DESIGN.md) | `/` homepage (+ subsidiary direction for `/contact`, `/get-involved`) |
| [`design/smartphone.DESIGN.md`](design/smartphone.DESIGN.md) | `/projects/modular-smartphone` (PhoneV2) |
| [`design/glasses.DESIGN.md`](design/glasses.DESIGN.md) | `/projects/smart-reading` |
| [`design/BRAND.md`](design/BRAND.md) | Voice, story spine, copy rules (all routes) |

**Rule:** Read the governing design doc before any UI/UX change. Copy changes in `lib/data/` must follow `BRAND.md`.

## Operations

| Doc | Purpose |
|-----|---------|
| [`ROUTES.md`](ROUTES.md) | Production routes, immersive chrome, data file map |
| [`PRE-LAUNCH.md`](PRE-LAUNCH.md) | Production config that can't be set in-repo — do before launch |
| [`MAINTAINER_GUIDE.md`](MAINTAINER_GUIDE.md) | How to update team, projects, config, pages |
| [`troubleshooting/KNOWN_ISSUES.md`](troubleshooting/KNOWN_ISSUES.md) | Common dev/build issues |
| [`IMAGE_REPLACEMENT_GUIDE.md`](IMAGE_REPLACEMENT_GUIDE.md) | Placeholder image inventory (partially legacy — see note inside) |

## Reference

| Doc | Purpose |
|-----|---------|
| [`The Smartglasses Project _ DIGITAL @ Cal Poly Pomona Proposals [Master Document].md`](The%20Smartglasses%20Project%20_%20DIGITAL%20@%20Cal%20Poly%20Pomona%20Proposals%20%5BMaster%20Document%5D.md) | Faculty proposal — source for Smart Reading copy |
| [`prompts/`](prompts/) | Asset-generation prompts (non-authoritative) |
| [`archive/`](archive/) | Superseded plans, specs, and handoffs |

## Verify before commit

```bash
./run.sh check    # toolchain, deps, routes, tsc, lint
./run.sh build    # full static export
```

## Branch: `feature/brand-story-gsap`

This overhaul branch ships:

- **Home landing** — Newsreader editorial experience at `/`
- **PhoneV2** — exploded-smartphone scrollytelling at `/projects/modular-smartphone`
- **Smart Reading** — R3F glasses experience at `/projects/smart-reading`
- **GSAP text reveals** — `TextReveal` component + `components/motion/gsapSetup.ts`
- **Brand voice** — `docs/design/BRAND.md` + brand-guardian / brand-voice-strategist agents
- **IA cleanup** — dedicated project routes, `/review` stakeholder hub, legal pages

See [`AUDIT-brand-story-gsap.md`](AUDIT-brand-story-gsap.md) for the pre-merge code audit.
