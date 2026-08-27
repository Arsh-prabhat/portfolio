"use client";

import React, { useState, useEffect } from "react";
import { LeftIconBar } from "./LeftIconBar";
import { Toolbar } from "./Toolbar";
import { HorizontalRuler } from "./CanvasRulers";
import { FloatingToolbar } from "./FloatingToolbar";
import { CommandPalette } from "./CommandPalette";
import { ResumeViewer } from "./ResumeViewer";
import { ContactPanel } from "./ContactPanel";
import { getProfile, getAllProjects } from "@/lib/content";

interface AppShellProps {
  children: React.ReactNode;
  contextLabel?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  contextLabel = "Home",
}) => {
  const profile = getProfile();
  const projects = getAllProjects();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen flex bg-figma-bg font-sans antialiased text-white overflow-hidden selection:bg-figma-active selection:text-white">
      {/* 1. Far-Left Vertical Icon Sidebar */}
      <LeftIconBar onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 2. Top Figma File Tabs Bar */}
        <Toolbar
          name={profile.name}
          contextLabel={contextLabel}
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenPalette={() => setIsPaletteOpen(true)}
        />

        {/* 3. Horizontal Pixel Ruler */}
        <HorizontalRuler />

        {/* 4. Main Canvas & Panels Split */}
        <div className="flex-1 flex overflow-hidden relative">
          {children}
        </div>
      </div>

      {/* 5. Floating Figma Canvas Tools Bar */}
      <FloatingToolbar onOpenPalette={() => setIsPaletteOpen(true)} />

      {/* Global Modals */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        projects={projects}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ResumeViewer
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        profile={profile}
      />

      <ContactPanel
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        profile={profile}
      />
    </div>
  );
};
