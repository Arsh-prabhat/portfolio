# Product Brief

## Product vision

An entry-level Product/UX Designer's portfolio that visually reads as a design-tool workspace (Figma-inspired chrome — toolbar, layers panel, canvas texture, inspector) while behaving as a simple, fast, linear site underneath. The interface should feel like evidence of design sensibility, not a barrier to reaching the work.

## Problem

The candidate is early-career (6-month internship), applying to competitive startups and MNCs, with no formal case studies written yet and mostly-final polished screens (iteration/version history was not preserved). A generic template portfolio won't differentiate them in a crowded entry-level applicant pool. But an overly elaborate, novel-interaction portfolio risks the opposite failure: recruiters and referral contacts abandoning before reaching the work, or the interface reading as "impressive shell, thin substance" for a junior candidate.

## Opportunity

A portfolio that visually commits to a distinctive, design-literate aesthetic (Figma-style chrome, glassmorphism, minimalism) while keeping every actual interaction dead simple can deliver "clean, expressive, wow" (the candidate's own target impression) without the usability and credibility costs of a fully functional design-tool simulation.

## Goals

- Communicate design ability: UX thinking, visual craft, interaction sensibility, systems thinking, process (where honestly available).
- Get the candidate referred and shortlisted by recruiters at target companies (Rapido/Zomato/Swiggy-tier startups, MNCs).
- Make the two strongest case studies (matrimonial app, delivery-partner app) immediately findable and quickly comprehensible.
- Keep resume and contact one click away at all times.

## Non-goals

- This is not a functioning design tool. No real pan/zoom canvas, no real layer manipulation, no real inspect/redline system.
- This is not a portfolio optimized for other designers' admiration at the expense of recruiter speed.
- This is not an attempt to fabricate a design process the candidate can't honestly support.

## Target users

1. **Recruiters** — primary audience, 30–90 second first pass, scanning for role fit and seniority signal.
2. **Referral contacts** — need to feel confident forwarding the link internally; credibility over cleverness.
3. **Hiring managers / design leads** — secondary but higher-value audience; will read 1–2 case studies in depth and evaluate process credibility.

## User needs

| User | Needs |
|---|---|
| Recruiter | Instant read on role/level, fastest path to strongest work, resume, contact |
| Referral contact | Confidence the site looks professional and won't embarrass them |
| Hiring manager | Evidence of real thinking: problem framing, decisions, outcome, honest process |

## Success criteria

- A recruiter can identify who the candidate is, what role they're suited for, and reach the resume/contact within 90 seconds without needing any instruction.
- At least one case study fully demonstrates problem → decisions → outcome in a way a design lead would find credible.
- The Figma-styled visual language is immediately legible as intentional and polished, not confusing or performative.
- The site works fully on mobile without any feature depending on pan/zoom or hover-only interaction.

## Product principles

1. Chrome can be bold; behavior must stay simple.
2. Every interaction must justify its cost in recruiter attention.
3. Honesty over completeness — reflection, not fabrication, where process history is incomplete.
4. Strongest work leads; weaker work doesn't get inflated to match.
5. Accessibility and mobile parity are default requirements, not later polish.

## Core experience

A visitor lands on a Figma-styled "workspace" home view (functioning as Present Mode by default): toolbar with name/title/resume/contact, a layers-style panel listing the 4 projects, and project cards on a dot-grid canvas background. The two strongest projects are visually prioritized. Clicking a project opens its case-study canvas: a left panel for section jump-nav (styled as Layers), main content that scrolls normally, and a right panel (styled as Inspector) holding "Design Decisions" — honestly framed rationale. One project includes a real embedded prototype. A command palette (`Cmd+K`) is available for those who want it, never required.

## Competitive / reference inspiration

- **Figma app itself** — toolbar, panel, and canvas visual language (styling reference only, not functional reference).
- **Minimalist, glassmorphic product sites** — restrained blur/translucency on functional surfaces, not decorative backgrounds.
- (Candidate to supply specific reference links/screenshots if available — not required to proceed.)

## Feature classification

| Feature | Classification | Rationale |
|---|---|---|
| Present-mode-style landing (default view) | MUST HAVE | This is the primary recruiter path; not optional |
| Figma-style toolbar/panel/canvas-texture chrome | MUST HAVE | Core to "clean, expressive, wow" brand goal; visual only, low interaction risk |
| Layers-panel-as-section-nav | MUST HAVE | Doubles as functional table-of-contents; genuinely useful |
| Resume/contact always one click away | MUST HAVE | Non-negotiable for recruiter/referral use case |
| Case study honest "Design Decisions" panel | SHOULD HAVE | High value for hiring-manager audience; must stay honest about partial reconstruction |
| Real prototype embed (1 project) | SHOULD HAVE | Only build where a real prototype exists — never simulate one |
| Command palette (Cmd+K) | NICE TO HAVE | Candidate wants it, cheap to build, but strictly optional and never gates content |
| Cosmetic canvas details (zoom-% readout, selection outlines, corner handles) | NICE TO HAVE | Low cost, reinforces visual language, purely decorative |
| Free-form pan/zoom canvas navigation | DO NOT BUILD | Disorienting on first use, breaks mobile, high dev cost, no comprehension benefit for a fast recruiter scan |
| Full inspect/redline spec system | DO NOT BUILD | Candidate lacks the underlying iteration/measurement data to honestly support this |
| Comments/annotations system | DO NOT BUILD (v1) | Adds no value for a 4-project portfolio at this stage |

## Risks

- **Content honesty risk**: pressure to over-narrate design rationale beyond what's actually remembered. Mitigation: explicit reflection framing in `CONTENT_SPEC.md` and `CONTENT_MODEL.md`.
- **Accessibility risk from glassmorphism**: blur/translucency reducing text contrast. Mitigation: restrict glass effects to non-text-critical surfaces; enforce contrast ratios in `DESIGN_PRINCIPLES.md`.
- **Scope creep risk**: AI-assisted "vibe coding" tends to over-build interactive systems (e.g., accidentally implementing real pan/zoom because it "seems cool"). Mitigation: explicit prohibition in `AGENT_INSTRUCTIONS.md`.
- **Mobile risk**: Figma-style multi-panel layouts collapsing poorly on small screens. Mitigation: panels stack/collapse into a single scrollable flow on mobile, texture/chrome simplified, no functionality lost.
- **Recruitment risk**: interface novelty overshadowing content for an entry-level candidate whose main asset is real internship work, not portfolio engineering. Mitigation: strict adherence to the MUST/SHOULD/DO NOT BUILD table above.
- **Uneven content risk**: 2 strong + 2 lighter case studies being forced into identical templates that expose the weaker projects' thinness. Mitigation: content model supports variable depth per project (see `CONTENT_MODEL.md`).

## Recommended tech architecture

Next.js + React + TypeScript + Tailwind CSS, Framer Motion for panel/glass micro-interactions, MDX/JSON content decoupled from components, deployed on Vercel. No CMS. State management via React Context; Zustand only if command palette state becomes complex. See `TECH_SPEC.md` for full detail.
