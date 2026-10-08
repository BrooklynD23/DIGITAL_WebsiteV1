# Hardware Teardown — Scroll-Driven Landing Page

A single-file landing page inspired by [ione.mykm.dev](https://ione.mykm.dev), skinned
in a studio-grey / industrial aesthetic to match your phone renders. The centerpiece is a
**scroll-driven teardown**: the device starts assembled and comes apart layer by layer as
you scroll down, and reassembles as you scroll up — so visitors can inspect the hardware.

Built from your **12 render frames**, crossfaded so the 12 steps read as smooth motion.

```
site/
├── index.html              ← the whole site (HTML + CSS + JS in one file)
└── assets/frames/
    ├── frame-01.png        ← ASSEMBLED  (Image1)
    │   …                       (disassembling…)
    └── frame-12.png        ← EXPLODED   (Image12)
```

## How your images were prepared
Your `Image1.png … Image12.png` were normalized onto one uniform 1700×1120 canvas and
re-saved as `frame-01 … frame-12`. This was necessary because the originals changed aspect
ratio partway through (wide exploded shots → portrait close-ups) and had slightly different
grey backgrounds; normalizing gives a pixel-stable crossfade and a seamless floating phone.

**Order:** `Image1` (assembled) is frame 1; scrolling down disassembles toward `Image12`
(fully exploded). To reverse it (scroll-down assembles instead), just rename your files in
the opposite order, or re-run the included `normalize.py` with the source mapping flipped.

## Swapping or updating frames
Drop replacements into `assets/frames/` as `frame-01.png … frame-12.png`, **same dimensions**
for all. Keep the device in a consistent position/scale between frames so the crossfade
tweens rather than jump-cuts. Different count? Change `frameCount` in the `CFG` block.

## Editing copy
All text is plain HTML in `index.html`. Replace: `Your Club Name`, the `TAKE IT APART`
headline (the word inside `<span class="out">` gets the outline treatment), the lede, the
three team `.card` blocks under **Teams**, the **Join** button `href="#"`, and the footer.
The right-hand teardown captions ("screen off.", "frame out.", etc.) live in the
`CFG.states` array — each is `[scrollProgress 0–1, "small label", "big note"]`.

## Rebrand / tune
- Colors & fonts: the `:root` block and the Google Fonts `<link>`.
- Speed of the teardown: `--pin-len:420vh` on `<section id="teardown">` (bigger = slower).
- Smoothness/weight: `progress += (target - progress) * 0.16` in the script (lower = heavier glide).
- Phone size on screen: `.phone { width / height }`.

Accessibility: frames are `aria-hidden` (decorative), and motion honors `prefers-reduced-motion`.

## Host it (static — free options)
GitHub Pages, Netlify, Cloudflare Pages, or your club's web space (upload `index.html` +
the `assets/` folder together). Test locally with a server, not by double-clicking:

```bash
cd site && python3 -m http.server 8000   # then open http://localhost:8000
```
