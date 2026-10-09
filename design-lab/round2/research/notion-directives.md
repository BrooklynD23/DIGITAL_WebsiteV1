# R2-NOTION: the 2 new directives (Notion-sourced, read-only pass)

Pass date: 2026-10-02. Source: Notion MCP, read-only. All pages show `verification: unverified`. Every fact below is Notion-sourced; the website must tag it `[confirm]`.

## Verdict

1. **The 2 directives are BRAIN and SHADES.** Confidence: medium-high (inferred, not stated).
   - Evidence A: Notion "Operating Rhythm" lists DIGITAL Departments as Engineering, Business and Marketing, **B.R.A.I.N.**, **S.H.A.D.E.S.** (the last two sit beside the legacy smartphone work).
   - Evidence B: "Current Initiatives & Projects" has exactly 3 live rows: SIDEKICK (legacy), SHADES, BRAIN.
   - Evidence C: the Aug 2026 intro transcript says "three major initiatives" (smartphone, SHADES, BRAIN).
   - The word "directive" appears NOWHERE in Notion. Notion says "initiative" and "department".
2. **SHADES = the smart-glasses (RSVP) project.** The names "Smart Reading" and "DG-002" are NOT FOUND in Notion. The mapping Smart Reading = SHADES is inferred from content. Confirm with the Head Designer.
3. **Future pipeline (NOT directives):** SIGNAL, VECTOR, TWINS, ANCHOR sit in "Future Initiatives & Projects". Only TWINS and ANCHOR have content. If the Head Designer meant a different pair, these are the alternates.

## SIDEKICK / smartphone verdict

| Claim | Verdict | Notion page title |
|---|---|---|
| Smartphone renamed SIDEKICK | CONFIRMED | TheSmartphoneProject; SIDEKICK (The Smartphone Project) |
| Status "legacy project" | CONFIRMED (wording) | TheSmartphoneProject |
| Acronym | Schematic Integration of Digital Electronics: Kinematic Interfaces, Circuits, & Kernels | Product Definition - SIDEKICK |
| Scope | Educational modular FPGA phone and SoC platform. RTOS or text engine only. No Android or Linux | Exploration of Viability |
| Notion Status field | "Planned" (not "Done" or "Paused") | Current Initiatives & Projects (db row) |

Exact Notion words: "SIDEKICK (Previously The Smartphone Project) is the legacy project of DIGITAL Technologies @ Cal Poly Pomona." The tool stack named is KiCAD, SolidWorks, ANSYS, Vivado, OrCAD.

## Directive 1: BRAIN

| Fact | Notion page title | Confidence |
|---|---|---|
| Name expands to "Building Remarkable AI Innovation and kNowledge" (also styled B.R.A.I.N.) | BRAIN; Mission Statement | high |
| Type: an initiative (Agentic AI Initiative), a department in Operating Rhythm. NOT described as a class | BRAIN; Operating Rhythm | high |
| "Competes in hackathons and develops full-fledged software solutions for business, engineering, and other disciplines' ventures" | BRAIN | high |
| Members build real projects with agentic tools: AI systems that carry out multi-step tasks on their own | Mission Statement | high |
| Method: state a prediction before building, build, measure against a standard nobody in the room chose, change course on contrary evidence. Failures get written down | Mission Statement | high |
| Three questions per project: Can it be built? Does it work? Should it exist? | Mission Statement | high |
| Open to every engineering discipline, not only CS. Skeptics welcome | Mission Statement | high |
| Industry partnerships "give that work somewhere real to land" (no named partners) | Mission Statement | med |
| Aims: students learn agentic tools before industry; collaborate with industry pros; resume experience; hackathon ideas continue past the hackathon | Transcript EIYF 2026 | med |
| One-line pitch: "explores AI and intelligent software through hackathons, workshops, and real-world projects that combine engineering with entrepreneurship" | Transcript EIYF 2026 | med |
| Status property: "Planned". Page last edited 2026-08-20 | BRAIN | high |
| Reference content: software-architecture primer (MVC, RAG variants, serverless, event sourcing, CQRS, etc.), oriented to 36-hour hackathons | Types of Software Architectures | med |
| Tracker "Technical Projects" has 1 row: team "Claude Code", no milestones | B.R.A.I.N. (Operating Rhythm) | low |
| Owner ROLE: a project manager (a student) | Transcript EIYF 2026 | high |
| MCP, context engineering, harnesses, infrastructure, class module, curriculum, module list, deliverables, timeline, meeting cadence | NOT FOUND | n/a |

The Head Designer's framing (an LLM class module covering MCP, context engineering, harnesses and infrastructure) is NOT in Notion. The only agentic wording is "agentic tools" and "Agentic RAG" in the architecture page. Treat the framing as Head Designer input, not Notion fact.

### What the BRAIN page must show
1. Name and expansion (Building Remarkable AI Innovation and kNowledge). Status "Planned" shown as "Forming" or "Fall 2026" only after the Head Designer approves the label.
2. One-sentence thesis: AI should amplify human thinking, not replace developing it. Order matters: idea first, tool second.
3. The method loop: predict, build, measure, revise, record.
4. The 3 questions: can it be built, does it work, should it exist.
5. What members do: hackathons, workshops, real projects with agentic tools, open to all engineering majors.
6. Join path. The CTA target is NOT FOUND in Notion.

### Do-not-publish (BRAIN)
- Personal names of the project manager, and the transcript's first-person biography.
- Raw transcript text (speech-to-text artifacts, e.g. "Uh").
- The "Claude Code" tracker row (internal tooling note).
- Any claim of named industry partners, results, hackathon wins, or a curriculum. None are in Notion.
- Notion URLs and file attachments (the weekly check-in HTML template).

## Directive 2: SHADES

| Fact | Notion page title | Confidence |
|---|---|---|
| Name: Smart Headset for Adaptive Dyslexia Enhancement System (also S.H.A.D.E.S.) | SHADES; Product Definition | high |
| Type: two-part biomedical engineering project. Track 1 engineering (RSVP heads-up-display glasses). Track 2 medical research (RSVP effect on dyslexic readers) | SHADES; Transcript EIYF 2026 | high |
| RSVP = Rapid Serial Visual Presentation: words shown one at a time at a fixed point, adjustable speed | Product Definition | high |
| Audience: dyslexia, ADHD, visual-tracking difficulty, speed-readers | Product Definition | med |
| Reference products named: Focals by North, Even Realities G1 | Product Definition | med |
| Open source intent: "an open source project for others to look at and potentially use" | Transcript EIYF 2026 | med |
| MVP: prepared text over ONE wired link (USB or UART) from a host laptop; limited English charset; FPGA renders word or phrase in a fixed region; pause, resume, speed, rewind; monocular fixed-focus bird-bath optics; external controller holds compute and power | Engineering Scope \| SHADES | high |
| Out of scope: wireless, camera/OCR, AI pacing, eye tracking, SLAM, standalone operation, medical claims | Engineering Scope \| SHADES | high |
| Clinical boundary: the build is NOT claimed to treat dyslexia or improve outcomes | Engineering Scope \| SHADES | high |
| Stack: Xilinx Artix-7 FPGA, Vivado, SystemVerilog, UART 115200 8N1, VGA 640x480 test monitor first, microcontroller, KiCad PCB | FPGA Project Timeline | high |
| 7 phases: 1 Basic FPGA operation, 2 Video output, 3 Text display, 4 Text input, 5 RSVP operation, 6 Full integration, 7 Wearable prototype | FPGA Project Timeline | high |
| 17 sub-projects and 5 suggested teams (A hardware, B video, C text input, D reading control, E integration) | FPGA Project Timeline | high |
| Subteams: Product Development, Systems Engineering, Hardware (PCB), SoC/FPGA, Mech-E | SHADES; SHADES Project Timeline Database | med |
| Status property: "Planned". Pages edited through 2026-09-30 (active planning). Which phase the team is in now: NOT FOUND | SHADES | med |
| Dates, deliverable ship dates, cohort size | NOT FOUND | n/a |

### Relation to existing builds
- Smart Reading (DG-002): the same glasses project, probably renamed or re-scoped as SHADES. Not stated in Notion. Open question 1.
- SIDEKICK: shares KiCAD, Vivado, FPGA and PCB skills. Notion says the club grew "around products", and smartphone was first. SHADES reuses that hardware template.
- Older Notion pages "Future Initiatives / SHADES (1)" show SHADES was incubated in the July 2026 future-projects area, then promoted to Current.

### What the SHADES page must show
1. Full name and the RSVP one-liner in plain words.
2. The two tracks: engineering prototype and medical research.
3. The MVP chain: text from laptop, FPGA, near-eye display, with an external controller.
4. The 7-phase roadmap as a progress rail, with the current phase marked only after confirmation.
5. The honest boundary: a research platform, not a medical device or treatment.
6. Open-source intent, only if the Head Designer approves the claim.

### Do-not-publish (SHADES)
- Personal names, team rosters, assignees, and expense or reservation links.
- Raw viability or ChatGPT-style analysis text ("Your architecture cleverly...").
- Part numbers or vendor picks marked as tentative (FPGA board, display) until confirmed.
- Any efficacy or clinical claim. The page itself forbids it.
- Notion URLs and attachments.

## Club-wide facts (Notion-sourced, tag [confirm])

| Fact | Notion page title | Confidence |
|---|---|---|
| "DIGITAL, Cal Poly Pomona's engineering and entrepreneurship project incubator" | Transcript EIYF 2026 | med |
| Mission: "we help students turn ideas into real products": research, planning, budgeting, project management, engineering, leadership | Transcript EIYF 2026 | med |
| Built around products, not competitions. Disciplines: hardware, software, mechanical, systems, product thinking, entrepreneurship | Transcript EIYF 2026 | med |
| Founded roughly 3 years before Aug 2026 (founder's recollection, not a date) | Transcript EIYF 2026 | low |
| Tagline: "It's about building engineers" | Transcript EIYF 2026 | med |
| Club registered with the campus student-government office (ASI) | Club Registration With ASI | low |
| Member count, meeting day, time, room | NOT FOUND (only historical "General Meetings" topic lists) | n/a |
| Sponsors or partners | NOT FOUND. "Target Companies" is a 2025 outreach wishlist (not confirmed partners). Sponsors DB has 1 stub row | n/a |

## Open questions for the Head Designer (top 6)
1. Is "Smart Reading (DG-002)" now SHADES? Which name does the site lead with?
2. Does "directive" mean BRAIN + SHADES, or is a future initiative (TWINS or SIGNAL) one of the two?
3. BRAIN: is it a project, a class module, or both? Notion has no module list. Who supplies the MCP, context engineering, harness and infrastructure curriculum?
4. SHADES: what phase is the team in today (Notion shows planning only)? Can the page show a phase rail?
5. Is "legacy" the public word for SIDEKICK? Does it get a reduced page, or an archive tone?
6. May the site publish meeting time, place, member count, the open-source claim, and the (unnamed) industry partnerships? None are confirmed.

## Sources (internal only, do not publish)
Notion page titles consulted: BRAIN; Mission Statement; Types of Software Architectures; Transcript EIYF 2026; B.R.A.I.N. (Operating Rhythm); Operating Rhythm; SHADES; S.H.A.D.E.S. (Operating Rhythm); Engineering Scope | SHADES; FPGA Project Timeline; Product Definition (SHADES); SHADES Project Timeline Database; TheSmartphoneProject; SIDEKICK (The Smartphone Project); Product Definition - SIDEKICK; Exploration of Viability; Current Initiatives & Projects (db); Future Initiatives & Projects (db: SIGNAL, VECTOR, TWINS, ANCHOR); Sponsors and Fundraising (db).
Notion page IDs (prefix only): BRAIN 39416947; SHADES 45f16947; SIDEKICK 3ab16947 and 3e316947; Operating Rhythm 36e16947; Transcript 39416947-...f2370b4.
Local cross-check: `design-lab/round2/research/kb-smartphone.md` F21 agrees on the SIDEKICK rename.
