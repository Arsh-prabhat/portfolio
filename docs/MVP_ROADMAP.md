# MVP Roadmap

## Phase 0 — Planning

- **Objective:** Finalize product direction and documentation (this phase).
- **Features:** N/A — documentation only.
- **Deliverables:** All 11 `/docs` files, this roadmap.
- **Dependencies:** None.
- **Acceptance criteria:** Candidate has reviewed and approved the direction in `PRODUCT_BRIEF.md`.
- **Do NOT build yet:** Any code.

## Phase 1 — Workspace shell

- **Objective:** Establish the core visual chrome and layout system.
- **Features:** `AppShell`, `Toolbar` (non-functional placeholders for Resume/Contact acceptable at this stage), `Canvas` container with dot-grid texture, base color/typography/spacing system per `DESIGN_PRINCIPLES.md`.
- **Deliverables:** A styled, empty shell that renders on desktop and mobile.
- **Dependencies:** Phase 0 approval.
- **Acceptance criteria:** Shell matches the visual direction (glassmorphism on chrome, Figma-style toolbar/canvas texture); responsive collapse behavior works at target breakpoints; no functional content yet required.
- **Do NOT build yet:** LayersPanel content, project data, command palette, any project pages.

## Phase 2 — First case study

- **Objective:** Prove the full case-study template with one real project (recommend starting with a strongest project — Matrimonial App or Delivery Partner App).
- **Features:** `SectionBlock`, `ProjectCard`, `LayersPanel` in `sectionList` mode, `InspectorPanel` with real Design Decisions content, project routing (`/project/[slug]`).
- **Deliverables:** One fully built, content-complete case study page.
- **Dependencies:** Phase 1 shell; first project's content drafted per `CONTENT_SPEC.md`/`CONTENT_MODEL.md`.
- **Acceptance criteria:** Page matches `INFORMATION_ARCHITECTURE.md` section order; `LayersPanel` jump-nav works; content is honest per the reconstructed-rationale rules; mobile layout collapses correctly.
- **Do NOT build yet:** Prototype embed (unless this is the project that has one — if not, defer to Phase 3), command palette, remaining 3 projects.

## Phase 3 — Interactions

- **Objective:** Add the interactive layer defined in `INTERACTION_SPEC.md`.
- **Features:** `CommandPalette` (full keyboard support), hover/press states across cards and panel entries, `PrototypeEmbed` (for the one project with a real prototype), loading/error states for routes and embeds.
- **Deliverables:** All interactions from `INTERACTION_SPEC.md` implemented and testable.
- **Dependencies:** Phase 2's working case-study template.
- **Acceptance criteria:** Every interaction in `INTERACTION_SPEC.md` behaves as specified, including edge cases (failed embed, empty command palette search, keyboard-only operation).
- **Do NOT build yet:** Any form of pan/zoom canvas — explicitly and permanently out of scope, not deferred.

## Phase 4 — Recruiter home / Present-mode landing

- **Objective:** Build the full Home view as the recruiter-optimized default landing experience.
- **Features:** Complete `Toolbar` functionality (Resume/Contact modals wired to real content), `LayersPanel` in `projectList` mode, `ProjectCard` grid with featured-project visual priority, hero identity block.
- **Deliverables:** A complete, functional Home page.
- **Dependencies:** `ResumeViewer`, `ContactPanel` content ready (`content/profile.md`, `content/resume.md`).
- **Acceptance criteria:** A recruiter can identify who the candidate is, see the 2 strongest projects prioritized, and reach resume/contact within one click, with zero required interaction beyond scrolling — matches `ACCEPTANCE_CRITERIA.md`.
- **Do NOT build yet:** Analytics, remaining lighter-depth project content if not yet drafted.

## Phase 5 — Additional projects

- **Objective:** Populate the remaining 3 case studies (1 more strong, 2 lighter).
- **Features:** No new components — reuse the Phase 2 template entirely, driven by content data.
- **Deliverables:** All 4 case studies live.
- **Dependencies:** Remaining project content drafted per `CONTENT_SPEC.md`, respecting the strong/light depth distinction in `CONTENT_MODEL.md`.
- **Acceptance criteria:** All 4 projects render correctly; lighter projects are honestly shorter, not visually broken or padded.
- **Do NOT build yet:** New component variants per project — if a project seems to need one, revisit whether the template itself needs adjustment (rare) rather than building one-off components.

## Phase 6 — Responsive / mobile

- **Objective:** Full mobile/tablet pass across every page and interaction.
- **Features:** Verify and refine all responsive behaviors specified in `DESIGN_PRINCIPLES.md` and `INTERACTION_SPEC.md` (Mobile Interactions section) across real devices/viewport sizes, not just browser dev tools.
- **Deliverables:** Confirmed working experience at common breakpoints (small phone, large phone, tablet, small laptop, large desktop).
- **Dependencies:** Phases 1–5 complete.
- **Acceptance criteria:** No feature is desktop-only in function; no layout breakage or overlap at any tested width; touch equivalents exist for all hover-dependent desktop interactions.
- **Do NOT build yet:** New features — this phase is refinement of existing scope only.

## Phase 7 — Polish

- **Objective:** Visual and motion refinement pass.
- **Features:** Motion timing/easing refinement (Framer Motion), glassmorphism contrast double-check on real content (not just design mockups), icon/typography consistency pass, `prefers-reduced-motion` verification, dark-mode decision finalized and applied consistently (see open decision in `DESIGN_PRINCIPLES.md`).
- **Deliverables:** A visually cohesive, refined final product.
- **Dependencies:** Phases 1–6 complete.
- **Acceptance criteria:** Matches `ACCEPTANCE_CRITERIA.md` visual design and interaction criteria.
- **Do NOT build yet:** New content or features — polish only.

## Phase 8 — Testing / deployment

- **Objective:** Final QA and launch.
- **Features:** Accessibility audit (automated + manual contrast checks per `TECH_SPEC.md`), cross-browser check, performance check (Lighthouse or equivalent), SEO metadata verification, deploy to Vercel.
- **Deliverables:** Live, deployed portfolio.
- **Dependencies:** Phases 1–7 complete.
- **Acceptance criteria:** All items in `ACCEPTANCE_CRITERIA.md` pass; site is live at a shareable URL.
- **Do NOT build yet:** N/A — this is the final phase for v1.

---

## Explicitly out of scope for all phases (v1)

- Pan/zoom functional canvas
- Full inspect/redline spec system
- Comments/annotations system
- Contact form (email/LinkedIn link only)
- CMS integration
- Fabricated prototype interactivity for projects without a real prototype
