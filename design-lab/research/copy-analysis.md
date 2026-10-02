# Copy analysis: rhetorical patterns from 11 orgs, and 10 DIGITAL directions

W1-REFS · 2026-10-02. Source: scout notes (`research/scout/*.md`), screenshots, and WebFetch summaries of RC /apply,
YC /apply, ACM /about, Hack Club /clubs, MIT member companies, Launchpad /projects, Darkroom /work.
**No sentences are copied.** Every row describes a *move* (the rhetorical shape), not wording.
Voice rules: `docs/design/BRAND.md` (promise → proof → invitation; verbs over adjectives; banned filler list) and
BRIEF §40 (banned slogans). Canonical lines (`MISSION_BEATS`, `VISION_LINE`) are not restated or paraphrased here.

Orgs analysed (11): Recurse Center (RC), Hack Club (HC), Y Combinator (YC), Entrepreneurs First (EF),
darkroom.engineering (DR), Launchpad @ Berkeley (LP), ACM at UCLA (ACM), MIT Media Lab (MIT), Framework (FW),
Playdate (PD), Linear (LN).

---

## 1. Pattern tables

### 1.1 Hero rhetoric

| Move | Who | Shape | Works because | Risk for DIGITAL |
|---|---|---|---|---|
| Identity sentence | RC, LP | "[Name] is a [noun] for [specific people]." Name in accent colour, claim in bold | Tells you category + audience in one line | Generic if the noun is "community" |
| Transformation claim + footnote | YC | "[Org] turns [X] into [Y]", one italic word, footnote defines it | The footnote turns a slogan into an argument | Borrowed authority (famous quote) |
| Dictionary definition | DR | "[word], noun: 1. literal meaning 2. what we do" | Wit + positioning in a form no one else uses | Gimmick if the word has no double meaning |
| Plain product sentence | PD, FW | "This is a [noun] that does [concrete thing]." Numbers in the subline | Concrete; no adjectives needed | Needs a real artefact |
| Second-person present | HC, EF | addresses "you" doing the thing now; EF names the visitor with nothing yet | Visitor sees themselves | Teen / founder register may not fit |
| Understated claim + changelog | LN | 2-line claim, then a small "new: X" link | Shows the thing moves without hype | Needs real update cadence |

**Observation.** The strongest heroes name a *mechanism or object*; the weakest (MIT, ACM taglines) name a feeling
about the future. DIGITAL's thesis is already a *standard* ("worth putting your name on"), so the hero's proof line must
show the standard being met, not repeat it.

### 1.2 CTA structure

| Move | Who | Shape |
|---|---|---|
| One verb, repeated everywhere | RC, YC, LP | Same Apply label in nav, hero, footer. Never renamed |
| Field instead of button | HC | Email input + one-word button in the hero; repeated 3× |
| CTA pair, identical each time | FW, Vercel, LN | Filled primary + outline secondary, same labels every panel |
| Builder CTA, separate | Rive, PD, Raycast | "Use it" vs "build on it" split. Second CTA is quieter and technical |
| Three-audience exit | EF, LP, d.school | apply / stay informed / partner, in that order |
| Time-cost reassurance | RC | Says how long the application takes |

### 1.3 Project descriptions

| Move | Who | Shape | Missing |
|---|---|---|---|
| Maker-first | HC | who made it + where + "use it" link + "read the source" link | problem, disciplines |
| Method-first | LP archive | one sentence naming the technique (model type) + repo link | team, dates, outcome |
| Honest sample | DR | "a few things we liked" framing; huge title + media + one line | metadata |
| Metadata footer | MIT | headline + 2-line dek + source/date/group/tags | outcome |
| Parts not prose | FW | the object is shown as its components; specs as numbers in sentences | people |
| Claim as test story | Nothing | "we ran X for N days" instead of a spec list | — |

**Gap DIGITAL can own:** nobody in the set gives *problem + who (by discipline) + status + what's not done yet* in one
entry. The phone's 7-subsystem ownership model (`phoneV2.ts:140-300`) is exactly that content.

### 1.4 Membership copy

| Move | Who | Shape |
|---|---|---|
| One inclusive sentence, early | ACM, HC | "any background / any major / any level" said once, plainly |
| Name the empty-handed visitor | EF | Speaks to the person with no idea / no team / nothing yet |
| Mechanism of the week | RC | Describes the rhythm (weekly talks, named events) instead of "community" |
| Steps with numbers | RC (4), YC (6) | numbered process, interview length stated, decision date stated |
| Always open | RC, YC | late applications still read; "best time is now" |

### 1.5 Social proof

| Move | Who | Shape |
|---|---|---|
| Quote as prose with face chips | YC | sentences end with a 32px face, no cards |
| One big quote + cohort label | RC, EF | single real person, real batch/season |
| Counters | LP | 3 real numbers, large numerals, plain labels |
| Headlines as proof | ACM | award / competition results as news items |
| Freshness | LN, Raycast | changelog dates show activity |
| The work as proof | TE, DR | no logos, no quotes; objects + art direction |

### 1.6 Partner / sponsor messaging

| Register | Who | Shape | Fit |
|---|---|---|---|
| Transactional-honest | RC | states how the org is funded and what companies get | high: builds trust |
| Collaborative | MIT | partners "co-create"; benefits listed; money unstated | medium: sounds big for a student club |
| Thank-you wall | LP, HC | logos + thanks; HC names donors by role ("made possible by") | only when real |
| Peer framing | YC | partners described as people who did the thing first | good for mentors |
| Sponsor the tools | DR | recurring ask: fund the open-source we maintain | good once DIGITAL has public repos |

### 1.7 Recruiting language

| Move | Who | Shape |
|---|---|---|
| Dated moment | LP | named recruitment week, events with dates and rooms, deadline |
| Persistent ask | RC, YC, LP | Apply in nav at all times |
| Role-aware | Raycast, d.school | entry differs by who you are |
| Lower the bar, keep the standard | YC, EF | "too early" is fine; the bar is effort, not credentials |
| Perks ladder | HC | small rewards for shipping |

---

## 2. Patterns DIGITAL should not borrow

1. Valuation / "top 1%" authority (YC, EF): an open student org has no such proof and should not want it.
2. "Imagine…" future taglines (MIT, ACM, HC): no mechanism, close to BRIEF §40's banned slogans.
3. Logo walls and reach stats (Vercel, Rive, LP): DIGITAL has **no verified partners** (`content-inventory.md`).
4. Prize / perk ladders (HC): turns building into a reward loop. Wrong for "worth putting your name on".
5. Gradient-word headlines (HC) and all-caps body (DR, EF).

---

## 3. Ten DIGITAL copy directions extending "Make something worth putting your name on."

Rules checked for each: BRAND pillars 1-4 (declarative, verbs, imperative CTAs, no banned filler), promise ≤7 words,
reveal lines ≤9 words with the subject first, BRIEF §40 banned slogans absent, no fabricated facts.
Lines are **directions, not final copy**: they go through `brand-voice-strategist` → `brand-guardian` before production.
`[confirm]` = true only if the club confirms. `[placeholder]` = value does not exist yet.

| # | Direction (pattern + source) | Example lines | Where | Facts |
|---|---|---|---|---|
| 1 | **Signature as proof.** Turn the thesis into a visible rule: every build carries its builders' names (sign-off block). Pattern: TE/DR "the work is the proof" | Promise: *"Every build is signed."* Proof: *"Names go on the schematic, the code and the test log."* | Hero proof line or Sign-Off block | Convention needs club adoption `[confirm]` |
| 2 | **Footnoted standard.** YC footnote move applied to the word "worth": define the standard, don't decorate it | Hero: *"Make something worth¹ putting your name on."* Footnote: *"¹ Worth it: you can explain every decision in it to a stranger."* | Hero, under the thesis | No facts claimed |
| 3 | **Mechanism, not adjectives.** RC/YC move using the real ownership model (`phoneV2.ts:295-300`) | *"You take a subsystem."* / *"You own it through the test gate."* / *"Someone reviews every handoff."* | "How teams work" section; reveal-safe (one clause per line) | Real (ownership model) |
| 4 | **Different majors, one object.** Framework flat-lay + ACM lockups, said in words | Promise: *"Seven subsystems. One phone."* Proof: *"Firmware, PCB, mechanical, apps and integration each have an owner."* | Over the subsystem flat-lay | Real (7 subsystems, one-owner model); owners named only when real `[confirm]` |
| 5 | **Name the visitor with nothing yet.** EF move, BRIEF territory "Products need more than programmers" | *"No project yet? Take an open subsystem."* / *"Products need more than programmers."* | "Who can join" section | Open-subsystem list `[confirm]` |
| 6 | **Evidence over claims.** Portfolio framing for recruiters and members | Promise: *"Résumés claim it. Builds show it."* Invitation: *"Leave with work you can open on a laptop."* | Proof section or Join section | No facts claimed |
| 7 | **Honest status as proof.** Linear changelog / DR "small sample" move: say what is not done | *"Prototyping. Not shipped yet."* / *"Here is what works today."* / *"Here is what breaks."* | Every project entry's status row | Phase must match one source (`content-inventory.md` notes a conflict) `[confirm]` |
| 8 | **Project entry formula.** Problem → object → who → state, in 4 short lines (fills the gap no reference fills) | Smart Reading: *"Reading means chasing the line."* / *"These glasses hold one word still."* / *"Needs: optics, firmware, design."* / *"Status: active."* | Project index + detail headers | Real (`projects.ts:65-70`, `glasses.ts:157`) |
| 9 | **Repeated stem to chapter the page.** HC move with DIGITAL's own noun | *"Your name on the schematic."* / *"Your name on the pull request."* / *"Your name on the repair plan."* | Section eyebrows down the homepage (A, D) | Repair plan real (`phoneV2.ts:295-300`); repo `[confirm]` |
| 10 | **Dated join + separate builder CTA.** LP/RC/Rive moves; CTA echoes the thesis at the close (BRAND "don't re-list the page") | Primary CTA: *"Take a subsystem"* · Secondary: *"See the builds"* · Recruiting line: *"Subsystems open [placeholder date]."* · Closing: *"Put your name on one."* | Nav, hero, footer | Date `[placeholder]` |

### Self-check

| Check | Result |
|---|---|
| BRAND banned words (comprehensive, innovative, cutting-edge, seamless, robust, leverage, empower, elevate, unlock, journey, passionate, dedicated) | 0 used |
| BRIEF §40 banned slogans | 0 used |
| Promise lines ≤7 words | all 10 directions |
| Restates `MISSION_BEATS` / `VISION_LINE` | no |
| Copied reference wording | no |
| Invented numbers, partners, people | none; unknowns flagged `[confirm]` / `[placeholder]` |
