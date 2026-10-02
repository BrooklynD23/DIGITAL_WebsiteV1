# Stanford d.school — https://dschool.stanford.edu
Category: university innovation lab. Why: most expressive academic site; collage of tilted coloured cards, torn red paper edge, italic serif accent. Pick reason: shows an institution being playful and still credible; multi-audience entry navigation.
Capture: standalone headless Chromium; refs in design-lab/references/stanford-dschool/. Caveat: scroll-1 shot is blank gridlines (scroll-triggered content did not render in headless); desktop.png is reliable.

## Narrative
1. Header: centered logo, search pill, 4-dot menu glyph
2. Interactive prompt "I'm curious about... [Everything]" with red dropdown chevron - the hero IS a filter
3. Row of tilted colour-block cards (tool / workshop / event / read more), each tagged with a vertical rotated label
4. Torn red paper strip with a one-sentence "About" statement
5. Content grid: workshops, stories, tools, alumni features; footer mirrors header
## Type
Signifier (serif, bold + italic for accent words), GT America (grotesque, light 300, tracked +0.15px, ~15px), "The Future" display. Text colour rgb(31,28,6) on warm off-white rgb(252,252,247).
## Color
Warm off-white bg; cards in sky blue, olive green, cyan, cream; signal red (#e8322b-ish from screenshot) for chevron, torn edge, italic word.
## CSS tokens
--ds-animation-duration .3s, long .6s, ease; border 1px / 2px; radius 5px, round 48px.
## Layout: 8-column hairline grid visible in background; cards tilted +/-3deg. Page ~6000px.
## Motion: not verified (static captures); cards appear scroll-triggered, content below fold was blank in headless.
## Project/people/CTA
- Cards tagged by type (Tool/Workshop/Event) and category (Alumni, Impact, Emerging Tech).
- Alumni = headshot + name only. Join = audience-split entry: degree / elective / workshop / self-paced / newsletter.
- Partner language minimal: "affiliate memberships".
## Mobile: captured in mobile.png (not analysed in detail).
## Steal as principle
1. Hero as a curiosity prompt/filter that routes visitors by interest (maps to DIGITAL disciplines).
2. Vertical rotated micro-labels for type of thing (Project / Event / Tool).
3. Visible hairline column grid as structure, not decoration.
## Avoid
1. Tilted pastel cards read "design school workshop", not engineering studio. 2. Content that depends on scroll to appear (blank at first paint). 3. Vague mission line.
## Tech observed: no gsap/THREE/Lenis globals.
