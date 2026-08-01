# HIGGSFIELD META PROMPT — DIGITAL Modular Smartphone Teardown (Multi-Clip, Team-Coherent)

## ROLE
You are a senior product cinematographer + technical animation director creating a **modular smartphone teardown film** for **DIGITAL @ Cal Poly Pomona** — a student engineering org building an open, repairable phone. Output must feel like **industrial studio documentation**, not consumer ad fluff: precise, calm, legible, honest about prototypes.

This is **not** a glossy Apple-style hero ad. It is a **bench teardown** — parts lift, separate, label themselves, and map to **student subsystems/teams**.

---

## MASTER DEVICE BIBLE (LOCK FOR ALL CLIPS — DO NOT DRIFT)

### Device identity — "DIGITAL Modular Phone v1"
- **Form:** Thick, boxy, utilitarian smartphone slab — taller/narrower than mainstream phones, **matte dark charcoal / space gray** body, slight corner radius, visible depth when viewed from the side.
- **Materials:** Anodized aluminum or high-grade matte polymer shell; glass faceplate; green PCB visible when open; orange/peach FPC ribbon cables; silver shield cans on board.
- **Front UI (when screen is on):** Monochrome **white-on-black** modular tile grid — clock, weather, comms icons, media player, utility row. No brand logos. No iOS/Android mimicry. Looks like a **student-built OS shell**, grid-organized, minimal.
- **Physical controls:** Bottom chin: **3 tactile buttons** (left: 3-bar texture, center: square, right: chevron). Right edge: **2 long rockers + 1 smaller button**. Top edge: small circular port (headphone-style jack).
- **Modularity language:** Parts separate along **clean layer planes** — not shattered, not destroyed. Every removal looks **serviceable** (repair manual, not explosion porn).

### Camera / stage (constant across every clip)
- **Background:** Neutral warm-gray studio sweep (`#E8E6E1` to `#D4D2CD`), soft gradient, no props, no hands unless explicitly requested.
- **Lighting:** Large soft key from upper-left (~45°), gentle fill from right, subtle floor contact shadow under floating parts. No harsh specular hotspots on glass.
- **Lens:** 85mm product lens equivalent, shallow but not extreme DOF — **all separated parts in a given frame stay sharp**.
- **Camera rig:** Locked tripod. **No orbit, no handheld shake.** Only allowed motion: slow 2–4% push-in OR locked frame.
- **Orientation:** Phone starts **3/4 front-right**, ~15° yaw, ~8° pitch (match frame `f-0001` reference aesthetic).
- **Color grade:** Desaturated, cool-neutral shadows, true charcoal body, accurate green PCB, restrained contrast. No teal-orange blockbuster grade.

### Motion grammar (constant)
- **Easing:** Mechanical precision — ease-in-out cubic, no bounce, no elastic overshoot.
- **Separation axis:** Layers peel on **fixed world axes** (glass/display +Y/+Z; frame +X; battery +X/+Y; PCB -X/-Y with rotation; back cover -X/-Y; screws micro +Z).
- **Timing:** 3–5 seconds per layer removal; 0.5s hold at start/end for scroll-scrubbing.
- **Physics:** Zero gravity float once separated; no tumbling. Parts **hold orientation** from previous clip.

### Hard continuity rules (critical for multi-take)
1. **Same phone instance** — identical proportions, button layout, bezel width, UI tile positions in every clip.
2. **Residual stack must match** — if Clip 3 ends with {chassis + PCB + battery + midframe}, Clip 4 must begin with exactly that stack, same positions ±2px.
3. **Never reintroduce removed parts** unless doing a reverse "reassembly" sequence.
4. **Ribbon cables stay attached** to their parent until that parent's clip; then they move with the board or flex as a single rigid group.
5. **Exploded spacing:** Maintain a **fixed radial offset table** (see Layer Map below) — do not invent new spacing per clip.
6. **UI screen:** When display is visible and powered, UI is **static** (no scrolling widgets, no time changing) to allow seamless loops.

---

## LAYER MAP — 14 PARTS → 6 REGISTERED LAYERS → 7 TEAMS

Canonical teardown order (outer → inner → exploded). Source: `lib/teardown/config.ts` registered layers + `components/phone-v2/PhoneSchematicSvg.tsx` part IDs + `lib/data/phoneV2.ts` subsystem sections.

| Order | Layer ID | Part name(s) | Team / Subsystem | Accent color (label only) | Explode vector (world space) |
|------:|----------|--------------|------------------|---------------------------|------------------------------|
| 00 | assembled | Full phone sealed | **Integration / Testing** | `#FACC15` yellow | — |
| 01 | chassis | Back cover + structural shell | **Mechanical / CAD** | `#C084FC` purple | back cover: `-X 40px, -Y 20px` |
| 02 | frame | Midframe, side rails, button carriers | **Mechanical / CAD** + **Systems Architecture** | `#C084FC` + `#F87171` red | `+X 48px, +Y 32px, rotZ 7°` |
| 03 | glass | Front glass / faceplate | **Apps / UX** + **Operating System** | `#60A5FA` blue + `#22D3EE` cyan | `+X 168px, -Y 132px, rotZ -1.4°` |
| 04 | display | Display panel + screen UI layer | **Operating System** + **Apps / UX** | `#22D3EE` + `#60A5FA` | `+X 128px, -Y 96px` |
| 05 | board | Main PCB, shield cans, ESP32-S3 area | **Hardware / PCB** | `#FBBF24` amber | `-X 170px, -Y 56px, rotZ -17°` |
| 06 | battery | Battery pack module | **Firmware / Embedded** | `#4ADE80` green | `+X 162px, +Y 68px, rotZ 14°` |
| 07 | flex | Flex cables / FPC ribbons | **Hardware / PCB** + **Firmware** | `#FBBF24` + `#4ADE80` | `+X 132px, -Y 164px, rotZ 15°` |
| 08 | camera | Camera module | **Hardware / PCB** | `#FBBF24` | `+X 150px, -Y 132px, rotZ 11°` |
| 09 | antenna | Antenna / RF module | **Hardware / PCB** | `#FBBF24` | `-X 166px, +Y 132px, rotZ -8°` |
| 10 | speakers | Speaker drivers | **Hardware / PCB** | `#FBBF24` | `-X 120px, +Y 150px` |
| 11 | buttons | Side + chin button assemblies | **Mechanical / CAD** | `#C084FC` | `+X 182px, -Y 16px` |
| 12 | haptics | Haptic motor | **Integration / Testing** | `#FACC15` | `-X 148px, +Y 162px, rotZ -14°` |
| 13 | screws | Fasteners / screw tray | **Integration / Testing** | `#FACC15` | micro scatter to tray |
| 99 | exploded | Full exploded isometric | **All teams** | white labels | hold 2s |

### Registered layer labels (from `lib/teardown/config.ts`)
- LAYER 01 — CHASSIS (`sealed.`)
- LAYER 02 — FRAME (`frame out.`)
- LAYER 03 — BATTERY (`swappable.`)
- LAYER 04 — BOARD (`esp32-s3.`)
- LAYER 05 — DISPLAY (`screen off.`)
- LAYER 06 — GLASS (`faceplate.`)

### 14 schematic part IDs (from PhoneSchematicSvg)
`phone-front-glass`, `phone-screen-ui`, `phone-display-panel`, `phone-midframe`, `phone-main-pcb`, `phone-battery`, `phone-camera-module`, `phone-antenna-module`, `phone-speakers`, `phone-buttons`, `phone-haptics`, `phone-flex-cables`, `phone-screws`, `phone-back-cover`

### 7 subsystem teams (from `lib/data/phoneV2.ts`)
1. Systems Architecture (`#F87171`) — display panel, midframe
2. Hardware / PCB (`#FBBF24`) — main PCB, flex cables
3. Firmware / Embedded (`#4ADE80`) — battery, flex cables
4. Operating System (`#22D3EE`) — screen UI, front glass
5. Apps / UX (`#60A5FA`) — front glass, screen UI
6. Mechanical / CAD (`#C084FC`) — back cover, midframe
7. Integration / Testing (`#FACC15`) — screws, haptics

---

## CLIP BREAKDOWN (GENERATE AS SEPARATE TAKES, THEN STITCH)

**Deliverable:** 8–12 short clips (3–6s each) + 1 master 30–45s compile.  
**Each clip:** same camera, same lighting, same device bible.  
**End frame of clip N = start frame of clip N+1** (pixel-register continuity).

### CLIP A — `00_assembled_hero` (3s)
Matte charcoal modular smartphone, sealed, 3/4 front-right on neutral gray studio background. Screen ON showing monochrome white-on-black modular tile UI. Soft product lighting, locked camera. Subtle 2% slow push-in. Hold final frame 12 frames.

### CLIP B — `01_remove_back_cover` (4s)
Back cover detaches as single rigid shell plate, sliding backward-left. Team label: MECHANICAL / CAD — enclosure & fit.

### CLIP C — `02_remove_midframe` (4s)
Midframe / side rail assembly separates +X right, rotZ 7°. Team label: SYSTEMS ARCHITECTURE — module boundaries.

### CLIP D — `03_remove_front_glass` (4s)
Front glass faceplate lifts +Y/+Z, slight -1.4° tilt. Team label: APPS / UX — surface layer.

### CLIP E — `04_remove_display_stack` (4s)
Display panel + UI layer separate +X/-Y. Team label: OPERATING SYSTEM — platform shell.

### CLIP F — `05_extract_main_pcb` (5s)
Green main PCB lifts -X/-Y, rotZ -17°. ESP32-S3 region, KiCad aesthetic. Team label: HARDWARE / PCB.

### CLIP G — `06_extract_battery_module` (4s)
Battery module slides +X/+Y, rotZ 14°. Team label: FIRMWARE / EMBEDDED.

### CLIP H — `07_flex_camera_rf_audio` (5s)
Flex ribbons, camera, antenna, speakers pop out per offset table. Team label: HARDWARE / PCB.

### CLIP I — `08_buttons_haptics_screws` (4s)
Button assemblies, haptic motor, screws detach. Teams: MECHANICAL / CAD, INTEGRATION / TESTING.

### CLIP J — `99_full_exploded_hold` (6s)
Full exploded isometric of all 14 parts — match `public/assets/teardown/frames/f-0097.webp` layout. Hold 2s.

---

## TRANSITION / STITCHING INSTRUCTIONS
1. **Hard match-cut** — end frame = start frame (preferred for scroll-scrub web use)
2. **1-frame cross-dissolve (2 frames max)** — only if alignment is perfect
3. **No whip pans, no morphs** between different phone designs

Reverse sequence optional for reassembly CTA.

---

## ON-SCREEN LABEL SYSTEM (POST)
- Font: IBM Plex Mono, uppercase
- Format: `SUBSYSTEM — PART NAME`
- Color dot matches team accent from layer map

---

## TECHNICAL EXPORT SPECS (FOR WEB SCROLL-SCRUB)

Repo assets: `public/assets/teardown/teardown.mp4`, `teardown.webm`, `teardown-poster.jpg`, `frames/f-0001.webp` … `f-0097.webp` (97 frames). Config: `lib/teardown/config.ts`.

| Spec | Value |
|------|-------|
| Resolution | 1920×1080 master (export 1700px wide PNG sequence if possible) |
| Frame rate | 24fps |
| Master length | 30–45s → downsample to 97 key poses |
| Codec | H.264 + WebM VP9 |
| GOP | **GOP=1 (all I-frames)** for scroll scrubbing |
| Motion blur | Off or minimal |

**Key poses (TEARDOWN_CFG.states):** 0% assembled → 16% screen off → 38% frame out → 60% board visible → 82% modules → 97% full exploded

---

## NEGATIVE PROMPT (APPEND TO EVERY GENERATION)

no hands, no fingers, no tools, no smoke, no sparks, no destruction, no cracked glass, no Apple iPhone, no Samsung Galaxy, no notch, no dynamic island, no branded logos, no copyrighted UI, no unrealistic transparent glass phone, no sci-fi holograms, no neon cyberpunk, no dramatic lens flare, no shaky cam, no fisheye, no background clutter, no text watermark, no duplicate phones, no morphing between different phone models, no melting or liquid effects, no over-saturated colors, no cartoon style, no low-poly game asset look

---

## REFERENCE ANCHORS

Upload to Higgsfield in order:
1. `public/assets/teardown/teardown-poster.jpg` — hero assembled
2. `public/assets/teardown/frames/f-0001.webp` — start pose
3. `public/assets/teardown/frames/f-0048.webp` — mid teardown
4. `public/assets/teardown/frames/f-0097.webp` — final exploded
5. `public/images/placeholders/projects/modular-phone.png` — project thumbnail
6. Phone-v2 schematic style — thin stroke technical line-art exploded diagram

Instruction: "Match the reference phone geometry and materials exactly; only animate separation of parts listed in the current clip."

---

## PER-TEAM MINI-PROMPT TEMPLATE

> DIGITAL modular smartphone teardown, [CLIP ID] only. Continue from [PREVIOUS STATE]. [PART] separates per explode vector from layer map. Matte charcoal chassis remains. Studio gray background, locked 85mm camera, soft LL key. Student-built prototype aesthetic. Team label space: [SUBSYSTEM]. 4K, 24fps, no motion blur, mechanical ease-in-out. [negative prompt]

---

## QUALITY CHECKLIST
- [ ] Same phone in every clip
- [ ] Removed parts stay gone in subsequent clips
- [ ] Exploded positions match offset table (±5%)
- [ ] Materials: matte charcoal, green PCB, orange flex, silver shields
- [ ] No consumer-phone clone aesthetics
- [ ] Background and lighting constant
- [ ] Last frame of each clip matches first frame of next
- [ ] GOP=1 / all-keyframe export for scrubbing
- [ ] 97 extractable still poses along master timeline

---

## ONE-LINE SUMMARY

Create a calm, studio-lit, multi-clip modular smartphone teardown of the DIGITAL charcoal prototype: serviceable layer-by-layer separation across 14 parts mapped to 7 student engineering teams, with locked camera, fixed explode vectors, and pixel-perfect continuity between clips for scroll-scrub web playback.

---

## REPO CROSS-REFERENCES

| Asset / file | Purpose |
|--------------|---------|
| `public/assets/teardown/` | Existing teardown video + 97-frame sequence |
| `lib/teardown/config.ts` | Layer labels, scroll states, video paths |
| `lib/data/phoneV2.ts` | Subsystem teams, accents, activePartIds |
| `components/phone-v2/PhoneSchematicSvg.tsx` | 14-part explode transforms |
| `lib/data/projects.ts` | Modular smartphone module descriptions |
