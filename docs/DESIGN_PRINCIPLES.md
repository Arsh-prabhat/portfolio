# Design Principles

## Brand personality

Target impression (candidate's own words): **clean, expressive, wow.**

Translation into design terms:
- **Clean** → generous whitespace, restrained color, clear typographic hierarchy, no visual clutter competing with case-study content.
- **Expressive** → confident use of glassmorphism and Figma-style chrome as texture/personality, motion that feels considered rather than decorative-for-its-own-sake.
- **Wow** → a strong first-impression moment (the landing "workspace" view) that is visually distinctive on first load, without requiring interaction to appreciate it.

These three must stay in tension deliberately: "wow" is capped by "clean" (nothing that clutters), and both are capped by usability (nothing that costs a recruiter time).

## Visual direction

Figma-inspired workspace chrome (toolbar, layers-style panel, dot-grid canvas texture, inspector-style panel) rendered in a minimalist, glassmorphic style. Reasoning: this satisfies "expressive/wow" through a visual system a design-literate reviewer will immediately recognize and appreciate as intentional, while the minimalism keeps it "clean" and prevents the chrome from overwhelming the actual work.

Glassmorphism is applied **only to structural chrome surfaces** — toolbar, side panels, cards on hover — never to body text backgrounds or large content areas. Reasoning: blur/translucency reduces text contrast; confining it to chrome protects readability while still delivering the visual signature throughout.

## Typography

- One primary typeface for UI chrome (toolbar labels, panel headers, nav) — should read as slightly technical/geometric to reinforce the "tool" feeling (e.g., an Inter/Söhne-adjacent grotesk).
- One typeface (can be the same family, different weights) for case-study body content, optimized purely for long-form readability — larger x-height, comfortable line length (60–75 characters), generous line-height (1.5–1.6).
- Avoid decorative or display fonts for body copy — the "expressive" quality should come from layout and chrome, not from typographic novelty that slows reading.
- Type scale should be modest (5–6 steps) — this is a content site, not a type-specimen showcase.

## Color strategy

- Neutral-dominant palette (grays/near-blacks/near-whites) to support the minimalist "clean" goal and to let glass/blur effects read clearly against it.
- One accent color, used sparingly, for interactive elements (links, active states, the "wow" moment on the landing view) — reasoning: a single accent keeps the palette legible as "minimalist" while still giving the design a personality color a recruiter will remember.
- Dark mode should be considered from the start, not bolted on later — Figma's own visual language is strongly associated with dark-UI tooling contexts, and glassmorphism often reads more effectively against a dark base. (Confirm with candidate whether dark-only, light-only, or both — flagged as an open decision below.)
- Contrast ratios must meet WCAG AA minimum (4.5:1 body text, 3:1 large text/UI) at all times, including on any glass/blurred surface — verify manually since blur can visually pass a false contrast check.

**Open decision for candidate:** dark-mode-only, light-mode-only, or toggleable both. Recommendation: dark-mode-only for v1 (matches Figma-tool association, simplifies glassmorphism execution, reduces scope) — revisit if candidate strongly prefers light.

## Spacing

- 8px base spacing grid — standard, predictable, and reads as "systematic" (reinforces the tool/design-system association without needing explanation).
- Generous outer margins on all case-study content — the "clean" goal requires breathing room; content should never feel cramped against panel edges.

## Borders

- Thin (1px) low-opacity borders on panels and cards, consistent with real design-tool chrome (Figma itself uses subtle hairline borders on panels) — reinforces the metaphor without needing heavy visual weight.

## Radius

- Consistent, moderate corner radius (not sharp, not pill-shaped) on cards and panels — Figma's own UI uses a restrained radius; matching this supports the visual reference without going cartoonish/playful, which would undercut "clean."

## Shadows

- Soft, low-opacity shadows only on elevated/floating elements (command palette, hover-state cards) — reinforces the glass/panel depth metaphor. Avoid heavy drop shadows elsewhere; they read as dated and conflict with the minimalist goal.

## Iconography

- A single consistent icon set (e.g., a geometric line-icon library) used sparingly — primarily in the toolbar and layers panel, to reinforce the tool metaphor (file icons, layer-type icons, zoom-control icon, etc. — cosmetic, not functional).
- Icons should never be the only signifier for a critical action (resume, contact) — always paired with text label, for clarity and accessibility.

## Motion

- Framer Motion used for: panel enter/exit transitions, hover-state micro-interactions on project cards, command palette open/close.
- Motion should be fast (150–250ms) and purposeful — communicating spatial relationships (e.g., a panel sliding in from where it "lives") rather than being decorative.
- No motion should be required to understand or operate the interface — motion enhances, never gates, comprehension.
- Respect `prefers-reduced-motion` — all motion must have a reduced/instant fallback.

## Interaction principles

1. **Look like a tool, behave like a website.** Every visual chrome element (toolbar, layers panel, zoom readout) is allowed to reference Figma visually; no element should require the visitor to know how Figma works to operate it.
2. **Nothing gates content.** Command palette, hover states, and any cosmetic canvas detail must be strictly additive — a visitor who never touches them still reaches everything.
3. **One primary action always visible.** Resume/contact access should never require more than one click from any screen.
4. **Strongest work first, always.** Visual hierarchy on the landing view must prioritize the two strongest case studies regardless of project list order.

## Accessibility

- WCAG AA minimum across all text, including on glass/blurred surfaces (verify manually, not just via automated tools, since blur effects can produce misleading contrast scores).
- All interactive elements keyboard-navigable, including the command palette and layers-panel nav — no functionality should depend on hover or drag.
- Focus states must be visible and match the visual language (not a browser-default outline that clashes with the aesthetic, but never removed without a compliant replacement).
- `prefers-reduced-motion` respected throughout.
- No content or navigation may depend on color alone (e.g., an "active layer" state needs more than a color change — a weight change, icon, or underline too).
- Alt text required for all case-study images; prototype embeds must have a text-based fallback description of what the prototype demonstrates.

## Responsive behavior

- Multi-panel layout (toolbar + layers panel + canvas + inspector panel) is a desktop-only visual arrangement. On mobile/tablet, panels collapse into a single vertical flow: toolbar becomes a simplified sticky header, layers panel becomes a collapsible section-jump menu (e.g., a dropdown or expandable list), inspector content moves inline within the case study rather than in a side panel.
- No feature may depend on a viewport-only interaction (hover, right-click, drag) — every interaction must have a touch-equivalent.
- Breakpoints should be content-driven (test at common device widths) rather than arbitrary; case-study readability at narrow widths takes priority over preserving the desktop chrome's visual arrangement.

## Content hierarchy

On the landing view, in order of visual priority:
1. Name + role/title (immediate identity)
2. Resume + contact access (toolbar, persistent)
3. Two strongest case studies (largest/most prominent cards)
4. Remaining case studies (present, but visually secondary)
5. Cosmetic chrome details (zoom readout, dot-grid texture, decorative icons) — lowest priority, must never compete visually with 1–4.

Within a case study, in order:
1. Project title, one-line problem/outcome summary, role, timeline (immediately visible, no scrolling required)
2. Problem/context
3. Process (to the honest extent it exists)
4. Screens/visual design
5. Prototype (where available)
6. Outcome
7. Design Decisions / reflection panel
8. Learnings
