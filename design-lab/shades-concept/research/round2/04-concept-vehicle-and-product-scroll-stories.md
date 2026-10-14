# 04. Concept vehicle and product scroll stories

Scope: web research for SHADES (planning-stage RSVP reading glasses). Read-only. No commits.

## Method limits (read first)

1. WebFetch returns extracted page text. It does not render the page. Scroll behavior, pinning, animation timing and image-sequence triggers are **not observed** unless the page text itself says so.
2. Every "Scroll mechanics" field below is therefore marked **not verified** unless noted.
3. Mercedes-Benz pages returned HTTP 403. Mercedes content below comes from search excerpts only and is marked UNVERIFIED.
4. Google Pixel fetch returned a truncated placeholder. Excluded.
5. Lucid was not searched. Not covered.

## Coverage at a glance

| # | Page | Fetch status | Concept status stated? |
|---|------|--------------|------------------------|
| 1 | Apple AirPods Pro (shipping product) | Fetched | N/A (product) |
| 2 | Apple Watch (shipping product) | Fetched | N/A (product) |
| 3 | Rivian R2 | Fetched | Yes: "Coming 2027." |
| 4 | BMW i Vision Dee (press article) | Fetched | Implicit only |
| 5 | Polestar Precept | Fetched | Yes, reframed |
| 6 | Hyundai N Vision 74 (brand journal) | Fetched | Yes, footnoted |
| 7 | Mercedes-Benz VISION EQXX | 403, search excerpts only | Yes, in excerpts |

---

## 1. Apple AirPods Pro

**1. URL:** https://www.apple.com/airpods-pro/ (fetched). Note: fetched content was labelled "AirPods Pro 3", so the live page may differ from the cache used.

**2. Hero headline (verbatim):** "The world's best in-ear Active Noise Cancellation."

**3. Concept status:** N/A. Shipping product.

**4. Section order (fetched headings):**
1. Get the highlights.
2. Take a closer look.
3. Intelligent noise control
4. Audio performance
5. Personalized listening
6. Fitness
7. IP57 dust, sweat, and water resistance.
8. Hearing Health
9. Experience
10. All-day battery life
11. Find My with Precision Finding.
12. Why Apple is the best place to buy AirPods.
13. Keep exploring AirPods.
14. AirPods Pro 3 and the environment.
15. Our values lead the way.

Arc: hero claim → product tour → features → health → environment → buy.

**5. Scroll mechanics:** Not verified. Page text references a film in the highlights area, an interactive product viewer under "Take a closer look", and animated sequences in Hearing Health and battery. Trigger and pinning not described.

**6. Visual devices:** Film, interactive product viewer, sequences (as above).

**7. Transfer to SHADES:** Use "Take a closer look" as a single interactive anatomy viewer for the glasses, instead of many small callouts.
**Dishonest for unbuilt product:** Not applicable here. The lesson is to keep spec claims footnoted (Apple does this in the source text).

---

## 2. Apple Watch

**1. URL:** https://www.apple.com/apple-watch-series-11/ (fetched).

**2. Hero headline (verbatim):** "Apple Watch"

**3. Concept status:** N/A.

**4. Section order (fetched headings):**
1. Explore the lineup.
2. Why Apple is the best place to shop Apple Watch.
3. Apple Watch essentials.
4. Make it personal. Make it pop. (band banner)
5. Made for each other.
6. Footer link groups.

Arc: catalog. No narrative arc.

**5. Scroll mechanics:** Not described in text.

**6. Visual devices:** Colour finish selector implied by product cards (Series 12 lists eight finishes). Behavior not verified.

**7. Transfer to SHADES:** Weak. Use as a **negative control**: this page is a catalog, not a story. Confirms the storytelling bar is not the Apple Watch page.
**Dishonest for unbuilt product:** N/A.

---

## 3. Rivian R2

**1. URL:** https://rivian.com/r2 (fetched).

**2. Hero headline (verbatim):** "Rivian R2" with subtitle "A Rivian designed to inspire adventurers of all kinds."

**3. Concept status (verbatim, placement):**
- Beside the starting price in "Explore the lineup": "Coming 2027."
- Footnote 1, under "Keep exploring": features and displays are "subject to change pending final production of the vehicle."

Status sits at the purchase point, plus a footnote. It is not in the hero.

**4. Section order (fetched headings):**
1. Explore the lineup
2. Benefits of being the first
3. R2 is designed for the adventurous
4. Any road, any time
5. Suspension that adapts and reacts
6. Versatile drive modes
7. Room for days
8. Take a closer look
9. Thoughtfully designed
10. Always evolving
11. Powerful features, right on your phone
12. "Hey Rivian, find coffee shops with pastries"
13. Millions of miles, hands-free
14. So much more ahead
15. Helping you stay safe out there
16. Fast charging wherever you go
17. Size it up
18. Keep exploring
19. Frequently asked questions

Arc: price and status → why first → capability → interior → software → safety → charging → sizing → FAQ.

**5. Scroll mechanics:** Not verified. Text shows no pinned or scroll-driven claim.

**6. Visual devices:** Not described in text.

**7. Transfer to SHADES:** Put "Concept, not for sale" beside any price or waitlist CTA, with a footnote on what may change. Keep the hero clean.
**Dishonest for unbuilt product:** "Coming 2027." is a dated promise. SHADES has no date, so do not borrow a year. The footnote "subject to change" is the honest part to copy.

---

## 4. BMW i Vision Dee (press article)

**1. URL:** https://www.press.bmwgroup.com/global/article/detail/T0406898EN/ultimate-companion-%E2%80%93-through-real-and-virtual-worlds:-bmw-presents-bmw-i-vision-dee-in-las-vegas?language=en (fetched). This is a press release, not a consumer product page. A consumer page was not found.

**2. Hero headline (verbatim):** "Ultimate companion – through real and virtual worlds: BMW presents BMW i Vision Dee in Las Vegas."

**3. Concept status:**
- The article never says "prototype". It does not use "concept" in the body.
- Only label: category tag "Concept Vehicles & Design", near the top.
- Body wording: "the futuristic mid-size sedan" and "vision of the future".
- Status is carried by the word "vision" and by the category tag.

**4. Section order (fetched):**
1. Headline and date (Thu Jan 05 05:15:00 CET 2023), tagged "Press Kit"
2. News ticker with three teasers
3. Category tag "Concept Vehicles & Design"
4. Press contact and author
5. Lead paragraph (Munich/Las Vegas, CES 2023)
6. Executive quotes
7. Subsections: Mixed Reality Slider; Advanced Head-Up Display; Welcome scenario; full-colour E Ink; Reductive design; Next step to NEUE KLASSE
8. Attachments (press release PDF, fact sheet PDF)
9. Media (no visible media in fetch)
10. Footer

Arc: announcement → three named features → vision → next milestone.

**5. Scroll mechanics:** Not applicable. Static press article. No scroll-driven behavior in fetched text. "Related Videos" heading shows no videos.

**6. Visual devices (described in text, not seen):**
- Mixed Reality Slider: five-step control moving from analogue to AR to virtual worlds; dimmable windows fade out reality.
- Full-width head-up display, invisible until activated.
- Phygital icons: headlights and closed kidney grille show expressions.
- Avatar projected onto a side window.
- E Ink body: 240 individually controlled segments, up to 32 colours.
- Steering-wheel spoke lights when touched.

**7. Transfer to SHADES:** The Mixed Reality Slider is a good model: one named control explained as a five-step sequence. Name the RSVP control the same way (for example, "speed dial" with steps).
**Dishonest for unbuilt product:** The article has no build status, no test data and no production statement. "Vision" does the disclaiming. For SHADES, put the word "concept" in the headline or eyebrow, not only in a category tag. Do not show the 240-segment E Ink figure as if measured.

---

## 5. Polestar Precept

**1. URL:** https://www.polestar.com/us/precept/ (fetched).

**2. Hero headline (verbatim):** "Polestar Precept" with subhead "The near future of automotive"

**3. Concept status (verbatim, placement):**
- Hero body, directly under the headline: "Polestar Precept is no conventional concept car."
- Same body: the vision "will be realized as Polestar 5."
- Second section heading: "Not a concept car, a statement car."

Status is stated in the first 2 lines, and the page then states that it becomes a production car.

**4. Section order (fetched headings):**
1. Hero (Polestar Precept / The near future of automotive)
2. Not a concept car, a statement car
3. The next step in Polestar's evolution
4. Intentional innovation
5. HMI / Infotainment's newest form
6. 3D knit / Premium with a purpose
7. Flax fiber composites / Organic technology
8. Newsletter signup
9. Footer

Arc: statement → evolution → design intent → HMI → materials → sign-up. The fetch notes some sections were elided, so the list may be incomplete.

**5. Scroll mechanics:** Not verified. Text shows no scroll-driven, pinned, or video visuals. Fetch notes each body paragraph appears twice; counted once.

**6. Visual devices:** None described in text. No numeric data callouts. Claims in text: "Made from 100% recycled PET bottles" (3D knit).

**7. Transfer to SHADES:** A short status sentence before the story, then material claims in plain text, is a clean structure.
**Dishonest for unbuilt product:** "Not a concept car" while it was a concept is a reframing move. The page is claiming a production commitment (Polestar 5). SHADES has no such commitment. Do not write "not a concept" language. Use "concept" plainly.

---

## 6. Hyundai N Vision 74

**1. URL:** https://www.hyundai.com/worldwide/en/brand-journal/mobility-solution/n-vision-74 (fetched). This is a brand-journal article, not a product page.

**2. Hero headline (verbatim):** "N Vision 74: Envisioning the Future of Hyundai Motor's High-Performance N Brand"
Metadata beneath: "6 minute read", "October 04, 2022".

**3. Concept status (verbatim, placement):**
- Opening paragraph calls it "a high-performance hydrogen electric hybrid vehicle".
- Footnote under the second paragraph defines "Rolling lab" as "a vehicle used for R&D and verification before its technology is applied to mass-produced models."
- Closing body: the design and technology "may one day be mass-produced". Neither line gives a date.

**4. Section order (fetched headings):**
1. Hero H1
2. Hyundai's development of High-Performance Vehicles and Hydrogen Fuel Cell Vehicles
3. The N Vision 74 inherits the design and heritage of the Pony Coupe concept
4. The Rolling lab, where demonstrates innovative technology that leads the time

Arc: hero → brand context → heritage → what a rolling lab is. Problem/idea/anatomy/experience/future: idea and heritage only.

**5. Scroll mechanics:** Not verified. No scroll claim in text.

**6. Visual devices:**
- Hero: side-view image.
- Image sequence (static): two sketches, one comparing against the Pony Coupe, one showing front and rear sketches.
- Specs appear only in body text: 85 kW fuel cell, 62.4 kWh battery, 0–100 km/h in under 4 seconds. No callouts.

**7. Transfer to SHADES:** The footnote defining "rolling lab" is the best honest-status device in this set. Define the prototype's role in one plain sentence, in small type, where the claim is made.
**Dishonest for unbuilt product:** Specs are stated as performance numbers for a prototype with no test data on this page. "May one day be mass-produced" is honest hedging, but the numbers read as settled. Label them "target" or "design goal" if you borrow this form.

**Search excerpts only (not fetched, UNVERIFIED):** Hyundai's newsroom excerpts say the car is "not confirmed for commercial production". Production reports conflict (limited run vs. 2030 plans). Check hyundai.news before quoting.

---

## 7. Mercedes-Benz VISION EQXX

**1. URL:** https://group.mercedes-benz.com/technology/innovation/vision/vision-eqxx.html and https://www.mercedes-benz.com/en/design/concept-cars/vision-eqxx-the-new-benchmark-of-effiency/. **UNVERIFIED.** Both returned HTTP 403 on fetch. Content is from search excerpts.

**2. Hero headline:** UNVERIFIED. Search-result page titles only: "Mercedes-Benz VISION EQXX: Redefining efficiency and range" and "Mercedes-Benz VISION EQXX: The new benchmark of efficiency".

**3. Concept status (search excerpt, paraphrase, not verbatim):** described as "a software-defined research prototype, not a production car". Official text reportedly says "not undergone type approval or homologation".

**4. Section order:** UNVERIFIED. Not seen.

**5. Scroll mechanics:** UNVERIFIED. Not seen.

**6. Visual devices:** UNVERIFIED. Not seen.

Data points from search excerpts (UNVERIFIED): range "more than 620 miles¹ (1,000 km)" with footnote; consumption under 10 kWh/100 km; drag coefficient 0.17; battery "almost 100 kWh". Excerpts conflict on power (180 kW vs about 150 kW).

**7. Transfer to SHADES:** Footnote-level caveat ("range figures are preliminary, based on digital simulations") beside a headline number is a good model. Use it for any SHADES figure such as reading speed in words per minute.
**Dishonest for unbuilt product:** Headline range is a simulation figure. Presented as a bold number, it reads as measured. SHADES speed figures must carry the same footnote.

---

## Excluded

- Google Pixel 11 Pro Fold (https://store.google.com/product/pixel_11_pro_fold?hl=en-US): fetch returned a truncated placeholder. Search excerpt only: outer screen "delivers incredibly smooth scrolling". Not a story page. Excluded.
- Lucid: not searched.

---

## Patterns

Five patterns, each with the pages that use it. Scroll-level claims are not verified for any page (see Method limits).

1. **Status at the purchase point, plus footnote.** Rivian R2 ("Coming 2027." beside price; footnote "subject to change pending final production"). Hyundai N Vision 74 (footnote defining "rolling lab"). Mercedes EQXX (caveat on range, search excerpt).

2. **Vision vocabulary carries the status.** BMW i Vision Dee ("vision", category "Concept Vehicles & Design", no "prototype"). Polestar Precept ("Not a concept car, a statement car" plus "realized as Polestar 5"). Both avoid a plain status sentence in the hero.

3. **Catalog skeleton: lineup → benefits → features → FAQ.** Rivian R2 (19 sections). Apple AirPods Pro (15 sections). Apple Watch (6 sections). Story arc is weak in all three.

4. **One named control or anatomy viewer as the story unit.** BMW Dee (Mixed Reality Slider, five steps). Apple AirPods Pro ("Take a closer look" interactive viewer, plus a film in highlights). Note: the Apple viewer's behavior is not verified.

5. **Numbers in body copy, not callouts.** Hyundai N Vision 74 (specs in body, no callouts). Polestar Precept (no numeric callouts; material claim in text). Apple Watch (health estimates footnoted). Mercedes EQXX (caveat footnote, search excerpt). None of the six fetched pages uses a data-callout device.

## Sources

Fetched (verified):
- https://www.apple.com/airpods-pro/
- https://www.apple.com/apple-watch-series-11/
- https://rivian.com/r2
- https://www.press.bmwgroup.com/global/article/detail/T0406898EN/ultimate-companion-%E2%80%93-through-real-and-virtual-worlds:-bmw-presents-bmw-i-vision-dee-in-las-vegas?language=en
- https://www.polestar.com/us/precept/
- https://www.hyundai.com/worldwide/en/brand-journal/mobility-solution/n-vision-74

Search excerpts only (UNVERIFIED page content):
- https://group.mercedes-benz.com/technology/innovation/vision/vision-eqxx.html (403 on fetch)
- https://www.mercedes-benz.com/en/design/concept-cars/vision-eqxx-the-new-benchmark-of-effiency/ (403 on fetch)
- https://www.hyundai.news/eu/articles/press-releases/hyundai-n-vision-74-a-ground-breaking-design-50-years-in-the-making.html
- https://www.polestar.com/us/news/minimise-the-compromises-polestar-precept-becomes-polestar-5/

## Next action

Fetch the Mercedes EQXX page in a browser-rendered tool (403 blocks WebFetch) to confirm the hero headline and status wording, then re-check the Patterns table.
