# Acceptance Criteria

## UX

- A first-time visitor understands who the candidate is, what role they're suited for, and where to find their strongest work within seconds of landing, without needing instruction.
- No interaction is required to access any core content (identity, projects, resume, contact) — all core content is visible/reachable via normal scroll and click.
- The Figma-inspired chrome (toolbar, layers panel, canvas texture, inspector) is legible as intentional design language, not confusing or ambiguous about what's clickable versus decorative.
- Navigation between Home and any case study, and between sections within a case study, takes no more than 2 clicks/taps from anywhere in the site.

## Visual design

- Visual language matches `DESIGN_PRINCIPLES.md`: minimalist base, glassmorphism confined to chrome surfaces, single accent color used sparingly, consistent type scale and spacing grid.
- The landing view delivers a genuine "wow" first impression (distinctive, polished, immediately legible as a design-tool-inspired aesthetic) without visual clutter.
- Visual hierarchy correctly prioritizes the 2 strongest case studies over the 2 lighter ones on the Home view.
- Dark/light mode decision (per `DESIGN_PRINCIPLES.md` open decision) is applied consistently across every screen — no inconsistent theming.

## Interaction

- Every interaction specified in `INTERACTION_SPEC.md` behaves exactly as documented, including edge cases (failed prototype embed, empty command palette search results, invalid project slug).
- No interaction depends on hover alone — every hover-based affordance has a working touch/keyboard equivalent.
- Command palette is fully operable via keyboard only (open, search, navigate, select, close).
- Cosmetic chrome details (zoom-percentage readout, decorative selection outlines) do not appear interactive when they are not, and do not interfere with real interactive elements.

## Recruitment

- **Critical user journey passes:** A recruiter arrives on the homepage → understands who the candidate is and their target role → identifies and opens the strongest project → understands the candidate's role and the project's outcome within the case study → optionally reviews further case-study detail → finds and accesses resume and/or contact — all without needing guidance.
- Resume and Contact are reachable from literally every screen in the site (Home, any project page, any modal state) in one click.
- Nothing in the visual or interaction design reads as unfinished, broken, or placeholder content in the delivered v1 (no lorem ipsum, no disabled-looking stubs for missing features).
- Case-study content is honest and internally consistent — no claims of process depth (research, iteration) that aren't backed by real content, per `CONTENT_SPEC.md`.

## Accessibility

- WCAG AA contrast compliance verified manually on all glass/blurred surfaces, not just via automated tooling.
- Full keyboard operability across the entire site, including custom components (command palette, collapsible panels).
- Visible, on-brand focus states on every interactive element.
- `prefers-reduced-motion` respected — reduced-motion users get instant/simplified transitions with no loss of functionality.
- All images have meaningful alt text; the prototype embed has a text-based fallback description.
- No content or state communicated by color alone.

## Performance

- Fast first contentful paint on both desktop and mobile connections (target: good Lighthouse performance score, though exact numeric thresholds can be set once real content/image weights are known).
- No significant layout shift during load (images have reserved dimensions, skeleton states match final layout shapes).
- Prototype embed and below-the-fold images are lazy-loaded and do not block initial page render.

## Responsive behavior

- Full functional parity between desktop and mobile — every feature works on both, differing only in layout arrangement (multi-panel vs. single-column collapse), per `INTERACTION_SPEC.md`.
- No horizontal scrolling, overlapping elements, or cut-off content at any commonly tested viewport width.
- Toolbar, layers-panel-as-jump-nav, and inspector content all have working, non-degraded mobile equivalents.

## Content

- All 4 case studies meet the mandatory content fields defined in `CONTENT_SPEC.md`.
- The 2 strong and 2 lighter projects are honestly differentiated in depth — lighter projects are not padded to falsely appear equally deep, nor are they visually broken/incomplete-looking as a result of being shorter.
- Design Decisions content for reconstructed rationale is framed honestly (reflective voice), not presented as if it were contemporaneous documentation.
- Personal info, resume, and contact content are complete, accurate, and up to date at launch.

## Technical quality

- Content and UI code remain decoupled — editing or adding a project's content does not require touching component code.
- No unused/unjustified dependencies beyond what `TECH_SPEC.md` specifies.
- No functional pan/zoom canvas, inspect/redline system, comments system, or contact form exists anywhere in the delivered v1 (explicitly out of scope, verified as absent, not just undocumented).
- Site builds and deploys successfully on Vercel with no console errors in production.

## Critical user journeys (must all pass)

1. **Recruiter fast path:** Home → identify candidate/role → open strongest project → understand role/outcome → find resume/contact. (Target: under 90 seconds, zero required instruction.)
2. **Hiring manager deep path:** Home → open a case study → read Problem through Design Decisions → come away with a credible understanding of the candidate's thinking process, not just final visuals.
3. **Referral-contact confidence path:** Home → general impression within seconds that this is a polished, professional, "safe to forward" portfolio.
4. **Mobile parity path:** Any of the above journeys, completed entirely on a phone-sized viewport, with no lost functionality.
5. **Keyboard-only path:** Any of the above journeys, completed using only keyboard navigation (Tab, Enter, Esc, arrow keys), with no mouse/touch input.
