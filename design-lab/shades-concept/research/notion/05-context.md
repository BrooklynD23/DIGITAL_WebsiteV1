# SHADES Notion Context (verbatim findings)

Read-only pass. Pages fetched: 6. Searches run: 2 ("S.H.A.D.E.S.", "Operating Rhythm").
Personal data redacted as [PERSONAL DATA: ...].

---

## 1. SHADES (root, current)

- URL: https://app.notion.com/p/45f169473d77821fb3ad81ac68585a5c
- Last edited (`page_last_edited_at`): 2026-09-28T19:33:36.436Z
- Location: Current Initiatives and Projects - Engineering Track
- Status property: `Planned`
- Title property: `Smart Headset For Adaptive Dyslexia Enhancement System`

### Overview
- Main Activities: "SHADES is the two part Biomedical Engineering project of DIGITAL Technologies @ Cal Poly Pomona. Medical Research Explores The Usage of Rapid Serial Visual Presentation (RSVP) for Dyslexic Readers. Engineering Project Designs RSVP Heads-Up Display Glasses."

### Navigation (page titles only)
- "SHADES Project Timeline Database"
- "SoC Project Timeline"
- "Mech-E"
- "Hardware Design (PCB)"
- "Product Development Team — Project Database"

Note: no phases, dates, deliverables, metrics, team roles, or meeting cadence on this page.

---

## 2. SHADES (1), draft A (Future Initiatives)

- URL: https://app.notion.com/p/3ab169473d778034b401da3d08026644
- Last edited (`page_last_edited_at`): 2026-07-28T21:27:43.803Z
- Location: Future Initiatives & Projects
- Content: navigation/dashboard only. No SHADES text.
- Callout links (titles, verbatim): "Project Breakdown", "Background, Project Solution, Scope, Deliverables, Metrics of Success - Product Development | SHADES", "Documentation", "System on Chip Logic Design", "Product Development"
- Embedded databases: "Today's Plan", "Reservations", "Expenses", "Key Places", "Food Plan", "Photo Spots"

## 3. SHADES (1), draft B (Future Initiatives)

- URL: https://app.notion.com/p/3ab169473d77804c9d29cb8ba84000c4
- Last edited (`page_last_edited_at`): 2026-07-28T21:25:53.189Z
- Location: Future Initiatives & Projects
- Content: same layout as draft A. Only the child-page links differ (different page IDs). Not a text source.
- Difference from draft A: draft B is 2 minutes older. Draft A is the later edit.
- Difference from current root: this draft sits under "Future Initiatives", the root sits under "Current Initiatives" (Status `Planned`).

---

## 4. Background, Project Solution, Scope, Deliverables, Metrics of Success - Product Development | SHADES (older draft)

- URL: https://app.notion.com/p/a28169473d7782aeaeda01d0f96040f8
- Last edited (`page_last_edited_at`): 2026-07-28T21:25:54.235Z
- Parent: "SHADES (1)" under Future Initiatives
- Structure present: "Background", "Project Solution", "Engineering Scope" (heading only, empty).
- Missing: "Deliverables" section and any "Metrics of Success" section heading. Only success framing exists (see Metrics).

### Purpose and framing
- "SHADES therefore does not begin with the claim that RSVP has already been proven to improve dyslexic reading. It begins with a more grounded proposition: if the way text is delivered affects a reader's ability to preserve and comprehend its meaning, then engineers should be able to build a system in which that delivery is no longer fixed."
- "The result is neither a less-refined imitation of commercial smartglasses nor a predetermined clinical solution in search of supporting evidence. SHADES is the missing engineering platform between a promising method of presenting information and the research required to determine whom that method can help."
- "SHADES does not begin with the assumption that one configuration will work for every reader or that RSVP has already been clinically validated for dyslexia."

### Medical / efficacy wording (quote exactly for checking)
- "Existing research provides sufficient reason to investigate this possibility, but it does not yet establish RSVP as a validated solution for dyslexia."
- "However, this literature does not directly determine whether an adaptive RSVP system can improve comprehension for individuals with dyslexia, nor does it establish which presentation variables would be most effective for different readers."
- "A separate medical research effort will examine whether RSVP is a viable intervention for people with dyslexia and other reading-related disabilities by directly evaluating comprehension, reading speed, retention, comfort, and other relevant outcomes."
- "The role of the engineering project is to develop the functional platform through which this method can be implemented, adjusted, and eventually studied under controlled conditions."
- "A successful SHADES prototype will not establish by itself that RSVP improves comprehension for every person with dyslexia or another reading-related disability. It will establish the engineering foundation required to investigate that possibility honestly."

### Hardware described
- "At the center of this platform is an FPGA-based processing architecture."
- "The display electronics will be paired with a bird-bath optical assembly as an attainable alternative to the custom waveguides and sealed optical engines used in modern commercial smartglasses. In this configuration, light from a microdisplay is redirected by a semi-reflective beam splitter toward a curved optical element, which enlarges and returns the virtual image toward the user's eye while preserving a view of the surrounding environment."
- "The system will therefore be constructed around commercially obtainable components that expose documented electrical and communication interfaces. Microdisplays, inertial sensors, ambient-light sensors, communication modules, memory devices, and other supporting electronics can be selected from third-party manufacturers according to measurable requirements and integrated through standards such as I²C, SPI, UART, USB, or other appropriate protocols."
- "The FPGA instead serves as the open integration layer through which multiple subsystems can operate concurrently and time-dependent behavior can be controlled precisely."
- Time-sensitive functions listed for FPGA: "text buffering, RSVP pacing, display synchronization, sensor communication, and input handling".
- "Conventional processors and microcontrollers may remain better suited for tasks such as text preparation, wireless communication, application-level control, or other sequential operations."

### Phases and staging
- "Development will therefore proceed from an end-to-end proof of concept toward increasingly integrated wearable prototypes."
- "The initial system must demonstrate that text can be received, processed, paced, synchronized with a microdisplay, and viewed through the optical assembly."
- "Later iterations can improve phrase presentation, user controls, sensor integration, power consumption, thermal behavior, optical alignment, enclosure design, weight distribution, and overall wearability."

### Requirements / variables
- "Presentation speed, word and phrase grouping, display duration, font size, contrast, punctuation-sensitive pauses, and the timing between pieces of information can be modified rather than permanently embedded within a fixed reading interface."
- "User controls can allow the reader to pause, slow, accelerate, or revisit the presentation when comprehension breaks down."
- "The bird-bath system gives the team a realistic starting point from which image position, focal distance, field of view, brightness, transparency, alignment tolerance, and visual comfort can be understood before later prototypes pursue greater miniaturization."

### Team / education
- "Undergraduate students will encounter the same categories of decisions that make wearable systems difficult within industry and graduate-level research."
- No SHADES team roles or subteams stated.

---

## 5. Transcript EIYF 2026 (SHADES portion only)

- URL: https://app.notion.com/p/394169473d7780f2902dcf92a1467229
- Last edited (`page_last_edited_at`): 2026-08-04T20:14:40.080Z
- Parent: Curriculum
- Read with include_transcript: true (page is a text transcript, no meeting-note split).
- Speaker of the SHADES lines: not labeled as SHADES lead. Other speaker label in transcript: "[PERSONAL DATA: speaker name]", role stated as "project manager for BRAIN" (not SHADES).

### SHADES lines (verbatim)
- "SHADES explores wearable technology through smart glasses, combining embedded systems, PCB design, mechanical engineering, and accessibility-focused software."
- "Uh, Shades, so Shades is a smart headset for adaptive dyslexia enhancement system. Uh, so what shades is? Is that AR heads up display classes targeted for those who have reading disabilities like, uh? Dyslexia and also this will be an open source project for others to actually look at and potentially use for themselves."
- "Um, so for the first project track we have, we want to design a actual functional product prototype that actually has the augmented display glasses with the technologized text based. Then, for the second project track, we have the medical research, which is the which is a group where people will study how I don't know how that whoever RSVP (Rapid Serial Visual Presentation) is, uh, affect dyslexic readers."
- Framing line: "Today we have three major initiatives."

Note: transcript wording is informal and unreviewed. Use the root page wording for official phrasing.

---

## 6. S.H.A.D.E.S. (Operating Rhythm page)

- URL: https://app.notion.com/p/39a169473d778045bfdbef034a71da04
- Last edited (`page_last_edited_at`): 2026-07-11T01:12:43.089Z
- Icon: 👓 · Path: The Smartphone Project Database / Operating Rhythm
- Content:
  - Inline database: "Technical Projects"
  - Heading: "# Check-In"
  - Attached file: "CPPDigital_Weekly_CheckIn_Template.html"
- Meeting cadence: not stated in text. Only the template filename says "Weekly".
- Phases, dates, deliverables, metrics: none on this page.

---

## Gaps (not found in these pages)
- Deliverables list.
- Metrics of Success list.
- Team roles and subteams for SHADES.
- Dates and phase timeline (the timeline database is linked but was not in scope).
- Filled-in "Engineering Scope" section.

## Next action
1. Ask the SHADES lead for the current Deliverables and Metrics of Success text, then re-fetch the root page (`45f169473d77821fb3ad81ac68585a5c`) to confirm they are still absent.
