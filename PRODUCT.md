# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally (Head Designer, 2026-10-02):

- **Prospective members.** Cal Poly Pomona students from any major (engineering, CS, design, business, data, science) deciding whether to join. Success: they come to Thursday build night or pick a subsystem to own.
- **Sponsors, recruiters and faculty.** People judging whether the club does credible engineering work. Success: they reach out (sponsor a build, recruit, host a workshop, donate equipment).

## Product Purpose

DIGITAL is a student-run venture studio at Cal Poly Pomona. Members build real hardware/software products as multidisciplinary teams, own a named part of each build, and hand finished systems to the next cohort. The website exists to show that work credibly and turn visitors into members or backers.

## Positioning

Thesis: **"Make something worth putting your name on."** The mechanism is ownership. Each build is split into subsystems, and each subsystem has one owner, one review path per handoff, one test gate before merge and one repair plan before release (`lib/data/phoneV2.ts:295-300`). Generic student clubs describe activities. DIGITAL shows the build and who owns each part of it.

## Operating Context

- Initiatives (Notion "Current Initiatives"; names confirmed for the site by the Head Designer, 2026-10-02):
  - **SIDEKICK**: formerly "The Modular Smartphone" (DG-001). Notion calls it the legacy project.
  - **SHADES** (Smart Headset for Adaptive Dyslexia Enhancement System): formerly "Smart Reading" (DG-002). RSVP smart glasses with an engineering track and a medical-research track; it makes no medical claims. Mentor Dr. Mohamed El Hadedy.
  - **BRAIN** (Building Remarkable AI Innovation and kNowledge): agentic-AI initiative. Builds software with agentic tools and enters hackathons. Its page tells a concept story (MCP, context engineering, harnesses, tool use) and claims no curriculum, because Notion has none.
  - Venture Studies: a program (scope → budgets, sponsor briefs, pitches).
  - Notion lists all three initiatives as "Planned"; the site tags their status [confirm].
- Ritual: build night every Thursday 6:00 PM, Building 17, Room 1635. Discord for async work.
- Engineering source of truth for the smartphone: `DIGITAL-KNOWLEDGEBASE/TheSmartphoneProject` (KiCad projects, docs, wiki).
- Each project page has its own presentation "spin" (smartphone: scroll teardown; smart reading: 3D glasses + RSVP demo). This is a deliberate pattern to keep.

## Capabilities and Constraints

- Next.js 14 App Router, React 18, TypeScript strict, Tailwind 3, **static export only** (no server runtime, no runtime LLM).
- Content lives in `lib/data/`; copy changes go through brand-voice-strategist → brand-guardian (`docs/design/BRAND.md`).
- Design exploration happens in the lab worktree (`/design-lab/*`); production routes change only after Head Designer sign-off.
- Knowledgebase corrections (`design-lab/round2/research/kb-smartphone.md`, shown as `[confirm]`): the phone is built around a Zynq-7000 SoM (ARM + FPGA), not an ESP32-S3; there is no radio; the toolchain is KiCad 9; there are 3 real 2-layer boards (power carrier 49×41 mm, partly routed; sensor daughter board, no layout yet; FPC2532AP fingerprint board 22.8×26.1 mm, routed). Nothing has been fabricated or tested; the main branch paused 2025-08-26 mid-design.
- Open (club must decide): Notion records the project as renamed "SIDEKICK" with "legacy project" status; member counts (25+/40+/120+) remain unverified (6 people ever committed to the KB).

## Brand Commitments

- Name: DIGITAL / DIGITAL @ Cal Poly Pomona. Thesis line is canonical.
- One signal-red accent (`#d8412f`). It fails WCAG AA as small text and under white text, so text/fill uses need a darker shade.
- Voice: declarative, concrete, verbs over adjectives; no startup buzzwords (`docs/design/BRAND.md`).
- Head Designer direction for round 2: mirror **Apple's** product-page design playbook (primary). Use Google's UI/frontend approaches as secondary research. Pages should be more engaging and less wordy, with smooth interactive motion and custom icons.
- Round 1 pieces the team endorsed: the 4-stage workflow strip with animated dot orbs (concept C) and the scroll-driven exploded isometric phone (concept E, `#case-dg-001`).

## Evidence on Hand

- Real: 2 builds + 1 program, the 7-subsystem ownership model, the RSVP method, the meeting time/place, the Discord link, 1 named mentor.
- Knowledgebase facts may be shown on mockups, tagged `[confirm]` until the club verifies them (Head Designer, 2026-10-02). **No personal names** of members are published.
- Absent (must not be fabricated): photos of real work or people, member testimonials, verified member counts, confirmed partners/sponsors, shipped outcomes, dated events.

## Product Principles

1. Show the build, not the club: real artifacts and mechanisms over adjectives.
2. Less reading, more seeing: one idea per viewport; motion carries state, not decoration.
3. Honest status: unknowns are labelled, never filled in.
4. Every project gets its own spin inside one shared system.
5. Ownership is the story: every page answers "which part could be mine?"

## Accessibility & Inclusion

WCAG 2.1 AA. Honor `prefers-reduced-motion` with full content parity, keep content visible without JS, use 44px touch targets, and require keyboard operability for every interactive demo. Smart Reading's audience includes dyslexic readers, so its page must model readable typography.
