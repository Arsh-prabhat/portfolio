export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
}

export interface PrototypeData {
  embedUrl: string;
  fallbackDescription: string;
  externalLink: string;
}

export interface DesignDecision {
  decision: string;
  rationale: string;
  reconstructed: boolean;
}

export interface ProjectSections {
  problem: string;          // MDX/Markdown content — required
  process?: string;         // MDX/Markdown content — optional
  screens: MediaItem[];     // required visual design media
  outcome: string;          // MDX/Markdown content — required
  learnings: string;        // MDX/Markdown content — required
}

export interface Project {
  slug: string;
  title: string;
  oneLineDescription: string;
  role: string;
  timeline: string;
  team?: string;
  featured: boolean;
  depth: "strong" | "light";
  thumbnail: string;
  tags?: string[];
  sections: ProjectSections;
  designDecisions: DesignDecision[];
  hasPrototype: boolean;
  prototype?: PrototypeData;
}

export interface ProfileMetadata {
  name: string;
  title: string;
  positioning: string;
  bio: string;
  location?: string;
  photo?: string;
  email: string;
  linkedin: string;
  resumeUrl: string;
}
