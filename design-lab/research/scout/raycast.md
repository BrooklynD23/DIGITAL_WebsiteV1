# Raycast — https://www.raycast.com
Category: dev/productivity tool. Shots: design-lab/references/raycast/
Why good: a keyboard-native product shown through keyboard UI; abstract hero is pure brand; feature demos animate the actual interaction (typing, keystrokes).

## Narrative
1. Floating rounded glass nav bar (Store, Pro, AI, iOS, Windows, Teams, Enterprise, Blog, Pricing + Download).
2. Hero: huge diagonal red/blue grain ribbons (WebGL), centred H1 + one-line sub + "Download for Mac" + install-via-Homebrew line.
3. "Take shortcuts, not detours" - interactive launcher demo.
4. "It's not about saving time" - principle section.
5. Extension store ("There's an extension for that" + thousands more).
6. AI section (Chat / Quick AI / Extensions), "Built for professionals", "Don't repeat yourself" bento of Snippets/Quicklinks/Hotkeys, changelog "Stay in the loop", dev CTA "Build the perfect tools", final "Take the short way."

## Type
Inter (600 H1 64/70.4; H2 20/500 + 0.2px tracking), JetBrains Mono / Geist Mono / VT323 for pixel accents, Instrument Serif for one italic accent. Body 18px, white on #07080a.

## Color
bg #07080a, fg #fff, brand red/crimson #ff6363-ish used in hero art and logo only; blue secondary in art. Card borders 1px rgba white.

## Layout
Max ~1200px floating cards, rounding tokens exposed (4/6/8/12/16/20/24), spacing in 4px steps. Bento of 2+1 cards with inner demos.

## Motion
Canvas detected; hero ribbons look animated (not verified on a static capture); in-card demos show typing and keycaps (seen in screenshot). Purposeful: demos show the product behaviour. Heavy for mobile GPU.

## Product / proof / CTA
Primary CTA = Download (platform-aware: "Download for Mac"), repeated at nav + hero + end. Proof via extension count + changelog freshness. Dev CTA separate ("Build the perfect tools").

## Mobile
No overflow. Nav collapses into rounded bar with hamburger; hero keeps ribbons, one pill CTA; below fold content starts empty at first screen (long gap).

**Steal:** (1) demo the interaction inside the card (not a screenshot); (2) role-aware CTA (join as designer / dev / PM); (3) separate "build with us" CTA from "use it".
**Avoid:** (1) gradient/glow hero (BRIEF anti-pattern); (2) bento overload; (3) big empty gaps after hero on mobile.
Tech: WebGL canvas, Inter/JetBrains Mono; Lenis/GSAP not detected (likely CSS + custom).
