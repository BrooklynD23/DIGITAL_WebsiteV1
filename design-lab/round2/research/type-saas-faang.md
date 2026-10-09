# Type from SaaS/FAANG design systems (R2, W0-TYPE)

**Verdict:** for Signal Capture, use **Hubot Sans / Mona Sans / Monaspace Krypton** (GitHub). For the Apple page, use **Geist / Geist / Geist Mono** (Vercel). For SHADES reading, use **Atkinson Hyperlegible Next**. All are SIL OFL 1.1 and self-hosted, and each licence file sits next to its font.

- Trial route: `/design-lab/r2/type/`. It shows 7 stacks × 2 worlds at 1440 and 390, plus the SHADES reading block and a drop-in check.
- Renders: `design-lab/round2/references/type/{stack}-{signal|apple}-{1440|390}.png`, `reading-*.png`, `recommended-*.png` (34 files).
- Checks (`node design-lab/scripts/r2-type-shoot.mjs`): 0 console errors and 0 px overflow at both widths. All 18 trial families report `loaded`. `tsc --noEmit` is clean, and `impeccable detect --scope type` returns `[]`.
- Drop-in: `app/design-lab/r2/_system/fonts/index.ts` exports `fontSignal`, `fontApple` and `fontReading`. These are class strings that set `--font-display/--font-text/--font-mono`, along with the weight, stretch and `--track-80…17` tokens in `fonts.css`.

## 1. Catalogue (27 faces)

Licences were verified on 2026-10-02 from the GitHub licence API (`gh api repos/<r>/license`), the `google/fonts` METADATA.pb, or the owner's page. Faces marked UNVERIFIED or proprietary are not candidates.

| Face | Owner / system | Source | Licence (verified at) | Self-host on web? | Axes | Character | Apple-like-ness |
|---|---|---|---|---|---|---|---|
| SF Pro / SF Mono | Apple HIG | developer.apple.com/fonts | Proprietary. Apple-OS mock-ups only (apple-playbook §10) | **No** | wght, opsz | neo-grotesk | Reference only |
| Google Sans (classic) | Google brand | none public | **UNVERIFIED** | excluded | — | geometric-humanist | — |
| Google Sans Flex | Google, Material 3 Expressive | google/fonts `ofl/googlesansflex` | OFL 1.1 (METADATA `license: "OFL"`) | Yes | opsz 6–144, wdth 25–151, wght 1–1000, GRAD, ROND, slnt | geometric-humanist | Medium: rounder than SF, and reads as Google |
| Google Sans Code | Google | googlefonts/googlesans-code | OFL 1.1 (API) | Yes | wght 300–800 | humanist mono | — |
| Roboto Flex | Google, Material 3 | googlefonts/roboto-flex | OFL 1.1 (API) | Yes (next/font) | 13 axes incl. opsz, wdth, GRAD | neo-grotesk | Medium-low: reads as Android |
| Roboto Mono | Google | google/fonts `ofl/robotomono` | OFL 1.1 (METADATA) | Yes | wght | grotesk mono | — |
| Mona Sans | GitHub, Primer brand | github/mona-sans | OFL 1.1 (API) | Yes | wdth 75–125, wght 200–900 | neo-grotesk | Medium-high at wdth 100 |
| Hubot Sans | GitHub | github/hubot-sans | OFL 1.1 (API) | Yes | wdth 75–125, wght 200–900 | technical grotesk | Low: deliberately mechanical |
| Monaspace (Krypton, Neon…) | GitHub Next | githubnext/monaspace | OFL 1.1 (API) | Yes | wght 200–800, wdth 100–125, slnt | 5 mono voices; Krypton is mechanical | — |
| Geist | Vercel, Geist DS | vercel/geist-font | OFL 1.1 (API) | Yes | wght 100–900 | Swiss neo-grotesk | **High** |
| Geist Mono | Vercel | vercel/geist-font | OFL 1.1 (API) | Yes | wght 100–900 | grotesk mono | — |
| Segoe UI Variable | Microsoft Fluent | learn.microsoft.com/typography | Proprietary. "Download: N/A – exclusively included with Microsoft products"; web use needs a Monotype licence | **No** (only a paid Monotype licence) | wght, opsz | humanist | Medium |
| Cascadia Code / Mono | Microsoft | microsoft/cascadia-code | OFL 1.1 (LICENSE text; the API says NOASSERTION) | Yes | wght | mono | — |
| Optimistic | Meta (Dalton Maag) | fontsinuse / Meta dev docs | Proprietary commission, no public licence | **No** | wght, opsz | humanist grotesk | — |
| Amazon Ember | Amazon (Dalton Maag) | press / Fonts In Use | Proprietary, Amazon-only | **No** | static | humanist | — |
| Netflix Sans | Netflix (Dalton Maag) | Netflix press 2018 | Proprietary, internal only | **No** | static | geometric | — |
| Uber Move | Uber Base (MCKL) | base.uber.com, mckltype.com | Proprietary, Uber-only | **No** | static | grotesk | — |
| Airbnb Cereal | Airbnb DLS (Dalton Maag) | Airbnb 2018 launch | Proprietary | **No** | static | geometric | — |
| Spotify Mix | Spotify (Dinamo, 2024) | abcdinamo.com/news/spotify | Proprietary commission | **No** | wdth, wght | humanist-grotesk | — |
| Söhne | Stripe (Klim) | klim.co.nz/licences | Commercial. Klim web licence from USD 60 per style, min tier 20k views/mo | Only if paid | static | grotesk (Akzidenz lineage) | High, but paid |
| Inter / Inter Display | Linear; Shopify Polaris (`--p-font-family-sans: 'Inter'`) | rsms/inter | OFL 1.1 (API) | Yes (next/font) | opsz 14–32, wght 100–900 | neo-grotesk | **Highest** (closest to SF metrics) |
| Atlassian Sans / Mono | Atlassian DS (GA Sep 2025) | atlassian.design | **UNVERIFIED**: derived from Inter / JetBrains Mono, but no licence published | excluded | — | neo-grotesk | — |
| JetBrains Mono | JetBrains | JetBrains/JetBrainsMono | OFL 1.1 (API) | Yes | wght 100–800 | mono | — |
| IBM Plex Sans / Mono | IBM Carbon | IBM/plex | OFL 1.1 (API) | Yes | wght (Sans), static mono | grotesk with humanist cuts | Low-medium; it is the current prod face |
| Red Hat Display / Text / Mono | Red Hat brand | RedHatOfficial/RedHatFont | OFL 1.1 (API) | Yes (next/font) | wght | geometric grotesk | Medium |
| Mozilla Headline / Text | Mozilla 2025 brand (Studio DRAMA) | google/fonts `ofl/mozillaheadline`, `ofl/mozillatext` | OFL 1.1 (METADATA) | Yes | Headline wdth 75–100 + wght 200–700; Text wght 200–700; **uniwidth** (measured: same advance at 300/600/900) | quirky grotesk | Low |
| Atkinson Hyperlegible Next / Mono | Braille Institute | googlefonts/atkinson-hyperlegible-next | OFL 1.1 (API) | Yes | wght 200–800 | legibility grotesk | n/a (reading) |
| Lexend | Google Fonts / Lexend project | googlefonts/lexend | OFL 1.1 (API) | Yes (next/font) | wght 100–900 | wide geometric | n/a (reading) |
| Intel One Mono | Intel | intel/intel-one-mono | OFL 1.1 (API) | Yes | static | low-vision mono | — |
| Source Sans 3 | Adobe (Spectrum uses the proprietary Adobe Clean) | adobe-fonts/source-sans | OFL 1.1 (API) | Yes | wght | humanist | Medium |

On the impeccable reflex list: Inter-as-display and IBM Plex appear in the catalogue but not in the recommendation. Inter was trialled as the SF benchmark, and Plex is the current prod face, which the Head Designer called "not too nice".

## 2. Shortlist trialled (all OFL, self-hosted)

The trial ran 7 stacks: **GitHub** Hubot/Mona/Krypton, **Vercel** Geist/Geist/Geist Mono, **Google** Sans Flex/Sans Flex/Sans Code, **Inter** Display/Inter/JetBrains Mono, **Material** Roboto Flex/Roboto Flex/Roboto Mono, **Red Hat** Display/Text/Mono and **Mozilla** Headline/Text + Geist Mono. Reading was compared across Atkinson Hyperlegible Next, Lexend and Mona Sans (control).

Delivery: next/font/google for Inter, Roboto Flex/Mono, JetBrains Mono, Red Hat and Lexend. The others are missing from Next 14.2's font list, so they are next/font/local woff2 files (Latin subsets fetched from Google Fonts, Monaspace from the v1.400 release) with their OFL text beside them.

## 3. Verdicts from the renders

| Stack | Signal (dark graticule) | Apple (light) | Verdict |
|---|---|---|---|
| **GitHub** Hubot 700 wdth 108 / Mona / Krypton | Strongest identity in the set. The wide mechanical caps (SIDEKICK, SHADES, BRAIN) read as instrument-panel labels, and Krypton readouts look like a scope's channel strip. The 40/44 hero holds at 390 | Too heavy and too wide for Apple's restraint | **Signal pick** |
| **Vercel** Geist 600 / Geist / Geist Mono | Clean but neutral; it adds no instrument voice | The most "Apple played straight": tight 80 px hero, the 21 px grey 600 lead reads like apple.com. Body needed tracking 0 (at −0.004em "17, Room" crowded) | **Apple pick** |
| **Google** Sans Flex / Sans Code | Warm and friendly; too soft for a scope | Very good. Opsz 144 is already tight, so −0.02em collided at 80 px and −0.01em fixed it. Reads unmistakably as Google | Runner-up (Apple) |
| **Inter** Display / JetBrains Mono | Fine and generic | The closest SF Pro Display analogue in shape and rhythm | Rejected: reflex font, and the default across Linear, Polaris and Atlassian, so it carries no DIGITAL signal |
| **Material** Roboto Flex / Roboto Mono | Opsz 144 turns the hero condensed, which reads as Android | 12 px footnote shows a spacing gap ("Knowled gebase") | Rejected |
| **Red Hat** Display / Text / Mono | At weight 600 it still renders light and soft (measured: the weight axis works; the design is just low-contrast) | Pleasant, rounded, corporate | Rejected: too soft for both worlds |
| **Mozilla** Headline / Text | Quirky ink-trap grotesk with real voice | Sturdy, but the voice fights Apple neutrality | Rejected for now. Note: it is **uniwidth**, so a weight change never reflows. That is a useful trick for hover and state weight shifts |

## 4. Recommendations

### Signal Capture → Hubot Sans 700 (wdth 108) / Mona Sans 400 / Monaspace Krypton 500
- **Why no other face did the job:** it is the only stack where one family's width axis covers both the wide channel marks and normal-width text, and its mono is drawn as a *mechanical* voice instead of a code font. Geist and Inter look like software, Google Sans looks friendly, and Red Hat looks soft. The three faces are one designed family (GitHub), so they align without tuning.
- **Licence:** OFL 1.1 ×3 (github/hubot-sans, github/mona-sans, githubnext/monaspace).
- **Cost:** Hubot is 93 KB and Mona 98 KB (Latin, wdth+wght). **Krypton is 445 KB unsubset, so it must be subset before production.** Option: request `fonttools` + `brotli` as a dev-only tool (`pyftsubset --unicodes=U+0000-00FF,U+2000-206F,U+00D7`). Fallback: Geist Mono, 23 KB.

### Apple page → Geist 600 / Geist 400 / Geist Mono 500
- **Why no other face did the job:** it matches Inter's SF-like render at 80/56/28 with weight 600 untouched, without being the generic SaaS default. One 29 KB variable file serves both display and text, as SF does at Apple. Google Sans Flex came close but reads as Google's own brand.
- **Risk:** Geist is the create-next-app default, so it is common on Next.js sites. The Apple world's identity has to come from layout and imagery, which is how Apple works too.
- **Licence:** OFL 1.1 (vercel/geist-font).

### SHADES reading → Atkinson Hyperlegible Next 400
- **From the render:** it has the clearest confusable set (I has serifs, l has a tail, 0 is distinct from O, and 1 is distinct from I and l). The RSVP word "putting" stays crisp at 56 px on the dark scope. Lexend reads well and wide, but its I and l are both plain bars. Mona Sans fails I/l/1.
- **Evidence, stated honestly (no medical or efficacy claims):**
  - Atkinson was designed for **low-vision** readers (Braille Institute), not for dyslexia.
  - Lexend's fluency gains come from its creator's small studies (e.g. 20 pupils) and have not been replicated at scale.
  - Specialised dyslexia fonts showed no benefit in controlled tests (OpenDyslexic: Wery & Diliberto 2017, PMC5629233).
  - The better-supported lever is **spacing**: the BDA style guide recommends sans-serif at 16–19 px, wider letter and word spacing, and 1.5 line height, and extra-large letter spacing helped in Zorzi et al. 2012 (PNAS).
  - So SHADES should ship Atkinson plus an optional "more spacing" setting (`--reading-spaced-*` tokens: +0.05em letters, 0.16em words, 1.5 leading), not a "dyslexia font".
- **Licence:** OFL 1.1 (googlefonts/atkinson-hyperlegible-next).

## 5. Tracking needs (re-verified at real size; values live in `_system/fonts/fonts.css`)

| Size | Signal (Hubot/Mona) | Apple (Geist) | Note |
|---|---|---|---|
| 80 hero (40 mobile) | −0.02em | −0.035em | Geist needs the tighter value to match Apple's density. Floor is −0.04em |
| 56 / 48 | −0.015em | −0.03em | |
| 28 / 21 sub | −0.005em | −0.015em | |
| 21 lead | +0.006em (light on dark) | −0.004em | Apple lead uses weight 600 in grey #6e6e73 |
| 17 body | +0.006em | 0 | Negative tracking crowded the numerals |
| 12–13 mono readouts | +0.04em | +0.04em | Keep mixed case: uppercase-transform broke "KiCad" |

Lone display numerals use proportional figures. Tabular figures left a gap after "3" in "3 boards".

## 6. Rejected highlights
- **SF Pro:** licence forbids web use. **Söhne:** paid per-style Klim licence. **Segoe UI Variable:** Monotype-only web licence.
- **Atlassian Sans:** licence unpublished (UNVERIFIED). **Optimistic, Ember, Netflix Sans, Uber Move, Cereal, Spotify Mix:** proprietary commissions.
- **Inter:** reflex font and the SaaS default. **Roboto Flex:** reads as Android, with a small-size spacing glitch. **Red Hat:** too soft. **Mozilla:** voice fights both worlds.

## 7. Files
- Trial: `app/design-lab/r2/type/{page.tsx,layout.tsx,fonts.ts,stacks.ts,type.module.css}`.
- Fonts: `app/design-lab/r2/_system/fonts/{index.ts,fonts.css,<family>/*.woff2 + OFL.txt|LICENSE.txt}` (10 families).
- Scripts:
  - `design-lab/scripts/r2-type-shoot.mjs` (panels, errors, font status)
  - `r2-type-weights.mjs` (proves the weight axes render)
  - `r2-type-probe.mjs` (computed family and weight)
  - `r2-type-uniwidth.mjs` (Mozilla weight sample)

Sources:
- Licences: [vercel/geist-font](https://github.com/vercel/geist-font), [github/mona-sans](https://github.com/github/mona-sans), [github/hubot-sans](https://github.com/github/hubot-sans), [githubnext/monaspace](https://github.com/githubnext/monaspace), [rsms/inter](https://github.com/rsms/inter), [google/fonts](https://github.com/google/fonts), [Atkinson Next](https://github.com/googlefonts/atkinson-hyperlegible-next), [Lexend](https://github.com/googlefonts/lexend).
- Proprietary and commercial faces: [Segoe UI](https://learn.microsoft.com/en-us/typography/font-list/segoe-ui), [Klim licences](https://klim.co.nz/licences/), [Atlassian typography](https://atlassian.design/foundations/typography/product-typefaces-and-scale), [Polaris font tokens](https://polaris-react.shopify.com/tokens/font), [Uber Move](https://www.mckltype.com/custom/uber), [Netflix Sans](https://www.engadget.com/2018-03-21-netflix-custom-typeface-netflix-sans.html), [Spotify Mix](https://abcdinamo.com/news/spotify), [Amazon Ember](https://fontsinuse.com/typefaces/167735/amazon-ember), [Optimistic](https://fontsinuse.com/typefaces/180257/optimistic).
- Reading evidence: [BDA style guide](https://www.thedyslexia-spldtrust.org.uk/media/downloads/69-bda-style-guide-april14.pdf), [OpenDyslexic study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5629233/).
