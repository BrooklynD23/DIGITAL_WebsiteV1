# KB truth — The Smartphone Project

R2-KB · 2026-10-02. Source: `DIGITAL-KNOWLEDGEBASE/TheSmartphoneProject` (read-only; working copy on branch
`claude/openwiki-knowledge-graph-tbcphx` @ `88ce6ab`). Paths below are relative to that repo unless prefixed `lab:`.
`NOTION-AUDIT` = `NOTION-AUDIT-2026-10.md` (an untracked draft that quotes Notion. Second-hand, so lower confidence).
`git:` = `git log` / `git ls-tree` output, read-only. **KB C1–C9 ≠ site C1–C7.** The site IDs come from `lab:design-lab/research/content-inventory.md` §5.

## 1. Headline

1. Nothing has been fabricated. No board is finished. The repo has **no firmware, OS, app, enclosure, test result or photo**.
2. Compute is a **Zynq-7000 SoM** (ARM + FPGA) on a carrier board. It is **not an ESP32-S3**.
3. The tool is **KiCad 9.0**. No Altium, SolidWorks or PlatformIO file exists.
4. Main-branch design work ran **2025-07-19 → 2025-08-26**, then paused. A fingerprint board continued on a side branch until **2025-11**.
5. Three real KiCad boards exist and can be rendered: the carrier/power board, the sensor daughter board and the fingerprint board. kicad-cli is **not installed**, so this pass made no renders.

## 2. Verified facts

| # | Fact | Source | Conf. |
|---|---|---|---|
| F1 | Long-term goal is a student-built smartphone. The repo holds "early groundwork" | `wiki/index.md:19` | high |
| F2 | The repo is a KiCad 9.0 hardware project with no build system, package manager or test suite | `AGENTS.md:9-10` | high |
| F3 | Status: "paused August 2025, mid-design. Preserved for resumption" | `AGENTS.md:14`; `README.md:145-146` | high |
| F4 | First commit 2025-07-19. Last design commit `c81e8e5` on 2025-08-26. Active span about 38 days | `docs/project-history.md:8,14,24`; git: | high |
| F5 | Earliest work: 5 KiCad auto-backups on 2025-07-16, plus 1 more on 2025-07-27 | `docs/project-history.md:7,10,93-102` | high |
| F6 | Board A, **sensor daughter board** ("thermometer"): MCP9600 thermocouple amp (U1) + BMP581 pressure sensor (U2) on I²C, connected to the host through a 7-pin 1.00 mm header (J1) | `README.md:157-172`; `wiki/hardware/thermometer.md:30-37` | high |
| F7 | Board A has no outline, zero routed copper, U2 not placed and a stale netlist | `wiki/hardware/thermometer.md:68-73`; `docs/architecture.md:117-129`; .kicad_pcb has 0 segment/via/zone | high |
| F8 | Board A's schematic is **miswired mid-refactor**: U1 SCL tied to GND, SDA floating, ALERT_2/4 swapped, U2 SCL on +3.3V, chips unpowered. J1 has no power pin | `wiki/hardware/thermometer.md:54-66`; `docs/components.md:25-38,85-96` | high |
| F9 | Board A: 2 copper layers, 1.6 mm thick, 0.2 mm track and clearance, A4 single sheet | `docs/architecture.md:102-115`; `thermometer.kicad_sch:6` | high |
| F10 | Board A: custom MCP9600 QFN-20 footprint with 30 pads (EP + 9 thermal vias). This is the team's own library | `docs/library-notes.md:16-31`; `docs/components.md:47-57` | high |
| F11 | Board A: BMP581 library never committed (it lived on one laptop) | `docs/library-notes.md:35-42`; `AGENTS.md:75-78` | high |
| F12 | Board B, **Zynq-Carrier-Power**: "template Daughterboard for pinguz97's Zynq-SoM". It is a git submodule from a member's personal repo, pinned at `7aed9fc` | `Zynq-Carrier-Power/README.md:1-2`; `.gitmodules:1-4`; `wiki/hardware/zynq-carrier-power.md:20-26` | high |
| F13 | Board B contents: Zynq SoM on a DF40C-100DP mezzanine, **BQ25629** battery charger, USB-C (USB4105GFA), barrel jack, JST battery connector, 2.54 mm headers, SRV05-4 ESD, LED, 4 mounting holes. Nets include V_USB, VBAT, +5V, VREG_OUT and Vps | `wiki/hardware/zynq-carrier-power.md:32-40`; `Zynq-Carrier-Power.kicad_sch` lib_ids / power values | high |
| F14 | Board B PCB: **49.0 × 41.0 mm** with 2.5 mm corner radii, 2 copper layers, 1.6 mm thick, 36 footprints. **Partially routed** (14 segments, 8 vias, 7 zones) | `Zynq-Carrier-Power.kicad_pcb:6,25,29553+` (Edge.Cuts arcs/lines) | high (measured) |
| F15 | Zynq-7000 family. The exact part (7010 or 7020) **is not stated in any KiCad file**. Only Notion says "Zynq-7020" | `docs/architecture.md:19`; `NOTION-AUDIT:109` | med |
| F16 | Board A has **no mating connector** on Board B. The interface between them is unresolved | `docs/connector-pinout.md:12`; `NOTION-AUDIT:32` | high |
| F17 | Board C, **fingerprint sensor**: KiCad project for an **FPC2532AP** sensor. 2 layers, **22.8 × 26.1 mm**, routed (77 segments, 12 vias, 2 zones), 1×07 + 1×06 2.54 mm headers, 2 test points | git: `origin/TheFingerprintSensor` `cc17e00` (zip); `lab:…/assets/kb/source/fingerprint/Fingerprint_Sensor.kicad_pcb:3072` | high (measured) |
| F18 | Board C files are dated 2025-09-23 → 2025-11-27. The branch was never merged to main | git: zip listing; `docs/project-history.md:20-22` | high |
| F19 | Wider program (Notion only): sensor daughter boards for RTC, heat, mic, haptic, IMU, ToF, flashlight, light, touch, camera and speakers. **None of these has a repo artifact** | `NOTION-AUDIT:97,131,169` | med |
| F20 | Notion intent: an ESP32-**C3** on each daughterboard, plus an STM32G431 power sequencer. Neither was built | `NOTION-AUDIT:72-75,46,173` | med |
| F21 | Notion: the project was renamed **SIDEKICK** and given "legacy project" status. Scope says no full OS (RTOS or text engine). The old PRD (Linux, LTE, 6.1" display) is superseded | `NOTION-AUDIT:154,171,220` | med |
| F22 | Notion: a discrete trickle charger (TL431/LM358) was being researched in 2026-03/04, in parallel with the BQ25629. The two were never reconciled | `NOTION-AUDIT:83-87` | med |
| F23 | Notion's "Phase III — Design Custom PCBs" is the last recorded phase. The audit calls it stale because the repo is paused | `NOTION-AUDIT:101-105` | med |
| F24 | Mechanical rule (Notion): ICs on the back, connectors on the front, on the merged board | `NOTION-AUDIT:170` | low-med |
| F25 | No ERC/DRC has passed. No test result exists anywhere | `wiki/hardware/thermometer.md:87`; `AGENTS.md:9-10` | high |
| F26 | Docs-as-code governance: wiki + CI gate + generated knowledge graph, added 2026-06/07 by the current maintainer | `README.md:266-281`; `docs/project-history.md:15-18` | high |
| F27 | 6 git contributors (handles below; private, §7) | `docs/project-history.md:26-35`; git: | high |

**Errors inside the KB** (the files win over the docs):
- E1: `docs/project-history.md:20-21` and `NOTION-AUDIT:45,91` say the fingerprint branch is an **R503/R502** design by AngeloDuenas. Git shows `cc17e00` was authored by ARussellChung and the zip contains an **FPC2532AP** project. That matches Notion's FPC research, so KB C7 is largely moot.
- E2: The "paused Aug 2025" span covers main only. Fingerprint work ran Sep–Nov 2025.

## 3. Site contradictions (content-inventory §5)

| Site # | Conflict | Verdict | KB answer |
|---|---|---|---|
| C1 | 25+ vs 40+ engineers | **STILL OPEN** | The KB has no head count. Only 6 people ever committed (F27). Don't publish either number without a roster |
| C2 | 120+ members vs 40+ | **STILL OPEN** | The KB is silent on club size |
| C3 | 4 core modules vs 7 subsystems | **RESOLVED: neither** | Real hardware is 3 boards: carrier/power, sensor daughter board, fingerprint (F6, F12, F17). Notion plans more modules (F19). No "Display Unit" or "Haptics Module" artifact exists |
| C4 | KiCad/PlatformIO vs Altium/SolidWorks | **RESOLVED: KiCad 9.0** | `AGENTS.md:9`, `README.md:296`. No Altium, SolidWorks, PlatformIO or C++ anywhere. "Embedded C++" is unsupported |
| C5 | Prototyping vs PCB fabrication | **RESOLVED: neither** | Last phase was PCB **design** (F23), and it is paused (F3). Nothing was fabricated or tested (F7, F25) |
| C6 | ESP32-S3 vs Android/WiFi 6 | **RESOLVED: both wrong** | Compute is a Zynq-7000 SoM (F12, F15). ESP32-S3 appears nowhere (Notion has ESP32-C3 intent only, F20). Android is out of scope (F21). The KB has no radio of any kind |
| C7 | "engineering club" vs venture studio | **STILL OPEN** | Out of KB scope. The KB says "DIGITAL club" (`wiki/index.md:15`) |

## 4. Proposed subsystem list for the site

Replaces the 7 discipline lanes in `phoneV2.ts:140-288`. Those lanes describe ways of working, not hardware. Three of them (OS, Apps/UX, Mechanical) have zero artifacts. Status words are taken from the evidence.

| # | Subsystem | What is real | Status label | phoneV2 lane it replaces |
|---|---|---|---|---|
| 1 | **Compute** | Zynq-7000 SoM (ARM + FPGA, external design by pinguz97) on a DF40C mezzanine | uses third-party SoM | Systems Architecture (partly) |
| 2 | **Power & carrier** | 49 × 41 mm carrier: USB-C + barrel in, BQ25629 1-cell charger, VBAT rail | PCB layout in progress | Hardware / PCB |
| 3 | **Sensor module** | MCP9600 thermocouple + BMP581 pressure on I²C, 7-pin 1 mm header | schematic in rework | Hardware / PCB |
| 4 | **Fingerprint module** | FPC2532AP sensor board, 22.8 × 26.1 mm, routed | layout routed, unmerged | (new) |
| 5 | **Planned modules** | RTC, IMU, ToF, light, haptics, mic, speaker, camera, touch (Notion research) | research | Firmware / Apps (none built) |
| — | **Process (optional)** | Docs-as-code wiki + CI gate. This is real and unusually strong for a student project | live | Integration / Testing |

Drop or mark "not started" for Operating System, Apps/UX, Firmware and Mechanical/CAD. Their only KB evidence is intent (F20, F21, F24).

## 5. Real asset manifest

kicad-cli status: `which kicad-cli` finds nothing. `/mnt/c/Program Files/KiCad` does not exist, and there is no AppData install. **No SVG/PNG exports were made.**
To render later: install KiCad 9 (Windows `winget install KiCad.KiCad`, or `apt install kicad`), then run against the lab copies below:
`kicad-cli pcb export svg --layers F.Cu,B.Cu,F.SilkS,Edge.Cuts …`, `kicad-cli sch export svg …`, `kicad-cli pcb render` (3D, KiCad ≥9).
The KB contains **zero** raster or vector images. Read-only copies of the sources are in `lab:design-lab/round2/assets/kb/source/` (38 files; see `MANIFEST.md` there).

| # | Asset (lab copy under `assets/kb/source/`) | Shows | Use |
|---|---|---|---|
| A1 | `zynq-carrier-power/Zynq-Carrier-Power.kicad_pcb` | Real 49×41 mm outline, SoM connector, USB-C, charger, partial routing + 7 zones | **hero** (best board; 3D render with STEP models) |
| A2 | `zynq-carrier-power/Zynq-Carrier-Power.kicad_sch` | A3 single sheet: charger, USB-C, SoM, protection | detail |
| A3 | `fingerprint/Fingerprint_Sensor.kicad_pcb` | Routed 22.8×26.1 mm module, FPC2532AP pad field | **hero/detail** (most finished layout) |
| A4 | `fingerprint/Fingerprint_Sensor.kicad_sch` | FPC2532AP sensor + headers + test points | detail |
| A5 | `thermometer/thermometer.kicad_sch` | A4 sheet, MCP9600 + BMP581 + J1 | detail. **Miswired**: caption it "in rework", never "working" |
| A6 | `thermometer/thermometer.kicad_pcb` | 2 footprints, no outline, no copper | not usable alone |
| A7 | `thermometer/jackboys2.pretty/QFN65P500X500X100-21N_MCP9600-E_MX.kicad_mod` | Custom QFN-20 + 3×3 thermal-via grid | **icon reference** (club-authored) |
| A8 | `zynq-carrier-power/Imports/Zynq-Carrier/footprint_Zynq_SoM.pretty/Zynq_SoM.kicad_mod` | SoM mezzanine land pattern | icon/detail reference |
| A9 | `fingerprint/FPC2532AP/*.kicad_mod` | Sensor land pattern | icon reference |
| A10 | `zynq-carrier-power/Imports/**/*.st{e,}p`, `fingerprint/FPC2532AP/FPC2532AP.step` | Vendor 3D models (BQ25629, USB-C, DF40C, JST, 1 µH, FPC2532AP) | 3D render inputs. Vendor-supplied, not club work |
| A11 | `docs/architecture.md:15-50` (KB, not copied) | ASCII block diagram, host ↔ J1 ↔ sensors | diagram reference only (it annotates defects) |
| A12 | `graph/knowledge-graph.mmd` (KB, not copied) | Mermaid graph of wiki pages, not hardware | low. Could serve a "documented" motif |
| A13 | `Zynq-Carrier-Power/README.md:19-23` | 4 external images (3D ×2, schematic, PCB) on github.com/user-attachments | **not fetched**. Owned by a member's personal repo, so permission is needed |
| A14 | `thermometer-backups/*.zip` (6) | Schematic evolution, 2025-07-16 → 07-27 | low ("design history" strip) |

**Real board renders: none exist yet.** A1 and A3 are the strongest candidates once KiCad is installed.

## 6. Facts the site must NOT claim

1. ESP32-S3, 240 MHz, 8 MB PSRAM, 16 MB flash, Wi-Fi 6, BLE 5.0 (`projects.ts:14,30,53-58`). Not in the KB.
2. "Custom Android kernels" / "custom kernel drivers" / "Embedded OS" (`projects.ts:8`, `about.ts:116`). Scope says no full OS (F21).
3. "Four-layer boards" (`about.ts:108`). All three real boards are 2-layer (F9, F14, F17).
4. 4.5" IPS display, 3000 mAh swappable / hot-swap battery, "Display Unit", "Haptics Module" (`projects.ts:33-56`). No artifacts.
5. Altium, SolidWorks, PlatformIO, C++ (`about.ts:149`, `projects.ts:14`). KiCad only.
6. "PCB fabrication" or "Prototyping — component testing" as the current phase (`about.ts:133`, `projects.ts:23`). Also "Schematics & Layout: completed" (`projects.ts:22`), which is false (F7, F8).
7. Any test result, working prototype, bench shot or "Completed ✅" build. Notion's build log entry is false (`NOTION-AUDIT:77-81`).
8. That the club designed the Zynq SoM. It is pinguz97's external design (F12).
9. "Zynq-7020" without confirmation (F15). Also "SPI sensor bus / FPGA FIFO pipeline", because the real bus is I²C (`NOTION-AUDIT:65-69`).
10. "100% open source" (`projects.ts:16`). Repo visibility is unconfirmed, and the carrier lives in a personal repo.
11. 25+ / 40+ engineers on the build (C1). The KB shows 6 committers.
12. "3 semesters" as a fact. The KB shows about 5 months of design activity (2025-07 → 2025-11) plus Notion notes into 2026-04.

## 7. Sensitive: never publish

| Item | Where | Why |
|---|---|---|
| 6 personal emails (4 Gmail, 1 cpp.edu, 1 Gmail alias) | `README.md:302-307`; `docs/project-history.md:28-35`; `wiki/index.md:32,40` | personal contact info |
| Names / handles: pyson2k, Sebastian Graciano, pixelatedknight27, eryn-chen, ARussellChung, Angelo Duenas | same, plus `docs/project-history.md`, git log | no consent recorded. Use roles only |
| Full name embedded in a filename (`fingerprint-…-RussellChung-DIGITAL@CPP.zip`) | git: `origin/TheFingerprintSensor` | don't surface the filename |
| PC hostname + OS username in KiCad lock file | `Zynq-Carrier-Power/~Zynq-Carrier-Power.kicad_pcb.lck` (not copied) | device fingerprint |
| Notion workspace page URLs and IDs | `NOTION-AUDIT:220-225` and `2xxx…` IDs throughout | private workspace |
| Personal GitHub repos (eryn-chen/Zynq-Carrier-Power, AngeloDuenas/DIGITALBot, pinguz97/Zynq-SoM) | `.gitmodules:3`; `wiki/decisions/…:19`; `Zynq-Carrier-Power/README.md:5` | link only with the owner's OK |
| Secrets | none found. `.mcp.json:2-7` is an OAuth MCP URL with no token | — |

Also keep out of the site the defect-level language (e.g. "SCL tied to GND"). It is accurate but internal.
Use neutral status words instead: "in rework", "layout in progress".
