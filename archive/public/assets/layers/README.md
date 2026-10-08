# Registered teardown layers (Option B)

Full-frame transparent PNGs at **1700×1120** with every part at its assembled
position. Do not crop parts tight — the canvas origin is shared across all layers.

## Files

| Asset | Module |
|-------|--------|
| `layer-01-chassis` | Back / sealed chassis |
| `layer-02-frame` | Mid frame |
| `layer-03-battery` | Swappable battery |
| `layer-04-board` | ESP32-S3 mainboard |
| `layer-05-display` | Display unit |
| `layer-06-glass` | Front glass / faceplate |

Script-generated slices from `frame-01.png` are a **dev scaffold**. Replace with
real exports from one master scene (Blender/Figma/Photoshop) when available.

## Encode for production

```bash
npm install
npm run encode:teardown
```

Emits AVIF + WebP at 760 / 1100 / 1700 widths. Target total hero payload ≤ ~1.5 MB.
