import { ProfileMetadata, Project } from "./types";

export const profileData: ProfileMetadata = {
  name: "Arsh Prabhat",
  title: "UI/UX Design Intern & Product Designer",
  positioning: "Product & UI/UX Designer specializing in wireframing, prototyping, user research, usability testing, and design systems.",
  bio: "Computer Science & IT student (KIET '27) with hands-on UX design internship experience at HoocAI Technologies and Mockmate. Passionate about systems thinking, clean interfaces, and user-centric problem solving.",
  location: "Ghaziabad, Uttar Pradesh, India",
  email: "prabhatarsh1974@gmail.com",
  linkedin: "https://linkedin.com/in/arsh-prabhat",
  resumeUrl: "/resume.pdf",
};

export const projectsData: Project[] = [
  {
    slug: "matrimonial-platform",
    title: "Matrimonial Platform — Internship UX Case Study",
    oneLineDescription: "Redesigned onboarding using a value-first flow to reduce profile completion friction and boost engagement.",
    role: "UX Design Intern — Research, Flow Redesign, UI & Verification Workflows",
    timeline: "Internship Project",
    team: "Design & Product Team",
    featured: true,
    depth: "strong",
    thumbnail: "/images/project-01/thumb.svg",
    tags: ["UI/UX Design", "Figma", "Adobe XD", "Matchmaking", "Prototype"],
    hasPrototype: true,
    prototype: {
      embedUrl: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2Fsample-matrimonial-flow",
      fallbackDescription: "Interactive Figma prototype demonstrating the value-first profile verification, compatibility matching, and direct communication flow.",
      externalLink: "https://www.figma.com/proto/sample-matrimonial-flow"
    },
    sections: {
      problem: "Users faced high drop-off and friction during initial profile creation. Requiring exhaustive personal data before demonstrating profile compatibility reduced user motivation and connection completion rates.",
      process: "Mapped out friction points in the multi-step onboarding funnel. Redesigned onboarding around progressive disclosure cards: allowing users to preview high-compat profiles first before filling secondary lifestyle fields. Introduced verified trust badges and direct communication workflows.",
      screens: [
        {
          type: "image",
          src: "/images/project-01/screen-1.svg",
          alt: "Matrimonial Platform - Match Feed & Compatibility Verification",
          caption: "Primary matchmaking feed featuring verified badges, quick compatibility highlights, and one-tap connection triggers."
        },
        {
          type: "image",
          src: "/images/project-01/screen-2.svg",
          alt: "Matrimonial Platform - Progressive Value-First Onboarding",
          caption: "Value-first progressive onboarding flow chunking profile setup into 3 intent-focused steps."
        }
      ],
      outcome: "Successfully reduced profile completion friction, improving initial user onboarding completion and boosting active connection inquiries across test cohorts.",
      learnings: "Value-first design increases user trust. Demonstrating immediate reward before asking for sensitive profile data significantly improves onboarding metrics."
    },
    designDecisions: [
      {
        decision: "Shifted to value-first onboarding: preview matches before full profile completion",
        rationale: "Analysis showed requiring 20+ fields upfront caused early drop-off. Giving users immediate visual feedback of profile value created motivation to complete setup.",
        reconstructed: false
      },
      {
        decision: "Standardized verification & trust badges on profile cards",
        rationale: "Safety and authenticity were primary user concerns during research. Highlighting verified profiles directly improved connection confidence.",
        reconstructed: false
      }
    ]
  },
  {
    slug: "kolam-vidya-sih",
    title: "Kolam Vidya — Smart India Hackathon 2025",
    oneLineDescription: "Secured Top 50 nationwide selection for an AI-powered platform analyzing traditional Kolam art patterns.",
    role: "UI/UX Lead & Analyzer Module Co-Developer",
    timeline: "Smart India Hackathon 2025",
    team: "2nd Place College Round • Top 50 Project",
    featured: true,
    depth: "strong",
    thumbnail: "/images/project-02/thumb.svg",
    tags: ["SIH 2025", "AI Platform", "Computer Vision", "UI/UX", "Python"],
    hasPrototype: false,
    sections: {
      problem: "Traditional Indian Kolam art patterns involve intricate mathematical symmetry that is difficult to digitize, analyze, and preserve programmatically without specialized cultural and computer vision tools.",
      process: "Led UI/UX design for the web console and contributed to the analyzer module using Python and OpenCV. Designed step-by-step image upload, symmetry detection visualization, pattern recreation canvas, and testing workflows.",
      screens: [
        {
          type: "image",
          src: "/images/project-02/screen-1.svg",
          alt: "Kolam Vidya - Pattern Analyzer & Symmetry Detection UI",
          caption: "Interactive pattern analyzer workspace showing computer vision symmetry grid and vector recreation controls."
        },
        {
          type: "image",
          src: "/images/project-02/screen-2.svg",
          alt: "Kolam Vidya - SIH 2025 Results & Generation Console",
          caption: "AI pattern generation dashboard and cultural archive catalog."
        }
      ],
      outcome: "Secured 2nd position in the college round of Smart India Hackathon 2025 and shortlisted among the Top 50 projects out of thousands of nationwide team submissions.",
      learnings: "Combining AI/computer vision with intuitive UI design allows complex mathematical analysis to feel accessible and engaging to non-technical users."
    },
    designDecisions: [
      {
        decision: "Designed real-time symmetry overlay grid over user uploaded images",
        rationale: "Users needed instant visual feedback on line accuracy and symmetry axes during computer vision pattern analysis.",
        reconstructed: false
      }
    ]
  },
  {
    slug: "mockmate-peer-learning",
    title: "Mockmate — Peer-Learning Platform UX",
    oneLineDescription: "Designed peer matching and interview collaboration flows connecting students with study partners.",
    role: "UI/UX Design Intern (Aug 2025 – Oct 2025)",
    timeline: "3 months, 2025",
    featured: false,
    depth: "light",
    thumbnail: "/images/project-03/thumb.svg",
    tags: ["EdTech", "Peer Matching", "UI/UX", "Prototyping"],
    hasPrototype: false,
    sections: {
      problem: "Students struggled to find reliable peer interview partners, study mates, and skill-based collaborators matching their target roles and schedules.",
      screens: [
        {
          type: "image",
          src: "/images/project-03/screen-1.svg",
          alt: "Mockmate - Peer Match & Session Booking UI",
          caption: "Peer discovery hub featuring skill tag filters, interview availability slots, and instant booking."
        }
      ],
      outcome: "Shipped high-fidelity interfaces and interactive prototypes that enhanced user engagement and streamlined peer mock interview scheduling.",
      learnings: "Peer-to-peer scheduling requires minimal steps and calendar clarity to prevent booking drop-offs."
    },
    designDecisions: [
      {
        decision: "Simplified peer discovery with 1-tap skill filters and instant slot booking",
        rationale: "Reducing steps between finding a candidate partner and scheduling a mock session increased booked interviews.",
        reconstructed: false
      }
    ]
  },
  {
    slug: "hoocai-design-system",
    title: "HoocAI Technologies — Multi-Product UI System",
    oneLineDescription: "Designed responsive UI components and interfaces for 8+ client products across healthcare, e-commerce, and wellness.",
    role: "UX Design Intern (Jan 2026 – Present)",
    timeline: "Jan 2026 – Present",
    featured: false,
    depth: "light",
    thumbnail: "/images/project-04/thumb.svg",
    tags: ["Healthcare", "E-Commerce", "Design Systems", "Framer"],
    hasPrototype: false,
    sections: {
      problem: "Client products across healthcare, e-commerce, and wellness required fast design iterations with consistent typography, components, and responsive layouts.",
      screens: [
        {
          type: "image",
          src: "/images/project-04/screen-1.svg",
          alt: "HoocAI Client Systems & Component Spec",
          caption: "Multi-product UI kit containing responsive navigation bars, data cards, and form tokens."
        }
      ],
      outcome: "Successfully created user flows, wireframes, and production-ready interfaces for 8+ client products across multiple domain verticals.",
      learnings: "Designing for diverse industries requires a flexible design system that scales across B2C wellness and complex B2B e-commerce requirements."
    },
    designDecisions: [
      {
        decision: "Created a shared component library with light/dark adaptive tokens",
        rationale: "Allowed rapid adaptation of client UI kits without redesigning foundational grid and button layouts.",
        reconstructed: false
      }
    ]
  }
];

export function getProfile(): ProfileMetadata {
  return profileData;
}

export function getAllProjects(): Project[] {
  return projectsData;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}
