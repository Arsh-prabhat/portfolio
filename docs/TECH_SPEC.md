# Tech Spec

## Framework

**Next.js (App Router) + React + TypeScript.**

Reasoning: static-content-heavy site (4 case studies, mostly text/images) with a handful of interactive components (command palette, panel collapse/expand, prototype embed). Next.js gives strong defaults for image optimization, routing, and static generation — all of which matter for a portfolio where fast load time directly affects a 90-second recruiter scan. TypeScript is chosen for reliability when an AI coding agent is doing most of the implementation — type errors catch content/shape mismatches early.

Explicitly not chosen: a heavier framework (e.g., a custom WebGL/canvas engine) — nothing in this spec requires real canvas rendering, since the "canvas" is a styled scroll area, not a functional zoom/pan surface.

## Component architecture

See `COMPONENT_ARCHITECTURE.md` for full breakdown. High-level: a persistent `AppShell` (toolbar + layout frame) wraps all routes; `LayersPanel` and `InspectorPanel` are context-aware (their content changes based on whether you're on Home or a project page, not separate components per page).

## State management

**React Context, kept minimal.** Needed for: command palette open/close state, active section tracking (for layers-panel highlighting), and possibly a global "current project" context.

**Zustand** only if command palette state grows to need cross-component subscriptions beyond what Context handles cleanly (e.g., if search/filter logic gets complex). Do not introduce Zustand preemptively — start with Context and escalate only if needed. This project's state needs are small; over-engineering state management here would violate the "don't over-engineer" instruction in the original brief.

No Redux, no heavier state library — unjustified for a 4-project static content site.

## Content architecture

Content lives in `/content`, decoupled from `/app` (components/routes). Format: **MDX for long-form project sections** (Problem, Process, Outcome, Design Decisions — allows rich text with embedded components like image galleries) combined with a **JSON/TS metadata file per project** for structured fields (title, role, timeline, slug, section availability flags like `hasPrototype: boolean`).

Reasoning: MDX allows non-trivial formatting (headings, images, callouts) within case-study prose without requiring a CMS; the JSON/TS metadata layer keeps structured fields (used for cards, nav, conditionals like "does this project have a Prototype section") queryable without parsing prose. See `CONTENT_MODEL.md` for exact schema.

## Asset management

Images and videos in `/public`, organized per-project (`/public/images/project-01/`, etc.). Next.js `<Image>` component used throughout for automatic optimization/responsive sizing — important given this is an image-heavy visual-design portfolio and load time affects the recruiter-speed goal directly.

Prototype embeds: if using Figma's embed API, load via iframe with lazy-loading (`loading="lazy"` equivalent) so it doesn't block initial page performance; if a coded demo, treat as its own lazy-loaded component.

## Routing

- `/` — Home (Present-mode-style landing)
- `/project/[slug]` — one route per case study, statically generated at build time (content is fixed, not user-generated — static generation is both simpler and faster than SSR here)
- Resume and Contact are **not necessarily separate routes** — implement as modal/drawer overlays triggered from the toolbar, to avoid an extra full navigation for something that should feel instant. (A `/resume` route can still exist as a direct-link fallback for sharing, redirecting to or rendering the same content.)

## Animation strategy

**Framer Motion**, scoped narrowly per `DESIGN_PRINCIPLES.md`: panel transitions, hover/press micro-interactions, command palette open/close. No scroll-jacking, no physics-based canvas interactions (explicitly rejected — see Product Brief risks). All animations must respect `prefers-reduced-motion` via Framer Motion's built-in reduced-motion handling.

## Responsive strategy

Tailwind's responsive utilities, mobile-first. Desktop multi-panel layout collapses to a single-column flow below a defined breakpoint (recommend testing at ~768px and ~1024px thresholds, adjusting based on actual panel content width). No feature may be desktop-only in function — only in layout arrangement (see `INTERACTION_SPEC.md` Mobile Interactions).

## Accessibility

- Semantic HTML wherever possible before reaching for custom components (e.g., real `<nav>`, `<button>`, `<a>` elements even within Figma-styled chrome).
- ARIA roles/states for custom interactive components (command palette as a real dialog, collapsible panels with `aria-expanded`).
- Automated checks (e.g., axe or Lighthouse accessibility audit) run before each deploy, but not treated as sufficient alone — manual contrast checks required on glass/blurred surfaces specifically, since automated tools can misjudge translucent backgrounds.

## SEO

- Standard Next.js metadata API for per-page titles/descriptions (each project should have a distinct, descriptive title tag and meta description — this matters if the link gets shared or indexed, e.g., for a referral or a public portfolio link shared on LinkedIn).
- Open Graph tags for link previews (important since portfolio links are frequently shared via LinkedIn/email/Slack to referral contacts) — should show name, role, and ideally a preview image, not a generic blank card.
- Static generation naturally supports good SEO/crawlability; no client-side-only rendering of critical content.

## Performance

- Target: fast first contentful paint and low layout shift, given the recruiter-speed goal is core to the product brief, not just a technical nicety.
- Lazy-load below-the-fold images and the prototype embed.
- Keep the glassmorphism/blur effects performant — avoid excessive backdrop-filter usage stacked across many elements simultaneously (can be a real mobile GPU cost); confine to the chrome surfaces specified in `DESIGN_PRINCIPLES.md`, not applied broadly.
- Avoid unnecessary client-side JS for content that can be statically rendered.

## Analytics

Optional, lightweight (e.g., Vercel Analytics or a privacy-respecting alternative) if the candidate wants to know which projects get viewed most — useful signal for iterating the portfolio later, but not required for MVP. Flagged as a nice-to-have, not a launch blocker.

## Deployment

**Vercel** — reasoning: first-party Next.js support, zero-config static generation and preview deployments, free tier sufficient for a personal portfolio, fast global CDN (directly supports the performance goal above).

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions). `backdrop-filter` (used for glassmorphism) has broad modern support but should degrade gracefully (a solid semi-transparent background as fallback) rather than breaking visually on unsupported browsers.

## Security considerations

Minimal attack surface given this is a static content site with no user accounts, forms, or backend data storage in v1 (no contact form = no server-side input handling to secure). If a contact form is added later, standard practices apply (input validation, spam protection) — out of scope for v1 per `CONTENT_SPEC.md`.
