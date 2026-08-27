import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arsh Prabhat — UI/UX Designer & Product Designer Portfolio",
  description:
    "Figma-inspired, glassmorphic portfolio site showcasing Arsh Prabhat's UX design work, SIH 2025 AI projects, design systems, and internship case studies.",
  openGraph: {
    title: "Arsh Prabhat — UI/UX Designer & Product Designer Portfolio",
    description:
      "Figma-inspired, glassmorphic portfolio site showcasing UX design work, SIH 2025 AI projects, and design systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-canvas text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
