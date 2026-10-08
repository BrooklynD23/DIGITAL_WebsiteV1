# Smart-glasses model drop-in

The `/experiments/glasses` scroll hero renders a **primitive placeholder** (built from
Three.js geometry) until you drop a real model here.

## How to use a real glasses model

1. **Download a generic, no-brand glasses GLB.** Recommended starting points:
   - Sketchfab — "Augmented reality glasses" by zombitt (realistic, PBR). **Verify the
     license badge allows your use before shipping.**
   - CC0 fallbacks (always safe): Poly Pizza "Glasses Pack" by iPoly3D, or Meshy eyewear.
2. **(Optional) Shrink it** in Blender or with `gltf-transform` so the `.glb` is ~1–3 MB.
   Avoid Draco compression (keeps the loader dependency-free).
3. **Save the file here as** `scene.glb` (this exact path):
   `public/assets/experiments/glasses/scene.glb`
4. **Flip the switch:** in `components/experiments/glasses/GlassesModel.tsx`, set
   `MODEL_URL = '/assets/experiments/glasses/scene.glb'`.

That's it — the scene swaps the primitive for your model automatically; no other code
changes are needed. Scroll-driven swirl/drop, hover, and click already apply to whatever
mesh is loaded.

## Later: exact manayerbamate-style scrubbed frames (optional)

If you ever want the literal Mana technique (pre-rendered frame scrubbing instead of
real-time 3D), render a 120–180 frame turntable + transition of the glasses in Blender,
encode via the existing teardown pipeline, and reuse `components/teardown/engine/canvasSeqRenderer.ts`.
Not required — real-time WebGL here is already smooth at 60fps.
