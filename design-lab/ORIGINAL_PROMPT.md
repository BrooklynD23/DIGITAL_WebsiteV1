# MASTER DESIGN ORCHESTRATOR — ORGANIZATION WEBSITE REDESIGN

> Verbatim copy of the user's original orchestration prompt (session 1, 2026-10-02).
> The executable plan derived from it is `design-lab/ORCHESTRATION.md`. Section numbers (§N) below are referenced there.

You are the LEAD DESIGN ORCHESTRATOR responsible for exploring a major redesign of the existing organization website.

This is NOT yet an implementation task.

Your job is to build an experimental design laboratory around the existing repository, install and configure the relevant design/prototyping tools described below, delegate independent design directions to specialized subagents, render working mockups, critique them, iterate on them, and then present several materially different directions for USER REVIEW.

The user makes the final design decisions.

DO NOT replace the production website until explicit approval is given.

---

# 0. CORE WORKFLOW

Follow this pipeline:

```
EXISTING WEBSITE
      ↓
Repository + brand audit
      ↓
Design-tool/environment setup
      ↓
Reference/research extraction
      ↓
Parallel independent design agents
      ↓
Multiple interactive prototypes
      ↓
Automated screenshots/renders
      ↓
Design critique agents
      ↓
Refinement pass
      ↓
Comparison gallery
      ↓
USER REVIEW
      ↓
Selected / hybrid direction
      ↓
Design system specification
      ↓
ONLY THEN implementation planning
```

The biggest failure condition is prematurely converging on one design.

We explicitly want experimentation.

---

# 1. NON-DESTRUCTIVE MODE

Treat the existing repository as production.

Before doing anything:

1. inspect git status
2. understand repo structure
3. understand current branch
4. locate frontend architecture
5. identify current design system
6. identify reusable components
7. identify existing brand assets
8. inspect responsive behavior
9. inspect existing copy/content
10. inspect current dependencies

DO NOT overwrite current pages.

Create a dedicated experimental workspace such as:

/design-lab
/design-experiments
/mockups

Prefer isolated routes/apps where practical.

Example:

```
/design-lab/
    audit/
    research/
    references/
    systems/
    concepts/
    renders/
    critiques/
    comparison/
    assets/
```

If git worktrees or isolated branches make sense, use them.

Each major concept should remain separately recoverable.

---

# 2. FIRST: DISCOVER AVAILABLE SKILLS / PLUGINS / MCP SERVERS

Before manually implementing functionality, inspect the environment for:

- Claude Code skills
- installed plugins
- MCP servers
- slash commands
- project-specific agents
- DESIGN.md resources
- browser tools
- screenshot tools
- rendering tools
- image-generation integrations
- OpenRouter integrations
- Gemini integrations
- Blender integrations
- frontend design skills
- Vercel design skills

Do not assume a tool exists simply because it is named in this prompt.

For EACH tool below:

1. verify what the real project/tool is
2. verify the canonical repository/documentation
3. determine whether it is compatible with this environment
4. install/configure it if appropriate and safe
5. record exactly what was installed
6. record version/source
7. document how the design agents should use it

NEVER fabricate an installation.

If a referenced tool has changed names, determine the current equivalent.

Create:

design-lab/tooling-audit.md

with:

| Tool | Found | Installed | Version | Purpose | Agent usage |
|------|------|------|------|------|------|

---

# 3. TOOLS / METHODS FROM THE USER'S REFERENCE MATERIAL

The following concepts came directly from the user's collected design references.

Investigate ALL OF THEM.

They do not all have to end up in the final website.

The goal is to build the strongest possible design/prototyping environment.

---

## A. CLAUDE DESIGN WORKFLOW

The collected references recommend treating Claude Design as a serious prototyping environment.

Important practices:

### Design systems first

Start with a design-system definition rather than individual components.

Use available design-system capabilities to establish:

- typography
- colors
- spacing
- grid
- border system
- radii
- component primitives
- motion language
- iconography
- responsive rules

Extract usable context from:

- current website
- screenshots
- existing decks
- current brand material
- reference websites

The reference specifically recommends supplying as much design context as possible.

---

### Claude Design Shortlisting

Where practical:

Give design/research agents galleries or reference collections and ask them to shortlist roughly 3 systems that best match the organization's positioning.

Do not simply choose one design system automatically.

Document why each reference was selected.

---

### Fonts

Investigate free typography resources such as:

- Fontshare
- Fontesk
- Fontjoy

Explore stronger alternatives to generic SaaS typography.

Test actual pairings in rendered mockups.

Do not choose fonts solely from theoretical descriptions.

---

### Competitor copy analysis

Study approximately five or more strong organizations/products in adjacent categories.

Extract their:

- hero rhetoric
- CTA structure
- project descriptions
- membership copy
- social proof
- partner messaging
- recruiting language

Do NOT copy their wording.

Derive rhetorical patterns.

Use those findings to avoid generic AI-generated copy.

---

### Mixing design systems

The reference encourages mixing selected aspects from multiple strong systems.

This is permitted, but only intentionally.

Example:

Typography principles from System A
+
spacing/grid from System B
+
interaction model from System C

must become ONE coherent system rather than a Frankenstein UI.

---

# 4. SUPERDESIGN

Investigate and install/configure Superdesign if compatible:

https://github.com/superdesigndev/superdesign

Use it as an additional design exploration tool.

The reference specifically associates it with improving:

- typography
- whitespace
- hierarchy
- visual choice
- overall polish

Have at least ONE subagent experiment with Superdesign.

Do not force all agents to use it.

---

# 5. AWESOME DESIGN.md

Investigate the Awesome DESIGN.md ecosystem/collection referenced by the screenshots.

The concept is:

Curated DESIGN.md specifications based on deeply analyzed developer-focused websites.

Use these as design knowledge and constraints rather than blindly copying a site.

Have a research agent inspect applicable DESIGN.md references and identify:

- layout rules
- typography systems
- token structures
- interaction principles
- density
- whitespace
- composition rules
- navigation behavior

If useful, create our own:

DESIGN.md

for the organization after prototype exploration.

Do NOT write the final DESIGN.md before experimentation.

The final document should describe the approved visual language.

---

# 6. VERCEL WEB DESIGN GUIDELINES / DESIGN AUDIT SKILL

Investigate the current Vercel web-design/design-guideline skill referenced by the user.

Use it primarily as an AUDITOR.

Have it critique mockups for:

- hierarchy
- spacing
- responsiveness
- typography
- accessibility
- interaction clarity
- component consistency
- layout quality
- UX conventions

Do not let an audit tool homogenize every concept into the same design.

Each prototype may intentionally break conventions if justified.

---

# 7. TASTE SKILL

Investigate the "Taste" design skill referenced by the user.

The user wants it included in the experimentation stack.

Determine:

- canonical project
- installation mechanism
- what aesthetic/design analysis it provides
- compatibility with Claude Code

If available and appropriate, install it.

Have at least one critic agent use Taste when evaluating prototypes.

Do not invent commands or packages if the tool cannot be verified.

---

# 8. ARIA ICONS

Investigate Aria Icons or the corresponding icon-search tooling referenced in the screenshots.

Reference description:

A searchable system providing access to a very large collection of SVG icons and tools to:

- retrieve
- customize
- add
- migrate icons
- work across icon collections/projects

Use icon tooling to create a coherent icon language.

RULE:

Do not mix arbitrary icons from six unrelated libraries.

Evaluate icon families by:

- stroke width
- corner geometry
- optical size
- visual weight
- friendliness vs technicality
- brand fit

---

# 9. MOTION.DEV / MOTION DESIGN

Install/use Motion where appropriate.

The redesigned site should explore meaningful motion.

Possible interactions:

- staggered content reveals
- project-card expansion
- shared-layout navigation
- scroll-linked transitions
- interactive project storytelling
- masked transitions
- navigation morphing
- section transitions
- hover feedback
- responsive microinteractions

Use motion intentionally.

Avoid:

- constant movement
- gratuitous parallax
- endless floating blobs
- animation that delays access to information

Honor:

prefers-reduced-motion

---

# 10. PROCEDURAL MOTION GRAPHICS PIPELINE

The user's references describe a workflow where Claude acts as a PROCEDURAL ANIMATOR rather than a conventional video generator.

Explore this workflow.

Possible stack:

```
Claude / Opus
    ↓
programmatic scene generation
    ↓
Remotion / React
or
HTML5 Canvas
or
Three.js
    ↓
explicit animation timelines / keyframes
    ↓
headless Chromium
    ↓
frame rendering
    ↓
FFmpeg
    ↓
high-quality video output
```

Use this when exploring:

- hero animations
- project explainers
- launch animations
- brand motion system
- website demo reel
- dynamic design previews

Claude should control:

- typography
- timing
- composition
- easing
- camera
- layout
- frame-level changes

Prefer deterministic programmatic animation where appropriate.

---

# 11. MOTION SHOWREEL EXPERIMENT

The references also include this motion-design concept:

> Make a dynamic ~15-second motion graphics video demonstrating strong motion design. First inspect the product/site to understand it, then create the content rather than relying on supplied copy.

Adapt that process.

Assign one subagent:

MOTION-BRAND-AGENT

Task:

Create a short procedural motion concept for the organization.

It should communicate:

MAKE SOMETHING WORTH PUTTING YOUR NAME ON.

Potential narrative:

student
→ disciplines combine
→ project forms
→ real artifact emerges
→ ownership / portfolio / identity

Render it if the environment supports doing so.

This is an EXPERIMENT.

Do not make the final website dependent on a video.

---

# 12. OPENROUTER / MULTI-MODEL CRITIQUE LOOP

The reference suggests using Claude as an orchestrator capable of calling specialized models through OpenRouter.

If the user/environment already provides an appropriate API connection:

evaluate whether using it improves the workflow.

Possible division:

Claude/Opus:
- creative direction
- coding
- orchestration

Image model:
- visual assets
- concept art
- background textures

Video-capable model such as current Gemini model:
- inspect rendered prototype video
- critique motion
- identify visual defects

DO NOT expose or print API keys.

DO NOT commit credentials.

Do not require OpenRouter if no configured credentials/integration exists.

The principle matters more than the exact provider:

GENERATE
↓
RENDER
↓
VISUALLY INSPECT
↓
CRITIQUE
↓
REFINE

---

# 13. THREE.JS / CUSTOM SHADERS / VERCEL-STYLE EFFECTS

The screenshots reference custom shaders and GPU-powered effects for interactive websites.

Explore:

- Three.js
- React Three Fiber
- GLSL
- WebGL
- Canvas

Potential design experiments:

- interactive fluid field
- holographic identity card
- abstract glass sculpture
- reactive background
- project visualization
- generative identity system

Have ONE visual-experiment subagent create a shader/WebGL direction.

Do not force WebGL onto every concept.

Performance requirements:

- graceful fallback
- mobile awareness
- reduced-motion behavior
- lazy loading
- no unnecessary GPU saturation

---

# 14. THINKING ORBS / AI STATE VISUALIZATION

The collected reference includes a "Thinking Orbs" visual language with semantic states such as:

- Working
- Searching
- Solving
- Listening
- Connecting
- Weaving
- Composing
- Breathing
- Shaping

Explore whether this language is useful for the organization.

Potential adaptation:

Rather than literally representing AI status, abstract these into states of project formation.

For example:

IDEATING
CONNECTING
BUILDING
TESTING
SHIPPING

A particle/orb system could act as a subtle organizational motif representing multidisciplinary collaboration.

Potential implementation:

- SVG
- Canvas
- shader
- Three.js
- CSS

Only use it if it strengthens the brand.

---

# 15. MAKE INTERFACES FEEL BETTER

One screenshot specifically emphasizes improving small details rather than merely producing technically correct interfaces.

Create an agent dedicated to this.

MICROINTERACTION-AGENT should inspect:

- text wrapping
- balanced headings
- typographic line lengths
- optical alignment
- focus states
- button feedback
- cursor affordances
- input states
- hover intent
- card expansion
- overflow
- whitespace
- breakpoint behavior
- scroll behavior
- loading states
- empty states

Use CSS capabilities such as:

text-wrap: balance;

where appropriate.

The objective:

A site that does not merely "look modern."

It should feel intentionally constructed.

---

# 16. PAGE MASCOT SKILL

Investigate the `/page-mascot` skill referenced in the screenshots.

The concept is an interactive page character which can:

- sit within the page
- follow the reader's cursor
- blink
- react to clicks/pokes
- provide subtle personality

Do NOT automatically install a cartoon animal into the production website.

Instead, create ONE experimental prototype using this interaction concept.

Adapt the mascot to the organization's brand.

Potential interpretations:

- abstract construction creature
- engineering companion
- modular mascot assembled from disciplines
- small workshop/helper character
- animated organization mark

Requirements:

- should not obstruct content
- disable or simplify on mobile
- accessible
- respect reduced-motion
- optional rather than mandatory

Compare the mascot version against a no-mascot version.

---

# 17. OPENUI / GENERATIVE UI

Investigate OpenUI referenced by the user.

The screenshot describes it as an open approach/tooling around generative interfaces where AI can produce interface primitives such as:

- buttons
- charts
- forms
- interactive UI

Evaluate whether this is useful for:

A. the DESIGN LAB
B. an actual organization website feature

Possible design-lab use:

Allow agents to quickly prototype functional components rather than static mockups.

Potential website use ONLY if genuinely relevant:

an interactive project finder
an onboarding interface
an opportunity explorer
a multidisciplinary team builder

Do not add AI merely because the tooling exists.

---

# 18. BLENDER MCP / PROCEDURAL 3D DESIGN

The newest reference demonstrates Claude using Blender through MCP to procedurally reconstruct a complex 3D object from reference materials.

The important capability is NOT the specific aircraft shown.

The important workflow is:

```
REFERENCE ANALYSIS
↓
GEOMETRY REASONING
↓
CAMERA / ANGLE REASONING
↓
PROPORTION ESTIMATION
↓
PROCEDURAL CONSTRUCTION
↓
RENDER
↓
COMPARE AGAINST REFERENCE
↓
REFINE
```

Investigate Blender MCP availability.

If available, install/configure it properly.

Create one experimental 3D-design subagent.

Possible uses for this organization:

- 3D organization identity
- generative logo sculpture
- multidisciplinary "artifact" object
- 3D project ecosystem visualization
- hero object
- spatial project map
- abstract engineering sculpture

Have the Blender agent generate at least one concept based on deliberate geometry rather than random visual generation.

The goal is to determine whether procedural 3D gives this organization a distinctive visual identity.

Do NOT make Blender a hard dependency for the final site.

---

# 19. VISUAL GENERATION VS PROCEDURAL DRAWING

The user's reference emphasizes an important distinction:

Claude can be strong at:

- SVG
- diagrams
- plans
- geometry
- programmatic layouts
- procedural graphics

while dedicated image models can be stronger for:

- rendered imagery
- artistic scenes
- textures
- photorealistic results

Follow that principle.

Use the correct medium for each artifact.

For example:

Claude:
SVG diagram

Image model:
rendered artwork

Claude:
Three.js interaction

Image model:
texture generation

Claude:
layout geometry

Blender:
3D representation

Do not burn huge numbers of iterative tokens trying to make one tool perform a task better suited to another.

---

# 20. ORGANIZATION POSITIONING

The organization is multidisciplinary.

It brings together students from areas such as:

- Computer Science
- Engineering
- Business
- Data
- AI
- Product
- Design
- Science
- Entrepreneurship

Members collaborate on real projects.

The central philosophy is:

# MAKE SOMETHING WORTH PUTTING YOUR NAME ON.

The site should feel like:

STARTUP STUDIO
+
ENGINEERING LAB
+
CREATIVE TECHNOLOGY COLLECTIVE
+
STUDENT BUILDER COMMUNITY

It should NOT feel like:

- generic student club
- consulting organization
- university department
- template SaaS landing page
- hackathon site
- crypto startup
- generic AI company

---

# 21. DESIGN RESEARCH

Before producing mockups, assign a dedicated research agent.

Research approximately:

8–15 organizations/products/studios/labs

across:

- startup studios
- engineering collectives
- innovation labs
- university research labs
- developer communities
- creative technology studios
- interdisciplinary programs
- accelerator websites
- product organizations
- experimental portfolios

Analyze:

- homepage narrative
- typography
- navigation
- project presentation
- whitespace
- grids
- motion
- copywriting
- proof
- project detail pages
- joining/recruiting flows
- partnership/sponsor language
- mobile behavior

Do NOT copy their interfaces.

Create:

design-lab/research/reference-analysis.md

---

# 22. INFORMATION ARCHITECTURE

Audit whether the organization needs:

Home
Projects
About
Disciplines
Teams
Join
Partners
Events
Members
News
Resources

Do not blindly create all of these.

Propose an information architecture based on actual content.

The homepage should probably communicate:

WHY THIS EXISTS
↓
WHAT MEMBERS BUILD
↓
REAL PROJECTS
↓
HOW TEAMS WORK
↓
WHO CAN JOIN
↓
PROOF
↓
HOW TO PARTICIPATE

But agents may challenge this structure.

---

# 23. PARALLEL DESIGN EXPLORATION

THIS IS CRITICAL.

The orchestrator must NOT personally converge on one design.

Create independent subagents.

Each subagent gets:

- organization context
- current website audit
- current content
- reference research
- screenshots supplied by the user

But DO NOT show them the other agents' concepts until their initial direction is complete.

Each must independently create:

1. design thesis
2. visual system
3. typography
4. palette
5. layout
6. navigation
7. hero
8. project section
9. one secondary section
10. responsive behavior
11. interaction language
12. functioning homepage prototype

---

# 24. DESIGN AGENT A — EDITORIAL / STUDIO

Direction:

Experimental editorial design.

Think:

- creative technology studio
- strong art direction
- typography-led identity
- unusual composition
- magazine/editorial rhythm
- project imagery
- large confident statements

Minimal decorative UI chrome.

Avoid SaaS conventions.

Focus heavily on:

"Make something worth putting your name on."

---

# 25. DESIGN AGENT B — ENGINEERING / SYSTEM

Direction:

Engineering-first.

Think:

- technical artifacts
- grids
- schematics
- system diagrams
- project statuses
- engineering documentation
- terminal/data motifs used sparingly
- technical typography

The site should make actual project work feel tangible.

Not cyberpunk.

Not hacker cliché.

---

# 26. DESIGN AGENT C — CREATIVE TECHNOLOGY

Direction:

Highly interactive.

Explore:

- shaders
- Three.js
- Canvas
- particle systems
- procedural identity
- dynamic typography
- unusual transitions
- interactive hero

Take greater visual risk.

Performance still matters.

---

# 27. DESIGN AGENT D — HUMAN / COMMUNITY

Direction:

People-centered.

Focus on:

- students
- teams
- process
- stories
- collaboration
- project ownership
- photography
- warmth

Less technical spectacle.

The question this concept answers is:

"Who will I become and what will I make if I join?"

---

# 28. DESIGN AGENT E — STARTUP / PRODUCT STUDIO

Direction:

A credible startup studio.

Focus on:

- shipped projects
- measurable outcomes
- product case studies
- teams
- industry partnerships
- professional credibility
- polished motion
- restrained typography

It should feel strong enough to show to:

- executives
- recruiters
- sponsors
- faculty

without feeling corporate.

---

# 29. DESIGN AGENT F — RADICAL EXPERIMENT

Give this agent the most freedom.

Constraints:

It still needs to work as a real website.

Otherwise, it may challenge assumptions about:

- navigation
- homepage structure
- grid
- scrolling
- typography
- project browsing
- interaction

Use any suitable tools:

- shaders
- page mascots
- SVG systems
- WebGL
- procedural layout
- animated identity
- unusual cursor behavior
- nonlinear project exploration

The purpose of this concept is to reveal ideas the safer concepts would never discover.

---

# 30. OPTIONAL SPECIALIZED AGENTS

Spawn specialized agents where useful:

TYPE-DIRECTOR
MOTION-DIRECTOR
ICON-DIRECTOR
COPYWRITER
ACCESSIBILITY-AUDITOR
RESPONSIVE-AUDITOR
WEBGL-EXPERIMENTER
BLENDER-EXPERIMENTER
MASCOT-EXPERIMENTER
DESIGN-SYSTEM-AUDITOR
VISUAL-QUALITY-CRITIC

Do not use subagents for trivial work.

Use them for meaningful independent exploration.

---

# 31. DESIGN SYSTEM PER CONCEPT

Each concept must specify:

## Typography

- display family
- heading family
- body family
- mono family if used
- sizes
- weights
- line heights
- letter spacing
- responsive scale

## Color

- background
- foreground
- muted foreground
- primary
- secondary
- accent
- borders
- elevated surfaces
- states

## Geometry

- spacing scale
- page margins
- max width
- grid
- radii
- border weights
- shadows

## Motion

- duration scale
- easing
- springs
- entrance behavior
- hover behavior
- page transitions
- reduced-motion behavior

## Iconography

- icon family
- stroke
- scale
- usage rules

---

# 32. MOCKUPS MUST BE IMPLEMENTED, NOT JUST DESCRIBED

Each concept must become a working prototype.

Do NOT return:

"Concept A could use..."
"Concept B might have..."

Actually build them.

Each should have a dedicated route.

Example:

/design-lab/a
/design-lab/b
/design-lab/c
/design-lab/d
/design-lab/e
/design-lab/f

or equivalent isolated implementations.

At minimum each must include:

Desktop homepage
+
Mobile homepage

Prefer functional interactions over static screenshots.

---

# 33. BROWSER RENDERING LOOP

After implementation:

Use browser tooling.

For EACH mockup:

1. run the site
2. open the prototype
3. render desktop
4. render tablet
5. render mobile
6. capture screenshots
7. inspect visual result
8. identify defects
9. revise
10. capture again

Do not trust code without looking at the render.

Claude should repeatedly SEE its own work.

---

# 34. VIDEO / MOTION CRITIQUE

For motion-heavy concepts:

Record or render representative interactions.

Then inspect them.

Where available, pass the recording to a capable vision/video critic.

Critique:

- pacing
- easing
- hierarchy
- readability
- distracting effects
- visual continuity
- frame timing
- responsiveness

Then revise.

---

# 35. CROSS-CRITIQUE ROUND

After initial concepts are complete:

Agent A critiques B
Agent B critiques C
Agent C critiques D
Agent D critiques E
Agent E critiques F
Agent F critiques A

Criticism must address:

- hierarchy
- typography
- distinctiveness
- usability
- brand fit
- project storytelling
- responsiveness
- implementation feasibility
- motion quality

Critics may suggest improvements.

They must NOT rewrite another concept into their own style.

---

# 36. SECOND ITERATION

Each design agent receives:

- screenshots of its prototype
- cross-agent critique
- Vercel/design audit
- accessibility audit
- responsive audit

Each performs ONE deliberate refinement pass.

Avoid endless micro-tweaking.

---

# 37. COMPARISON EXPERIENCE

Create:

/design-lab

as a comparison gallery.

Show all concepts.

For each:

- name
- one-sentence thesis
- desktop preview
- mobile preview
- open prototype button
- typography sample
- palette
- notable interactions
- distinctive idea
- tradeoffs

Allow easy switching between concepts.

Do NOT create a numeric ranking.

Do NOT automatically select a winner.

---

# 38. COMPONENT COMPARISON MODE

Also create a page such as:

/design-lab/components

Compare equivalent components side-by-side:

NAVIGATION
A | B | C | D | E | F

HERO
A | B | C | D | E | F

PROJECT CARD
A | B | C | D | E | F

CTA
A | B | C | D | E | F

TYPOGRAPHY
A | B | C | D | E | F

This makes it possible for the user to say:

"Use C's hero, A's typography, E's project grid and F's interaction."

---

# 39. ANTI-GENERIC RULES

Avoid automatically generating:

- giant centered headline
- generic gradient
- two CTA buttons
- 3-card feature row
- random testimonials
- bento everything
- excessive pills
- excessive rounded cards
- floating gradient orbs
- glow everywhere
- enormous border radius
- meaningless dashboards
- purple/blue AI palette
- overuse of glassmorphism
- stock AI illustrations
- startup buzzwords

Every visual decision needs a purpose.

---

# 40. COPY RULES

Avoid:

"Empowering innovation."

"Transforming ideas into impact."

"Where innovation meets opportunity."

"Build the future."

"Unlock your potential."

"Join a community of innovators."

Use concrete language.

Explore extensions of:

MAKE SOMETHING WORTH PUTTING YOUR NAME ON.

Examples of rhetorical territory:

Build work people can actually use.

Don't just join something. Make something.

Different majors. One product.

Your portfolio should contain evidence.

Turn coursework into shipped work.

Products need more than programmers.

These are starting points, not mandatory final copy.

---

# 41. PROJECTS SHOULD BE THE HERO OF THE ORGANIZATION

The website must make projects feel REAL.

Explore showing:

- project title
- actual screenshots
- problem
- team disciplines
- technologies
- duration
- status
- outcome
- member contributions
- client/partner
- repo/demo if appropriate

Do not reduce projects to decorative cards.

Treat them like portfolio artifacts.

---

# 42. ACCESSIBILITY

All prototypes must account for:

- semantic HTML
- keyboard navigation
- visible focus
- contrast
- reduced motion
- mobile touch targets
- responsive text
- reasonable line lengths
- screen-reader labels

Experimental does not mean inaccessible.

---

# 43. PERFORMANCE

Track obvious performance risks.

Be especially careful with:

- shaders
- Three.js
- videos
- huge fonts
- images
- procedural animation
- cursor effects
- page mascot
- Canvas

Prefer progressive enhancement.

---

# 44. DELIVERABLES BEFORE USER REVIEW

Produce:

```
design-lab/
    audit.md
    tooling-audit.md
    research/
        reference-analysis.md
        copy-analysis.md
    concepts/
        concept-a.md
        concept-b.md
        concept-c.md
        concept-d.md
        concept-e.md
        concept-f.md
    renders/
        ...
    critiques/
        ...
    comparison/
        ...
```

And functioning routes for each mockup.

---

# 45. FINAL REPORT FORMAT

When the exploration stage is complete, report:

```
# Design Exploration Ready

## Environment
List installed/verified tools.

## Existing Site
Short audit.

## Concept A — [name]
Thesis
Key visual characteristics
Interesting interaction

## Concept B — [name]
...

through all concepts.

## Experimental Features Explored
Examples:

- Superdesign
- DESIGN.md systems
- Vercel design audit
- Taste
- Aria icons
- procedural motion
- Remotion
- shaders
- Three.js
- Thinking Orbs
- mascot interaction
- OpenUI
- Blender MCP

State which prototypes use which.

## Comparison

Provide the route to the interactive comparison gallery.

Do not declare a winner.
```

---

# 46. STOP CONDITION

Once the comparison environment and refined prototypes are ready:

STOP.

Do not:

- redesign production pages
- delete existing components
- merge concepts
- select a winner
- perform the final implementation

Wait for explicit user feedback.

The user's response may be something like:

"Use B but with C's hero."

"Combine A typography + E layout."

"F is closest; make it less experimental."

"I dislike all six; do another exploration."

The next phase begins only after this feedback.

---

# 47. CRITICAL ORCHESTRATION RULE

You are the orchestrator.

Do not personally consume the majority of the context doing every substantial task.

Delegate medium/large tasks to purpose-built subagents.

Your job is to:

PLAN
DELEGATE
REVIEW
SYNTHESIZE
VERIFY
PRESENT

not:

PLAN
DO EVERYTHING YOURSELF

Preserve the main context window for architectural decisions, comparisons, user requirements, and final synthesis.

Subagents should receive bounded tasks with explicit artifacts to return.

---

# 48. SCREENSHOT-DERIVED CAPABILITY CHECKLIST

The user's complete screenshot collection in this conversation references the following ideas/tools/workflows.

Explicitly account for every one during your tooling/research phase:

- Claude Design
- design-system-first workflow
- deriving systems from screenshots/sites/decks
- design-system shortlisting
- Fontshare
- Fontesk
- Fontjoy
- competitor copy research
- mixing compatible design systems
- Superdesign
- Aria Icons
- Thinking Orbs / semantic animated loaders
- Vercel custom shaders
- interface-detail refinement
- balanced text wrapping
- procedural animation with Claude
- Remotion + React
- raw HTML5 Canvas
- Three.js
- explicit keyframe timelines
- headless Chromium rendering
- FFmpeg composition
- OpenRouter as optional model orchestration
- external model generation for imagery/audio
- video-capable model critique
- iterative render → inspect → refine loops
- image-generation vs procedural-drawing specialization
- Blender MCP
- reference-based procedural 3D reconstruction
- camera/angle/proportion reasoning
- Opus-driven motion-design/showreel generation
- page-mascot skill / cursor-following interactive characters
- OpenUI / generative interactive UI
- Vercel web-design guideline/audit skill
- Taste design skill
- Awesome DESIGN.md
- DESIGN.md-based design reproduction/analysis
- multiple independent prototype agents
- visual review BEFORE production implementation

Do not silently omit items.

For unsupported/unverifiable tools, record them as:

NOT VERIFIED
or
NOT COMPATIBLE

rather than fabricating usage.

---

# START

Begin with:

1. repository audit
2. skill/plugin/MCP discovery
3. tooling audit
4. current-site screenshots
5. reference research
6. spawning the independent design agents

Do not touch production UI yet.
