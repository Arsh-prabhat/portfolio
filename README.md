# Arsh Prabhat — UI/UX Design Portfolio

A Figma-inspired, glassmorphic portfolio site for an entry-level / Jr. Product Designer, built to be read by AI coding agents (Google Antigravity) and implemented with minimal guessing.

## One-line description

An interactive portfolio whose visual language borrows the chrome of a design tool (toolbar, layers panel, canvas texture, inspector, command palette) while behaving like a simple, fast, linear portfolio underneath — built to help an early-career designer get noticed by recruiters and referrers in under 90 seconds, then reward hiring managers who dig deeper.

## Product concept

The portfolio is **Figma-styled, not Figma-functional**. A visitor sees a workspace-like interface — toolbar, layers-style sidebar, dot-grid canvas background, inspector-style rationale panel, optional command palette — but every interaction is a normal click or scroll. There is no pan/zoom canvas, no tutorial, and no interface fluency required to reach the content. The visual system exists to communicate "this designer thinks like a systems/tool person" — the content exists to prove the actual design work.

## Goals

1. Get an entry-level / Jr. Product Designer noticed and referred by recruiters at startups (Rapido, Zomato, Swiggy-tier) and MNCs.
2. Communicate UX thinking, visual craft, and product sense through 3–4 real case studies from a 6-month internship.
3. Make the interface itself a (small, contained) demonstration of design skill — without letting it slow down or confuse the primary audience.
4. Be honest about process — where iteration history wasn't preserved, the copy says so rather than fabricating a narrative.

## Target audience

- **Recruiters** (primary): fast screen, need role/seniority/strongest work/resume/contact in under 90 seconds.
- **Referral contacts**: need to feel confident forwarding the link — credibility over novelty.
- **Hiring managers / design leads** (secondary): will click into 1–2 case studies, want honest process and reasoning.

## Core features

- Present-mode-style landing page (the default view, not a separate mode) surfacing strongest work immediately.
- 4 case studies styled as "canvas" pages, 2 of which are the strongest (matrimonial app, delivery-partner app).
- Figma-style chrome: top toolbar, left layers-style section nav, dot-grid canvas texture, right inspector-style "Design Decisions" panel.
- One real embedded interactive prototype.
- Optional `Cmd+K` command palette for navigation.
- Resume and contact always reachable in one click, from any screen.
- Full mobile responsiveness (chrome adapts/collapses, no pan/zoom dependency).

## Tech stack

- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion (panel/glass micro-interactions only — not physics-heavy canvas work)
- Content authored as MDX/JSON, decoupled from components
- Vercel for deployment
- No CMS, no heavy state library (React Context is sufficient; Zustand only if command palette state grows unwieldy)

See `docs/TECH_SPEC.md` for full detail and reasoning.

## Project structure

```
portfolio/
├── README.md
├── docs/                     ← specs an AI agent must read before building
│   ├── PRODUCT_BRIEF.md
│   ├── DESIGN_PRINCIPLES.md
│   ├── INFORMATION_ARCHITECTURE.md
│   ├── INTERACTION_SPEC.md
│   ├── CONTENT_SPEC.md
│   ├── TECH_SPEC.md
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── CONTENT_MODEL.md
│   ├── MVP_ROADMAP.md
│   ├── AGENT_INSTRUCTIONS.md
│   └── ACCEPTANCE_CRITERIA.md
├── content/                  ← structured content, separate from UI code
│   ├── profile.md
│   ├── resume.md
│   └── projects/
│       ├── project-01.md
│       ├── project-02.md
│       ├── project-03.md
│       └── project-04.md
└── public/
    ├── images/
    ├── videos/
    └── fonts/
```

## Development philosophy

- **Chrome vs. behavior are separate decisions.** The Figma-style *look* (toolbar, panels, canvas texture) can be as visually committed as it wants. The *behavior* stays boringly simple: scroll, click, no pan/zoom, no gating.
- **Content is decoupled from UI.** Adding or editing a case study should never require touching component code.
- **Honesty over completeness.** Where real design rationale can't be reconstructed, content is framed as reflection, not fabricated redlining.
- **Cut anything that costs a recruiter time without adding understanding.** See the feature classification table in `docs/PRODUCT_BRIEF.md`.

## How AI coding agents should work on this project

1. Read every file in `/docs` before writing or changing architecture.
2. Do not introduce features not specified in `docs/PRODUCT_BRIEF.md`'s MUST/SHOULD/DO NOT BUILD table.
3. Do not build a functional pan/zoom canvas under any framing (this has been explicitly rejected — see Risks in `PRODUCT_BRIEF.md`).
4. Treat `docs/AGENT_INSTRUCTIONS.md` as binding operating rules, not suggestions.
5. When a requirement is ambiguous, follow the ambiguity-resolution rules in `AGENT_INSTRUCTIONS.md` rather than guessing silently.

## Important constraints

- Entry-level candidate — the portfolio must never overstate seniority or fabricate process depth it can't back up.
- Content for 2 of 4 case studies is strong; 2 are lighter — the IA and design must not force equal depth where equal depth doesn't exist.
- Only one project has a real interactive prototype — "Prototype mode" is per-project, not a universal feature.
- Accessibility is non-negotiable, especially given the glassmorphism (contrast risk) and dot-grid textures (visual noise risk) — see `DESIGN_PRINCIPLES.md`.
- No literal pan/zoom, no comments/annotations system, no fabricated inspect/redline data — these are explicitly out of scope for v1.
