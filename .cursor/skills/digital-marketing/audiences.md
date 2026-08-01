# Audience Segments — Messaging Table

Seven segments. For each: the one message to land, the proof that backs it,
and the CTA to point at. Proof must come from `claims.md`-approved sources.
CTAs reuse existing routes/strings (`/get-involved`, `/contact?type=*`,
Discord) — do not invent new destinations.

| # | Segment | Message | Proof | CTA |
|---|---------|---------|-------|-----|
| 1 | Prospective members — engineering majors (EE/ME/CpE) | Build the whole system, not just your slice: PCB design, power, enclosures, integration on real hardware. | Modular Smartphone: 4 core modules, custom PCB, ESP32-S3, build timeline in prototyping phase (`lib/data/projects.ts`). | "Join a project team" → `/contact?type=project-team` |
| 2 | Prospective members — CS / software majors | Your code runs on hardware you can hold — firmware, kernels, FPGA pipelines, not another CRUD app. | Tech stacks: C++/PlatformIO on the smartphone; Verilog/Embedded C + RSVP on Smart Reading (`lib/data/projects.ts`). | "Become a member" → `/contact?type=membership` |
| 3 | Prospective members — design / business majors | Every discipline has a seat: scope the work, raise the funding, pitch it like a business. | WE DESIGN / WE COMMUNICATE mission beats (`lib/data/mission.ts`); project pitches and sponsor relationships. | "Get involved" → `/get-involved` |
| 4 | General students — no experience, undecided major | No experience required. Show up Thursday, learn by building alongside people who'll teach you. | "Engineering, CS, design, business — no experience required." (`lib/data/landing.ts`); meetings Thursdays @ 6:00 PM, Building 17 Room 1635 (`lib/data/involvement.ts`). | "Come Thursday 6PM" → meeting info / Discord invite |
| 5 | Faculty & campus partners | Student teams doing serious, mentorable technical work that complements coursework. | Smart Reading mentored by Dr. Mohamed El Hadedy; open documented hardware platform (`lib/data/projects.ts`). | "Contact us" → `/contact` |
| 6 | Alumni | Stay in the loop and multiply your experience — mentor, speak, or just stay connected. | Alumni options: network, mentor students, speak at events (`lib/data/involvement.ts`). | "Join alumni network" → `/contact?type=alumni-network` |
| 7 | Sponsors & companies | Access students who have already built, tested, and pitched real systems — and put your name on honest work. | 100% open-source flagship, 25+ student engineers; current campus partners: CPP Project Hatchery, MEP-WiSE (`lib/data/siteConfig.ts`). | "Become a sponsor" → `/contact?type=sponsor` |

## Formulas — industrial type system

These match DESIGN.md's type treatment (uppercase Archivo headline with one
outline keyword + accent period, DM Mono eyebrow). The formulas shape NEW copy;
they never rewrite preserved strings.

### Headline

`[VERB] THE [CONCRETE NOUN].` — terse, imperative or declarative, one idea,
one outline keyword, ends with the accent period.

- `BUILD THE WHOLE SYSTEM.`
- `TAKE IT APART.`
- `SHIP THE PROTOTYPE.`

Bad: `EMPOWERING TOMORROW'S INNOVATORS` (abstract, superlative, no noun).

### Eyebrow (mono, accent)

`[INDEX] · [PLAIN LABEL]` or `[CONTEXT LABEL]` — lowercase-calm, factual.

- `01 · Flagship`
- `What we're building`
- `DIGITAL @ Cal Poly Pomona`

### CTA

`[VERB] [OBJECT]` — two or three words, concrete destination, no hype.

- `Get involved`
- `View specs`
- `Come Thursday`

Bad: `Start your journey!`, `Learn more` (vague), anything with an exclamation
point.

### Proof line (stat / margin note)

`[NUMBER or STATUS] [NOUN]` sourced from `claims.md` only.

- `4 core modules`
- `100% open source`
- `Prototyping — phase 3 of 4`
