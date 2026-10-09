# assets/kb — manifest

Read-only **copies** of KiCad sources from `DIGITAL-KNOWLEDGEBASE/TheSmartphoneProject`, copied 2026-10-02 by R2-KB.
The KB was not modified. No renders are in this folder: kicad-cli is not installed (see `../../research/kb-smartphone.md` §5).
The KB contains no PNG, JPG or SVG images, so there was nothing to copy as imagery. The 38 files here are render inputs only.

| Folder | Origin | Files | Render priority |
|---|---|---|---|
| `source/zynq-carrier-power/` | KB submodule `Zynq-Carrier-Power/` @ `7aed9fc` (lock file not copied, because it holds a hostname) | pro/sch/pcb/dru, lib tables, README, `Imports/` (symbols, footprints, 5 vendor STEP models) | 1: PCB 2D layers + 3D render (hero) |
| `source/fingerprint/` | KB branch `origin/TheFingerprintSensor` commit `cc17e00`, extracted from the uploaded zip (backups, fp-info-cache and .kicad_prl skipped) | pro/sch/pcb/dru + `FPC2532AP/` (sym, 2 footprints, STEP, vendor import note) | 2: routed PCB (hero/detail) |
| `source/thermometer/` | KB root `thermometer.*` + `jackboys*` libs + lib tables | pro/sch/pcb, MCP9600 symbol + footprint | 3: schematic only (PCB has no outline). The BMP581 lib is missing upstream |

Render recipe (once KiCad 9 is installed):

```bash
kicad-cli pcb export svg -o out/carrier-front.svg --layers F.Cu,F.SilkS,F.Mask,Edge.Cuts source/zynq-carrier-power/Zynq-Carrier-Power.kicad_pcb
kicad-cli sch export svg -o out/carrier-sch/ source/zynq-carrier-power/Zynq-Carrier-Power.kicad_sch
kicad-cli pcb render -o out/carrier-3d.png --side top --quality high source/zynq-carrier-power/Zynq-Carrier-Power.kicad_pcb
```

Do not publish any filename, hostname or person name from the origin. See kb-smartphone.md §7.
