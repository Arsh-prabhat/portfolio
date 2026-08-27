# Information Architecture

## Global navigation

Persistent across all views (toolbar, styled as Figma's top bar):

- Name / logo mark (left) — clicking returns to landing/home view
- Current context label (center) — e.g., project name when inside a case study, or "Home" on landing
- Resume (right) — opens/downloads resume, always visible
- Contact (right) — opens contact panel/modal, always visible
- Command palette trigger (subtle, right or via `Cmd+K`) — optional, never required

## Portfolio structure (top-level tree)

```
/ (Home — functions as Present Mode by default)
├── Hero: name, title, one-line positioning
├── Toolbar: resume, contact, command palette
├── Layers panel (left): list of all 4 projects, styled as layer list
├── Canvas (center): project cards on dot-grid background
│   ├── Featured: Case Study 1 — Matrimonial App (strongest)
│   ├── Featured: Case Study 2 — Delivery Partner App (strongest)
│   ├── Case Study 3 (lighter)
│   └── Case Study 4 (lighter)
├── About section (brief, may live on home or its own anchor — see open decision below)
└── Footer: contact links, resume link (redundant fallback)

/project/[slug] (Case Study canvas view)
├── Toolbar (persistent, same as home)
├── Layers panel (left): section jump-nav for THIS case study
│   ├── Problem
│   ├── Process (if content exists)
│   ├── Screens
│   ├── Prototype (only if real prototype exists for this project)
│   └── Outcome
├── Canvas (center): scrolling case-study content, sections in order above
├── Inspector panel (right): "Design Decisions" — honest rationale, collapsible on smaller screens
└── Footer: link back to home, resume, contact

/resume (or modal/drawer, not necessarily a route — see Tech Spec)
└── Resume viewer + download link

Contact (modal/drawer, not necessarily a route)
└── Email, LinkedIn, other relevant links
```

## Project structure (per case study)

Each case study is a single scrollable page (`/project/[slug]`), not a multi-page flow. Depth of each section varies by project (strong vs. lighter — see `CONTENT_MODEL.md`), but section order stays consistent across all 4 for predictability.

## Case-study structure (section detail)

1. **Header** — title, one-line problem/outcome summary, role, timeline, team size (always present, always brief)
2. **Problem** — what problem was being solved, for whom, why it mattered
3. **Process** — research/flows/iteration, to the honest extent available (may be brief for lighter projects — never padded)
4. **Screens** — final visual design, presented clearly, high-fidelity
5. **Prototype** — real embedded interactive prototype (only for the 1 project that has one; omitted entirely for others, not stubbed/faked)
6. **Outcome** — what shipped, what changed, measurable or observed impact if known
7. **Design Decisions** (Inspector panel content) — honest rationale for key choices, explicitly framed as reflection where iteration history wasn't preserved
8. **Learnings** — brief, personal, shows growth mindset (valuable for an entry-level narrative)

## Recruiter mode

Not a separate mode/route — the **default landing view is already recruiter-optimized** (Present-mode-style): identity, strongest work, resume, and contact are all visible without any interaction. This decision replaces the brief's original "separate Present Mode" concept, since a mode toggle would itself add a decision point recruiters shouldn't need to make.

## About

Short — name, title, one-paragraph positioning, possibly a photo. Lives either as a hero-adjacent block on Home or as a single anchor/section, not a deep separate page (an entry-level candidate's "about" should not compete with case-study content for attention).

**Open decision for candidate:** does About need its own scroll section with more detail (skills, tools, brief story), or should it stay to 2–3 lines in the hero? Recommendation: keep it brief (2–3 lines + resume link) — the case studies should carry the proof, not an extended bio.

## Resume

Always reachable via toolbar. Implementation choice (embedded viewer vs. direct PDF download vs. both) is a `TECH_SPEC.md` decision, not an IA decision — IA only requires that it is never more than one click away from any screen.

## Contact

Always reachable via toolbar. Lightweight (modal or drawer) — email + LinkedIn minimum, no contact form required for v1 (adds backend complexity with no clear benefit over a direct email/LinkedIn link).

## Prototype experiences

Only the project with a real embedded prototype gets a "Prototype" section in its layers-panel nav. Projects without one do not show a stubbed/disabled Prototype entry — omit entirely rather than imply missing content. This is an explicit rule for `AGENT_INSTRUCTIONS.md` as well: never fabricate the appearance of a feature that doesn't have real content behind it.

## IA notes on unequal project depth

Because 2 projects are strong and 2 are lighter, the IA must not force identical section depth. All 4 use the same section *order*, but the lighter 2 may have shorter Process/Design Decisions content, and that's acceptable and expected — see `CONTENT_MODEL.md` for how this is structured so it doesn't look broken or incomplete.
