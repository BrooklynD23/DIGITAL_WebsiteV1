# SHADES concept — source plan from the GPT-6 Sol agent (verbatim, 2026-10-08)

> Saved as received from the Head Designer. This is INPUT, not the approved plan. The improved plan is
> `PLAN.md` in this folder. Reference images: `references/01-sol-three-directions.png` (directions A/B/C and
> the master prompt) and `references/02-sol-six-frame-sequence.png` (the six-frame sequence the Head Designer
> likes). The prompt that produced it: "My team is building something similar, but we don't want to copy
> ASUS's head-up display glasses rendering. Can you provide prompt engineering for image-gen models to create
> this & expand more into it based on what Shades is doing for DIGITALWebsite".

---

## DIGITAL Shades — Cinematic Product Rendering Direction

Image-generation prompt system · Based on the DIGITAL Website GitHub repository and your ASUS reference

Your ASUS reference has a strong cinematic quality worth preserving: a floating product, deliberate studio
lighting, realistic materials, and a composition that makes the hardware feel engineered rather than
decorative.

But I would take DIGITAL Shades in a different direction: a reading-focused assistive wearable, not a gaming
headset.

I located and reviewed the DIGITAL_WebsiteV1 repository, including its Smart Reading product description,
content definitions, and glasses design specification.

### 1. What we're actually designing

The repository calls the project Smart Reading. The product concept is FPGA-powered smart glasses developed
with dyslexic readers in mind.

Its defining interaction is RSVP (Rapid Serial Visual Presentation): words appear sequentially at a fixed
focal location, with a user-controlled reading pace.

The design language already established in the website includes:

- Dark acetate frames and lightly translucent lenses.
- A minimal in-lens HUD using soft phosphor green #7FE6A3.
- An FPGA-driven processing concept and modular, open hardware.
- A reading-centered demonstration that transitions from a book to the wearer's perspective.

The current website uses a generic sunglasses 3D model as a visual placeholder. So the opportunity is to
create an original DIGITAL Shades industrial design that can eventually replace it.

One important distinction: the repo establishes the functional concept, not a verified final hardware
enclosure or optics arrangement. The proposed physical design below is concept art, not a claim that those
parts have already been built.

### 2. Three visual directions to explore

**A. Everyday intelligence** — Glasses that resemble ordinary premium eyewear, with the engineering hidden in
the temples. Best for communicating accessibility, comfort, and everyday use.

**B. Visible engineering** — A more distinctive hardware concept with readable optical, processing, and
structural systems. Best for demonstrating DIGITAL's engineering work.

**C. Reading becomes visible** — The display experience takes center stage, showing a subtle word projected at
one fixed location. Best for explaining what distinguishes the product.

My preferred combination is A for the silhouette, B for the engineering storytelling, and C for the visual
payoff.

### 3. Master prompt — Original DIGITAL Shades product hero

Use this first to establish a consistent product identity before generating variations.

**Prompt 01 · Hero rendering**

```
Create a photorealistic cinematic industrial-design product hero for DIGITAL Shades, an original experimental FPGA-based smart-reading eyewear concept developed by a university engineering team.

REFERENCE PRIORITY:
Use the ASUS image only for lighting, image quality, suspended composition, and material realism. Never reproduce its product geometry.

DESIGN:
Original slim graphite eyewear with softly squared lenses, a continuous sculpted brow, precision metal hinges, ergonomic temples, and discreet modular electronics integrated into one temple.

The glasses should look wearable every day, not like gaming hardware.

One subtly visible optical display region within a lens suggests fixed-point reading assistance.

CAMERA:
Three-quarter frontal product view. Complete glasses floating in space. Hero positioned upper-right of center with generous text-safe negative space left and below.

MATERIALS:
Satin graphite acetate, brushed titanium details, realistic transparent tinted optical lenses, subtle manufacturing seams.

LIGHT:
Large diffused studio key, cool fill, fine edge highlights. Dramatic but restrained.

BACKGROUND:
Deep charcoal with a subtle graphite illumination gradient.

NO:
ASUS/ROG branding, angular gaming styling, LED bars, tethered controller, exaggerated holograms, random sensors, sci-fi helmet, UI mockups, text, or logos.

16:9, premium physically based CGI, UHD.
```

### 4. Expand into a cinematic sequence

Instead of six unrelated product images, I'd generate six frames of the same physical glasses, each revealing
something more about the engineering or reading experience.

| Frame | Title | Description | Notes |
|---|---|---|---|
| 01 | The idea | Start from an industrial drawing, showing how an ordinary pair of glasses could become an assistive reading device. | Paper beige · pencil graphite · concept stage |
| 02 | The physical form | The drawing becomes a detailed physical object. This is the strongest opening for an ASUS-quality product rendering. | Graphite · diffused highlights · floating hero |
| 03 | Inside the system | Carefully separate the frame, lens module, hinges, and conceptual electronics to explain the engineering. | Exploded assembly · mechanical hierarchy · restrained detail |
| 04 | The optics | Tight macro on one lens, revealing a very small projected reading element. Here, the product's unique purpose becomes apparent. | Optical precision · phosphor green · one word |
| 05 | Through the wearer's eyes | Transition from the exterior glasses to a reading scene. The page remains visible while one focused word appears at a fixed position. | Warm book-world · dark vignette · RSVP experience |
| 06 | The complete product | Return to the same glasses, fully assembled. No extra complexity; the payoff is that a sophisticated system looks like simple eyewear. | Hero resolution · quiet confidence · everyday wearable |

(The per-frame "Copy frame prompt" texts were not included in what was pasted; only frame titles,
descriptions and notes are available.)

### 5. A special render inspired by the ASUS reference

There is one variation worth exploring that carries over the engineering relationship between two objects
without copying the ASUS glasses/controller combination.

**DIGITAL Shades + FPGA development hardware**

```
Create a cinematic dual-object engineering composition for the DIGITAL Shades university smart-reading project.

TOP OBJECT:
An original pair of minimal, dark graphite smart-reading glasses, floating in a natural three-quarter view. Elegant eyewear silhouette, subtle optical module, realistic hinges and transparent tinted lenses.

BOTTOM OBJECT:
A distinct, compact FPGA development circuit board prototype, presented separately below the glasses. Realistic exposed PCB with an FPGA package, supporting components, connectors, mounting holes, power circuitry, and believable assembly detail.

IMPORTANT:
The board is presented as a conceptual engineering development platform, not as a confirmed finalized external controller.

The two objects communicate the relationship between wearable optics and programmable hardware.

NO PHYSICAL CABLE between them unless the reference engineering design explicitly requires one.

COMPOSITION:
Strong diagonal balance. Glasses occupy upper-left/center. FPGA board occupies lower-right. Both float within the same photographic environment, separated by deliberate negative space.

BACKGROUND:
Deep graphite on the left transitioning into a softly illuminated silver-gray on the right, inspired by the reference image's lighting distribution but not copied literally.

LIGHTING:
Premium industrial CGI, cool fill, soft edge reflections, deep detailed blacks, physically plausible optical refractions.

NO:
ASUS/ROG markings, proprietary gaming-console styling, red LED strip, giant processing dock, fictional claims of miniaturization, invented manufacturer logos, product packaging, headings, or watermarks.

16:9 widescreen, photorealistic, cinematic.
```

This could be especially useful for the engineering/platform portion of DIGITAL's project page. But it should
not replace the simpler single-object product hero.

### 6. How to make the whole series consistent

The biggest failure mode with image-generation models is product identity drift: one image creates a
beautifully curved frame, while the next replaces it with angular sunglasses or adds entirely new hardware.

I recommend the following generation order:

1. Generate and approve one clean three-quarter hero.
2. Generate a front, side, and rear design reference from that exact hero.
3. Use the approved images as references for every subsequent frame.
4. Generate exploded, macro, and POV shots without changing the established device.
5. Add UI overlays, captions, and transitions in the website rather than baking them into the product
   photography.

For the existing Next.js/React Three Fiber experience, the artwork should complement the scroll animation,
not compete with it. The repository's current visual story moves from a warm paper environment into a darker
POV with a green reading HUD. This six-frame sequence can extend that narrative while giving your team a more
original hardware identity.

One final design decision matters most: should DIGITAL Shades resemble normal glasses with hidden technology,
or should viewers immediately recognize it as student-engineered hardware?

For this project, I would bias toward normal glasses with small, deliberately exposed details that make the
engineering discoverable on closer inspection. That distinction would make the product visually compelling
without looking like another gaming AR headset.

---

## Head Designer's notes on this plan (2026-10-08)

- SHADES is still being prototyped, so the page should lean on the CONCEPT: "I like this sequence with more
  focus on the concept" (the six-frame sequence, `references/02-sol-six-frame-sequence.png`).
- The hero should be a conceptual / theory visualization, as in that sequence.
- Keep the book background with the motion of words going through it.
- The final concept should follow FAANG product aesthetics, leaning toward Apple.
- It must fit the aesthetic of the locked SIDEKICK and BRAIN pages.
- "The current implementation is not too good." Two different mockups are wanted.
- Do not copy the ASUS head-up-display glasses rendering.
