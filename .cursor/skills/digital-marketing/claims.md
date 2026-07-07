# Approved Claims Registry

Check this table before writing ANY stat, sponsor line, or factual claim.

- **approved** — safe to use; keep wording consistent with the source file.
- **verify** — do not publish in new copy until a human confirms the number;
  existing pages already showing it are left alone until verified.
- **do-not-use** — never use in new copy; replace on sight when doing copy
  passes.

New claims start as `verify`. Only a human sign-off moves them to `approved`.

| Claim | Status | Source | Notes |
|-------|--------|--------|-------|
| Open-source modular smartphone ("100% open source") | approved | `lib/data/projects.ts` | Flagship project stat. |
| 4 core modules (smartphone) | approved | `lib/data/projects.ts` | Compute, power, display, haptics. |
| 25+ student engineers (smartphone) | approved | `lib/data/projects.ts` | Project-level, not club-wide. |
| Smartphone in prototyping (phase 3 of 4) | approved | `lib/data/projects.ts` | Honest status word — use it. |
| ESP32-S3, KiCad, C++, PlatformIO, custom PCB | approved | `lib/data/projects.ts` | Smartphone tech stack. |
| Smart Reading: FPGA + RSVP, 8-month build cycle | approved | `lib/data/projects.ts` | Wearable flagship stats. |
| Smart Reading mentored by Dr. Mohamed El Hadedy | approved | `lib/data/projects.ts` | Named faculty mentor. |
| Meetings Thursdays @ 6:00 PM, Building 17 Room 1635 | approved | `lib/data/siteConfig.ts`, `lib/data/involvement.ts` | Core CTA fact. |
| Sponsors: CPP Project Hatchery; College of Engineering: MEP-WiSE | approved | `lib/data/siteConfig.ts` | 2 named campus partners — frame as "campus partners" / "supported by". |
| "No experience required" | approved | `lib/data/landing.ts` | Join copy. |
| 120+ active members | verify | `lib/data/siteConfig.ts` | Club-wide number; confirm before using in new copy. |
| 15 prototypes | verify | `lib/data/siteConfig.ts` | Unclear counting method. |
| 50k+ lines of code | verify | `lib/data/siteConfig.ts` | Unverifiable vanity stat; prefer depth stats. |
| "Backed by Industry Leaders" | do-not-use | `app/page.tsx` | Oversells 2 campus sponsors. Replace with "Campus partners" / "Supported by". |
| Any shipped-product framing for flagship hardware | do-not-use | — | Projects are prototyping; say so. |
| "revolutionary" / "game-changing" / "seamless" / "cutting-edge" | do-not-use | — | Banned superlatives per SKILL.md voice rules. |
