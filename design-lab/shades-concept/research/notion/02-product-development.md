# SHADES Notion: product-development subtree (verbatim)

Read-only. Quotes are verbatim from notion-fetch / notion-search results. Personal data omitted (none appeared in the pages read).

## Coverage

1. Pages fetched in full: 4 named + 6 rows = 10 pages (plus 2 DBs, 2 collections).
2. Skipped per brief: Product Definition, Engineering Scope, Exploration of SHADES Viability, Background & Project Solution.
3. Truncation: none reported (`truncated` / `unknown_block_count` not flagged in any result).
4. Row listing: notion-fetch on a collection returns schema only, not rows. Rows were found via notion-search with `data_source_url` (it returned workspace-wide hits, so row set may be incomplete).

---

## 1. Product Development

- URL: https://app.notion.com/p/3ab169473d7780a9a741c5da07426cac
- Last edited: 2026-09-22T21:42:30.699Z
- Status property: "Not started"
- Child pages listed: Product Definition; Customer Discovery - Engineering Track| SHADES; Exploration of SHADES Viability; FPGA Decision Matrix - Product Development | SHADES

No body content beyond the child-page index.

---

## 2. FPGA Decision Matrix - Product Development | SHADES

- URL: https://app.notion.com/p/3ac169473d77801dae50d675dd2decd8
- Last edited: 2026-07-30T00:17:09.134Z

### Candidate table (scoring columns empty)
- Columns: "Matching DEVBOARD", "Size", "Power", "Feasibility", "Education", "Cost"
- Rows: AMD Xilinx Spartan-7 (XC7S15 or XC7S25); Lattice iCE40 UltraPlus (iCE40UP5K); Intel/Altera Cyclone 10 LP (10CL006 or 10CL016); Gowin LittleBee GW1NR (GW1NR-9); AMD Artix-7 (XC7A35T or XC7A100T); AMD Zynq-7000 SoC (XC7Z010 or XC7Z020); AMD Artix UltraScale+ (AU10P or AU15P)
- Note: every score cell is blank. No decision recorded in this page.

### Spartan-7 framing
- "While the Spartan-7 is a fantastic \"safe bet,\" sticking to just one chip vendor or family can create supply chain risks or lock you out of features that might make your build easier."
- Spartan-7 row in comparison table: "Spartan-7 (*Previous Pick*)" | BRAM "$0.8 Mb - 2.7 Mb" | Board "Digilent Cmod S7" | Advantage "Extremely small DIP module form factor; low cost"

### Candidate facts quoted
- iCE40UP5K: "It packs **128 KB of Block RAM (EBR)** plus **1 MB of Single-Port RAM (SPRAM)**"; "~75 µW static power"; Dev kit "iCEbreaker FPGA Board" or "Lattice iCE40UP5K-MDP-EVN"; Toolchain "Yosys + nextpnr"
- Cyclone 10 LP (10CL016): "504 Kilobits (M9K memory blocks)"; I/O "1.2V, 1.5V, 1.8V, 2.5V, and 3.3V"; Dev kit "Terasic DE10-Lite"; "Quartus Prime is notoriously beginner-friendly"
- Gowin GW1NR-9: "468 Kb of Block RAM" and "many variants include **64 Mb (8 MB) of embedded Pseudo-SRAM (PSRAM)**"; Dev kit "Sipeed Tang Nano 9K (costs roughly $15 to $20)"
- Artix-7: "Digilent Basys 3 (XC7A35T) and Arty A7 (XC7A35T / XC7A100T)"; BRAM "1.8 Mb (A35T) to 4.8 Mb (A100T)"
- Zynq-7000: "dual-core ARM Cortex-A9 processor"; boards "Digilent Cora Z7, Zybo Z7, or PYNQ-Z2"; BRAM "2.1 Mb - 4.4 Mb"
- Artix UltraScale+: "16nm FinFET"; "up to 2.4x better fabric performance per watt compared to Artix-7"; "Native MIPI D-PHY performance up to 2500 Mbps per lane"; board "AMD Kria K26 SOM / Custom"

### Power and ideal boards (comparison table)
- Spartan-7 (XC7S25): Power "Low Power (~0.1W-0.3W)"; Ideal board "Digilent Cmod S7"; Best used for "Maximum Vivado industry-standard alignment"
- iCE40UP5K: Power "Ultra-Low Power (< 0.01W)"; Ideal board "iCEbreaker / Lattice EVN"; Best used for "Extreme battery life & open-source tools"
- Cyclone 10LP (10CL016): Power "Low Power (~0.15W-0.35W)"; Ideal board "Terasic DE10-Lite / Custom"; Best used for "Labs already trained on Altera/Quartus"
- GW1NR-9: Power "Low Power (~0.1W-0.2W)"; Ideal board "Sipeed Tang Nano 9K"; Best used for "Tightest project budgets (~$15 dev boards)"

### Procurement and recommendation
- "Having these four options documented in your **System Requirements Specification (SyRS)** gives your team a solid procurement fallback: if Digilent or Xilinx chips go out of stock, you can instantly pivot to the **Tang Nano 9K (Gowin)** or **iCEbreaker (Lattice)** without changing your core display engine logic architecture."
- "If you are committing to **AMD Vivado**, staying within the AMD Xilinx ecosystem gives you access to a massive library of pre-verified IP blocks, free toolchain tiers (Vivado ML Standard Edition), and widespread university support."
- "For **Phase 1 (Benchtop Prototyping)**, start with an **Artix-7 (Arty A7 or Basys 3)** or a **Zynq-7000 (Cora Z7)** because they are widely documented, cheap, and immediately compatible with free Vivado licenses. Once your Verilog Display Engine logic is verified on the bench, you can target the smaller **Spartan-7 (Cmod S7)** for the final enclosure build."
- Zynq rationale: "Lets you write SD card/file logic in C on ARM, saving FPGA space"

---

## 3. Customer Discovery - Engineering Track| SHADES (row, blank)

- URL: https://app.notion.com/p/3ab169473d7780bb94c4def9f430f2c0
- Last edited: 2026-07-28T15:33:05.614Z
- Body: blank page, no content.

---

## 4. SHADES Part Tracker (database) and its row

- DB URL: https://app.notion.com/p/3e9169473d7780de9291fce804895432
- Parent: "Part Serialization Standardization" (https://app.notion.com/p/3e9169473d778082b49cc55fed3ce54f)
- Schema: single property "Name" (title). No status, part number, or owner fields.
- View: table, displays "Name" only.
- Row read: "SHADES-" (https://app.notion.com/p/3e9169473d778062924ae5f3ed6bcd3e), last edited 2026-09-28T20:46:54.704Z, blank page.

### Part Serialization Standardization (parent page)
- URL: https://app.notion.com/p/3e9169473d778082b49cc55fed3ce54f
- Last edited: 2026-09-28T20:46:43.812Z
- Status: "In progress"
- Purpose quoted: "When working on a project with a large family of parts with many revisions; naming schemes can get messy(ie. \"REVISION\", \"REVISION FINAL\" \"FINAL FINAL V2\"), creating an unorganized project. Standardizing naming schemes create a clean revision history, as well as tracking assembly trees very easy to navigate."

---

## 5. Product Development Team — Project Database (database)

- DB URL: https://app.notion.com/p/3e3169473d77807b99ecc5c92145160f
- Collection: collection://3e316947-3d77-8074-8d5b-000b8c8f7d8c
- Properties: Name (title); Status (Not started / In progress / Done); Due Date (date); Phase (select, no options defined)
- View: table showing Name, Status, Phase, Due Date
- Row count: not returned by fetch. Rows read below come from search hits.

### Row: System on Chip Logic Design (Status "Not started", last edited 2026-09-22T21:33:39.075Z)
- URL: https://app.notion.com/p/3aa169473d7780aea39cc2f504a68295
- Quotes:
  - "The work can be assigned as six closely coordinated subprojects:" then "1. STM32-to-FPGA communication interface 2. Text buffering and presentation-unit management 3. RSVP timing, WPM control, and playback state machine 4. Font memory and text renderer 5. Microdisplay timing and output controller 6. System simulation, verification, and FPGA integration"
  - Module list: "Input Interface: Receives text and commands from the STM32."
  - Speed control: "The STM32 can debounce and interpret the rotary encoder, then send the resulting WPM value to the FPGA."
  - Scope limit: "The FPGA should not perform natural-language processing."
  - Example rate: "A possible MVP range might be 100–600 WPM in 25-WPM steps, but the final values should come from the project requirements."
  - Stretch: "Literal scrolling should remain a stretch goal because it requires different rendering behavior."
  - Milestones (Modules 1-3 pass gates): "The 'Right Track' Pass Condition: Jitter must be < 100 µs."; "Zero dropped frames and a transmission latency under 2 ms per word block."; "Total latency must consistently land under 15 ms."

### Row: Part Serialization Standardization (In progress, last edited 2026-09-28T20:46:43.812Z)
- URL: https://app.notion.com/p/3e9169473d778082b49cc55fed3ce54f
- See section 4.

### Row: Project Breakdown V1 (last edited 2026-07-09T00:43:03.528Z)
- URL: https://app.notion.com/p/398169473d7780acb47be4f62b53c566
- Quotes:
  - "If we break the SHADES architecture down into highly isolated, bite-sized mini-projects, the Work Breakdown Structure (WBS) becomes much more manageable for students."
  - Mini-Project A: "The Hardware Quadrature Rotary Encoder Debouncer (Logic Design)" ("must fit within a tiny footprint of the FPGA (< 100 Look-Up Tables/LUTs)")
  - Mini-Project B: "The I2C LiPo Fuel Gauge Circuit (PCB Design)" ("Maximum standby current consumption must be under 50 µA")
  - Mini-Project C: "The SPI Slave Byte-Reassembly Block (Firmware/Logic)" ("must operate reliably at a serial clock speed (SCLK) of 25 MHz")
  - Milestone gates: "Week 2: Approved Problem Definition, Requirements, and Trade Matrix document." "Week 5: Signed-off Schematic Draft or Verilog Structural Block Diagram." "Week 8: Code/Routing Checklist." "Week 12: Verification Report containing raw oscilloscope/testbench data proving the requirements from Week 2 were met."

### Row: Project Breakdown V4 (last edited 2026-07-09T00:46:11.185Z)
- URL: https://app.notion.com/p/398169473d7780ad891acd64122fa037
- Quotes:
  - "To fix this, we need to ensure that each mini-project is strictly bound to **one single engineering discipline** (Electrical, Mechanical, or Digital Logic/Software)."
  - Phase 1 (Power & Battery Management, Electrical/Firmware): "Mini-Project: The I2C Battery Fuel Gauge IC Integration", "I2C Fuel Gauge IC (e.g., MAX17043)", "chip must operate natively within a 3.0V - 4.5V range and draw less than 50µA in sleep mode"
  - Phase 2 (Character Generation & Storage, Digital Logic/FPGA): "Mini-Project: The Internal BRAM Font ROM Block"; "output a 16 × 16 monochrome pixel bitmap matrix for any requested standard ASCII character within 2 clock cycles"; "must fit within the limited internal BRAM structures of a budget FPGA (like the Spartan-7) without using external DDR memory."
  - Phase 3 (Visual Ergonomics, Mechanical): "Mini-Project: The Mechanical Inter-Pupillary Distance (IPD) Slider Rail"; "Provide at least 15mm of travel distance"; "The entire sliding track assembly cannot exceed a total weight of 5 grams"
  - Team roles: "The **Electrical team** focuses purely on circuits, trace routing, and standard C drivers." "The **Computer/FPGA team** stays entirely inside a digital logic simulator..." "The **Mechanical team** works strictly with CAD, structural tolerances, and physical 3D prints."

### Row: Project Breakdown V5 (last edited 2026-07-09T01:00:38.264Z)
- URL: https://app.notion.com/p/398169473d77807588a0e2d6119f9c87
- Quotes:
  - Macro architecture (diagram): "POCKET PUCK (MOTHERBOARD)" with "EMBEDDED CPU / CORES" and "FPGA FABRIC"; "AXI Bus"; "USB-C TETHER CABLE (High-Speed Data & Power)"; "GLASSES FRAME (HEADSET)" with "DAUGHTERBOARD" and "DISPLAY IC"; "MIPI D-PHY Protocol"; "MICRO-LED DISPLAY"; "FOCAL SLIDER".
  - Phase 1: "Mini-Project: The Mechanical Focal Slider & Mirror Mount"; "must provide ±4 mm of continuous linear displacement while maintaining strict perpendicular alignment with the reflection mirror within ±0.5°"
  - Phase 2: "Mini-Project: The MIPI Protocol Physical Layer Routing"; "Maintain a continuous differential trace impedance of 100 Ω ± 10% across the motherboard, tether breakout, and daughterboard pathways."; "Must minimize total trace length differential between MIPI clock and data lanes to less than 0.5 mm"
  - Phase 3: "Mini-Project: The AXI-to-Display-Engine Interrupt Controller"; "implement an AXI4-Lite slave interface ... within 5 clock cycles"; "(100 MHz target clock speed)"
  - Team leads: "Mechanical Discipline Lead" (Phase 1), "Electrical Discipline Lead" (Phase 2), "Computer / Logic Discipline Lead" (Phase 3)

### Row: Concept of Operations (blank, last edited 2026-09-28T19:28:44.177Z)
- URL: https://app.notion.com/p/3e9169473d77806baa90f66d3f80fb39
- Status "Not started". Body blank.

### Row: Operational Concept (blank, last edited 2026-09-28T19:28:36.208Z)
- URL: https://app.notion.com/p/3e9169473d7780619fdbf40d7313dc42
- Status "Not started". Body blank.

---

## Conflicts and gaps

1. Project Breakdown V1 and V4 use an FPGA-only SoC framing; V5 describes a Zynq-style "EMBEDDED CPU / CORES" + FPGA fabric over AXI. The FPGA Decision Matrix does not state which architecture was chosen.
2. FPGA Decision Matrix recommends Artix-7 or Zynq-7000 for Phase 1 and Spartan-7 Cmod S7 for the final enclosure, yet the same page calls Spartan-7 the "Previous Pick." Chip choice is unresolved in the page text.
3. Product Development status is "Not started" while child "Part Serialization Standardization" is "In progress" (2026-09-28).
4. Product Development Team Project Database rows were not enumerated by fetch. Search hits only; row set may be incomplete. Not checked: Project Breakdown index page (398169473d7780799ddad2fec32f1797), Customer Discovery sibling rows, any Done rows.
