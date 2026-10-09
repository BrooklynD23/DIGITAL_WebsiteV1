# SHADES Notion Subtree: Mech-E and Timelines (read-only pull)

Read: 2026-10-09. Tools: notion-fetch, notion-query-data-sources (read-only). Nothing written to Notion.

Caveats up front:
1. Several Notion databases hold rows whose schema does not match their title (see Section 2, 5, 6). Quotes are verbatim; mismatches are flagged, not corrected.
2. Database and row-query results do not return `page_last_edited_at`. Those entries show `n/a` and must be re-fetched to date them.
3. No page or row states which phase is current. Status values are reported as found.
4. "Mechanical Enclosure | SHADES" lives under the SIDEKICK path in Notion. Included because it was listed, but it is smartphone-project content.

---

## 1. Mech-E (root page)

- URL: https://app.notion.com/p/6a5169473d778301abb801b31b609968
- page_last_edited_at: 2026-09-22T21:39:55.314Z
- Path: SHADES > Current Initiatives & Projects

### WBS / task pipeline (verbatim table)
- "Task 1 | Problem Definition & Requirements: Define hard dimensional targets and limitations."
- "Task 2 | Mechanism Case Study: Reverse-engineer real-world consumer mechanisms (e.g., Sidekick hinge)."
- "Task 3 | Material & Process Analysis: Evaluate materials and manufacturing methods."
- "Task 4 | Decision Matrix: Use a weighted trade matrix to finalize the mechanism concept."
- "Task 5 | CAD & GD&T: Draft 3D models with strict tolerance stack-ups and internal cable routing."
- "Task 6 | FEA Simulation: Run structural and thermal Finite Element Analysis to validate physics."
- "Task 7 | Prototyping & CAM: Program CAM toolpaths and fabricate high-fidelity physical mockups."
- "Task 8 | Testing & TDP Hand-off: Run cycle tests and deliver 2D drawings with a Bill of Materials."

### Child pages / linked
- Inline DB "Mechanical Engineering" (rows: Section 5).
- Child page "Activities" (https://app.notion.com/p/857169473d7782d0b50e8123ee8af480): not fetched (out of scope list).

---

## 2. Focal Plane Adjustment (Mech-E row)

- URL: https://app.notion.com/p/c88169473d7782d5b54b81d570aa04cf
- page_last_edited_at: 2026-09-28T21:20:30.215Z
- Data-quality flag: the row's property block is a restaurant record ("Restaurant": "Focal Plane Adjustment", "Type": "Pizza", address 27 Prince St NYC, "Best For": "Casual Dinner"). Body content below is mechanical.

### Frame / form factor / weight
- "Design a linear carriage providing ±4mm of focal displacement while holding ±0.5° of perpendicular alignment."
- "Weight of system: Less than 40-50 grams (Avg. Glasses range 15-35 grams)"
- "Meta Glasses ( Weighs 48-55 grams)"
- "Ideally less tension on temples: causes discomfort"
- "Range of Motion ( Due to prescription levels)"

### Focal plane / optics mechanics
- "The slider acts as a precision data-handling and structural adjustment mechanism that adjusts the focal distance of the display from your, maintaining a rigid 45-degree angle to deliver clear, distortion-free Rapid Serial Visual Presentation (RSVP) text."
- "Human depth perception varies from person to person meaning a statically locked display engine will leave text looking like a blurry, illegible smudge for a large portion of users."
- Approaches listed: "Design extendable arms and extendable nose bridge to move it closer and further away from your face", "Move the birdbath projector closer and further from the lens", "Bifocal lens(similar to reading glasses)"
- "Assuming vision for consumers are 20/20"
- "Magnified Reading Glass lens for various depths"

### Limitations (verbatim subset)
- "Levels of Prescription ( Higher Prescriptions, Larger Lens')"
- "Battery Life"
- "Durability / How Fragile the design would be"

### Child page: Rough Draft Case Study
- URL: https://app.notion.com/p/3e9169473d77809d90a5db36370ff2ea
- page_last_edited_at: 2026-09-28T21:05:59.795Z
- "With oculus it appears that there is a 8-10 mm range of lens distance to the eyes, they move with each other. Proceed with the glasses without the need or consideration for a prescription."
- "[Text Projection in Smart Glasses] The displayed image/text would need to be sandwiched or attached to the lower corner of a bifocal lens. Allowing for reading text off the lens and looking at the real world."

---

## 3. Mechanical Enclosure | SHADES (Project Definition)

- URL: https://app.notion.com/p/3e0169473d7780859d6ccd0972dc5289
- page_last_edited_at: 2026-09-19T00:42:06.916Z
- Path flag: under "Mechanical Enclosure | SIDEKICK" > "SIDEKICK (The Smartphone Project)". Content is a haptic-feedback daughterboard spec for a phone. Included per request; treat as SIDEKICK, not SHADES glasses.

### Enclosure / form factor (verbatim)
- "Define enclosure, the joining method, coming up with an approach for design. Parts need to be interchangable/accessible, easily repairable, avoid being complicated, dissipate heat, protect internal components, the internal components don't jostle around, gripablity of device, portable"
- "Modern Day Flip-phones" and "Old Phone Architectures" listed as approach references.

### Haptic daughterboard (SIDEKICK)
- "Produce physical vibration when commanded by the main device."
- "Provide at least two distinguishable feedback patterns, such as:" followed by "A short pulse for input confirmation." and "A repeated or longer pattern for an error."
- "Fit within the space allocated inside the device."
- "The largest unanswered requirement is the actuator type. Choosing between an ERM, LRA, and piezoelectric actuator will determine the driver circuit, power requirements, PCB design, controllability, and achievable feedback patterns."
- "Weight" / "temples" / "tether" / "cable" for SHADES: not stated on this page.

Child pages (not fetched): "Eccentric Rotating Mass motor (ERM) (1)", "Linear Resonant Actuator (LRA) (1)", "piezoelectric actuator (1)".

---

## 4. Mech-E rows (Mechanical Engineering data source)

Data source: collection://3b016947-3d77-8219-bfc2-87a0d0fb673e. Schema is a restaurant/itinerary template; row titles are SHADES mechanical items. Rows 1-6 of 6 returned (has_more: false). Each row is fetched below.

### 4a. Optomechanical IPD Slider
- URL: https://app.notion.com/p/630169473d77830a9df48128b4d40da9
- page_last_edited_at: 2026-08-31T20:42:21.815Z
- Frame / weight:
  - "Enforcing a strict weight limit under 5 grams to prevent the front-heavy display module from weighing down the frames and causing them to slip uncomfortably down the user's nose."
  - "The total weight of the sliding track assembly must remain under 5 grams to ensure proper facial ergonomic balance and prevent nasal slippage."
- Optics / mechanics:
  - "Maintaining a rigid 45-degree semi-reflective mirror angle, preventing even a \$0.5\^\\circ\$ angular misalignment from ghosting or knocking text out of view."
  - "The IPD slider will be integrated as a hardware adjustment track inside the smartglasses brow, positioned directly above the user's eyes."
  - "The sliding track must provide smooth horizontal travel matching an adult IPD range of 55 mm to 75 mm."
  - "The assembly must incorporate internal clearance channels to prevent flexible display ribbon cables from exceeding their safe bend radius during travel."
- Limitations:
  - "Manufacturing constraints on standard rapid prototyping equipment made achieving sub-millimeter alignment tolerances a significant hurdle."
  - "Balancing the strict <5g weight restriction while maintaining structural rigidity required extensive trade-off evaluations between material selections."

### 4b. Mass Balancing & Strain Relief
- URL: https://app.notion.com/p/944169473d778211815d812aa7b33d17
- page_last_edited_at: 2026-08-23T19:07:08.393Z
- "Balance a 140mm to 148mm frame to a 30/70 nose-to-ear weight split, including a 10mm to 15mm tether strain channel."

### 4c. Compute Puck Enclosure
- URL: https://app.notion.com/p/ab3169473d778245bac8816b34bf65a3
- page_last_edited_at: 2026-09-28T19:30:12.731Z
- Form factor / size:
  - "The enclosure will measure approximately **7 × 14 × 1 cm** and incorporate secure battery-retention cages, motherboard mounting features, physical control dials or buttons, and a protected cable connection to the glasses."
  - "The target external dimensions are approximately **70 × 140 × 10 mm**."
  - "The **10 mm thickness constraint** may be difficult to meet once battery thickness, motherboard height, controls, wall thickness, and internal clearances are included."
- Purpose: "The smartglasses require an external module to safely contain their battery, control electronics, and physical user interface."
- Portability: "The enclosure must be small enough to fit in a typical pocket or be carried comfortably near the hip."
- Controls: "Buttons and dials must be distinguishable by touch."
- Cable / tether / strain:
  - "The connection cable must not be pinched between enclosure parts."
  - "The enclosure must include strain relief at the cable exit."
  - "A strain-relief feature will transfer cable loads into the enclosure rather than the solder joints, motherboard, or glasses frame."
  - "The final cable length and connector orientation will affect pocket placement, hip mounting, and strain-relief design."
- Thermal / water: "Water resistance may be limited by exposed buttons, dials, charging ports, seams, and cable exits."
- Design inspiration (titles only): "80's Walkman Housing Shell", "iPod Circle Click Wheel", "Metal Belt Clip".
- Page ends mid-sentence in Success Criteria: "The enclosure fits w"

### 4d. Ergonomic Hinge & Nose-Bridge
- URL: https://app.notion.com/p/5df169473d7782499702817b8dc8aa07
- page_last_edited_at: 2026-08-23T19:08:11.510Z
- "Develop a flexible, multi-material bridge fitting 18mm to 22mm widths with spring-assisted temple hinges."

### 4e. Manufacturing Jigs & Test Rigs
- URL: https://app.notion.com/p/0ad169473d7783fe8b69819c795cb171
- page_last_edited_at: 2026-09-01T01:12:12.325Z
- "Create benchtop calibration fixtures to achieve sub-millimeter optical alignment and build automated 500-cycle wear testers."

---

## 5. Inline database: "View of Mechanical Engineering" (3e3169473d7780569705ceb9efcb4549 and 3e3169473d7780379a1dfcfdbe4178eb)

- Both are views of collection://3b016947-3d77-8219-bfc2-87a0d0fb673e (Section 4).
- page_last_edited_at: n/a (database fetch does not return it).
- Restaurant-template schema (Type options: Pizza, Brunch, Steakhouse, Italian...). Used as the Mech-E row store.

---

## 6. SHADES Project Timeline Database

- URL: https://app.notion.com/p/3c0169473d7780058617ed76e154fa03
- page_last_edited_at: 2026-09-22T21:43:21.418Z
- Child objects: FPGA Project Timeline (page), Product Development Team DB, and three untitled inline DBs (3e3169473d77803d9c99e404b4422a34 = View of Hardware Design (PCB) DB, 3e3169473d778003a922f7a3255de116 = View of SoC Project Planning Tasks, 3e3169473d7780379a1dfcfdbe4178eb = View of Mechanical Engineering).

### 6a. Product Development Team — Project Database
- URL: https://app.notion.com/p/3e3169473d77807b99ecc5c92145160f
- page_last_edited_at: n/a
- Schema: Name, Status (Not started / In progress / Done), Phase (no options), Due Date (no values returned).
- Rows (9 of 9, has_more false), name and status only:
  - "Product Definition" - Not started
  - "Concept of Operations" - Not started
  - "Operational Concept" - Not started
  - "Product Development" - Not started
  - "Background, & Project Solution - Product Development | SHADES" - Not started
  - "System on Chip Logic Design" - Not started
  - "Project Breakdown" - Not started
  - "Documentation" - Not started
  - "Part Serialization Standardization" - In progress (only row marked In progress)
- No Due Dates returned on any row.

---

## 7. FPGA Project Timeline

- URL: https://app.notion.com/p/3b3169473d7780239e59e2e84242a7de
- page_last_edited_at: 2026-09-22T21:06:03.556Z
- Title in page: "Artix-7 RSVP Display System — Team Project Breakdown"

### Goal (verbatim)
- "Build an Artix-7 FPGA system that receives text from a laptop, separates it into words, and displays one word at a time on a monitor or wearable display at an adjustable reading speed."

### Projects (17, numbered as in page)
- Project 1: FPGA Board Bring-Up. Dependencies: "None. This project should be completed first."
- Project 2: Clock Generation (subpage)
- Project 3: Video Timing Generator. Dependencies: "Projects 1 and 2"
- Project 4: Basic Pixel and Display Test. Dependencies: "Project 3"
- Project 5: Font ROM Development. Dependencies: "None for development, but Project 4 is needed for hardware display testing."
- Project 6: Text Renderer. Dependencies: "Projects 3, 4, and 5"
- Project 7: UART Receiver. Dependencies: "Project 1"
- Project 8: Text Parser. Dependencies: "Project 7"
- Project 9: Word Buffer and Queue. Dependencies: "Project 8"
- Project 10: RSVP Timing Controller. Dependencies: "Project 9". Objective: "Control when the displayed word changes."
- Project 11: User Control Interface. Dependencies: "Projects 1 and 10"
- Project 12: Clock-Domain Crossing. Dependencies: "Projects 2, 6, 9, and 10"
- Project 13: Top-Level System Integration. Dependencies: "All major module projects"
- Project 14: Verification and Testbench Development. Dependencies: "Runs in parallel with every development project."
- Project 15: Hardware Debug and Integrated Logic Analyzer. Dependencies: "Projects 7 through 13"
- Project 16: Display Interface Research and Wearable Integration. Dependencies: "The basic system should first work on a standard monitor."
- Project 17: Documentation and Version Control

### Phases (names and numbering, verbatim headings)
- "Phase 1: Basic FPGA Operation" - expected: "The board can be programmed, clocks are stable, and the development environment is working."
- "Phase 2: Video Output" - expected: "The monitor displays stable colors and shapes."
- "Phase 3: Text Display" - expected: "A centered word such as `HELLO` appears on the monitor."
- "Phase 4: Text Input" - expected: "A word typed on the laptop appears on the monitor."
- "Phase 5: RSVP Operation" - expected: "A sentence appears one word at a time at an adjustable speed."
- "Phase 6: Full Integration" - expected: "The complete monitor-based prototype works reliably."
- "Phase 7: Wearable Prototype" - expected: "The text system operates on the intended wearable display."

### Leadership checkpoints (verbatim headings)
- "Checkpoint 1": Board identified, XDC file verified, FPGA programmed, Git repository created
- "Checkpoint 2": Pixel clock generated, Video synchronization works, Monitor displays test pattern
- "Checkpoint 3": Font ROM works, Renderer displays a centered hard-coded word
- "Checkpoint 4": UART receives characters, Parser produces complete words, Buffer preserves word order
- "Checkpoint 5": RSVP controller changes words at the correct speed, Pause and speed controls work
- "Checkpoint 6": Full system passes simulation, Hardware system works, Timing requirements are met, No critical clock-domain crossing issues remain
- "Checkpoint 7": Wearable display interface is understood, Electrical requirements are safe, Final display is readable and stable

### Wearable / display / UART specifics
- Project 16 objective: "Determine how the final wearable display connects to the FPGA system."
- Project 7 UART default: "115200 baud, 8 data bits, no parity, and 1 stop bit unless the team selects otherwise."
- Project 3 default: "Select the first display standard, preferably 640×480 VGA."

### Status / current phase
- No status field on this page. No phase is marked current.

---

## 8. SoC Project Timeline

- URL: https://app.notion.com/p/31f169473d7782a09e28814b27948c25
- page_last_edited_at: 2026-09-22T21:39:55.314Z
- Page body is only an inline DB reference: "SoC Project Planning Tasks" (https://app.notion.com/p/944169473d77834f855c01dd54f5a920).
- Data-quality flag: that DB's data source (collection://38916947-3d77-8260-be42-87b6da36269d) has a trip-itinerary schema (Type options: Dinner, Walk, Landmark, Accommodation, Transport, Coffee, Observatory, Lunch, Photo Spot, Shopping, Flight; Priority High/Medium/Low). Only the Modules values are SoC-relevant.
- page_last_edited_at of DB: n/a.

### SoC module names found in the Modules column (verbatim)
- "I2C"
- "Communication Interface"
- "Input Buffer & Parser"
- "**Text Rendering Engine**"
- "Frame Buffer & BRAM"
- "UI / Overlay Engine"
- "Display Timing Generator"
- "Microdisplay Interface"
- "Clock & Reset Management"
- "Top-Level Control / Integration"
- "Verification & FPGA Bring-Up"
- "**Today's Plan**" (not a module; a planning row)

Status values: all rows Status "__NO__" (unchecked). No phase numbering in this DB.

---

## 9. Hardware Design (PCB) Database (view: 3e3169473d77808589b8e825f5b4a0ae; view: 3e3169473d77803d9c99e404b4422a34)

- Data source: collection://3cf16947-3d77-800b-a1e8-000bc03a9bad
- page_last_edited_at: n/a
- Schema: Name, Task ID, Parent Task (~40 module options), Board / Workstream, Category, Phase Number, Phase Checklist, Status (only option: "Not Started"), Date (none set).
- Rows returned: 20 (cap reached; has_more: true, so more exist beyond the cap).

### Top-level projects seen
- "Complete SHADES Electrical System Integration" - Task ID SHD-PCB-40, Phase 0, Category MVP Integration. Project Explanation: "Proves that the processing board, carrier, display board, control board, battery, firmware, and FPGA-team test image function together as one electrically validated wearable platform."
- "Motherboard Bring-Up and Rework" - subtasks SHD-PCB-39.04 to 39.10 (seen), Category MVP Integration.
- "USB-C Power and Data Module" - subtask SHD-PCB-14.01 "MIPI (Mobile Industry Processor Interface) Case Study", Phase 1, Board "Carrier / Communications".

### Phase structure, Complete SHADES Electrical System Integration (SHD-PCB-40.01 to 40.10)
1. Project Definition (40.01)
2. Component Research and Selection (40.02)
3. Schematic Design (40.03)
4. PCB Editor (40.04)
5. 3D Mechanical Model (40.05): "Check enclosure, optics, cable, and mounting clearances"
6. Design Validation (40.06)
7. Firmware (40.07)
8. Project Presentation (40.08)
9. Rework (40.09)
10. LinkedIn Project Spotlight (40.10)

Motherboard Bring-Up and Rework uses the same 10-phase template (39.01-39.10); only 39.04 to 39.10 returned in this cap.

Status: every seen row "Not Started". No dates set.

### Phase 1 checklist (verbatim, repeated in 40.01 and 14.01)
- "Problem definition" / "Applications" / "Functional requirements" / "Electrical and mechanical requirements" / "Limitations" / "Inputs and outputs" / "Communication protocol selection"

### Mechanical-relevant text (40.05)
- "Add or create component 3D models", "Generate the complete PCB assembly model", "Check component heights", "Check connector accessibility", "Check enclosure, optics, cable, and mounting clearances"

---

## 10. Source-status summary

| Source | Read | Cap | Notes |
|---|---|---|---|
| Mech-E root (6a5169...) | yes | n/a | WBS 8 tasks |
| Focal Plane Adjustment (c88169...) + child | yes | n/a | data mismatch flagged |
| Mechanical Enclosure (3e0169...) | yes | n/a | SIDEKICK path |
| SHADES Timeline DB (3c0169...) | yes | n/a | |
| FPGA Timeline (3b3169...) | yes | n/a | 17 projects, 7 phases |
| SoC Timeline (31f169...) | yes | n/a | DB is itinerary-schema |
| Inline DB PCB (3e3169...8589) | yes, 20 rows | 20 | has_more |
| Inline DB SoC (3e3169...d1fc) | yes, 12 rows | 20 | itinerary schema |
| Inline DB Mech-E (3e3169...9705) | yes, 6 rows | 20 | restaurant schema |
| Product Dev DB (3e3169...7b99) | yes, 9 rows | 20 | |
| Mech-E rows, 5 more pages | yes | 20 | |
| Child pages (ERM/LRA/piezo, Activities, Rough Draft) | partial | | ERM/LRA/piezo and Activities not fetched |

Current phase: not stated in any source.
