# Content inventory — what is actually true

W1-AUDIT · 2026-10-02. Source of truth = `lib/data/*` at `5693b8d`. Every field below is cited.
`MISSING` = no data anywhere in the repo. `UNVERIFIED` = present in data but contradicted elsewhere, implausible,
or carried over from the legacy template; do not use in concepts without club confirmation.
Never source facts from `UI_Pages/` (legacy template) — see `audit.md` §4.

---

## 1. Projects

### DG-001 — The Modular Smartphone (flagship)

DG id assigned by DESIGN.md §4.6 (not yet in data — R4 pending).

| Field | Value | Source | Confidence |
|---|---|---|---|
| Title | "The Modular Smartphone" (also "The Smartphone Project", "Phone V2") | `lib/data/projects.ts:7`; `homeLanding.ts:109`; `phoneV2.ts:114` | real |
| Slug / route | `modular-smartphone` → `/projects/modular-smartphone` | `projects.ts:6` | real |
| One-line | "Build a modular smartphone around repair, upgrades, and real subsystem interfaces." | `homeLanding.ts:110` | real |
| Problem | Throwaway culture / unrepairable devices: "challenges the throwaway culture of modern devices" | `projects.ts:9` | real (framing) |
| Requirement (verbatim, "since day one") | "Build a smartphone from scratch that is comfortable to hold, intuitive to use, powerful enough…, efficient enough to endure a whole day…, speedy enough…, and versatile enough to serve as a foundation for future innovations." | `lib/data/about.ts:97-98` | real |
| Disciplines / subsystems (7) | Systems Architecture · Hardware/PCB · Firmware/Embedded · Operating System · Apps/UX · Mechanical/CAD · Integration/Testing — each with description, 3 bullets, scope/risk/mode | `phoneV2.ts:140-288` | real (content model) |
| Workflow | plan → prototype → test → integrate | `phoneV2.ts:138` | real |
| Ownership model | one owner per subsystem · one review path per handoff · one test gate before merge · one repair plan before release | `phoneV2.ts:295-300` | real |
| "Core modules" (4) | Core Compute (ESP32-S3), Power Management (hot-swap battery), Display Unit, Haptics | `projects.ts:26-51` | UNVERIFIED — conflicts with 7 subsystems; not rendered anywhere |
| Tech | ESP32-S3, KiCad, C++, PlatformIO, Custom PCB | `projects.ts:14` | UNVERIFIED — `/about` says "Altium, SolidWorks, embedded C++" (`about.ts:149`) |
| Bench work | Four-layer PCBs for power/connectivity; 3D-printed + CNC enclosures for snap-fit; custom kernel drivers + interface | `about.ts:105-118` | partially verified (stated on `/about`) |
| Specifications | ESP32-S3 @240MHz, 8MB PSRAM, 16MB flash + SD, 4.5" IPS (modular), 3000mAh swappable, "WiFi 6, BLE 5.0" | `projects.ts:52-59` | UNVERIFIED — ESP32-S3 is Wi-Fi 4 (b/g/n); "custom Android kernels" (`projects.ts:8`) impossible on that MCU. Not rendered in production. |
| Status | `active`; phase 3 of 4 "Prototyping — Component Testing" (current) | `projects.ts:11,20-25` | real-ish |
| Status (alt) | roadmap: Concept & prototyping ✓ · **PCB fabrication (current)** · System integration (future) | `about.ts:126-142` | conflicts with "Prototyping" — pick one with the club |
| Dates | Start date MISSING · end date MISSING · "3 semesters" | `homeLanding.ts:115-116` | duration UNVERIFIED |
| Team size | "25+ student engineers" (`projects.ts:18`) vs "40+ members" (`homeLanding.ts:113`) | — | UNVERIFIED (conflict) |
| Open source | "100%" (`projects.ts:16`) | — | UNVERIFIED; no repo link exists |
| Outcome | MISSING (no shipped revision, no test results) | — | — |
| Contributors | MISSING (lead "To be announced" — `team.ts:82-89`) | — | — |
| Partner / sponsor | MISSING (project-specific) | — | — |
| Repo | MISSING (`siteConfig.community.github` points to `SunnyYoshimitsu/CelestiCall` — unrelated personal repo name, `siteConfig.ts:28`) | — | — |
| Demo / video | MISSING (video shelf is placeholder — `community.ts:59`) | — | — |
| Imagery (real) | **none.** Available: `PhoneSchematicSvg` (procedural SVG, `components/phone-v2/PhoneSchematicSvg.tsx`); generic phone teardown renders `public/assets/frames/*`, `public/assets/layers/*` (not the club's device); placeholder `public/images/placeholders/projects/modular-phone.svg` | — | — |
| Page | Immersive route, `lib/data/phoneV2.ts` (header: "pending human sign-off", `phoneV2.ts:4-5`) | | |

### DG-002 — Smart Reading (flagship)

| Field | Value | Source | Confidence |
|---|---|---|---|
| Title | "Smart Reading" (also "Smart Accessibility Glasses") | `projects.ts:64`; `homeLanding.ts:125` | real |
| Route | `/projects/smart-reading` | `projects.ts:63` | real |
| One-line | "FPGA-based heads-up glasses that show one word at a time, right where you look. Built with dyslexic readers in mind." | `projects.ts:65-66` | real |
| Problem | Reading load from saccades & fixations — eyes chase the line, lose their place | `glasses.ts:122-129` | real |
| Audience | Dyslexic readers; "~5–20% of people" | `glasses.ts:127` | claim — source not cited in repo |
| Method | RSVP (rapid serial visual presentation): one word at a fixed point; reader sets WPM (HUD demo: 450 wpm) | `glasses.ts:5-7,108,133-140` | real |
| Compute | FPGA, real-time render | `glasses.ts:139,148` | real |
| Tech | FPGA, RSVP, Optics, Verilog, Embedded C | `projects.ts:73` | real (stated) |
| Disciplines wanted | engineering, optics, firmware, design, research | `glasses.ts:157` | real |
| Mentor | **Dr. Mohamed El Hadedy** | `projects.ts:68`; `glasses.ts:157,160` | real — only named person on the site |
| Openness | "The firmware stays open. The design stays modular" | `glasses.ts:146` | claim; no repo |
| Status | `active` | `projects.ts:70` | real; phase MISSING |
| Dates | "8-month build cycle"; start/end MISSING | `projects.ts:77`; `glasses.ts:150` | duration only |
| Source doc | "The Smartglasses Project … [Master Document]" (not in repo) | `glasses.ts:4` | exists off-repo — ask for it |
| Outcome / prototype state | MISSING | — | — |
| Contributors | MISSING (lead TBA — `team.ts:91-98`) | — | — |
| Partner | MISSING | — | — |
| Imagery (real) | **none.** Available: `public/assets/experiments/glasses/BookBG_{Blurry,Clear}.png` (POV page backgrounds); procedural R3F glasses (`GlassesModel.tsx`); optional `Sunglasses.fbx`, `vuzix-re2-hipoly.fbx` (third-party, not the prototype). `projects.ts:72` wrongly points at the phone placeholder. | — | — |
| Cost to join | "Free to join" | `glasses.ts:161` | real |

### Venture Studies (program, not a project record)

| Field | Value | Source | Confidence |
|---|---|---|---|
| Title | "Venture Studies" — kicker "Technical Entrepreneurship" | `homeLanding.ts:140-141` | real |
| What | "Turn engineering scope into budgets, sponsor briefs, and pitches." | `homeLanding.ts:142` | real |
| Learnings | Map technical scope to budget and sponsorship; defend trade-offs in front of sponsors | `homeLanding.ts:149-150` | real |
| Stats | 5 case studies · 12 sponsor briefs · 2 pitch cycles | `homeLanding.ts:143-148` | UNVERIFIED (no artifacts) |
| Lead | TBA | `team.ts:100-107` | — |
| Route | none — card links to `/get-involved` | `homeLanding.ts:151` | — |
| Imagery | none (placeholder plate "TEAM WORKING SESSION") | `homeLanding.ts:139` | — |
| In `projects.ts`? | **No** | | |

### Not projects (do not list as such)

"Embedded Systems", "Robotics Initiative", "Software Hatchery" exist only in `UI_Pages/homepage/code.html` (legacy template). No data, no team.

---

## 2. Team / people

| Record | Name | Role | Term | Source |
|---|---|---|---|---|
| president | To be announced | President | 2026–27 | `team.ts:45-53` |
| vice-president | To be announced | Vice President | 2026–27 | `team.ts:54-62` |
| secretary | To be announced | Secretary | 2026–27 | `team.ts:63-71` |
| treasurer | To be announced | Treasurer | 2026–27 | `team.ts:72-80` |
| lead-smartphone | To be announced | Project Lead — Modular Smartphone | — | `team.ts:81-89` |
| lead-smart-reading | To be announced | Project Lead — Smart Reading | — | `team.ts:90-98` |
| lead-venture-studies | To be announced | Project Lead — Venture Studies | — | `team.ts:99-107` |

All 7 `isPlaceholder: true`. Photos, bios, links, discipline codes: MISSING for everyone.
Named humans anywhere in repo data: **1** (Dr. Mohamed El Hadedy, faculty mentor).
Discipline codes available for future credits: ME EE SW DS ID VN CM OP (DESIGN.md §9.3).

## 3. Involvement paths

Meeting: **Thursdays @ 6:00 PM · Building 17, Room 1635 · Cal Poly Pomona** — "Thursday nights are build nights. Subsystem standups first, workshop after." (`involvement.ts:140-146`; `siteConfig.ts:16-18`). Perks list: hands-on workshops, industry guest speakers, project updates, networking (`involvement.ts:146`) — speakers UNVERIFIED (none named).

| Audience | Option | CTA → | Source |
|---|---|---|---|
| Students | Become a Member (featured) | `/contact?type=membership` | `involvement.ts:28-36` |
| Students | Join a Project Team | `/contact?type=project-team` | `:37-44` |
| Students | Apply for Leadership | `/contact?type=leadership` | `:45-52` |
| Students | Get Mentorship ("senior members and industry mentors") | `/contact?type=mentorship` | `:53-60` |
| Alumni | Join Alumni Network (featured) | `/contact?type=alumni-network` | `:69-77` |
| Alumni | Mentor Students | `/contact?type=mentor` | `:78-85` |
| Alumni | Speak at an Event | `/contact?type=speaker` | `:86-93` |
| Companies | Become a Sponsor (featured) | `/contact?type=sponsor` | `:102-110` |
| Companies | Recruit Talent ("grads who have shipped") | `/contact?type=recruit` | `:111-118` |
| Companies | Host a Workshop | `/contact?type=workshop` | `:119-126` |
| Companies | Donate Equipment | `/contact?type=donate` | `:127-134` |

All 11 paths end at the same contact form (4 topics: general, join, project, sponsorship — `contactTopics.ts:5-10`).
Homepage frames it as 2 ways in: Core Teams (own a smartphone subsystem) / Contributors (research, design, ops, docs) (`homeLanding.ts:87-97`).
Eligibility: "Bring engineering, computer science, design, or business. No project experience required." (`homeLanding.ts:169`); "Open to all majors · Free to join" (`app/community/page.tsx:42`).

## 4. Org facts, channels, partners

| Field | Value | Source | Confidence |
|---|---|---|---|
| Name | DIGITAL · DIGITAL @ Cal Poly Pomona | `siteConfig.ts:4-5` | real |
| Domain | digitalcpp.org; contact@digitalcpp.org | `siteConfig.ts:7,15` | real |
| Positioning (brand) | "student-run venture studio" | DESIGN.md §1; `homeLanding.ts:57` | approved line; code still says "engineering club" in 5 places |
| Thesis | "Make something worth putting your name on." | DESIGN.md §2.1; `homeLanding.ts:56` | canonical |
| Vision | "Real systems, built by students, handed to the next cohort." | `mission.ts:26-27` | canonical |
| Tagline | "Students building real technology, one module at a time." | `mission.ts:18-19` | canonical (unused in UI) |
| Mission beats | WE EXPLORE / DESIGN / BUILD / COMMUNICATE + lines | `mission.ts:30-51` | canonical — verbatim only |
| Beliefs | B1–B4 | DESIGN.md §2.2 | canonical (not yet in `lib/data`) |
| Pipeline | FIND → PROVE → MAKE → SHIP → SIGN | DESIGN.md §3 | adopted (not yet in `lib/data`) |
| Acronym | Device · Implementation · Generating · Integrating · Testing · Analyzing · Learning | `about.ts:17-67` | real, legacy framing |
| Discord | discord.gg/Vsg3qcNVzv | `siteConfig.ts:24,27`; `community.ts:25` | real |
| Notion | notion.so team join link | `siteConfig.ts:29` | real |
| LinkedIn / GitHub / Instagram | linkedin.com/company/digitalcpp · github.com/digitalcpp · instagram.com/digitalcpp | `siteConfig.ts:21-23` | UNVERIFIED (community.ts marks LinkedIn URL empty, `community.ts:36`) |
| YouTube | none | `community.ts:41` | MISSING |
| Sponsors / support | "Cal Poly Pomona Project Hatchery", "College of Engineering: MEP-WiSE" | `siteConfig.ts:41-44` | UNVERIFIED — not rendered anywhere; confirm before any "proof" section |
| Stats | 120+ members · 15 prototypes · 50k+ LOC · 2 sponsors | `siteConfig.ts:34-39` | UNVERIFIED — traces to the 2023 `UI_Pages` template; not rendered |
| Testimonials / quotes | none | — | MISSING |
| Events | none (no dated event in data) | — | MISSING |
| News / posts | none (`linkedInPosts = []`) | `community.ts:47` | MISSING |
| Videos | 2 placeholders | `community.ts:58-61` | MISSING |
| Photos of people/work | none | — | MISSING |
| Founding year | none | — | MISSING |

## 5. Contradictions to resolve with the club (blocking for any "proof" section)

| # | Claim A | Claim B | Sources |
|---|---|---|---|
| C1 | 25+ student engineers (smartphone) | 40+ members (smartphone) | `projects.ts:18` vs `homeLanding.ts:113` |
| C2 | 120+ active members | 40+ on the flagship | `siteConfig.ts:35` vs `homeLanding.ts:113` |
| C3 | 4 core modules | 7 subsystems | `projects.ts:15-17,26-51` vs `homeLanding.ts:111`, `phoneV2.ts:140-288` |
| C4 | KiCad / PlatformIO | Altium / SolidWorks | `projects.ts:14` vs `about.ts:149` |
| C5 | Phase: Prototyping (component testing) | Phase: PCB fabrication | `projects.ts:23` vs `about.ts:133-135` |
| C6 | ESP32-S3 MCU | "custom Android kernels", "WiFi 6" | `projects.ts:8,53,58` |
| C7 | "engineering club" | "not an engineering club — venture studio" | `siteConfig.ts:6`, `app/about/page.tsx:46` vs DESIGN.md §1 |

## 6. Placeholder rules for concepts

- Contributor names → `[placeholder]` or the DESIGN.md §4.4 unsigned `BUILT BY ______` cell.
- Photos → striped plate with `[ PROJECT PHOTO — … ] [placeholder]` caption.
- Dates → `[placeholder date]`; never invent a REV letter or DG sheet date.
- Numbers → only: 7 subsystems, 4 workflow stages, 8-month build cycle, 3 semesters (label "planned" if used), Thursday 6 PM, Bldg 17 Rm 1635, 7 open leadership roles, 11 involvement paths, 2 projects.
