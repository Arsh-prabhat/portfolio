# Agent Instructions

Binding operating rules for any AI coding agent (e.g., Google Antigravity) working on this project. These are not suggestions — follow them as strictly as the code itself.

## Before making any change

1. Read every file in `/docs` before making architectural changes, adding dependencies, or implementing a new feature. Do not rely on this file alone — `PRODUCT_BRIEF.md`'s feature classification table and `INTERACTION_SPEC.md` govern what gets built and how it behaves.
2. Check `MVP_ROADMAP.md` for the current phase before building anything — do not implement future-phase features prematurely, even if they seem easy to add while already working in a related area.

## Product boundaries — do not cross these

3. Do not invent product requirements. If something isn't specified in `/docs`, either find the closest applicable principle (see "Resolving ambiguity" below) or flag it rather than guessing silently and proceeding.
4. Do not redesign the information architecture without explicit approval — `INFORMATION_ARCHITECTURE.md` and `INTERACTION_SPEC.md` are the source of truth for structure and behavior.
5. **Never build a functional pan/zoom canvas**, under any framing or naming. This has been explicitly and permanently rejected (see `PRODUCT_BRIEF.md` risks and feature classification). If a task seems to imply this, stop and flag it rather than implementing it.
6. Never build a full inspect/redline spec system, a comments/annotations system, or a contact form — these are explicitly out of scope for v1 (see `MVP_ROADMAP.md`).
7. Never fabricate the appearance of a feature that doesn't have real content behind it — e.g., do not render a disabled/greyed-out "Prototype" tab for a project that has no real prototype. Omit entirely, per `INFORMATION_ARCHITECTURE.md`.
8. Never invent or embellish project content (metrics, research methodology, iteration history) beyond what's provided in `/content`. If content seems thin, that reflects `CONTENT_MODEL.md`'s `depth: "light"` designation — it is expected, not a bug to silently "fix" by adding invented detail.

## Technical discipline

9. Do not introduce unnecessary dependencies. Check `TECH_SPEC.md`'s stated stack before adding a library — if something isn't listed there (e.g., a state management library beyond React Context/Zustand), don't add it without a clear, documented reason tied to an actual requirement.
10. Keep components reusable per `COMPONENT_ARCHITECTURE.md` — e.g., `LayersPanel` must remain one component with a mode prop, not forked into separate per-page components.
11. Keep content separate from UI code at all times — content changes (editing a project's text, adding a new project) should never require editing component code, per `CONTENT_MODEL.md`.
12. Preserve accessibility requirements from `DESIGN_PRINCIPLES.md` and `TECH_SPEC.md` in every change — this includes keyboard operability, contrast (especially on glass/blurred surfaces), `prefers-reduced-motion` handling, and semantic HTML. Accessibility is not a later pass to skip now and fix later.
13. Test responsive layouts for every UI change — desktop multi-panel and mobile single-column collapse behavior, per `INTERACTION_SPEC.md`'s Mobile Interactions section.
14. Do not replace working architecture unnecessarily. If a component or pattern is functioning and matches spec, prefer extending it over rewriting it.

## Process discipline

15. Explain significant architectural decisions when made — briefly note why, referencing the relevant `/docs` file, so decisions remain traceable.
16. Verify changes in the browser (or equivalent preview) before considering a task complete — do not assume code correctness from source alone, especially for visual/interaction work where the whole point is how it looks and feels.
17. Check for regressions before completing a task — specifically re-verify: keyboard navigation still works, mobile layout still collapses correctly, and no previously-working interaction broke.

## Resolving ambiguity

When a requirement is ambiguous or not explicitly covered by `/docs`:

1. First, check whether an existing design/product principle resolves it by analogy (e.g., `DESIGN_PRINCIPLES.md`'s "look like a tool, behave like a website" principle, or "nothing gates content" — these should resolve most edge cases in interaction design).
2. If a principle doesn't clearly resolve it, default to the **simpler, less novel implementation** — this project's stated philosophy consistently favors restraint over cleverness (see `PRODUCT_BRIEF.md` risks and `README.md` development philosophy).
3. If the ambiguity is about content (not knowing what to say for a given project field), do not invent — leave a clear placeholder/TODO and flag it, rather than writing fabricated content that could misrepresent the candidate's actual work or process.
4. If the ambiguity is significant enough that either resolution meaningfully changes the product (not just an implementation detail), flag it explicitly for the candidate rather than proceeding — this mirrors the same standard used during this project's own planning interview: material decisions get asked, not assumed.
