---
name: digital-editorial-review
description: Orchestrate independent product-design, UX-writing, and skeptical-student reviews of DIGITAL website copy and composition. Use when a section feels awkward, generic, too promotional, or visually disconnected from the actual work, especially SHADES recruitment.
---

# DIGITAL editorial review orchestrator

## Intent
Make DIGITAL read like a carefully edited technology product website, without imitating another company's slogans. Optimize for *natural information density*: the shortest phrasing that still reads comfortably, conveys concrete facts, and follows from what the visitor just saw. Don't make every sentence a tagline.

## Before any review
Read `DESIGN.md`, `docs/design/BRAND.md`, `.claude/skills/digital-natural-voice/SKILL.md`, `.claude/skills/digital-product-ux-auditor/SKILL.md` and the existing `design-taste-frontend` skill. Read the target route and adjacent chapter copy. For SHADES read `app/(apple)/_content/shades.ts`, `app/(apple)/_shades/`, `app/(apple)/_chrome/JoinChapter.tsx`, relevant styles, and `app/(apple)/_chrome/club.ts`. Verify current wording from source, not just user screenshots.

Honor `DESIGN.md` route locks and brand-voice governance. Do not change production code, locked sections, or the canonical story without explicit Head Designer approval. Don't claim user research unless conducted. Do not present planned SHADES hardware or medical benefits as established outcomes.

## Review protocol: independent passes, then synthesis
If subagents are supported, delegate **read-only** review work in parallel, non-overlapping:
1. **Product designer**: map visitor intent, visual semantics, section placement, mobile hierarchy and CTA behavior; propose structural cuts. Do not write slogans.
2. **UX writer**: audit exact words for clarity, spoken cadence, specificity, economy and truthful modality. Supply edits in their surrounding context. No invented business claims.
3. **Skeptical student**: after reading only the shown section, say what work is offered, whether one can join, and what clicking does. Record ambiguity, not preferences.

If subagents aren't available, carry out these passes sequentially and label them as analytical perspectives, not real users or independent agents.

Reconcile disagreements against actual repository evidence. Distinguish information architecture failures from sentence-level defects. Prefer simplifying the UI over clever text that explains a decorative graphic.

## Copy craft rules
- First draft in ordinary spoken language, then tighten it. Don't begin with a punchy headline formula.
- Read headline, body, role list and CTA **continuously**. If the passage sounds like four unrelated ad slogans, start over.
- Keep connective words that make speech natural. A 13-word sentence may be better than three 4-word fragments.
- Cut empty qualifications, repeated subjects, circular definitions, and anything already demonstrated above.
- Avoid AI advertising tropes: 'X meets Y', 'not just X, but Y', 'one X, endless Y', 'own a part, build the whole', 'unlock', 'elevate', 'empower', 'seamless', 'impact-driven'.
- Favor clear project labels ('Work on SHADES', 'The teams', 'Ask about joining') when a slogan would add no meaning.
- Make every CTA truthful to the destination; Discord is not an application workflow.
- Never imply a role is currently vacant, a component finalized, or a medical claim validated without evidence.

## Four acceptance gates
**Facts:** Every product, role, schedule and status statement is backed by checked source.
**Reader:** In five seconds a new visitor can explain what this section is about and how to proceed (heuristic only; test with humans if possible).
**Flow:** A cold read from preceding paragraph through CTA is natural, without repetitive metaphors, clipped fragments or doubled-up headings.
**Design:** Every graphic depicts a real information relationship and remains comprehensible on mobile, via keyboard, and with reduced motion.

If any gate fails, do not return a polished mockup as 'approved.' State the remaining issue.

## Output
1. Current excerpt and its position on the page.
2. Structural issues versus copy issues, backed by source references.
3. Independent perspectives and disagreement resolutions.
4. Three **different information architectures**, each with whole-section copy and an exact CTA label (not three tagline variations).
5. Preferred version, continuously written, with a concise explanation of why it flows.
6. Rejected alternatives and words that felt synthetic.
7. Unknown facts, accessibility/test criteria, and files affected if implementation later approved.

## Reference principles
Apple HIG writing: https://developer.apple.com/design/human-interface-guidelines/writing
Apple design principles: https://developer.apple.com/design/human-interface-guidelines/design-principles/
Product Design UX skill: https://github.com/magnus919/agent-skills/blob/main/product-design-and-ux/SKILL.md
UX writing skill: https://github.com/content-designer/ux-writing-skill
Anthropic frontend design: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md

These references inform methodology, not brand imitation.
