# SHADES Notion Subtree: product-definition (verbatim findings)

Source: Notion, read-only via notion-fetch. No personal data present in the fetched pages.
Quotes are verbatim. Each section gives the page URL and `page_last_edited_at`.

---

## 1. Product Definition

- URL: https://app.notion.com/p/390169473d77806f93d1c99f5a28db74
- Last edited: 2026-09-10T20:00:53.230Z
- Parent path: Product Development > SHADES Project Timeline Database > SHADES
- Truncated: no

### Goal / purpose
- "The central engineering goal is to build a functional smartglasses platform that can stream text, process it, and display it word-by-word or phrase-by-phrase at an adjustable speed."
- "The device would be designed as an assistive reading tool for individuals with dyslexia, ADHD, visual tracking difficulties, or other reading-related challenges."
- "It could also be used by neurotypical people to learn speed reading techniques that could help them improve their reading speed to keep up with such a fast paced world."

### Form factor / display concept
- "Inspired by lightweight smartglasses such as **Focals by North** and **Even Realities G1**, this project aims to create a prototype wearable display system that can present text directly in the user's field of view."
- "By using RSVP, the system reduces the need for eye scanning, line tracking, and repeated regressions. The user can focus on a fixed visual point while the system controls the pace and structure of the reading experience."

### Hardware
- "The project emphasizes embedded systems, FPGA design, wearable computing, display systems, human-centered design, and assistive technology."

### Notes
- Page is a summary; no subteams, dates, or phases.
- Page has no child pages linked.

---

## 2. Background, & Project Solution - Product Development | SHADES

- URL: https://app.notion.com/p/3ab169473d778029a38ed4957c453ed2
- Last edited: 2026-09-28T20:39:16.252Z
- Status property: "Not started"
- Due date property: none set
- Truncated: no

### Goal / purpose
- "The importance of this approach does not lie simply in reducing eye movements or displaying words more quickly."
- "The central engineering challenge is therefore not to maximize reading speed. It is to control the delivery of text in a manner that supports the construction of meaning."
- "SHADES therefore does not begin with the claim that RSVP has already been proven to improve dyslexic reading. It begins with a more grounded proposition: if the way text is delivered affects a reader's ability to preserve and comprehend its meaning, then engineers should be able to build a system in which that delivery is no longer fixed."
- "The engineering objective is therefore to deliver complete ideas at a pace and structure the user can follow."

### FPGA and architecture
- "At the center of this platform is an FPGA-based processing architecture."
- "The FPGA instead serves as the open integration layer through which multiple subsystems can operate concurrently and time-dependent behavior can be controlled precisely."
- "Time-sensitive operations such as text buffering, RSVP pacing, display synchronization, sensor communication, and input handling can be implemented through custom digital logic instead of remaining inaccessible within a proprietary chipset."
- "Development will therefore proceed from an end-to-end proof of concept toward increasingly integrated wearable prototypes. The initial system must demonstrate that text can be received, processed, paced, synchronized with a microdisplay, and viewed through the optical assembly."

### Display / optics
- "The display electronics will be paired with a bird-bath optical assembly as an attainable alternative to the custom waveguides and sealed optical engines used in modern commercial smartglasses."
- "In this configuration, light from a microdisplay is redirected by a semi-reflective beam splitter toward a curved optical element, which enlarges and returns the virtual image toward the user's eye while preserving a view of the surrounding environment."
- "The bird-bath system gives the team a realistic starting point from which image position, focal distance, field of view, brightness, transparency, alignment tolerance, and visual comfort can be understood before later prototypes pursue greater miniaturization."

### Components and interfaces
- "The system will therefore be constructed around commercially obtainable components that expose documented electrical and communication interfaces. Microdisplays, inertial sensors, ambient-light sensors, communication modules, memory devices, and other supporting electronics can be selected from third-party manufacturers according to measurable requirements and integrated through standards such as I²C, SPI, UART, USB, or other appropriate protocols."

### Wearability / mechanical
- "The physical frame must then transform these electrical and optical subsystems into a device that can genuinely be worn."
- "Heat-producing components must be separated from sensitive areas, control inputs must remain accessible, and the display must remain visible without obstructing the environment."

### Medical / clinical boundary
- "A separate medical research effort will examine whether RSVP is a viable intervention for people with dyslexia and other reading-related disabilities by directly evaluating comprehension, reading speed, retention, comfort, and other relevant outcomes."
- "The role of the engineering project is to develop the functional platform through which this method can be implemented, adjusted, and eventually studied under controlled conditions."
- "A successful SHADES prototype will not establish by itself that RSVP improves comprehension for every person with dyslexia or another reading-related disability."

### Team / education
- "Undergraduate students will encounter the same categories of decisions that make wearable systems difficult within industry and graduate-level research."

### Success / outcome
- "It will establish the engineering foundation required to investigate that possibility honestly."

---

## 3. Engineering Scope | SHADES

- URL: https://app.notion.com/p/3ac169473d77802c99b5c90e4d426475
- Last edited: 2026-07-29T13:16:01.119Z
- Parent: Exploration of SHADES Viability
- Child linked: Project Scope Notes (see section 5)
- Truncated: no

### Goal / purpose and MVP
- "The engineering scope of SHADES is intentionally centered on one complete technical objective: developing a safe, head-mounted system that receives previously prepared text and presents it through Rapid Serial Visual Presentation in a controllable near-eye display."
- "The project is not intended to produce a general-purpose smartglasses platform, a standalone wearable computer, or a clinically validated treatment for dyslexia."
- "For the minimum viable prototype, previously prepared text will be transferred from an external host computer through a wired connection, buffered by the embedded electronics, converted into words or short phrases, rendered by the FPGA, and displayed through a monocular optical system."
- "The minimum viable SHADES prototype will be considered complete when it can receive previously prepared text through one wired connection, represent a limited English character set, render words or phrases in a fixed display region, execute controllable RSVP timing and punctuation-sensitive pauses, respond to pause, resume, speed, and rewind controls, and present the result through a stable monocular fixed-focus display. External processing and power hardware are acceptable and expected within this architecture."

### Hardware partition (responsibility per device)
- Host computer: "The host computer will prepare plain text and convert it into presentation instructions that the embedded system can execute."
- Microcontroller: "The microcontroller will manage the wired connection to the host, receive and validate presentation data, monitor user inputs, perform basic buffering and system supervision, and communicate commands and data to the FPGA."
- FPGA: "The FPGA will be responsible for the functions that benefit directly from deterministic and parallel hardware execution. These functions include RSVP timing, presentation-state control, glyph lookup, text rendering, display synchronization, and the predictable execution of pause, resume, speed-change, and rewind commands."
- External controller: "The primary processing electronics, FPGA development board or module, microcontroller, and power hardware will initially remain in an external controller."
- Glasses: "The glasses will contain only the microdisplay, fixed-focus optical assembly, necessary interface electronics, and the controls that must be physically accessible to the wearer."
- Interfaces: "This partition must be supported by interface-control documentation defining the ownership of each signal, communication protocol, packet structure, supply voltage, logic level, connector, pinout, cable constraint, startup sequence, shutdown sequence, and mechanical board envelope."

### FPGA / electronics boundary
- "A commercially available FPGA development board or module will be used for the initial prototype."
- "However, the minimum viable product will not depend on designing a custom FPGA motherboard, routing high-speed DDR memory, or mounting a high-pin-count BGA FPGA."
- "The project will not require the development of a GPU, custom CPU, instruction set, complete system-on-chip, general-purpose graphics engine, DDR memory controller, operating system, or universal driver architecture."

### Display / optics boundary
- "The selected microdisplay must have publicly obtainable electrical documentation, a supported initialization process, a display interface the team can realistically generate, and sufficient information to test the display without proprietary calibration equipment."
- "Displays that depend on nondisclosure agreements, undocumented register sequences, inaccessible driver software, or manufacturer-only configuration tools will not be used."
- "The optical system will use one fixed-focus, monocular bird-bath optical path."
- "Binocular displays, stereoscopic imagery, varifocal optics, custom waveguides, and retinal projection are outside the current scope."

### Communication / storage / software
- "The first prototype will use one wired communication method, such as USB or UART, to transfer presentation data from the host to the embedded system."
- "Wi-Fi, Bluetooth, cellular communication, cloud synchronization, and over-the-air updates are outside the current scope."
- "The device will only provide the temporary buffering needed to maintain uninterrupted presentation."
- "Host software will be limited to a utility that prepares supported text, configures presentation variables, and transfers instructions to the embedded hardware."

### Content / text processing
- "The engineering prototype will operate on previously prepared plain text."
- "Optical character recognition, cameras, environmental text recognition, and native parsing of PDF, DOCX, HTML, or Markdown files are therefore outside the current scope."
- "Character support will initially be limited to a deliberately selected English character set, punctuation set, and small collection of fonts."

### RSVP behavior / controls / sensors
- "The RSVP system will expose variables that a user or researcher can intentionally configure, including presentation speed, phrase length, punctuation-related pauses, font size, contrast, and selected timing behavior."
- "AI-generated pacing, automatic comprehension detection, vocabulary analysis, and personalized learning models are outside the engineering scope."
- "User interaction will be limited to a small number of physical controls, such as buttons, switches, or a rotary encoder."
- "Eye tracking, hand tracking, gesture recognition, voice control, and touch interfaces are outside the current scope."
- "Sensors will only be added when a defined system requirement cannot be satisfied without them."

### Wearability / power / mechanical
- "The prototype is not required to achieve all-day comfort, consumer-level fashion refinement, waterproofing, impact ruggedization, or universal compatibility with prescription glasses."
- "The glasses are also not required to operate as a completely standalone device."

### Manufacturing
- "Manufacturing work will focus on prototype fabrication, PCB assembly, enclosure construction, optical mounting, cable fabrication, test fixtures, documented assembly procedures, and design revisions based on measured performance."
- "Injection molding, production tooling, automated high-volume assembly, and mass-manufacturing optimization are outside the current scope."

### Validation / clinical / certification
- "Testing will address RSVP timing accuracy, maximum supported presentation rate, control-response latency, text-transfer reliability, buffer-underrun behavior, glyph and display stability, brightness and contrast, optical alignment, external-controller temperature, glasses weight and balance, mechanical stability, operating duration, and safe behavior during lost communication or other faults."
- "Exact acceptance thresholds will be established through the project requirements and subsystem specifications."
- "The engineering prototype may support later research involving readers with dyslexia or other reading disabilities, but this phase will not claim that RSVP treats dyslexia, improves clinical outcomes, or represents the medically optimal method of presenting text."
- "Certification efforts will be limited to basic engineering safety evaluation appropriate to a controlled prototype. Medical-device approval, FCC or UL certification, and full consumer-product certification are outside the current scope."

### Stretch goals
- "Stretch functions may be considered after this complete pathway has been demonstrated and validated. Appropriate stretch goals include user-selectable presentation presets, automatic brightness adjustment, a more compact external controller, improved phrase-grouping rules performed by the host, additional researcher controls, and greater PCB consolidation."

### Scope-change test (7 questions)
- "Any proposed feature or subsystem that exceeds these boundaries must undergo a formal scope-change evaluation."
- Questions: (1) which existing requirement makes it necessary; (2) what part of the RSVP chain fails without it; (3) can the host or an off-the-shelf part do it; (4) does it add a new engineering domain; (5) can current students build and verify it in the phase; (6) which deliverable is delayed or removed; (7) how is it objectively tested.

---

## 4. Exploration of SHADES Viability

- URL: https://app.notion.com/p/390169473d778022aecaced182120c72
- Last edited (page_last_edited_at): 2026-08-05T23:28:03.424Z
- Fetch "as of": 2026-08-05T23:38:17.680Z
- Parent: Product Development
- Children linked: Engineering Scope | SHADES (section 3), Concept of Operations (ConOps) - SHADES (section 6)
- Truncated: no `truncated` field returned. The result was too large for the tool and was saved to a local file (86,783 chars). Content below was read from that file.
- Read coverage: Read in full: Project Objectives, Engineering Scope (embedded copy, duplicates section 3), System Requirements heading block, Project Definition, Proposed Architecture, Key Deliverables, Challenges, Success Metrics, Timeline, Broader Impact, Tech Stack, Interconnect, Headwear, the start of Optical Engine, and Milestones. Skimmed only: Benchmark, the assignment-template essay, optical product comparison (FOV, light loss, form factor), and display-engine explainer. Not read in full: roughly chars 48,530-54,600, 66,437-68,070 (partly), 71,828-86,783 (partly).

### Project objectives (page's own opening)
- "SHADES is not a general-purpose smartglasses platform or an undergraduate SoC-development project. It is an application-specific RSVP presentation system."
- "A tethered, monocular near-eye display that receives previously prepared text through one wired interface, buffers and presents that text using controllable RSVP timing, renders it in a fixed visual region, and allows the user to pause, resume, change speed, and revisit information. Processing and power components that cannot comfortably fit on the glasses may remain in an external controller or development system."

### Goal / core question
- "Can we design and prototype a wearable FPGA-powered smartglasses system that presents text using low-latency, adjustable RSVP to support more efficient reading?"

### Hardware: display and optics
- "Devices like the Even Realities G1 use a proprietary MicroLED projector embedded in the frame temple..." (context for choosing bird-bath).
- "Bird-Bath Optical Path, works by mounting a microdisplay facing *downward* from the upper brow of the glasses. Directly beneath it, you place a 45° semi-reflective mirror (a beam-splitter prism)."
- "...the Bird-Bath Optical Path heavily relies on darker lenses to make it easy enough to see the generated text."
- "Initially, the beamsplitter partially reflects and transmits light from the display source, leading to a 50% light loss."
- Display candidates (Tether/Headwear section): "A monochrome MicroLED or MicroOLED display (such as a $640 \times 200$ resolution array)."
- Prototype parts list: "An SSD1306 or a similar low-cost SPI-driven MicroOLED display panel breakout board." and "A standalone $45^\circ$ beam-splitter glass prism block (purchased from an educational science/optics supplier)."
- Optical engine recommendation: "buy an integrated, pre-aligned \"Optical Engine\" kit (where the MicroLED and the focusing lens are permanently bonded together in a factory casing)."

### Hardware: processing / FPGA / controller ("puck")
- "To compensate, we will use a high-speed serialization approach. This means your FPGA needs to send *character codes* or highly compressed, sparse pixel blocks (since it's a monochrome display) rather than full video frames."
- "The Display Brain: A standard FPGA Development Board (like a Digilent Nexys or Basys 3) running Vivado."
- "Control Microcontroller: A low-power $\mu C$ (running bare-metal firmware or an RTOS) handles the user interface. It reads inputs from physical buttons, dials, or a touch surface, and feeds the updated Words-Per-Minute (WPM) settings to the FPGA via a standard protocol like **I2C or SPI**."
- "Power Management Unit (PMIC): Manages the lithium-polymer battery charging, boosts or bucks the voltage rails for the FPGA core ($1.0\text{V}$), I/O rails ($3.3\text{V}$)..."
- Note: the page also names a "Spartan UltraScale+ (SU10P or SU25P)" as a "Next-Gen Alternative" with "native hardcoded **MIPI D-PHY** interfaces."

### Hardware: link / interconnect
- "Physical Layer: A flexible, ultra-thin USB-C cable."
- "Protocol Layer: ... map the physical wires of the USB-C cable to direct hardware lines: differential signals for a high-speed serialized SPI/UART link to transfer pixel data, alongside dedicated power and ground wires."
- Bandwidth claim: "128,000 bits \text{ per frame} \times 30 frames/sec = 3.84 Mbps" (640x200 mono at 30 fps).

### Form factor
- "To mitigate this, we decided to place the CPU into an external puck that you would put in your back pocket."
- "Mechanical ... 3D printers used in typical student labs (like FDM printers) have tolerance errors that can easily cause this misalignment." and "If the microdisplay sits even **0.5 mm** out of alignment from its prism or waveguide..."

### Core deliverables (page list)
1. System requirements document
2. FPGA architecture diagram
3. RSVP algorithm implementation
4. Text parsing and timing module
5. HDL modules for display control
6. Simulated display timing results
7. Functional bench-top prototype
8. Wearable smartglasses proof-of-concept
9. Adjustable reading speed interface
10. Demonstration using sample text
11. Final engineering report
12. GitHub repository with code and documentation
13. Future design roadmap

### Success metrics (page's list)
- "A working RSVP display system"
- "Adjustable reading speed"
- "Stable text rendering"
- "Low-latency word updates"
- "Usable display brightness and readability"
- "A wearable or semi-wearable prototype"
- "Clear documentation for future teams"
- "A design that can later integrate findings from the dyslexia research project"
- Possible technical metrics: display latency, maximum reliable WPM, frame update rate, battery runtime, text rendering accuracy, device weight, user comfort rating, response time for pause/resume/speed.

### Timeline (page's proposed phases, 8 months)
- Months 1-2: "Requirements and Architecture": "The team defines system requirements, selects an FPGA platform, identifies display options, and designs the overall architecture."
- Months 3-4: "RSVP Engine and Display Simulation": "Students implement the RSVP algorithm, simulate display timing, and develop the initial FPGA display pipeline."
- Months 5-6: "Prototype Development": "The team integrates FPGA hardware with a display module and demonstrates real-time RSVP text output."
- Months 7-8: "Wearable Integration and Testing": "The system is mounted into a glasses-style form factor. The team tests readability, latency, comfort, and user controls."
- Milestone gate (tech-stack section): "Milestone 2: Breadboard & Development Board Integration (Months 3–4)" with a 1,000 FPS camera test; "Milestone 4: Assembly, Testing, and Data Collection (Months 7–8)".

### Requirements (headings only, no body text in the page)
- Headings present but empty: Operational Requirements, Functional Requirements, Constraint Requirements, Legal Requirements, Safety Requirements, Derived Requirements.
- Example requirements in the linked ConOps/SyRS block: "[SyRS-002]: The head-worn component shall draw no more than $250\,\text{mW}$ of active power during continuous rendering."
- "[SyRS-001]: The FPGA Display Engine shall transmit character pixel bitmaps over the serial data link within $2\,\text{ms}$ of memory pointer execution."
- Verification table row: "SyRS-002 | Active Power consumption | Inspection / Test | USB-C Inline Power Meter | Current Draw ≤ 50 mA at 5 V".
- Verification table row: "SyRS-003 | End-to-End M2P Latency | Test | 1,000 FPS High-Speed Camera | Frame count ≤ 15 frames from trigger".

### Team responsibilities (table in page)
- Power and Safety: "Regulation, protection, power distribution, thermal monitoring"
- Host Interface: "Receive prepared text and deliver it reliably to the FPGA"
- User Controls: "Pause, resume, speed, rewind, and basic status"
- Display Interface: "Power, initialize, configure, and connect the selected display"
- FPGA Carrier and Integration: "Connect the FPGA development module to every subsystem"
- Each team has three "Mini-project" tracks (1, 2, 3) in the table.

### Challenges flagged by the page
- Optical: "If the microdisplay sits even 0.5 mm out of alignment..." (see above).
- IRB: "You cannot legally test an unapproved hardware device on human subjects at an academic institution without **Institutional Review Board (IRB)** approval." and "Treat the research protocol as a Day 1 task."
- Integration: "Implement a **\"Hardware-in-the-Loop\"** design rule. By Week 4, create a rough \"cardboard and hot glue\" mockup..."

### Medical / clinical boundary (page)
- "Since your project has a vital second half—evaluating whether this helps individuals with dyslexia—you must test the device with real people."
- "Participants will view RSVP text on a standard laptop screen to validate the algorithm" (suggested simulated IRB protocol).

### Broader impact (page)
- "The long-term goal is to develop a modular smartglasses platform that can support individuals with dyslexia by changing how text is presented. The device could eventually be expanded to support additional features such as OCR, mobile connectivity, adaptive pacing, translation, captions, or classroom accessibility tools."

### Conflicts with the Engineering Scope page (section 3)
- Exploration lists "Bluetooth phone connection" and "Camera-based OCR" as "Future version". Engineering Scope lists Bluetooth, Wi-Fi, OCR, and cameras as "outside the current scope."
- Exploration describes the controller as a "puck" in the back pocket, with a USB-C tether; Engineering Scope says the external controller holds the FPGA, microcontroller, and power.
- Exploration proposes "Adjust brightness" and a "Start new passage" control; Engineering Scope lists automatic brightness only as a stretch item.
- Exploration's requirements headings are empty; Engineering Scope gives the testable list.

---

## 5. Project Scope Notes (child of Engineering Scope)

- URL: https://app.notion.com/p/3ac169473d7780288c2effe2bddaa47e
- Last edited: 2026-07-29T13:15:44.419Z
- Truncated: no

### Outside of scope (list)
- "A GPU"
- "A custom CPU or instruction set"
- "A complete SoC"
- "A general-purpose graphics engine"
- "A DDR memory controller"
- "A USB, Bluetooth, or Wi-Fi stack from first principles"
- "An operating system"
- "A universal driver architecture"

### Display-interface boundary
- "The microdisplay must have: Obtainable documentation; A supported initialization process; A display interface the team can realistically generate; Publicly available electrical specifications; No NDA-only register sequences or calibration tools"
- "The project should not require students to develop a custom MIPI-DSI transmitter, HDMI chipset, undocumented microdisplay driver, or high-speed display interface from first principles."

### In/out table (verbatim rows, condensed to the key cells)
| Area | In scope | Outside |
|---|---|---|
| Content | Previously prepared plain text | OCR, cameras, PDF/DOCX/HTML/Markdown parsing |
| Optics | One fixed-focus, monocular bird-bath optical path | Binocular, varifocal, custom waveguides, retinal projection |
| Communication | One wired protocol, such as USB or UART | Wi-Fi, Bluetooth, cellular, cloud sync, OTA updates |
| Storage | Temporary buffering needed for presentation | File systems, onboard document libraries, user accounts |
| Validation | Timing accuracy, legibility, optical alignment, control response, heat, weight, stability | Proving that RSVP treats dyslexia or improves clinical outcomes |
| Certification | Basic engineering safety evaluation | Medical-device approval, FCC/UL, consumer certification |

---

## 6. Concept of Operations (ConOps) - SHADES | Product Development

- URL: https://app.notion.com/p/3b3169473d77803d8b6dcda750335eb1
- Last edited: not returned in the fetch metadata. Fetch "as of": 2026-08-05T23:38:17.680Z.
- Parent: Exploration of SHADES Viability
- Truncated: no

### Session flow (quoted)
- "The SHADES (Smart Headset for Adaptive Dyslexia Enhancement System) is an application-specific assistive reading platform designed to present pre-processed text to a user using Rapid Serial Visual Presentation (RSVP) in a fixed monocular display region."
- "The system operates via a split architecture: an external controller ("puck") housing the processing unit, power supply, and primary physical controls, and a head-worn monocular display assembly connected via a single physical tether cable."
- Setup: "Prior to wearing the device, text content is loaded onto the compute puck from an external host computer using a wired connection (USB-UART)."
- Controls: "Selecting Reading Speed: The user selects or alters their desired reading speed (measured in Words Per Minute) by turning a physical rotary dial located on the compute puck."
- Rewind: "If the user loses focus or misses a word, they press a physical \"Rewind\" button on the puck."
- Safe state: "If communication or power is abruptly interrupted, the glasses gracefully transition into a safe, blank display state."

### Gaps the page itself lists
1. "Ambient Light & Contrast Control: Bird-Bath optics experience roughly 50% light loss..."
2. "Text Passage Selection / Navigation: ... selecting \"Chapter 1\" vs. \"Chapter 2\" without re-tethering to a PC) is not defined."
3. "Tactile Feedback & Blind Usability: ... all puck-based physical controls (dials, buttons) require distinct tactile shapes or haptic/audio indicators..."

---

## Open items for the team (from the pages, not decided)
- Display choice: pages name MicroOLED, MicroLED, and SSD1306 options. Engineering Scope requires documented, obtainable display interfaces; no part is chosen.
- FPGA board: pages name Digilent Nexys / Basys 3 (Exploration) and Spartan UltraScale+ (alternative). Not chosen.
- Requirements: Exploration's requirements section is empty; SyRS-001/002/003 examples exist in the page but need confirmation.
- Timeline: Exploration gives 8 months; Engineering Scope and Background give no dates. Background Status = "Not started".
- Medical: Background and Scope both say the engineering phase makes no clinical claim; the IRB protocol timing is raised as a Day 1 item in Exploration.
