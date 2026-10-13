---
name: digital-natural-voice
description: Edit and audit DIGITAL website copy for natural, concise product-company writing. Use on headlines, product descriptions, recruitment text, buttons, and entire page transitions whenever copy feels awkward, robotic, corporate, slogan-heavy, or too wordy.
---

# DIGITAL natural voice — editorial skill

## Purpose
Sound like a thoughtful builder talking to an interested person. Not a corporate marketing team, campus recruitment poster, or AI copy generator. Precision without stiffness. Brevity without fragments. The best sentence is often ordinary.

This is a **review gate and rewriting process**, not a phrase generator. Reject copy when it feels unnatural even if it conforms to a word limit.

## Read first
Read `DESIGN.md`, `docs/design/BRAND.md`, the affected route's source copy, previous and following sections, `app/(apple)/_chrome/JoinChapter.tsx`, and `.claude/skills/design-taste-frontend/SKILL.md`. For SHADES read `app/(apple)/_content/shades.ts` and project components. For overall DIGITAL positioning read `app/(apple)/_content/home.ts`. Check `lib/data/involvement.ts` and `app/(apple)/_chrome/club.ts` for facts.

Protect the approved page narrative spine and locked routes. Source records trump aspirational writing. SHADES remains a planned research platform, not a clinically validated device. No invented team openings, confirmed hardware, job guarantees, partnerships, or user outcomes.

## Core editorial principle: natural information density
Write the **minimum number of words needed for a complete, comfortable reading experience**, not the fewest words technically possible. Every word should do a job; a natural connective word can be essential. Don't force every sentence into a five-word marketing headline.

Find the balance between:
- **Too little:** 'Five teams. One build. Own yours.' (choppy, cliché, vague)
- **Too much:** 'DIGITAL empowers students through unique, hands-on opportunities to gain valuable real-world experience by participating in specialized multidisciplinary teams.' (generic, padded, promotional)
- **Closer:** 'At DIGITAL, students work on specific parts of a product and help bring them together.' (natural and intelligible; verify fit and avoid restating the page)
- **Even more contextual on SHADES:** 'SHADES has teams working on FPGA timing, firmware, optics, design, and research.' (literal; improve based on whether those teams actually exist and on adjacent copy)

These are illustrative, not prescribed lines.

## Editorial audit sequence
1. **Locate purpose:** State the one reader question this particular section must answer. Read it with the immediately preceding paragraph and following CTA. Remove redundancy with the rest of the page.
2. **Truth inventory:** Separate confirmed technical details, proposed work, invitations, and unknowns. Preserve status and modality ('plans to', 'working on') accurately.
3. **First plain draft:** Write one natural full-sentence version as if explaining the work to a student at build night. Do not start with a slogan.
4. **Compress carefully:** Cut words that add no information, but retain articles, conjunctions, and transitions that help the sentence breathe. Avoid passive nominalizations and piled-up modifiers.
5. **Oral rhythm test:** Read the complete section aloud at normal conversational speed. Fix unnatural pauses, harsh line endings, forced parallels, pronouns without referents, and robotic three-beat repetition.
6. **Context test:** Does the heading lead naturally to its support line, the visual, and the next action? If not, restructure the content rather than endlessly polishing sentences.
7. **Three independent review passes:** (a) product designer checks visual-information fit; (b) UX editor checks semantics, CTA promises, rhythm and scannability; (c) skeptical student asks what they actually build and how to get involved. List disagreements and resolve against evidence.
8. **A/B alternatives:** Produce 2–3 *structurally different* versions: direct, product-specific, and editorial. Not three paraphrased taglines. Recommend one and reject weaker wording explicitly.
9. **Stop when sufficient:** If the current sentence already reads naturally, preserve it. No rewrites just for variety.

## Hard red flags
- Stacked clipped fragments: 'One product. Five teams. Your future.'
- Cleverness masquerading as clarity: 'Own a piece of tomorrow.'
- Formulaic oppositions: 'Not just X. But Y.'
- Inflated guarantees: 'Real industry experience' without defining a concrete experience.
- Hollow verbs: 'empower', 'unlock', 'elevate', 'reimagine', 'leverage'.
- Generic nouns carrying no specifics: 'opportunity', 'innovation', 'impact', 'community' alone.
- Excessive second person, repeated 'you', and forced rhetorical questions.
- Arbitrary title case or line breaks to disguise an awkward sentence.
- Forced Apple mimicry: copying brand slogans or inventing dramatic product claims.
- Calling an illustrative component diagram final hardware.
- Replacing a simple invitation with unclear metaphors ('Pick your seat').

## Compression rubric (each scored 0–2)
- **Clarity:** Can a first-time student tell what the line means immediately?
- **Naturalness:** Would a person say this without sounding rehearsed?
- **Specificity:** Is it clearly about this product and the actual work?
- **Rhythm:** Is it smooth when read alongside adjacent lines?
- **Economy:** Can another word be removed without harming meaning or rhythm?
- **Truth:** Are status, responsibility, and outcomes accurately represented?
Aim for >=10/12, with **no zero for naturalness, clarity or truth**. Scores are editorial heuristics, never claimed user-test data.

## SHADES guidance
The page already explains the reading technology. The join section must switch from *how it works* to *what students can contribute*. Prefer 'Join the SHADES team' or 'Work on SHADES' over a clever slogan when appropriate. Show project-specific areas: FPGA timing/video, Embedded C controls, optics, interaction design, and research, but do not imply finalized hardware choices or verified current openings. If the recruiting process is Discord, label it 'Ask about joining' or 'Join the Discord'; do not mislabel it 'Apply'. Meeting logistics belong below the value statement, not in a second oversized headline. Sometimes a clean list with no hero art is stronger than anonymous circles.

Example diagnosis:
- 'Own a part of SHADES. Every part above names the team that owns it.' repeats 'part' and 'owns', assumes the dots have visible labels, and sounds procedural.
- 'Subteam meetings depend on the team.' is redundant and visually overemphasized.
- 'Join the Discord to connect with the leads.' is operational; keep it close to the link, not as the selling point.

## Output contract
Return: (1) reader intent and prior-section context, (2) exact awkward phrase -> reason -> improved replacement, (3) final proposed **whole-section** copy with heading/body/roles/CTA/logistics in reading order, (4) two alternatives genuinely different in structure, (5) concise red-team critique and why the preferred version survives, (6) fact checks, file touchpoints and accessibility considerations.

Never edit production files, change the approved narrative spine, or touch locked routes without explicit authorization. A skill is not proof of empirical user testing.
