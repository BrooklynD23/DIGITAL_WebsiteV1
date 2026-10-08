---
name: scroll-frame-sequence
description: Build a scroll-driven image sequence where N sequential frames of one object (a phone opening, a flower blooming, a product rotating) are scrubbed by scroll position — playing forward on scroll-down and reversing on scroll-up. Use when a user has a set of ordered frames and wants an Apple-style "scroll to animate" hero, or references sites like ione.mykm.dev. Covers the pin-track layout, scroll→frame mapping, and adjacent-frame crossfade that makes a low frame count look smooth.
---

# Scroll-Frame Sequence

A technique for turning **N ordered frames of one subject** into a reversible,
scroll-scrubbed animation. Scroll down advances frames; scroll up rewinds them.

## When to use
- The user has frames that are *sequential states of the same object* (opening,
  blooming, rotating, assembling) — NOT unrelated images.
- They want the animation tied to scroll position (scrubbing), not autoplay.

If the images are unrelated, this is the wrong pattern — use a crossfade carousel or
parallax-stack instead.

## The three moving parts

**1. A tall pin track.** One section is taller than the viewport (e.g. `360vh`).
Inside it, a `position:sticky; top:0; height:100svh` stage stays fixed while the track
scrolls past. The distance scrolled through the track = animation progress.

```js
const r = track.getBoundingClientRect();
const total  = r.height - innerHeight;          // scrollable distance
const passed = clamp(-r.top, 0, total);
const progress = total > 0 ? passed/total : 0;  // 0..1
```

**2. Progress → fractional frame.** `f = progress * (N - 1)`. The integer part is the
current frame; the fraction is how far toward the next one.

**3. Adjacent-frame crossfade (the smoothness trick).** Stack all N frames absolutely.
Each frame's opacity = `clamp(1 - |index - f|, 0, 1)`. Only the two nearest frames are
visible, blended by the fraction. This makes 12 frames look like ~60. Without it, a low
frame count flips choppily.

Add a `lerp` toward the target progress each rAF for weight:
`progress += (target - progress) * 0.18`.

## Critical asset requirement
The frames MUST be registered to each other — same dimensions, subject in the same
position/scale, only the animating part changing. Crossfading misaligned frames produces
a jump-cut, not a smooth tween. Transparent PNG/WebP lets the subject float over the bg.

## Performance
- Preload every frame before binding scroll (`new Image()` per frame).
- `will-change:opacity` on the frame layers.
- Read scroll in a passive listener, do work in `requestAnimationFrame`.
- For >30 heavy frames, prefer drawing to a single `<canvas>` instead of N `<img>`.

## Accessibility
Mark frames `aria-hidden="true"` (decorative). Honor `prefers-reduced-motion`: skip the
lerp/animation and just show the final (open) frame.

A complete working implementation is in `index.html` (the `CFG` block + the `render()`
function are the reusable core).
