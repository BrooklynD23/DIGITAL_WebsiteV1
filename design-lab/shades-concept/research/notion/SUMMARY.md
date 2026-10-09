# SHADES in Notion: summary and site comparison (2026-10-09)

**Result:** 48 facts. 21 agree with the site, 6 conflict, 17 are new, 4 are site claims Notion does not support. No `_content` file was edited.

**Sources:**
- Root page https://app.notion.com/p/45f169473d77821fb3ad81ac68585a5c (last edited 2026-09-28) and every child page it links.
- Raw quotes are in `01-…05-*.md` in this folder, written by five Haiku 5.5 readers.
- The orchestrator re-fetched 12 SHADES pages and matched their key quotes.
- Notion was read-only. Names are redacted.
- "Last edited" means Notion's `page_last_edited_at`, not a decision date.
- Every SHADES page is marked `unverified` in Notion.

### 1. Sources (short names)
| Short | Page | URL | Last edited |
|---|---|---|---|
| Root | SHADES | https://app.notion.com/p/45f169473d77821fb3ad81ac68585a5c | 2026-09-28 |
| Scope | Engineering Scope \| SHADES | https://app.notion.com/p/3ac169473d77802c99b5c90e4d426475 | 2026-07-29 |
| Background | Background, & Project Solution \| SHADES | https://app.notion.com/p/3ab169473d778029a38ed4957c453ed2 | 2026-09-28 |
| ProdDef | Product Definition | https://app.notion.com/p/390169473d77806f93d1c99f5a28db74 | 2026-09-10 |
| ConOps | Concept of Operations (ConOps) - SHADES | https://app.notion.com/p/3b3169473d77803d8b6dcda750335eb1 | 2026-08-05 |
| FPGA-TL | FPGA Project Timeline | https://app.notion.com/p/3b3169473d7780239e59e2e84242a7de | 2026-09-22 |
| SoC | System on Chip Logic Design | https://app.notion.com/p/3aa169473d7780aea39cc2f504a68295 | 2026-09-22 |
| Puck | Compute Puck Enclosure (Mech-E) | https://app.notion.com/p/ab3169473d778245bac8816b34bf65a3 | 2026-09-28 |
| Focal | Focal Plane Adjustment (Mech-E) | https://app.notion.com/p/c88169473d7782d5b54b81d570aa04cf | 2026-09-28 |
| Balance | Mass Balancing & Strain Relief (Mech-E) | https://app.notion.com/p/944169473d778211815d812aa7b33d17 | 2026-08-23 |
| USB-C | 1. Project Definition — USB-C Power and Data Module | https://app.notion.com/p/3cf169473d77817aa02dc70e76540f3f | 2026-09-23 |
| FPGA-core | 1. Project Definition — FPGA/SoC Core Module | https://app.notion.com/p/3cf169473d7781ba9686dc6ca5676a33 | 2026-10-07 |
| Explore | Exploration of SHADES Viability | https://app.notion.com/p/390169473d778022aecaced182120c72 | 2026-08-05 |
| PCB-DB | Hardware Design (PCB) Database | https://app.notion.com/p/32c169473d7783c59ad301c03a2e09fc | rows 2026-09-23 to 10-08 |
| Transcript | Transcript EIYF 2026 | https://app.notion.com/p/394169473d7780f2902dcf92a1467229 | 2026-08-04 |

### 2. Facts Notion states
**Goal and boundary**
- Root: "SHADES is the two part Biomedical Engineering project of DIGITAL Technologies @ Cal Poly Pomona. Medical Research Explores The Usage of Rapid Serial Visual Presentation (RSVP) for Dyslexic Readers. Engineering Project Designs RSVP Heads-Up Display Glasses."
- Root: the Status property is "Planned".
- Scope: "developing a safe, head-mounted system that receives previously prepared text and presents it through Rapid Serial Visual Presentation in a controllable near-eye display. The project is not intended to produce a general-purpose smartglasses platform, a standalone wearable computer, or a clinically validated treatment for dyslexia."
- Background: "The central engineering challenge is therefore not to maximize reading speed. It is to control the delivery of text in a manner that supports the construction of meaning."
- Background: "SHADES therefore does not begin with the claim that RSVP has already been proven to improve dyslexic reading."

**Architecture**
- Scope: the host "will prepare plain text and convert it into presentation instructions".
- Scope: the microcontroller "will manage the wired connection to the host, receive and validate presentation data, monitor user inputs … and communicate commands and data to the FPGA".
- Scope: the FPGA handles "RSVP timing, presentation-state control, glyph lookup, text rendering, display synchronization", plus pause, resume, speed and rewind.
- Scope: "The primary processing electronics, FPGA development board or module, microcontroller, and power hardware will initially remain in an external controller. The glasses will contain only the microdisplay, fixed-focus optical assembly, necessary interface electronics, and the controls that must be physically accessible to the wearer."
- ConOps: "an external controller ("puck") housing the processing unit, power supply, and primary physical controls, and a head-worn monocular display assembly connected via a single physical tether cable." The cable "provides both low-voltage power and serialized data transmission".
- USB-C: "the primary wired connection for both power delivery and data transfer between the SHADES headset and its secondary external hardware unit."
- Do not print (part names): Artix-7 XC7A100T / Nexys A7 (FPGA-core, FPGA-TL), STM32 (SoC), USB-C, DRV2605L haptic driver (PCB-DB, a Stretch item).

**Controller**
- ConOps: a "physical rotary dial located on the compute puck" sets WPM. A "dedicated physical button on the puck" plays and pauses. A physical "Rewind" button is on the puck.
- Puck: "approximately **7 × 14 × 1 cm** … physical control dials or buttons, and a protected cable connection to the glasses".
- Puck: "small enough to fit in a typical pocket or be carried comfortably near the hip".
- Puck: "Buttons and dials must be distinguishable by touch."

**Display and optics**
- Scope: "one fixed-focus, monocular bird-bath optical path". Varifocal and waveguide optics are out of scope.
- Background: the optics return the image "while preserving a view of the surrounding environment".
- Words or phrases:
  - Scope: the MVP must "render words or phrases in a fixed display region".
  - ConOps: "one word or short phrase at a time".
  - FPGA-TL: "displays one word at a time".
- Scope: adjustable variables are "presentation speed, phrase length, punctuation-related pauses, font size, contrast, and selected timing behavior."
- SoC: "A possible MVP range might be 100–600 WPM in 25-WPM steps, but the final values should come from the project requirements."
- ConOps: on lost communication or power, the glasses go to "a safe, blank display state."
- Focal: "Design a linear carriage providing ±4mm of focal displacement"; also "Weight of system: Less than 40-50 grams (Avg. Glasses range 15-35 grams)".
- Balance: "Balance a 140mm to 148mm frame to a 30/70 nose-to-ear weight split, including a 10mm to 15mm tether strain channel."

**Team**
- Root navigation lists four subteams: Product Development, SoC/FPGA, Mech-E, Hardware Design (PCB).
- Explore team table: Power and Safety, Host Interface, User Controls, Display Interface, FPGA Carrier and Integration.
- FPGA-TL teams: A Hardware and Vivado, B Video Pipeline, C Text Input and Storage, D Reading Control, E Integration and Verification.
- No mentor, Optics team or Design team appears on any SHADES page.
- PCB-DB board options include Carrier / Power, Control Daughterboard, Display Daughterboard (`03-hardware-pcb.md:32-35`). Backs the Hardware (PCB) seat line.
- Mech-E rows: Optomechanical IPD Slider, Mass Balancing & Strain Relief, Compute Puck Enclosure, Ergonomic Hinge & Nose-Bridge (`04-mech-e-and-timelines.md:93-132`). Backs the Mechanical seat line.
- Scope, Background and ConOps (with its SyRS requirements and the WPM dial) sit under Product Development (`01-product-definition.md:33,158,229,294,305`). Backs the Product development seat line.

**Roadmap**
- FPGA-TL phases: 1 Basic FPGA Operation, 2 Video Output, 3 Text Display, 4 Text Input, 5 RSVP Operation, 6 Full Integration, 7 Wearable Prototype. Seven checkpoints.
- PCB-DB: a 10-step template per module. Every row is "Not Started" and no row has a date.
- Explore: an 8-month proposal with no calendar dates.
- No page names a current phase.

**Research and constraints**
- Background: "A separate medical research effort will examine whether RSVP is a viable intervention … by directly evaluating comprehension, reading speed, retention, comfort, and other relevant outcomes."
- Scope: "this phase will not claim that RSVP treats dyslexia, improves clinical outcomes, or represents the medically optimal method of presenting text."
- Scope: "Medical-device approval, FCC or UL certification, and full consumer-product certification are outside the current scope."
- Explore: human testing needs IRB approval.
- Do not print (efficacy): ProdDef calls SHADES "an assistive reading tool for individuals with dyslexia, ADHD, visual tracking difficulties … neurotypical people to learn speed reading".

### 3. Notion vs site (shades.ts + DECISIONS.md)
| # | Notion fact | Source | Site | Verdict |
|---|---|---|---|---|
| 1 | Full name | Root | `expansion` | agrees |
| 2 | Status "Planned" | Root | `status: 'Planning'` | agrees |
| 3 | Two tracks | Root | `tracks.items` | agrees |
| 4 | No claim RSVP treats dyslexia | Scope, Background | `boundaryShort`, `tracks.boundary` | agrees |
| 5 | Medical-device approval out of scope | Scope | "Not a medical device" | agrees |
| 6 | Prepared text over one wired link | Scope, ConOps | `scope.in[0]` | agrees |
| 7 | Limited English character set | Scope | `scope.in[1]` | agrees |
| 8 | Pause, resume, speed, rewind | Scope | `scope.in[2]` | agrees |
| 9 | FPGA does timing and rendering | Scope | light path "timing" | agrees |
| 10 | External controller for compute and power | Scope, ConOps | `scope.in[4]`, DECISIONS #7 | agrees |
| 11 | One eye, fixed focus (MVP) | Scope | `scope.in[3]` | agrees |
| 12 | Out-of-scope list | Scope | `scope.out` | agrees |
| 13 | Seven phases, same names | FPGA-TL | `roadmap.phases` | agrees (Notion calls them the FPGA team's phases) |
| 14 | No current phase | all | `current: null` | agrees |
| 15 | No dates | PCB-DB | none printed | agrees |
| 16 | 100–600 WPM, 25-step, tentative | SoC | `reader.wpm` | agrees |
| 17 | See-through | Background | DECISIONS #6 | agrees (first Notion source) |
| 18 | Single tether | ConOps, Balance | DECISIONS #7 | agrees |
| 19 | Fixed visual point | ProdDef | `method` | agrees |
| 20 | Words or short phrases | Scope, ConOps | "one word at a time" | **conflict** |
| 21 | ±4 mm focal slider | Focal | "fixed focus" | **conflict** (Notion contradicts itself) |
| 22 | Light glasses (<40–50 g), components off the glasses | Focal, Balance, Scope | #7 bulky, heavier temples | **conflict** |
| 23 | Four subteams | Root | 5 seats | **conflict** |
| 24 | "Planned", all rows Not Started | Root, PCB-DB | meta "in development" | **conflict** |
| 25 | Controls → MCU → FPGA | Scope, SoC | Text → Timing → Control | **conflict** |
| 26 | Controls on glasses (Scope) vs puck (ConOps, Puck) | Scope, ConOps, Puck | #7 Control in box | agrees with the newer pages |
| 27 | MCU runs link and inputs | Scope | — | new |
| 28 | Pocket controller with dial and buttons, ~7×14×1 cm | ConOps, Puck | — | new |
| 29 | One cable: power and data | ConOps, USB-C | — | new |
| 30 | Phrase length, pauses, font size, contrast adjustable | Scope | — | new |
| 31 | Aim: not max speed, delivery that supports meaning | Background | — | new |
| 32 | Research looks at comprehension, reading speed, retention, comfort | Background | — | new |
| 33 | Lost link → blank display | ConOps, Scope | — | new |
| 34 | "open, FPGA-centered smartglasses platform"; "open source" (informal) | Background, Transcript | — | new |
| 35 | Bird-bath optics named | Scope | — | new, do not print |
| 36 | Part names | FPGA-core, SoC, USB-C, PCB-DB | — | new, do not print |
| 37 | Display 640×480 vs "monochrome" | USB-C, ConOps | — | new, do not print (Notion inconsistent) |
| 38 | Haptic board (Stretch) | PCB-DB | — | new |
| 39 | PCB 10-step template, Not Started | PCB-DB | — | new |
| 40 | 8-month proposal | Explore | — | new, do not print |
| 41 | "assistive … ADHD … speed reading" | ProdDef | — | new, do not print |
| 42 | Inspired by named products | ProdDef | — | new, do not print |
| 43 | IRB needed | Explore | — | new, do not print |
| 44 | Mentor | not in SHADES pages | `join.mentor` | site only (source `lib/data`) |
| 45 | "Formerly Smart Reading" | not found | `formerly` | site only |
| 46 | No software on the glasses | Notion silent | DECISIONS #7 | site only (Head Designer) |
| 47 | Atkinson Hyperlegible | none | `highlights.type` | site only (web demo) |
| 48 | Microdisplay shows the word | Scope | light path "display" | agrees |

Totals: agree 21 (rows 1–19, 26, 48), conflict 6 (rows 20–25), new 17 (rows 27–43), site only 4 (rows 44–47).

### 4. Proposed diff for `app/(apple)/_content/shades.ts` (proposal only; brand agents and Head Designer first)
```diff
@@ header comment
- * Sources: design-lab/round2/research/notion-directives.md (Notion SHADES pages, all tagged [confirm]),
+ * Sources: design-lab/round2/research/notion-directives.md and design-lab/shades-concept/research/notion/SUMMARY.md
+ * (Notion SHADES pages, re-read 2026-10-09, all tagged [confirm]),
@@ meta
-    description: 'RSVP reading glasses in development at DIGITAL, Cal Poly Pomona: one word at a time, at one fixed point, at your pace.',
+    description: 'RSVP reading glasses, a concept in planning at DIGITAL, Cal Poly Pomona: one word at a time, at one fixed point, at your pace.',
@@ lightPath.stages  (reorder only, ids unchanged)
-      { id: 'timing', … },
-      { id: 'control', … },
+      { id: 'control', … },
+      { id: 'timing', … },
@@ tracks.items
-      { id: 'research', name: 'Medical research', line: 'Study how readers with dyslexia respond to RSVP, with no outcome promised in advance.' },
+      { id: 'research', name: 'Medical research', line: 'Study how readers with dyslexia respond to RSVP: comprehension, reading speed, retention and comfort. No outcome promised in advance.' },
@@ scope.in
       'Prepared text over one wired link',
+      'Words or short phrases in one fixed spot',
       'A limited English character set',
-      'Pause, resume, speed and rewind',
-      'One eye, fixed focus',
-      'An external controller for compute and power',
+      'Pause, resume, speed and rewind, from a dial and buttons',
+      'One eye, fixed focus, see-through',
+      'A pocket-sized controller for compute and power, on one cable',
@@ roadmap
-    lead: 'From basic FPGA operation to a wearable prototype.',
+    lead: 'The FPGA team’s plan, from basic FPGA operation to a wearable prototype.',
@@ join.roles
-      { id: 'fpga', name: 'Engineering', line: 'FPGA timing and video output.' },
-      { id: 'firmware', name: 'Firmware', line: 'Embedded C for control.' },
-      { id: 'optics', name: 'Optics', line: 'Lenses and a frame that fits.' },
-      { id: 'design', name: 'Design', line: 'How a reader sets the pace.' },
+      { id: 'fpga', name: 'SoC and FPGA', line: 'Word timing, text rendering and video output.' },
+      { id: 'pcb', name: 'Hardware', line: 'Circuit boards for the controller and the display.' },
+      { id: 'mech', name: 'Mechanical', line: 'The frame, the optics mounts and the controller case.' },
+      { id: 'product', name: 'Product development', line: 'Requirements, scope and how a reader sets the pace.' },
       { id: 'research', name: 'Research', line: 'The medical-research track.' },
```

Not proposed:
- `join.mentor` and `formerly`: Notion is silent. The Head Designer confirms.
- Temple bulk (#22): an art decision, not a string.
- `hero.lead`: true for the FPGA plan; the phrase case is covered in the scope list.

### 5. Verification log
- **Re-fetched by the orchestrator, all matched:** Root, Scope, Background, ProdDef, ConOps, FPGA-TL, SoC, Puck, Focal, Balance, USB-C, FPGA-core.
- **Not re-checked:** Explore, most PCB-DB rows, Transcript, Project Breakdown V1/V4/V5.
- **Data flags:** Mech-E rows and the SoC planning DB use a restaurant/trip template schema. FPGA-core has pasted-in ambient-light and haptic text. "Mechanical Enclosure | SHADES" sits under the SIDEKICK path.

### 6. Head Designer decisions (2026-10-09)
- Adopt: stage wording, words or short phrases, seats → Notion subteams, light-path order (Control before Word timing).
- Adopt new facts: controller + one cable, see-through, research questions, FPGA-team roadmap lead.
- Temples: keep DECISIONS #7 for now; the Notion weight/balance conflict is logged and revisited when Mech-E settles the frame.
- Focal slider: not adopted; MVP scope says fixed focus.
- Orchestrator spot-check: Scope ("words or phrases"), Focal ("Less than 40-50 grams"), Background ("preserving a view of the surrounding environment") re-fetched, all verbatim.
