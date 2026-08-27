"use client";

import React from "react";
import { Figma, File, Grid, PenTool, Sliders, User, Command } from "lucide-react";

interface LeftIconBarProps {
  activeTab?: string;
  onOpenPalette?: () => void;
}

export const LeftIconBar: React.FC<LeftIconBarProps> = ({
  activeTab = "files",
  onOpenPalette,
}) => {
  return (
    <aside className="w-12 h-screen bg-figma-sidebar border-r border-figma-border flex flex-col items-center justify-between py-3 shrink-0 select-none z-30">
      {/* Top Section: Figma Logo & Tool Items */}
      <div className="flex flex-col items-center space-y-4">
        {/* Figma Main Menu Icon */}
        <button
          className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-figma-hover transition-colors"
          title="Figma Main Menu"
        >
          <Figma className="w-5 h-5 text-white" />
        </button>

        {/* Files Icon (Active Blue Pill) */}
        <button
          className="w-8 h-8 rounded-lg bg-figma-active flex items-center justify-center text-white shadow-md"
          title="Files & Layers (Alt+1)"
        >
          <File className="w-4 h-4 fill-white" />
        </button>

        {/* Assets Icon */}
        <button
          className="w-8 h-8 rounded flex items-center justify-center text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors"
          title="Assets Library"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Tools Icon */}
        <button
          className="w-8 h-8 rounded flex items-center justify-center text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors"
          title="Design Tools"
        >
          <PenTool className="w-4 h-4" />
        </button>

        {/* Variables Icon */}
        <button
          className="w-8 h-8 rounded flex items-center justify-center text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors"
          title="Design Tokens & Variables"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Command Palette Icon */}
        <button
          onClick={onOpenPalette}
          className="w-8 h-8 rounded flex items-center justify-center text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors"
          title="Command Palette (Cmd+K)"
        >
          <Command className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Section: Profile Avatar */}
      <div className="flex flex-col items-center space-y-3">
        <div
          className="w-7 h-7 rounded-full bg-accent-blue/30 border border-figma-active flex items-center justify-center text-white text-xs font-bold"
          title="Arsh Prabhat (UI/UX Designer)"
        >
          AP
        </div>
      </div>
    </aside>
  );
};
