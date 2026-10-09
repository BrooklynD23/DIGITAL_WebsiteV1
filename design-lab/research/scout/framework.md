# Framework — https://frame.work
Category: modular/repairable hardware. Shots: design-lab/references/framework/
Why good: the product's thesis (own it, repair it, build it) is the page structure; parts laid out flat like an engineering kit.

## Narrative
1. Sticky light nav: product families left (Desktop / Laptop 12/13/16 / Shop all), utility right.
2. Dark hero: product photo bleeding into black, 2-tone headline (white + orange), spec-rich sentence, two CTAs (Configure now / Learn more).
3. Ticker-style mono strip ("[ ... ] we launched").
4. Stacked rounded colour panels, one per product, each with headline, 1-2 sentence spec, same two CTAs (green kit panel, lilac panel, grey desktop).
5. Ethos block ("isn't our computer. It's yours"), parts carousel (flat-lay modules), newsletter, footer.

## Type
Graphik (600 headings, 400 body) + DM Mono + "Framework Pixel". H1 60/75, H2 48/60, body 14/20-ish; copy is plain-spoken and specific (battery hours, RAM, chipset).

## Color
Neutral light page; each product panel gets one flat pastel (sage, lilac, grey). Accent orange (#ff6b35-ish) reserved for primary CTA and headline word. Hero black.

## Layout
Edge margin ~40px; full-width rounded (~16px) panels stacked vertically; text on one half, product on the other. Flat-lay photography on solid colour: objects arranged with space, like a parts bin.

## Motion
No GSAP/Three/Lenis. 6 <video> elements (product loops). Minimal motion; works.

## Product / proof / CTA
Product = flat-lay of components (modularity shown, not told). Proof = specs, repair/guide links, Linux support. CTA pair repeated identically per panel (primary orange pill + outline pill) - consistent and findable.

## Mobile
No horizontal overflow. Hamburger/cart/logo bar; hero image first, then headline, spec paragraph, both CTAs stacked in one row. Cookie notice + floating consent button overlay.

**Steal:** (1) show modularity as a flat-lay of real parts - fits "different disciplines, one product"; (2) repeat one CTA pair identically for scanability; (3) specific numbers in the copy.
**Avoid:** (1) pastel panel stack looks like template SaaS if used with stock imagery; (2) cookie banner covering hero; (3) same-size panels without hierarchy.
Tech: no framework globals; video-heavy.
