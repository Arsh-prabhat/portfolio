# Interaction Spec

Format for each interaction: **Trigger → Behavior → Result → Edge cases**

---

## 1. Landing on Home

- **Trigger:** Visitor navigates to root URL.
- **Behavior:** Toolbar, layers panel, and canvas render together (optionally staggered with a brief, skippable entrance animation, <400ms total, respecting `prefers-reduced-motion`).
- **Result:** Visitor sees name/title, resume/contact access, and all 4 project cards (2 strongest visually prioritized) without any interaction required.
- **Edge cases:** Slow network — show a lightweight skeleton/loading state matching the chrome layout (see Loading States below), never a blank screen. Reduced-motion users see content appear instantly, no stagger.

## 2. Navigating to a case study

- **Trigger:** Click/tap on a project card (Home) or a project entry in the layers panel.
- **Behavior:** Standard route transition to `/project/[slug]`; toolbar persists, layers panel content swaps from "project list" to "section list for this project," canvas loads case-study content.
- **Result:** Visitor lands at the top of the case study header (title, role, timeline, one-line summary) — never mid-scroll.
- **Edge cases:** Direct URL access (shared link) must work identically to in-app navigation — no dependency on client-side-only routing state.

## 3. Layers panel section jump-nav (within a case study)

- **Trigger:** Click/tap a section label in the left panel (Problem, Process, Screens, Prototype, Outcome).
- **Behavior:** Smooth scroll to that section's anchor within the same page (not a route change).
- **Result:** Section scrolls into view; the corresponding layers-panel entry visually indicates "active" (weight/icon/underline change — not color alone, per accessibility principle).
- **Edge cases:** If a section doesn't exist for this project (e.g., no Prototype), it is not listed at all — not shown disabled/greyed out.

## 4. Project switching from within a case study

- **Trigger:** Click a different project entry, accessible via a persistent "all projects" affordance in the layers panel (e.g., a collapsible top section) or by returning to Home first.
- **Behavior:** Route transition to the new project's case study.
- **Result:** New case study loads at its header, layers panel updates to reflect the new project's sections.
- **Edge cases:** None significant — this is a standard route change, not a stateful in-canvas transition.

## 5. Command palette (`Cmd+K` / `Ctrl+K`)

- **Trigger:** Keyboard shortcut, or click on the palette trigger icon in the toolbar.
- **Behavior:** Modal overlay opens with a search/filter input and a list of quick actions: jump to a project, jump to a section within the current project, open resume, open contact.
- **Result:** Selecting an entry performs that navigation and closes the palette.
- **Edge cases:** `Esc` closes without action. Palette must be fully keyboard-operable (arrow keys + Enter), not mouse-dependent. On mobile, the trigger icon is still present in the toolbar since `Cmd+K` isn't discoverable on touch devices; palette UI adapts to a full-screen sheet on small viewports.

## 6. Prototype embed (project with real prototype only)

- **Trigger:** Visitor scrolls to or jumps to the Prototype section.
- **Behavior:** Embedded interactive prototype (e.g., Figma embed or coded demo) loads within the canvas, framed consistently with the rest of the chrome (e.g., inside a device-frame or panel treatment).
- **Result:** Visitor can interact with the actual prototype inline, no separate tab required (though an "open in new tab" fallback link should be present).
- **Edge cases:** If the embed fails to load (network/CORS issues), show a clear fallback message with a direct link, never a silent blank space. Embed must not autoplay sound or hijack scroll.

## 7. Design Decisions / Inspector panel

- **Trigger:** Visible by default on desktop (right panel, persistent while in a case study); on mobile, presented as a collapsible/expandable inline section rather than a separate panel.
- **Behavior:** Displays honest rationale for key decisions in that project. No interaction required to view on desktop; a tap-to-expand on mobile.
- **Result:** Hiring-manager-tier visitors get process insight without it competing for space with the main canvas content on smaller screens.
- **Edge cases:** For lighter-depth projects, this panel is shorter — never padded with generic statements to appear equally deep. If genuinely minimal, a brief honest note is acceptable (e.g., "detailed decision history wasn't preserved for this project — see Screens and Outcome for the result").

## 8. Zoom-percentage readout (cosmetic detail)

- **Trigger:** Always visible in a corner of the canvas, styled like Figma's zoom control.
- **Behavior:** Purely decorative — may subtly animate/change on scroll for texture, but does not control any real zoom function.
- **Result:** Reinforces the visual metaphor at zero interaction cost.
- **Edge cases:** Must not be interactive-looking in a way that invites clicking (no cursor:pointer, no hover state implying functionality) — should read clearly as ambient chrome, not a broken control.

## 9. Hover states

- Project cards: subtle lift/glass-intensity increase + a Figma-style selection-outline flourish. Must have a touch/focus equivalent (see Mobile Interactions).
- Layers panel entries: background highlight on hover, matching the "active" state visual treatment used for keyboard focus.
- Toolbar actions (Resume, Contact): standard button hover feedback (opacity/background shift), no motion-heavy treatment — these are functional, not decorative.

## 10. Click/tap states

- All interactive elements must have a visible pressed/active state distinct from hover (important for touch devices, which have no hover state at all).
- Command palette entries: clear selected/highlighted state during keyboard navigation.

## 11. Loading states

- Route transitions: lightweight skeleton matching the target layout's chrome (toolbar + panel shapes + placeholder cards/content blocks), not a generic spinner — reinforces the "workspace" feel even while loading.
- Images: blur-up or dimension-reserved placeholders to prevent layout shift.
- Prototype embeds: explicit loading indicator within the embed frame, since third-party embeds can be slow.

## 12. Error states

- Failed route (invalid project slug): a clear "project not found" state within the same chrome (toolbar persists), with a link back to Home — never a bare browser 404 outside the app's visual system.
- Failed prototype embed: see Interaction 6 above.
- Failed resume load: fallback direct-download link always available as backup.

## 13. Empty states

- Not generally applicable (all 4 projects will have content by launch), but the layers panel and command palette must handle empty search/filter results gracefully (e.g., command palette search with no matches shows a plain "no results" message, not a blank list).

## 14. Mobile interactions

- Toolbar collapses to essential items: name/home, resume, contact, palette trigger — no loss of function, only layout simplification.
- Layers panel becomes a collapsible section (e.g., expandable list or dropdown) at the top of the case-study content rather than a persistent side column.
- Inspector/Design Decisions panel becomes an inline expandable section within the scroll flow (see Interaction 7).
- No interaction may depend on hover — all hover-only affordances (card lift, selection outline) get a tap/focus equivalent that persists briefly or toggles.
- Dot-grid canvas texture and other decorative chrome may simplify or reduce in visual weight on small screens to preserve content readability and performance — this is expected, not a bug.

## 15. Accessibility interactions

- Full keyboard operability: Tab order follows visual/logical order (toolbar → layers panel → canvas content → inspector panel); command palette fully keyboard-navigable.
- Skip-to-content link available for keyboard/screen-reader users to bypass toolbar/panel chrome and reach case-study content directly.
- All custom interactive components (command palette, collapsible panels) use appropriate ARIA roles/states (`role="dialog"`, `aria-expanded`, etc.).
- Motion-based feedback (hover lift, transitions) always paired with a non-motion signal (border, weight, icon) for users with `prefers-reduced-motion` or vestibular sensitivity.
