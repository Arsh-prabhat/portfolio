"use client";

import React, { useState } from "react";
import { MousePointer, Layout, Square, Type, Component, Code, Sparkles, Plus } from "lucide-react";

interface FloatingToolbarProps {
  onOpenPalette?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onOpenPalette,
}) => {
  const [activeTool, setActiveTool] = useState("select");

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex items-center space-x-1 p-1.5 rounded-xl bg-[#2C2C2C] border border-figma-border shadow-floating-bar text-white select-none">
      {/* Select Tool (Active Blue) */}
      <button
        onClick={() => setActiveTool("select")}
        className={`p-2 rounded-lg transition-colors ${
          activeTool === "select"
            ? "bg-figma-active text-white"
            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
        }`}
        title="Select / Move (V)"
      >
        <MousePointer className="w-4 h-4 fill-current" />
      </button>

      {/* Frame Tool (#) */}
      <button
        onClick={() => setActiveTool("frame")}
        className={`p-2 rounded-lg transition-colors ${
          activeTool === "frame"
            ? "bg-figma-active text-white"
            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
        }`}
        title="Frame (F)"
      >
        <Layout className="w-4 h-4" />
      </button>

      {/* Shape / Rectangle */}
      <button
        onClick={() => setActiveTool("shape")}
        className={`p-2 rounded-lg transition-colors ${
          activeTool === "shape"
            ? "bg-figma-active text-white"
            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
        }`}
        title="Rectangle (R)"
      >
        <Square className="w-4 h-4" />
      </button>

      {/* Text Tool (T) */}
      <button
        onClick={() => setActiveTool("text")}
        className={`p-2 rounded-lg transition-colors ${
          activeTool === "text"
            ? "bg-figma-active text-white"
            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
        }`}
        title="Text (T)"
      >
        <Type className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-figma-border mx-1"></div>

      {/* Components / Assets */}
      <button
        onClick={onOpenPalette}
        className="p-2 rounded-lg text-figma-textSecondary hover:bg-figma-hover hover:text-white transition-colors"
        title="Resources & Components (Shift+I)"
      >
        <Component className="w-4 h-4" />
      </button>

      {/* Dev Mode Code Tool */}
      <button
        onClick={() => setActiveTool("dev")}
        className={`p-2 rounded-lg transition-colors ${
          activeTool === "dev"
            ? "bg-figma-active text-white"
            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
        }`}
        title="Dev Mode (Shift+D)"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
};
