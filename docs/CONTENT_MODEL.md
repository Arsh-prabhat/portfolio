# Content Model

Structured data model for portfolio content, kept separate from UI components per `README.md`'s development philosophy. Each project = one metadata object (JSON/TS) + one MDX file (or set of MDX section files) for long-form content.

## Project schema (TypeScript)

```typescript
interface Project {
  slug: string;                    // URL segment, e.g. "matrimonial-app"
  title: string;
  oneLineDescription: string;      // shown on ProjectCard, ~1 sentence
  role: string;                    // e.g. "Sole designer — research, UI, testing"
  timeline: string;                // e.g. "3 months, 2024"
  team?: string;                   // optional
  featured: boolean;               // true for the 2 strongest projects
  depth: "strong" | "light";       // drives how much content is expected/shown
  thumbnail: string;               // path under /public/images/[slug]/
  tags?: string[];                 // e.g. ["Mobile", "Research", "Design System"]
  sections: ProjectSections;
  designDecisions: DesignDecision[];
  hasPrototype: boolean;
  prototype?: PrototypeData;       // required if hasPrototype is true
}
```

## Section schema

```typescript
interface ProjectSections {
  problem: string;          // MDX/rich content — required for all projects
  process?: string;         // MDX — optional, present only where real
  screens: MediaItem[];     // required — final visual design, at least 1
  outcome: string;          // MDX — required
  learnings: string;        // MDX — required, brief
}
```

## Media schema

```typescript
interface MediaItem {
  type: "image" | "video";
  src: string;               // path under /public/images/[slug]/ or /public/videos/[slug]/
  alt: string;                // required — accessibility
  caption?: string;
}
```

## Prototype schema

```typescript
interface PrototypeData {
  embedUrl: string;                  // e.g. Figma prototype embed link
  fallbackDescription: string;       // required — accessibility + failure fallback
  externalLink: string;              // "open in new tab" fallback
}
```

## Design decision schema

```typescript
interface DesignDecision {
  decision: string;             // what was decided, e.g. "Simplified the onboarding to 2 steps"
  rationale: string;            // why — honest, first-person reflection
  reconstructed: boolean;       // true if this is reconstructed-from-memory rather than contemporaneous documentation
}
```

Note: `reconstructed: true` doesn't need to be shown as a literal UI badge (that could read as odd/undermining) — but the underlying content for reconstructed decisions should be written in the honest reflective voice specified in `CONTENT_SPEC.md` ("Looking back, the reasoning was...") so the distinction is felt in tone even if not explicitly labeled. This flag exists primarily to help the candidate (and any future editor) track which entries need that careful framing.

## Metadata (site-level)

```typescript
interface ProfileMetadata {
  name: string;
  title: string;
  positioning: string;        // one-line, shown in hero
  bio: string;                 // 2–4 sentences
  location?: string;
  photo?: string;
  email: string;
  linkedin: string;
  resumeUrl: string;
}
```

## Tags

Optional per-project tags (e.g., "Mobile," "Research," "Design System," "0→1") — used only if the candidate wants lightweight filtering/scanning support in the layers panel or command palette. Not required for MVP; can be added without restructuring the schema since it's already an optional array.

## Outcomes

Free-text MDX (`sections.outcome`) rather than a rigid metrics schema — reasoning: forcing structured "metric: value" fields risks pressuring the candidate to invent numbers they don't have. Real metrics can simply be written into the prose where genuinely known; qualitative outcomes (e.g., "shipped to production and used by delivery partners daily") are equally valid and should not be shoehorned into a fake-quantitative format.

## Depth-driven rendering rule

The `depth: "strong" | "light"` field is read by the UI layer to determine section-length expectations and whether extended sub-sections (e.g., detailed Process breakdown) render with more visual space — but it does **not** hide or disable any section for "light" projects. Light projects still get full header/problem/screens/outcome/learnings; they simply may have shorter `process` and fewer `designDecisions` entries, which is expected and honest, not a degraded experience.

## Example: minimal project entry (light-depth project)

```typescript
{
  slug: "project-03",
  title: "Internal Ops Dashboard",
  oneLineDescription: "Redesigned a cluttered internal dashboard used daily by ops staff.",
  role: "UI design, usability review",
  timeline: "3 weeks, 2024",
  featured: false,
  depth: "light",
  thumbnail: "/images/project-03/thumb.png",
  hasPrototype: false,
  sections: {
    problem: "...",
    screens: [ /* MediaItem[] */ ],
    outcome: "...",
    learnings: "..."
    // process omitted — none preserved for this project
  },
  designDecisions: [
    { decision: "Simplified the table view to reduce visual noise", rationale: "...", reconstructed: true }
  ]
}
```
