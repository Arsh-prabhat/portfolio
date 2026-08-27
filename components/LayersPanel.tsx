"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { ChevronDown, ChevronRight, Hash, Layers, Search, Plus, Filter, FileText, CornerDownRight, Star } from "lucide-react";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface LayersPanelProps {
  mode: "projectList" | "sectionList";
  projects?: Project[];
  activeProjectSlug?: string;
  sections?: SectionNavItem[];
  activeSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  mode,
  projects = [],
  activeProjectSlug,
  sections = [],
  activeSectionId,
  onSelectSection,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    logos: true,
    userApp: true,
    components: true,
  });

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  return (
    <aside className="w-full md:w-60 bg-figma-sidebar border-b md:border-b-0 md:border-r border-figma-border flex flex-col shrink-0 text-xs select-none">
      {/* Top File Title Header (Figma Drafts Style) */}
      <div className="p-3 border-b border-figma-border flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1 font-bold text-white text-xs">
            <span>Arsh Prabhat</span>
            <ChevronDown className="w-3.5 h-3.5 text-figma-textMuted" />
          </div>
          <div className="text-[10px] font-mono text-figma-textMuted">Drafts / UI UX Projects</div>
        </div>

        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="md:hidden p-1 text-figma-textSecondary hover:text-white"
          aria-label="Toggle Layers Panel"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isMobileExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Sub-bar: Search & Tools */}
      <div className="px-3 py-2 border-b border-figma-border flex items-center justify-between text-[11px] font-mono text-figma-textSecondary bg-[#1A1A1A]">
        <div className="flex items-center space-x-1.5">
          <span>File</span>
          <span className="text-[9px] text-figma-textMuted bg-[#2C2C2C] px-1 rounded">Alt+1</span>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <Plus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Page 1 Header */}
      <div className="px-3 py-2 border-b border-figma-border flex items-center justify-between text-xs font-medium text-white bg-[#1A1A1A]">
        <span>Page 1</span>
        <ChevronDown className="w-3.5 h-3.5 text-figma-textMuted" />
      </div>

      {/* Layers Section Header */}
      <div className="px-3 py-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-figma-textMuted">
        <span>Layers</span>
        <Filter className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
      </div>

      {/* Tree Content Area */}
      <div className={`${isMobileExpanded ? "block" : "hidden"} md:block overflow-y-auto p-1 space-y-0.5 flex-1`}>
        {mode === "projectList" ? (
          <div className="space-y-1">
            {/* Group Node: Featured Case Studies */}
            <div className="space-y-0.5">
              <button
                onClick={() => toggleNode("logos")}
                className="w-full flex items-center space-x-1.5 px-2 py-1 rounded text-left text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors font-medium text-[11px]"
              >
                {expandedNodes["logos"] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-figma-textMuted" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-figma-textMuted" />
                )}
                <span className="truncate text-white"># Featured Work</span>
              </button>

              {expandedNodes["logos"] && (
                <div className="pl-4 space-y-0.5">
                  {projects.filter(p => p.featured).map((proj) => {
                    const isActive = proj.slug === activeProjectSlug;
                    return (
                      <Link
                        key={proj.slug}
                        href={`/project/${proj.slug}`}
                        className={`flex items-center justify-between px-2.5 py-1 rounded text-[11px] transition-colors ${
                          isActive
                            ? "bg-figma-active text-white font-medium"
                            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          <Hash className="w-3.5 h-3.5 shrink-0 text-figma-active" />
                          <span className="truncate">{proj.title.split("—")[0]}</span>
                        </div>
                        <span title="Featured Strong Project">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Group Node: Core UI & Systems */}
            <div className="space-y-0.5 pt-1">
              <button
                onClick={() => toggleNode("userApp")}
                className="w-full flex items-center space-x-1.5 px-2 py-1 rounded text-left text-figma-textSecondary hover:text-white hover:bg-figma-hover transition-colors font-medium text-[11px]"
              >
                {expandedNodes["userApp"] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-figma-textMuted" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-figma-textMuted" />
                )}
                <span className="truncate text-white"># Core Systems</span>
              </button>

              {expandedNodes["userApp"] && (
                <div className="pl-4 space-y-0.5">
                  {projects.filter(p => !p.featured).map((proj) => {
                    const isActive = proj.slug === activeProjectSlug;
                    return (
                      <Link
                        key={proj.slug}
                        href={`/project/${proj.slug}`}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] transition-colors ${
                          isActive
                            ? "bg-figma-active text-white font-medium"
                            : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5 shrink-0 text-figma-textMuted" />
                        <span className="truncate">{proj.title.split("—")[0]}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Back to Home Tab */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-2 py-1 rounded text-figma-textMuted hover:text-white hover:bg-figma-hover transition-colors text-[11px] font-mono mb-2"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              <span>← Return to Page 1</span>
            </Link>

            <div className="px-2 py-1 text-[11px] font-medium text-white">
              # Current Canvas Layers
            </div>

            <div className="space-y-0.5">
              {sections.map((sec) => {
                const isActive = sec.id === activeSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      onSelectSection?.(sec.id);
                      setIsMobileExpanded(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1 rounded text-left transition-colors text-[11px] ${
                      isActive
                        ? "bg-figma-active text-white font-semibold"
                        : "text-figma-textSecondary hover:bg-figma-hover hover:text-white"
                    }`}
                  >
                    <CornerDownRight className="w-3 h-3 text-figma-textMuted" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
