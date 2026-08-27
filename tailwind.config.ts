import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        figma: {
          bg: "#1E1E1E",
          sidebar: "#1E1E1E",
          hover: "#2C2C2C",
          border: "#383838",
          active: "#0C8CE9",
          activeBg: "rgba(12, 140, 233, 0.15)",
          textPrimary: "#FFFFFF",
          textSecondary: "#B3B3B3",
          textMuted: "#757575",
          card: "#2C2C2C",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      boxShadow: {
        'figma-card': '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px #383838',
        'figma-glow': '0 0 20px rgba(12, 140, 233, 0.4)',
        'floating-bar': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px #383838',
      },
    },
  },
  plugins: [],
};

export default config;
