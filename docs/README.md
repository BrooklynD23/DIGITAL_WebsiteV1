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
| [`DESIGN.md`](../DESIGN.md) | The Apple system (default since 2026-10-07): tokens, patterns, rules for every route |
| [`design/sidekick.DESIGN.md`](design/sidekick.DESIGN.md) | `/projects/sidekick/` — **locked** |
| [`design/brain.DESIGN.md`](design/brain.DESIGN.md) | `/projects/brain/` — **locked** |
| [`design/BRAND.md`](design/BRAND.md) | Voice, story spine, copy rules (all routes) |
| [`design/landing.DESIGN.md`](design/landing.DESIGN.md), [`smartphone.DESIGN.md`](design/smartphone.DESIGN.md), [`glasses.DESIGN.md`](design/glasses.DESIGN.md) | Archived designs (now in `archive/`); history only |

**Rule:** Read the governing design doc before any UI/UX change. Copy changes in `app/(apple)/_content/` and `lib/data/` must follow `BRAND.md`.

## Operations

| Doc | Purpose |
|-----|---------|
| [`ROUTES.md`](ROUTES.md) | Production routes, page chrome, data file map |
| [`PRE-LAUNCH.md`](PRE-LAUNCH.md) | Production config that can't be set in-repo — do before launch |
| [`MAINTAINER_GUIDE.md`](MAINTAINER_GUIDE.md) | How to update team, involvement, config, pages |
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

## Branch: `design-lab/shades-revamp`

Current working branch. `design-lab/exploration` is open as a draft PR into `main`.

The earlier `feature/brand-story-gsap` overhaul (home landing, PhoneV2, Smart Reading, GSAP reveals,
`/review` hub) is superseded; its designs are in `archive/`. See
[`AUDIT-brand-story-gsap.md`](AUDIT-brand-story-gsap.md) for that branch's pre-merge code audit (historical).
