"use client";

import React, { useState } from "react";
import { DesignDecision } from "@/lib/types";
import { Sliders, Plus, Eye, CheckCircle2, Info, ChevronDown, Lightbulb } from "lucide-react";

interface InspectorPanelProps {
  designDecisions: DesignDecision[];
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  designDecisions,
}) => {
  const [activeTab, setActiveTab] = useState<"design" | "prototype">("design");
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);

  return (
    <aside className="w-full lg:w-64 bg-figma-sidebar border-t lg:border-t-0 lg:border-l border-figma-border flex flex-col shrink-0 text-xs select-none">
      {/* Top Inspector Tabs: Design / Prototype */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-figma-border bg-[#1E1E1E]">
        <div className="flex items-center space-x-4 font-semibold text-xs">
          <button
            onClick={() => setActiveTab("design")}
            className={`pb-2 pt-2 transition-colors relative ${
              activeTab === "design"
                ? "text-white font-bold"
                : "text-figma-textSecondary hover:text-white"
            }`}
          >
            Design
            {activeTab === "design" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-figma-active"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("prototype")}
            className={`pb-2 pt-2 transition-colors relative ${
              activeTab === "prototype"
                ? "text-white font-bold"
                : "text-figma-textSecondary hover:text-white"
            }`}
          >
            Prototype
            {activeTab === "prototype" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-figma-active"></span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-figma-textMuted font-mono text-[11px]">
          <span>4% ▾</span>
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="lg:hidden p-1 text-figma-textSecondary hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Inspector Sections */}
      <div className={`${isMobileExpanded ? "block" : "hidden"} lg:block overflow-y-auto p-3 space-y-4`}>
        {/* Page Background Setting Section */}
        <div className="space-y-2 pb-3 border-b border-figma-border">
          <div className="text-[11px] font-semibold text-white">Page</div>
          <div className="flex items-center justify-between bg-[#2C2C2C] p-1.5 rounded border border-figma-border text-[11px] font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-[#1E1E1E] border border-white/20"></div>
              <span className="text-white">1E1E1E</span>
            </div>
            <div className="flex items-center space-x-2 text-figma-textMuted">
              <span>100 %</span>
              <Eye className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Styles Header */}
        <div className="flex items-center justify-between pb-2 border-b border-figma-border text-[11px]">
          <span className="font-semibold text-white">Styles</span>
          <Plus className="w-3.5 h-3.5 text-figma-textMuted hover:text-white cursor-pointer" />
        </div>

        {/* Export Header */}
        <div className="flex items-center justify-between pb-2 border-b border-figma-border text-[11px]">
          <span className="font-semibold text-white">Export</span>
          <Plus className="w-3.5 h-3.5 text-figma-textMuted hover:text-white cursor-pointer" />
        </div>

        {/* Design Decisions Reflection Cards */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-accent-indigo">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Design Decisions</span>
          </div>

          {designDecisions && designDecisions.length > 0 ? (
            designDecisions.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-[#2C2C2C] border border-figma-border space-y-2 text-xs"
              >
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-figma-active shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-white text-[11px] leading-snug">
                    {item.decision}
                  </h4>
                </div>

                <p className="text-[11px] text-figma-textSecondary leading-relaxed pl-5">
                  {item.rationale}
                </p>

                {item.reconstructed && (
                  <div className="pl-5 pt-1 flex items-center space-x-1 text-[9px] font-mono text-figma-textMuted">
                    <Info className="w-3 h-3 text-amber-400" />
                    <span>Reconstructed rationale</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-[11px] text-figma-textMuted italic">
              Select a project on canvas to inspect design rationale.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
