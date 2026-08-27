# Component Architecture

Components determined by the actual product decided above — not a blind reuse of the brief's suggested list. Each entry below states responsibility, inputs, outputs/state, and dependencies.

## AppShell

- **Responsibility:** Persistent layout wrapper for every route — renders `Toolbar` and provides the overall chrome frame (including responsive collapse behavior between desktop multi-panel and mobile single-column layouts).
- **Inputs:** `children` (the current route's page content).
- **State:** Holds/exposes responsive breakpoint state if needed for conditional rendering (or delegates entirely to CSS/Tailwind responsive classes where possible — prefer CSS over JS for layout changes).
- **Dependencies:** `Toolbar`, `CommandPalette` (mounted here so it's available globally via `Cmd+K`).
- **Reuse:** Used by every route; no route renders its own chrome independently.

## Toolbar

- **Responsibility:** Top bar — name/home link, current context label, Resume trigger, Contact trigger, command palette trigger icon.
- **Inputs:** `contextLabel` (string — e.g., current project name or "Home").
- **State:** None significant; delegates open/close of Resume/Contact to shared context or local modal state.
- **Dependencies:** `ResumeViewer` / `ContactPanel` (as modals/drawers it can trigger).
- **Reuse:** Single instance, rendered by `AppShell`.

## LayersPanel

- **Responsibility:** Context-aware left panel. On Home: lists all 4 projects (styled as layers), prioritizing the 2 strongest visually. On a project page: lists that project's available sections (Problem, Process, Screens, Prototype [conditional], Outcome) as jump-nav anchors.
- **Inputs:** `mode: 'projectList' | 'sectionList'`, `items` (array of projects or sections depending on mode), `activeItemId` (for highlighting current scroll position on project pages).
- **State:** Tracks which item is "active" (via scroll position on project pages); collapsible/expanded state on mobile.
- **Dependencies:** Project metadata (from `content/projects/*`) when in `projectList` mode.
- **Reuse:** Same component, different mode/data — not two separate components, to keep the visual language consistent.

## Canvas

- **Responsibility:** The main scrollable content area with the dot-grid texture background. On Home, renders `ProjectCard` grid; on a project page, renders the case-study content sections in order.
- **Inputs:** `children` (page-specific content) or `projects` (array, for Home mode).
- **State:** None of its own — purely a styled container; scroll behavior is native, not custom-implemented (explicitly not a pan/zoom canvas — see `PRODUCT_BRIEF.md` risks).
- **Dependencies:** `ProjectCard` (Home mode).
- **Reuse:** Two usages (Home grid, project-page content wrapper) sharing the same visual texture/styling.

## ProjectCard

- **Responsibility:** Represents one project on the Home canvas — image/thumbnail, title, one-line description, visual priority styling (larger/featured treatment for the 2 strongest projects).
- **Inputs:** `project` (metadata object: title, slug, oneLineDescription, thumbnail, `featured: boolean`).
- **State:** Hover/focus visual state only.
- **Dependencies:** Links to `/project/[slug]`.
- **Reuse:** 4 instances on Home, driven entirely by content data — no per-project custom components.

## InspectorPanel

- **Responsibility:** Right-side panel (project pages only) rendering the "Design Decisions" reflection content. Collapses to an inline expandable section on mobile rather than a persistent side column.
- **Inputs:** `designDecisions` (MDX/rich content from that project's content file), `isCollapsedByDefault` (boolean, viewport-dependent).
- **State:** Expanded/collapsed (mobile only).
- **Dependencies:** None beyond content data.
- **Reuse:** One instance per project page, content-driven; not present on Home (no InspectorPanel on the landing view).

## PrototypeEmbed

- **Responsibility:** Renders the single real interactive prototype (for the one project that has one) — iframe or embedded demo, with loading state and a fallback "open in new tab" link.
- **Inputs:** `embedUrl`, `fallbackDescription` (for accessibility/failure fallback).
- **State:** Loading/error state for the embed.
- **Dependencies:** None beyond the external embed source.
- **Reuse:** Conditionally rendered on exactly one project page — not stubbed or rendered as disabled on others (per `INFORMATION_ARCHITECTURE.md`, absence means omission, not a disabled state).

## CommandPalette

- **Responsibility:** Global `Cmd+K` overlay for quick navigation — jump to project, jump to section (within current project context), open Resume, open Contact.
- **Inputs:** Derived from all project/section metadata (built from content data, not hardcoded).
- **State:** Open/closed, search query, keyboard-selected index.
- **Dependencies:** Routing (Next.js router), content metadata.
- **Reuse:** Single global instance, mounted once in `AppShell`.

## ResumeViewer

- **Responsibility:** Modal/drawer presenting the resume (embedded preview + direct download link). Also reachable as a fallback direct route (`/resume`) for shareable links.
- **Inputs:** `resumeFileUrl`.
- **State:** Open/closed (if modal), or none (if standalone route render).
- **Dependencies:** Static resume PDF asset.
- **Reuse:** Triggered from `Toolbar` and `CommandPalette`.

## ContactPanel

- **Responsibility:** Modal/drawer with email + LinkedIn (and any other relevant links). No form in v1.
- **Inputs:** `contactInfo` (from `content/profile.md` metadata).
- **State:** Open/closed.
- **Dependencies:** None beyond static content.
- **Reuse:** Triggered from `Toolbar` and `CommandPalette`.

## SectionBlock

- **Responsibility:** Generic wrapper for each case-study content section (Problem, Process, Screens, Outcome, Learnings) — provides consistent heading style, anchor ID (for `LayersPanel` jump-nav), and spacing.
- **Inputs:** `id`, `title`, `children` (MDX content).
- **State:** None.
- **Dependencies:** None.
- **Reuse:** Used repeatedly within every project page — this is what keeps section styling consistent without duplicating layout code per project.

## Explicitly not built

- No `PropertiesPanel` in the literal Figma sense (real property/value editing) — folded into `InspectorPanel`'s simpler, content-only role.
- No `LayerTree` with expand/collapse nesting beyond the simple flat section list `LayersPanel` already provides — a nested tree would over-engineer navigation for 4–8 flat sections per project.
- No `RecruiterMode` as a separate component/toggle — the default Home view already serves this purpose (see `INFORMATION_ARCHITECTURE.md`).
