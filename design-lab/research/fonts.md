# Fonts — W1-SYSTEMS type lab

**Verdict:** top picks by direction. A = Zodiak/Switzer. B = Plex Sans Condensed/Plex. C = Clash Display/General Sans. D = Fraunces/Figtree. E = Cabinet Grotesk/Satoshi. F = Bricolage Grotesque (narrow)/Departure Mono. Fontjoy rejected as a method.

- Route: `/design-lab/type-lab` (11 pairings, same layout/colours, real copy from `lib/data/homeLanding.ts`, `projects.ts`, `mission.ts`).
- Renders: `design-lab/renders/type-lab/panels/d-p0…p10.png` (1440), `m-p0/p1/p5/p8.png` (390), full pages `typelab-{desktop,tablet,mobile}.png`, zoom `zoom-p4-body.png`.
- Checks: 0 console errors at 1440 and 390. 0px horizontal overflow at both. `tsc --noEmit` clean. All 17 next/font families and 7 Fontshare families report `loaded`.

## Sources and licenses

| Source | How it was used | License reality |
|---|---|---|
| Google Fonts | `next/font/google` in `app/design-lab/type-lab/fonts.ts` | SIL OFL 1.1: self-hosted by next/font, safe for static export |
| Fontshare | One `<link>` per family to `api.fontshare.com/v2/css` (scoped `layout.tsx`) | **ITF Free Font License (FFL)**: free for commercial use, but **no redistribution or font serving**. Production should keep using Fontshare's CDN, not commit the files |
| Fontesk | Departure Mono (listed on Fontesk as OFL; file taken from the official GitHub release v1.500, self-hosted via `next/font/local`). Instrument Serif and Bricolage Grotesque are also listed there | Per-font. Fontesk mixes OFL with "free for commercial use" custom EULAs, so check each font |
| Fontjoy | Headless run on 2026-10-02: 13 generations captured (below). Run #10 rendered as a control | Outputs are Google Fonts (OFL/Apache) |

**Fontjoy, 13 runs:** Montserrat/Lora/Hind Madurai · Alegreya/Overpass/Biryani · Source Serif Pro/Esteban/Ek Mukta · Raleway/Pridi/Palanquin · Vollkorn/Cormorant SC/Metamorphous · Merriweather/Cormorant/Glegoo · Roboto/Yantramanav/Source Sans Pro · Quattrocento Sans/Rajdhani/Heebo · PT Mono/Yanone Kaffeesatz/Martel · Merriweather Sans/Muli/Kanit · Khand/Averia Gruesa Libre/Nunito Sans · **Arimo/Fira Sans Condensed/Martel** · Hind/Meera Inimai/Anaheim. These are 2010s Google staples, and the tool has no mono slot.

## Verdicts (judged from the renders, not from specimens)

| # | Pairing (display / body / mono) | Fit | Verdict from render |
|---|---|---|---|
| 00 | Newsreader / IBM Plex Sans / Plex Mono (current prod) | Control | Calm and literate. The italic second line gives the thesis a signature. It reads like a university press, which drifts toward the "university department" anti-target. Keep as the safe fallback |
| 01 | **Zodiak** 400 / **Switzer** / JetBrains Mono | **A** | Highest-contrast serif in the set: crisp, fashion-editorial, clearly not SaaS. The 100% / 25+ numerals have character. Switzer is a neutral, tight text face at 17px. **Best A** |
| 02 | Instrument Serif / Instrument Sans / Spline Sans Mono | A-alt, E accent | Condensed serif stacks four tight lines with big impact per width, and the italic is elegant. Spindly at 40px H2, so use it ≥56px only. Very common on 2024–26 startup sites (trend risk) |
| 03 | **IBM Plex Sans Condensed** 600 CAPS / Plex Sans / Plex Mono | **B** | Blunt, spec-sheet, documentation-grade, and the whole family stays continuous with the current mono. A five-line all-caps hero is heavy; use caps for ≤3 lines. Risk: generic industrial if the grid is weak |
| 04 | Archivo wdth 125 / Archivo / JetBrains Mono | B-alt, E | Wide and loud, with automotive/startup energy, but "worth" orphans at 1440. **Body defect:** Archivo (variable, wdth axis) shows loose spacing after "f" at 17px ("f ully", "f rom"; see zoom). Display only |
| 05 | **Clash Display** 600 / **General Sans** / Martian Mono | **C** | Strongest poster punch of the geometric sans. At −0.02em letters collided; −0.01em fixed it. Martian Mono is wide, so labels run long. Risk: heavily used on agency/Awwwards templates |
| 06 | **Fraunces** (SOFT 100, WONK 1, opsz 144) / **Figtree** / Plex Mono | **D** | The warmest result: soft terminals, bouncy italic, friendly "4". Figtree is approachable and very readable. Overuse tips it into café branding, so pair it with a hard grid |
| 07 | **Cabinet Grotesk** 800 / **Satoshi** / JetBrains Mono | **E** | Most "credible startup studio" of the set. Compact and confident, with stat numerals that carry a metrics row. Satoshi body is clean. **Best E** |
| 08 | **Bricolage Grotesque** (opsz 96, wdth 75) 800 / Bricolage text / **Departure Mono** | **F** | The most distinctive render. Glyphs collided at −0.03em; −0.005em fixed it. Ink-trap quirks plus the pixel mono read as "made by people who build things". Holds at 390px |
| 09 | Tanker CAPS / Switzer / Departure Mono | F-alt | Poster/sports energy, loud. Can read as streetwear or gaming. Spot use only (one moment per page) |
| 10 | Fontjoy control: Arimo / Fira Sans Condensed / Martel | Rejected | Arimo is an Arial-metric clone, so the hero looks default. The condensed Fira body and a serif accent in the mono slot clash. This confirms Fontjoy is not a fit for this brand |

## Rules derived from the renders
1. Tracking is part of the pairing. Clash and Bricolage both broke at the tight tracking their marketing specimens suggest. Re-verify at the real size.
2. Keep display faces ≥40px on mobile (clamp floor). The 40px floor held for all 11 pairings at 390px with no overflow.
3. Use one display voice per page. Serif-italic emphasis (p0, p2, p6) works only on the second line of the thesis, never as a pattern.
4. Prefer OFL for production. Fontshare FFL means a third-party CDN `<link>`, which conflicts with DESIGN.md §8 "via next/font, never raw `<link>`" and needs a Head Designer exception.

## Flags
- **Doc/code drift:** DESIGN.md §8 names **Source Serif 4** as the promise serif, but `lib/fonts.ts` loads **Newsreader**. One of them needs reconciling.
- **Fontshare API bug (2026-10-02):** combining families or static weights in one request (`f[]=a@400,500&f[]=b@…`) dropped or swapped families. Workaround: one stylesheet per family with variable cuts (`@1`, `@2` italic), as in `fonts.ts`.
- Mono picks are interchangeable across sans pairings. JetBrains Mono, Plex Mono and Spline Sans Mono all rendered cleanly at 10–12px caps.

Sources: [Fontshare](https://www.fontshare.com), [Fontshare OFL page](https://fontshare.com/licenses/sil-ofl), [Fontesk — Departure Mono](https://fontesk.com/departure-mono-font/), [Departure Mono release](https://github.com/rektdeckard/departure-mono/releases), [Fontjoy](https://fontjoy.com), [Google Fonts](https://fonts.google.com).
