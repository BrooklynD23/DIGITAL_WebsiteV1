# Vercel — https://vercel.com
Category: dev infrastructure. Shots: design-lab/references/vercel/
Why good: extreme restraint; one geometric mark animates as the hero; proof is a logo wall plus named case-study frames with real numbers.

## Narrative
1. Slim nav (Products / Resources / Enterprise / Pricing; Get a Demo / Log In / Sign Up) + event banner ("Ship 26 ...").
2. Hero: left-aligned 2-line H1, two CTAs, centre WebGL triangle, right a 3-line vertical text list of audiences.
3. Logo wall (Meta, Schwab, DoorDash, OpenAI, SpaceX, ...) edge to edge in one row.
4. Large H2 sections each followed by an embedded customer-site screenshot frame (Zapier, Mintlify) with stat row (450K+ agents, 9,000+ integrations).
5. Feature index list ("Features": Global Delivery, Serverless Functions...), closing CTA.

## Type
Geist Sans (+ Geist Mono + Geist Pixel family of 5 variants used as texture). H1 64px/64 -3.84px (-6%); H2 56/56 -3.36px; body 14/20. Weight 400-450: heavy tracking squeeze does the work, not boldness.

## Color
bg #fafafa, fg #171717, black buttons. Zero accent colour in the page chrome; colour comes from customer screenshots.

## Layout
24px outer margin, flush-left; grid of thin hairline cells; generous whitespace around the single hero shape.

## Motion
WebGL canvas (hero shape rotates/reflects light), logo row marquee, scroll-reveal frames. Helps: one focal animation only. Mobile: shape kept, scaled with soft shadow.

## Product / proof / CTA
Proof = recognisable logos + stat numbers + named customer sites. CTAs: filled pill (primary) + outline pill (secondary), repeated.

## Mobile
No overflow. Hamburger, banner kept, triangle then H1 then stacked full-width CTAs, logos start a horizontal ticker. Note: a scrambled-text effect ("tdkyexsensaigents") was mid-animation in the capture - text-scramble should resolve instantly under reduced motion.

**Steal:** (1) one focal animated object, not many; (2) heavy negative tracking on a light-weight display face; (3) numbers beside proof frames.
**Avoid:** (1) logo walls of companies we have no relationship with (we need real partners only); (2) chrome with no accent - needs a point of view for DIGITAL; (3) text scramble without reduced-motion guard.
Tech: Next.js, WebGL canvas, Geist fonts (GSAP/Lenis not detected).
