# SHADES Notion Subtree: hardware-pcb

Read-only fetch via notion-fetch / notion-search. Quotes are verbatim. Personal names replaced with `[PERSONAL DATA: name]`.
Pages read: 19 (2 parent pages + 17 database rows). Rows in the database beyond these 17 were not fetched (cap 25).

Status note: every row's Notion `Status` property is `Not Started`, including rows whose body text is already written.

---

## Section 1: Hardware Design (PCB) (parent page)

- **URL:** https://app.notion.com/p/f6b169473d778353afe181f0d976b610
- **Last edited:** 2026-09-30T03:28:06.850Z
- **Status:** container page, no body text (only links the database below)
- **Path:** SHADES > Hardware Design (PCB)

### Structure
- "Hardware Design (PCB) Database" (inline DB): https://app.notion.com/p/32c169473d7783c59ad301c03a2e09fc
- Data source: `collection://3cf16947-3d77-800b-a1e8-000bc03a9bad`
- Database `page_last_edited_at` was not returned by the fetch tool.

---

## Section 2: Hardware Design (PCB) Database (data source schema)

- **URL:** https://app.notion.com/p/32c169473d7783c59ad301c03a2e09fc
- **Last edited:** not returned by fetch
- **Status:** database, schema only read

### Board / Workstream options (verbatim)
- Processing Board
- Carrier / Power
- Carrier / Communications
- Display Daughterboard
- Control Daughterboard
- Carrier / Debug
- Carrier / Motherboard
- Optional Peripheral
- Development Feature
- System Integration

### Category options (verbatim)
- MVP
- MVP - Conditional
- MVP - Architecture Dependent
- MVP Integration
- Stretch
- DNP

### Status options
- Not Started (only option defined)

---

## Section 3: Complete SHADES Electrical System Integration

- **URL:** https://app.notion.com/p/3cf169473d77818984b5f1fdf5ce2d0a
- **Last edited:** 2026-09-23T13:05:55.477Z
- **Status:** Not Started
- **Task ID:** SHD-PCB-40
- **Phase Number:** 0
- **Category:** MVP Integration
- **Board:** System Integration
- **Sub-items:** 10 linked pages (URLs not fetched)

### System architecture
- "Proves that the processing board, carrier, display board, control board, battery, firmware, and FPGA-team test image function together as one electrically validated wearable platform."
- "Parent task for the complete Complete SHADES Electrical System Integration mini-project."

### Notes
- Page body is blank.

---

## Section 4: USB-C Power and Data Module (Project Definition)

- **URL:** https://app.notion.com/p/3cf169473d77817aa02dc70e76540f3f
- **Last edited:** 2026-09-23T13:14:22.988Z
- **Status:** Not Started
- **Task ID:** SHD-PCB-14.01
- **Phase:** 1 (Project Definition)
- **Category:** MVP
- **Board:** Carrier / Communications
- **Parent task:** USB-C Power and Data Module (parent item URL https://app.notion.com/p/3cf169473d7781aa9111e2462cac4f41)
- **Child page linked:** "USB-C Power and Data Module Requirements" https://app.notion.com/p/3e4169473d7780e3ab73d0c5249d3798 (not fetched)

### System architecture: headset vs external unit, cable, USB-C
- "The module will provide the primary wired connection for both power delivery and data transfer between the SHADES headset and its secondary external hardware unit."
- "Its purpose is to provide a single connection capable of supplying the electrical power required by the headset while simultaneously allowing digital information to be exchanged between system components."
- "Provide any required conversion or communication hardware, such as a USB-to-MIPI bridge, depending on the communication requirements of other SHADES modules."
- "The module must determine whether the headset acts as a USB-C power sink, whether the external hardware acts as the source, and whether USB Power Delivery negotiation is necessary."
- "The USB-C interface must also correctly handle the required Configuration Channel (CC) pins..."

### Data rate
- "The module is expected to support USB 3.x-class communication rather than being limited to USB 2.0. The exact USB generation and required sustained data rate remain TBD..."
- "Range; based on our raw display payload of \~442 Mb/s (from 640 × 480 × 60 Hz × 24-bit), USB 3.2 Gen 1 minimum (5 Gb/s, theoretical payload max of \~625 MB/s.)"
- "Breathing room/design over could require USB 3.2 Gen 2 (10 Gb/s, payload max \~1,050 MB/s.)"
- "20Gb/s is likely overkill..."

### Display
- "The headset display is preliminarily estimated at 640 × 480 resolution. Assuming 24-bit color and 60 Hz refresh, the active video payload is approximately **442 Mb/s, **with the actual required link bandwidth expected to be somewhat higher after accounting for timing and protocol overhead. A DisplayPort interface therefore provides substantial bandwidth margin for this display resolution."
- "If the SHADES display hardware uses MIPI DSI while the external connection uses USB-C/DisplayPort, a bridge or converter may be required. The exact bridge architecture is dependent on the display, processor, and system architecture and remains TBD."

### Power
- "The required operating voltage, average current, and peak/startup current of the headset have not yet been finalized."
- "**Charging and operating modes:** The requirement to \"disable use when charging\" is currently ambiguous."

### Protection / mechanical
- "Because USB-C is an externally accessible connector, electrical protection is required."
- "The USB-C connector and PCB must withstand expected cable pulling, bending, and twisting forces."

---

## Section 5: FPGA/SoC Core Module (Project Definition)

- **URL:** https://app.notion.com/p/3cf169473d7781ba9686dc6ca5676a33
- **Last edited:** 2026-10-07T03:24:00.117Z
- **Status:** Not Started
- **Task ID:** SHD-PCB-01.01
- **Phase:** 1
- **Category:** MVP
- **Board:** Processing Board
- **Parent item URL:** https://app.notion.com/p/3cf169473d77815884b7d41fd03d7e57

### System architecture / processor
- "The goal for this assignment is to design an Artix-A7 FPGA motherboard for SHADES. The FPGA will act as the main processor for the overall system."
- "SHADES will be using an FPGA" (body sentence cut off; no following text)
- Part: "Artix 7 XC7A100T-1CSG324C FPGA."
- Reference dev board: "Link to Nexys Artix-A7 Digilent Dev Board containing the processor we are using"

### Data quality flags
- Requirements section contains text about an ambient-light sensor ("The purpose of the light sensor module is to provide the information input necessary to adjust the lens according to the user's ambient light level."). Looks misplaced copy from the Ambient-Light page.
- Approach section contains haptic text ("ERM seems like the most simple one and best one ..."), which conflicts with the haptic component decision (LRA). See Section 8.
- Approach section names [PERSONAL DATA: name] as author. Role not stated.
- Limitations section is empty (bullets blank).

---

## Section 6: Haptic Driver Module (Project Definition)

- **URL:** https://app.notion.com/p/3cf169473d77819cac95d6f3e0ec44c8
- **Last edited:** 2026-10-08T17:32:10.809Z
- **Status:** Not Started
- **Task ID:** SHD-PCB-25.01
- **Phase:** 1
- **Category:** Stretch
- **Board:** Optional Peripheral
- **Child pages:** ERM, LRA, piezoelectric actuator (URLs not fetched)

### Purpose and function
- "The module will connect to a larger device and translate electrical control signals into tactile responses that the user can feel."
- "The haptic engine will be used to communicate device activity without requiring the user to look at a screen or indicator light."
- "Prevent the main processor from directly supplying the actuator's operating current."

### Requirements (selected)
- "Provide at least two distinguishable feedback patterns, such as:" (short pulse for input confirmation; repeated or longer pattern for error)
- "Prevent unintended continuous vibration if communication with the main device is lost."
- "Avoid drawing the actuator's operating current directly from a processor output pin."
- "Include accessible test points for power, ground, and important control signals."

### Limitations (selected)
- "The actuator may draw significantly more current than a processor output can supply."
- "Repeated or continuous vibration may reduce battery life."
- "Vibration strength may change as the battery voltage decreases unless the driver compensates for it."

### Open item
- "The largest unanswered requirement is the actuator type. Choosing between an ERM, LRA, and piezoelectric actuator will determine the driver circuit, power requirements, PCB design, controllability, and achievable feedback patterns."
- Note: this page's last-edit (2026-10-08) postdates the component page, which states an LRA was selected. See Section 7.

---

## Section 7: Haptic Driver Module (Component Research and Selection)

- **URL:** https://app.notion.com/p/3cf169473d7781989fe5e14bc0240eca
- **Last edited:** 2026-10-07T03:52:07.375Z
- **Status:** Not Started (body contains a completed selection)
- **Task ID:** SHD-PCB-25.02
- **Phase:** 2
- **Category:** Stretch
- **Board:** Optional Peripheral

### Final decisions (verbatim)
- "The **Linear Resonant Actuator** was selected with a total score of **36 out of 50**."
- "The **Texas Instruments DRV2605L in the VSSOP-10 package** is selected for the first SHADES haptic daughterboard."
- Decision summary: "LRA + DRV2605L + STM32 I²C control"
- Interface: "STM32 → I²C → DRV2605L → LRA"
- "The STM32 will not directly supply the actuator current or generate the resonant drive waveform."

### Architecture
- "The module will be implemented as a daughterboard controlled by an STM32 microcontroller."
- Daughterboard should provide: DC supply input, ground, I²C SCL/SDA, enable/shutdown, optional hardware-trigger input, LRA outputs, local decoupling, test points, defined connector to STM32.

### Driver scoring (as written)
- "The totals identify the DA7281 as the strongest component on raw technical capability. However, the scores do not by themselves determine the selected component."
- DA7281 total 43, TI DRV2605L 41, TI DRV2604L 39.
- Second matrix totals: DRV2605L 36, DRV2604L 35, "Renesas DA7280" 37. Name and total conflict with the DA7281 entries above.

### Remaining verification before schematic (14 items, first five)
1. "The LRA's rated RMS voltage is within the driver's usable output range."
2. "The LRA's maximum overdrive voltage will not be exceeded."
3. "The LRA's coil resistance and current demand are compatible with the driver."
4. "The actuator's resonant frequency is supported."
5. "The available DC rail falls within the driver's 2.0 V to 5.2 V operating range."

### Attachments (filenames only)
- drv2605l.pdf, drv2604l.pdf, REN_da7280_datasheet_3v0_DST_20220608_1_1.pdf, haptic_driver_module_-_Copy.zip

---

## Section 8: Other Project Definition rows (display, optics-adjacent, power, storage, clocks, integration)

All pages below: Phase 1, Status Not Started, body blank unless noted.

| Row | Task ID | Board | Category | Last edited (UTC) | URL |
|---|---|---|---|---|---|
| Display Interface Module | SHD-PCB-16.01 | Display Daughterboard | MVP | 2026-09-23T13:15:42.266Z | https://app.notion.com/p/3cf169473d7781babbfbd4f3bb5dab1e |
| Display Power Module | SHD-PCB-15.01 | Display Daughterboard | MVP | 2026-09-23T13:15:00.526Z | https://app.notion.com/p/3cf169473d77816787a0cbabeabe7fd5 |
| Ambient-Light Sensor Module | SHD-PCB-24.01 | Optional Peripheral | Stretch | 2026-09-23T13:23:30.714Z | https://app.notion.com/p/3cf169473d77817a8136fa2d0edb0b46 |
| Rotary Encoder Module | SHD-PCB-17.01 | Control Daughterboard | MVP | 2026-09-23T13:22:52.480Z | https://app.notion.com/p/3cf169473d7781dfb36ee289e6a853c5 |
| Battery Temperature Module | SHD-PCB-19.01 | Carrier / Power | MVP | 2026-09-23T13:24:48.603Z | https://app.notion.com/p/3cf169473d778130b713d92ac2c2b26c |
| Processing Board Integration | SHD-PCB-11.01 | Processing Board | MVP Integration | 2026-09-23T13:06:33.340Z | https://app.notion.com/p/3cf169473d778198b780ff94c6b5b360 |
| Volatile Memory Module | SHD-PCB-02.01 | Processing Board | MVP - Conditional | 2026-09-23T13:10:27.401Z | https://app.notion.com/p/3cf169473d778116a852ed1efabe5840 |
| Boot Flash Module | SHD-PCB-03.01 | Processing Board | MVP | 2026-09-23T13:10:08.758Z | https://app.notion.com/p/3cf169473d778161b93ddb65f47fd666 |
| Application Storage Module | SHD-PCB-04.01 | Processing Board | MVP - Conditional | 2026-09-23T13:09:29.426Z | https://app.notion.com/p/3cf169473d77816892b8c2a2952c2486 |
| FPGA Clock Module | SHD-PCB-05.01 | Processing Board | MVP | 2026-09-23T13:09:16.145Z | https://app.notion.com/p/3cf169473d7781a0b384f04583b9401d |
| FPGA JTAG Module | SHD-PCB-07.01 | Processing Board | MVP | 2026-09-23T13:08:10.447Z | https://app.notion.com/p/3cf169473d77817483f8cc8b2c401c78 |
| Wireless Communication Module | SHD-PCB-31.01 | Optional Peripheral | Stretch | 2026-09-23T13:20:28.501Z | https://app.notion.com/p/3cf169473d778171acffdffb0e8fea5f |

All 12 rows have blank bodies (only the properties above exist).

---

## Section 9: Module list (from Parent Task select options)

Source: Parent Task select options in the database schema (Section 2 fetch). Only modules in the fetched rows are annotated.

- FPGA/SoC Core Module (body read)
- Volatile Memory Module (fetched)
- Boot Flash Module (fetched)
- Application Storage Module (fetched)
- FPGA Clock Module (fetched)
- FPGA Reset and Supervisor Module
- FPGA JTAG Module (fetched)
- STM32 Board Controller Module
- STM32 SWD and Debug Module
- Processing-Board Power Regulation Module
- Processing Board Integration (fetched)
- Battery Charging and Protection Module
- Battery Fuel-Gauge Module
- USB-C Power and Data Module (body read)
- Display Power Module (fetched)
- Display Interface Module (fetched)
- Rotary Encoder Module (fetched)
- Reading-Control Button Module
- Battery Temperature Module (fetched)
- Hardware Diagnostic Module (fetched)
- Control Daughterboard Integration
- Display Daughterboard Integration
- Main Carrier/Motherboard Integration
- Ambient-Light Sensor Module (fetched)
- Haptic Driver Module (body read)
- Speaker / Audio Output Module
- Microphone Module (fetched in search only, not opened)
- External Storage Module
- RTC Module
- Advanced Power-Monitoring Module
- Wireless Communication Module (fetched)
- Hinge or Wear-State Sensor Module
- Diagnostic LED Module
- Full Debug Header Module
- Rail-Isolation and Current-Measurement Module
- Alternate Clock Module
- Signal-Tuning Module
- Integrated Board-Support Firmware
- Motherboard Bring-Up and Rework
- Complete SHADES Electrical System Integration (body read)

Note: Microphone Module (row 3cf169473d778133b818d46382ad4336) appeared in search results but was not opened; it is not counted in the 17 fetched rows.

---

## Section 10: Phases and dates

- Phase 0: Complete SHADES Electrical System Integration (SHD-PCB-40), sole Phase 0 row seen.
- Phase 1 (Project Definition): all fetched rows. Phase Checklist: Problem definition, Applications, Functional requirements, Electrical and mechanical requirements, Limitations, Inputs and outputs, Communication protocol selection.
- Phase 2 (Component Research and Selection): Haptic Driver Module only (SHD-PCB-25.02).
- Dates: the database date property is empty on all fetched rows (`date:Date:is_datetime` = 0, no start date). No deadlines appear in these pages.

---

## Section 11: Key takeaways

1. Architecture: headset connects to an external "secondary hardware unit" by one USB-C cable carrying power and data. Data rate and power levels are TBD.
2. Display: preliminary 640x480 @ 60 Hz, 24-bit (about 442 Mb/s payload). DisplayPort preferred over MIPI bridging, but TBD.
3. Processor: Artix-A7 XC7A100T FPGA stated as the "main processor" on the FPGA page, while the Complete Integration page refers to a "processing board" and an "STM32" appears in the haptic and board-controller rows. Relationship between FPGA and STM32 is not described in these pages.
4. Haptic: LRA + TI DRV2605L over I2C from STM32 is the current decision (Category Stretch, Optional Peripheral). Open verification list of 14 items.
5. Status: all rows Not Started. No dates set.

Next action: confirm with the team whether the FPGA page's misplaced ambient-light and haptic text (Section 5 flags) should move to their own pages, then fetch the remaining ~23 rows if the full subtree is needed.
